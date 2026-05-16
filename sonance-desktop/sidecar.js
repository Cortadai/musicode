const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');
const crypto = require('crypto');
const { app } = require('electron');
const http = require('http');

const PORT = 17380;
const HEALTH_URL = `http://localhost:${PORT}/actuator/health`;
const HEALTH_POLL_INTERVAL = 1000;
const HEALTH_TIMEOUT = 45000;

let javaProcess = null;
let killed = false;
let adoptedExisting = false;

function getAppDataDir() {
  return path.join(app.getPath('appData'), 'Sonance');
}

function getDataDir() {
  return path.join(app.getPath('home'), '.sonance', 'data');
}

function getOrCreateKey(filename) {
  const appDataDir = getAppDataDir();
  const keyFile = path.join(appDataDir, filename);

  if (fs.existsSync(keyFile)) {
    return fs.readFileSync(keyFile, 'utf8').trim();
  }

  fs.mkdirSync(appDataDir, { recursive: true });
  const key = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(keyFile, key, { mode: 0o600 });
  console.log(`[sidecar] Generated ${filename} at ${keyFile}`);
  return key;
}

function getEncryptionKey() {
  return getOrCreateKey('encryption.key');
}

function getJwtSecret() {
  return getOrCreateKey('jwt.secret');
}

function getJarPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'server', 'sonance-server.jar');
  }
  const targetDir = path.join(__dirname, '..', 'sonance-server', 'target');
  const jars = fs.readdirSync(targetDir).filter(
    (f) => f.startsWith('sonance-server') && f.endsWith('.jar') && !f.includes('original')
  );
  if (jars.length === 0) {
    throw new Error('No sonance-server JAR found in target/. Run mvn package first.');
  }
  return path.join(targetDir, jars[0]);
}

function getJavaPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'jre', 'bin', 'java.exe');
  }
  return 'java';
}

function checkHealth() {
  return new Promise((resolve) => {
    const req = http.get(HEALTH_URL, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function waitForHealth() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const poll = async () => {
      if (killed) {
        reject(new Error('Sidecar was killed before becoming ready'));
        return;
      }

      const healthy = await checkHealth();
      if (healthy) {
        resolve();
        return;
      }

      if (Date.now() - startTime > HEALTH_TIMEOUT) {
        reject(new Error(`Spring Boot failed to start within ${HEALTH_TIMEOUT / 1000}s`));
        return;
      }

      setTimeout(poll, HEALTH_POLL_INTERVAL);
    };

    poll();
  });
}

function isPortInUse() {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      resolve(err.code === 'EADDRINUSE');
    });
    server.once('listening', () => {
      server.close(() => resolve(false));
    });
    server.listen(PORT, '127.0.0.1');
  });
}

function findPidOnPort() {
  try {
    const output = execSync(`netstat -ano | findstr ":${PORT}" | findstr "LISTENING"`, {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 5000,
    });
    const match = output.trim().split('\n')[0];
    if (match) {
      const pid = match.trim().split(/\s+/).pop();
      return parseInt(pid, 10) || null;
    }
  } catch {
    // no process found
  }
  return null;
}

function killPid(pid) {
  try {
    execSync(`taskkill /F /PID ${pid}`, { windowsHide: true, timeout: 5000 });
    console.log(`[sidecar] Killed zombie process PID ${pid} on port ${PORT}`);
    return true;
  } catch (err) {
    console.warn(`[sidecar] Failed to kill PID ${pid}: ${err.message}`);
    return false;
  }
}

async function clearPort() {
  const portBusy = await isPortInUse();
  if (!portBusy) return;

  console.log(`[sidecar] Port ${PORT} is already in use — checking for zombie`);

  const healthy = await checkHealth();
  if (healthy) {
    console.log(`[sidecar] Existing server on port ${PORT} is healthy — adopting it`);
    adoptedExisting = true;
    return;
  }

  const pid = findPidOnPort();
  if (pid) {
    console.log(`[sidecar] Found zombie PID ${pid} — killing it`);
    killPid(pid);
    await new Promise((r) => setTimeout(r, 1000));

    const stillBusy = await isPortInUse();
    if (stillBusy) {
      throw new Error(`Port ${PORT} still in use after killing PID ${pid}. Close the process manually.`);
    }
  } else {
    throw new Error(`Port ${PORT} is in use but couldn't identify the process. Close it manually.`);
  }
}

async function start() {
  killed = false;
  adoptedExisting = false;

  await clearPort();
  if (adoptedExisting) return;

  const jarPath = getJarPath();
  const javaPath = getJavaPath();
  const encryptionKey = getEncryptionKey();
  const jwtSecret = getJwtSecret();
  const dataDir = getDataDir();

  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(path.join(dataDir, 'covers'), { recursive: true });
  fs.mkdirSync(path.join(dataDir, 'waveforms'), { recursive: true });

  const jvmArgs = [
    `-Dsonance.data-dir=${dataDir.replace(/\\/g, '/')}`,
    `-Dsonance.jwt.secret=${jwtSecret}`,
    '-jar', jarPath,
    '--spring.profiles.active=desktop',
  ];

  console.log(`[sidecar] Starting: ${javaPath} ${jvmArgs.join(' ')}`);

  javaProcess = spawn(javaPath, jvmArgs, {
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
    env: { ...process.env, SONANCE_TOKEN_ENCRYPTION_KEY: encryptionKey },
  });

  javaProcess.stdout.on('data', (data) => {
    process.stdout.write(`[server] ${data}`);
  });

  javaProcess.stderr.on('data', (data) => {
    process.stderr.write(`[server:err] ${data}`);
  });

  javaProcess.on('error', (err) => {
    console.error(`[sidecar] Failed to start Java process: ${err.message}`);
  });

  javaProcess.on('exit', (code, signal) => {
    if (!killed) {
      console.error(`[sidecar] Java process exited unexpectedly: code=${code} signal=${signal}`);
    }
    javaProcess = null;
  });

  return waitForHealth();
}

function stop() {
  return new Promise((resolve) => {
    killed = true;

    if (adoptedExisting) {
      console.log('[sidecar] Adopted server — killing by port');
      const pid = findPidOnPort();
      if (pid) killPid(pid);
      adoptedExisting = false;
      resolve();
      return;
    }

    if (!javaProcess) {
      resolve();
      return;
    }

    const proc = javaProcess;

    const forceKillTimer = setTimeout(() => {
      if (proc && !proc.killed) {
        console.log('[sidecar] Force killing Java process (SIGKILL)');
        proc.kill('SIGKILL');
      }
      resolve();
    }, 5000);

    proc.on('exit', () => {
      clearTimeout(forceKillTimer);
      resolve();
    });

    console.log('[sidecar] Sending SIGTERM to Java process');
    proc.kill('SIGTERM');
  });
}

function isRunning() {
  return adoptedExisting || (javaProcess !== null && !javaProcess.killed);
}

module.exports = { start, stop, isRunning };

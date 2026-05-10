const { spawn } = require('child_process');
const path = require('path');
const { app } = require('electron');
const http = require('http');

const HEALTH_URL = 'http://localhost:17380/actuator/health';
const HEALTH_POLL_INTERVAL = 1000;
const HEALTH_TIMEOUT = 45000;

let javaProcess = null;
let killed = false;

function getJarPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'server', 'sonance-server.jar');
  }
  const targetDir = path.join(__dirname, '..', 'sonance-server', 'target');
  const fs = require('fs');
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

function start() {
  killed = false;
  const jarPath = getJarPath();
  const javaPath = getJavaPath();

  console.log(`[sidecar] Starting: ${javaPath} -jar ${jarPath}`);

  javaProcess = spawn(javaPath, ['-jar', jarPath], {
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
    env: { ...process.env },
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
    if (!javaProcess) {
      resolve();
      return;
    }

    killed = true;
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
  return javaProcess !== null && !javaProcess.killed;
}

module.exports = { start, stop, isRunning };

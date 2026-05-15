const fs = require('fs');
const path = require('path');

exports.default = async function (context) {
  const electronDist = path.join(__dirname, 'node_modules', 'electron', 'dist');
  const appOutDir = context.appOutDir;

  const requiredFiles = [
    'chrome_100_percent.pak',
    'chrome_200_percent.pak',
    'resources.pak',
    'snapshot_blob.bin',
    'vk_swiftshader_icd.json',
    'vulkan-1.dll',
  ];

  for (const file of requiredFiles) {
    const src = path.join(electronDist, file);
    const dest = path.join(appOutDir, file);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(`[afterPack] Copied missing: ${file}`);
    }
  }
};

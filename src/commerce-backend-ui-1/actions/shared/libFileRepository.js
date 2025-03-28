// libFileRepository.js
//https://github.com/adobe/amazon-sales-channel-app-builder/blob/main/actions-src/shared/repository/libFilesRepository.ts
const filesLib = require('@adobe/aio-lib-files');

async function writeFile(filePath, data) {
  const files = await filesLib.init();
  await files.write(filePath, data, { contentType: 'application/octet-stream' });
}

async function readFile(filePath) {
  const files = await filesLib.init();
  const fileBuffer = await files.read(filePath);
  return fileBuffer;
}

module.exports = { writeFile, readFile };

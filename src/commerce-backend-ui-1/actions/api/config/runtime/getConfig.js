// getConfig.js
//https://github.com/adobe/amazon-sales-channel-app-builder/blob/main/actions-src/api/account/runtime/getCredentials.ts
const ConfigEncryptionHelper = require('../../../shared/runtime/security/ConfigEncryptionHelper');
const { readFile } = require('../../../shared/libFileRepository');
const { Core } = require('@adobe/aio-sdk');
const logger = Core.Logger('getConfig', { level: 'info' });

async function main(params) {
  const { ENCRYPTION_KEY, ENCRYPTION_IV, RUNTIME_NAMESPACE } = params;

  const helper = new ConfigEncryptionHelper(ENCRYPTION_KEY, ENCRYPTION_IV);
  const filePath = `${RUNTIME_NAMESPACE}-bazaarvoice.enc`;

  try {
    // Read the encrypted file as a buffer
    const encryptedBuffer = await readFile(filePath);
    const encryptedConfig = JSON.parse(encryptedBuffer.toString('utf8'));

    // Decrypt the configuration
    const config = helper.decryptConfig(encryptedConfig);

    // Log and return the decrypted configuration
    logger.info('Configuration retrieved successfully.');
    return {
      statusCode: 200,
      body: config
    };
  } catch (error) {
    logger.error(`Error retrieving configuration from ${filePath}:`, error);
    return {
      statusCode: 500,
      body: { error: 'Failed to retrieve and decrypt configuration.' }
    };
  }
}

exports.main = main;

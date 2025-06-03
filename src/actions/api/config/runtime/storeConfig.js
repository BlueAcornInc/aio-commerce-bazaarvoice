// storeConfig.js
// https://github.com/adobe/amazon-sales-channel-app-builder/blob/main/actions-src/api/account/runtime/storeCredentials.ts
const ConfigEncryptionHelper = require('../../../../shared/runtime/security/ConfigEncryptionHelper');
const { writeFile } = require('../../../../shared/libFileRepository');
const { Core } = require('@adobe/aio-sdk');

const logger = Core.Logger('storeConfig', { level: 'info' });

async function main(params) {
  const { ENCRYPTION_KEY, ENCRYPTION_IV, RUNTIME_NAMESPACE } = params;

  try {
    // Convert the entire form submission to a JSON string
    const configString = JSON.stringify(params);

    // Encrypt the stringified JSON
    const helper = new ConfigEncryptionHelper(ENCRYPTION_KEY, ENCRYPTION_IV);
    const encryptedConfig = helper.encryptConfig(configString);

    // Save to .enc file using aio-lib-files
    const filePath = `${RUNTIME_NAMESPACE}-bazaarvoice.enc`;
    await writeFile(filePath, Buffer.from(JSON.stringify(encryptedConfig)));

    logger.info(`Encrypted configuration saved as ${filePath}`);
    return {
      statusCode: 200,
      body: {
        message: `Configuration saved securely for namespace: ${RUNTIME_NAMESPACE}`,
      },
    };
  } catch (error) {
    logger.error('Encryption or storage error:', error);
    return {
      statusCode: 500,
      body: { error: 'Failed to encrypt and store form data.' },
    };
  }
}

exports.main = main;

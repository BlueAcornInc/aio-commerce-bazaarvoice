const { Core } = require("@adobe/aio-sdk");
const {
  readConfiguration,
  writeConfiguration,
} = require("../../../shared/configurationHelper");
const { toPublicConfig } = require("../../../shared/publicConfig");

const REQUIRED_FIELDS = ["enableExtension", "environment", "clientName"];

/**
 * The configuration the admin UI may see: public fields, plus whether a
 * Cloud SEO key is stored. The key itself is never returned.
 *
 * @param {object} config Stored configuration
 * @returns {object} Configuration safe to return to the browser
 */
function toAdminConfig(config = {}) {
  return {
    ...toPublicConfig(config),
    hasCloudSeoKey: Boolean(config.cloudSeoKey),
  };
}

/**
 * Read the stored Cloud SEO key, if any, so a save without a new key keeps it.
 *
 * @param {object} params Action params
 * @param {string} name Configuration name
 * @returns {Promise<string|undefined>} The stored key, or undefined
 */
async function readStoredCloudSeoKey(params, name) {
  try {
    const existing = await readConfiguration(params, name);
    return existing?.cloudSeoKey;
  } catch {
    return undefined;
  }
}

/**
 * Main admin action
 *
 * @param {object} params Action input param
 * @returns {object} Response object
 */
async function main(params) {
  const logger = Core.Logger("baazarvoice-config", { level: "info" });
  const name = "baazarvoice";

  // Check the method
  if (params.__ow_method === "post") {
    const payload = params.payload || {};
    const missing = REQUIRED_FIELDS.filter((field) => !payload[field]);

    if (missing.length > 0) {
      // Field names only: params carries credentials and is never logged.
      logger.warn(`Missing required fields: ${missing.join(", ")}`);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Missing required fields (${missing.join(", ")}).`,
        }),
      };
    }

    const {
      enableExtension,
      environment,
      clientName,
      enableProductFamilies,
      deploymentZone,
      locale,
      enableBvPixel,
      debug,
    } = payload;
    // Write-only key: a blank value keeps the stored one.
    const cloudSeoKey =
      payload.cloudSeoKey || (await readStoredCloudSeoKey(params, name));

    const configToStore = {
      enableExtension,
      environment,
      clientName,
      enableProductFamilies,
      deploymentZone,
      locale,
      cloudSeoKey,
      enableBvPixel,
      debug,
    };

    try {
      await writeConfiguration(configToStore, name, params);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          message: "Saved BaazarVoice config",
          savedConfig: toAdminConfig(configToStore),
        }),
      };
    } catch (error) {
      logger.error(error);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          message: "Error while saving configuration",
        }),
      };
    }
  } else if (params.__ow_method === "get") {
    try {
      const loadedConfig = await readConfiguration(params, name);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          message: "Loaded BaazarVoice config",
          config: toAdminConfig(loadedConfig),
        }),
      };
    } catch (error) {
      logger.error(error);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          message: "Error while loading configuration",
        }),
      };
    }
  } else {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Method Not Allowed",
        allowedMethods: ["GET", "POST"],
      }),
    };
  }
}

exports.main = main;

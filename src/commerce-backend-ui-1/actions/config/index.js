const { Core } = require("@adobe/aio-sdk");
const {
  readConfiguration,
  writeConfiguration,
} = require("../../../shared/configurationHelper");

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
    const {
      enableExtension,
      environment,
      clientName,
      enableProductFamilies,
      deploymentZone,
      locale,
      cloudSeoKey,
      enableBvPixel,
      debug,
    } = params.payload;

    if (!enableExtension || !environment || !clientName) {
      logger.error("Missing field for request", params);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error:
            "Missing required fields (enableExtension, environment, clientName).",
          receivedParams: params,
        }),
      };
    }

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
          savedConfig: configToStore,
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
          error: error || "Unknown error",
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
          config: loadedConfig,
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
          error: error || "Unknown error",
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

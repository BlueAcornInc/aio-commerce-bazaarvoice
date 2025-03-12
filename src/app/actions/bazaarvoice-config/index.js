const { Core } = require("@adobe/aio-sdk");
const stateLib = require("@adobe/aio-lib-state");
const { MAX_TTL } = stateLib;

async function main(params) {
    const logger = Core.Logger("bazaarvoice-config", { level: "info" });

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
            sftpUsername,
            sftpPassword,
            sftpHostName,
            productFeedFilename,
            productFeedExportPath,
        } = params;

        if (!enableExtension || !environment || !clientName) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    error: "Missing required fields (enableExtension, environment, clientName).",
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
            sftpUsername,
            sftpPassword,
            sftpHostName,
            productFeedFilename,
            productFeedExportPath,
        };

        const state = await stateLib.init();
        await state.put("bazaarvoiceConfig", JSON.stringify(configToStore), {
            ttl: MAX_TTL,
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                success: true,
                message: "Saved Bazaarvoice config with max TTL",
                savedConfig: configToStore,
            }),
        };
    } else if (params.__ow_method === "get") {
        const state = await stateLib.init();
        const entry = await state.get("bazaarvoiceConfig");
        let loadedConfig = {};
        if (entry && entry.value) {
            try {
                loadedConfig = JSON.parse(entry.value);
            } catch (e) {
                logger.warn("Failed to parse stored JSON", e);
                loadedConfig = {};
            }
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                success: true,
                message: "Loaded Bazaarvoice config",
                config: loadedConfig,
            }),
        };
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
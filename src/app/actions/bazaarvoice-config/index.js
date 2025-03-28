/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0.
*/
const { Core } = require('@adobe/aio-sdk');

/**
 * Returns a JSON response with an error message
 */
function errorResponse(message, statusCode = 400) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            success: false,
            error: message
        })
    };
}

/**
 * Main function
 */
async function main(params) {
    const logger = Core.Logger('bazaarvoice-config', { level: params.LOG_LEVEL || 'info' });

    try {
        logger.debug('Raw params:', params);

        // Only handle GET requests
        if (params.__ow_method !== 'get') {
            logger.warn('Unsupported HTTP method:', params.__ow_method);
            return errorResponse('Method Not Allowed. Only GET is supported.', 405);
        }

        // Fetch config from environment variables
        const enableExtension = String(params.ENABLE_EXTENSION).toLowerCase() === 'true';
        const environment = params.ENVIRONMENT || 'staging';
        const clientName = params.CLIENT_NAME || '';
        const enableProductFamilies = String(params.ENABLE_PRODUCT_FAMILIES).toLowerCase() === 'true';
        const deploymentZone = params.DEPLOYMENT_ZONE || 'Main Site';
        const locale = params.LOCALE || '';
        const cloudSeoKey = params.CLOUD_SEO_KEY || '';
        const enableBvPixel = String(params.ENABLE_BV_PIXEL).toLowerCase() === 'true';
        const debug = String(params.DEBUG).toLowerCase() === 'true';
        const sftpUsername = params.SFTP_USERNAME || '';
        const sftpPassword = params.SFTP_PASSWORD || '';
        const sftpHostName = params.SFTP_HOSTNAME || '';  // Adjusted to match envKey
        const productFeedFilename = params.PRODUCT_FEED_FILENAME || '';
        const productFeedExportPath = params.PRODUCT_FEED_EXPORT_PATH || '';

        if (!clientName) {
            logger.error('CLIENT_NAME is not set in environment variables.');
            return errorResponse('Client Name is not configured', 400);
        }

        const config = {
            enableExtension: enableExtension ? 'yes' : 'no',
            environment,
            clientName,
            enableProductFamilies: enableProductFamilies ? 'yes' : 'no',
            deploymentZone,
            locale,
            cloudSeoKey,
            enableBvPixel: enableBvPixel ? 'yes' : 'no',
            debug: debug ? 'yes' : 'no',
            sftpUsername,
            sftpPassword: '****' + (sftpPassword ? sftpPassword.slice(-4) : ''), // Masked
            sftpHostName,
            productFeedFilename,
            productFeedExportPath
        };

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                message: 'Loaded Bazaarvoice config from environment variables',
                config
            })
        };
    } catch (error) {
        logger.error('Unexpected error:', error);
        return errorResponse('Server Error: ' + error.message, 500);
    }
}

exports.main = main;
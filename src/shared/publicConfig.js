/**
 * The Bazaarvoice settings that are safe to expose. The Cloud SEO key is a
 * server-side credential: it is write-only and never leaves the app.
 */
const PUBLIC_FIELDS = [
  "enableExtension",
  "environment",
  "clientName",
  "enableProductFamilies",
  "deploymentZone",
  "locale",
  "enableBvPixel",
  "debug",
];

/**
 * Pick only the public fields from a stored configuration.
 *
 * @param {object} config Stored configuration
 * @returns {object} Configuration without credentials
 */
function toPublicConfig(config = {}) {
  return PUBLIC_FIELDS.reduce((out, field) => {
    if (config[field] !== undefined) {
      out[field] = config[field];
    }
    return out;
  }, {});
}

module.exports = { PUBLIC_FIELDS, toPublicConfig };

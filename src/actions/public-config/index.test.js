const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};
jest.mock("@adobe/aio-sdk", () => ({
  Core: {
    Logger: jest.fn(() => mockLogger),
  },
}));
jest.mock("@adobe/aio-commerce-lib-config", () => ({
  initialize: jest.fn(),
  getConfigurationByKey: jest.fn(),
  byCodeAndLevel: jest.fn((code, level) => ({ code, level })),
}));

const libConfig = require("@adobe/aio-commerce-lib-config");
const { main } = require("./index");

const VALID_CONFIG = {
  status: "on",
  clientName: "blueacorn-sandbox",
  deploymentZone: "Main Site",
  environment: "staging",
  locale: "en_US",
  showReviews: true,
  showStarSummary: true,
  showQna: false,
  showInlineStars: true,
  showCartStars: false,
  trackConversions: false,
};

/**
 * Make getConfigurationByKey resolve from a plain object of field values.
 *
 * @param {object} values Field values by name
 */
function storedConfig(values) {
  libConfig.getConfigurationByKey.mockImplementation(async (name) => ({
    config: { name, value: values[name] },
  }));
}

describe("Bazaarvoice public storefront config", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    libConfig.getConfigurationByKey.mockReset();
  });

  test("returns only the public fields for the requested store view", async () => {
    storedConfig({ ...VALID_CONFIG, unexpectedField: "not-public" });

    const response = await main({ storeCode: "brand_us" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(VALID_CONFIG);
    expect(libConfig.byCodeAndLevel).toHaveBeenCalledWith(
      "brand_us",
      "store_view",
    );
  });

  test("reports off when disabled", async () => {
    storedConfig({ ...VALID_CONFIG, status: "off" });

    expect((await main({})).body).toEqual({ status: "off" });
  });

  test("reports off when a bv.js URL segment is missing or malformed", async () => {
    for (const bad of [
      { clientName: "" },
      { clientName: "client/../x" },
      { deploymentZone: "main?site" },
      { environment: "dev" },
      { locale: "english" },
    ]) {
      storedConfig({ ...VALID_CONFIG, ...bad });
      // eslint-disable-next-line no-await-in-loop
      expect((await main({})).body).toEqual({ status: "off" });
    }
    expect(mockLogger.warn).toHaveBeenCalled();
  });

  test("falls back to global when the store view isn't in the scope tree", async () => {
    libConfig.getConfigurationByKey.mockImplementation(async (name, scope) => {
      if (scope.level === "store_view") {
        throw new Error("INVALID_SCOPE: Unknown scope");
      }
      return { config: { name, value: VALID_CONFIG[name] } };
    });

    const response = await main({});

    expect(response.body).toEqual(VALID_CONFIG);
    expect(libConfig.byCodeAndLevel).toHaveBeenCalledWith("global", "global");
  });

  test("reports off before any scope tree exists", async () => {
    libConfig.getConfigurationByKey.mockRejectedValue(
      new Error("INVALID_SCOPE: Unknown scope code='global' level='global'"),
    );

    const response = await main({});

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "off" });
  });

  test("rejects a malformed store code without reading config", async () => {
    const response = await main({ storeCode: "../../etc" });

    expect(response.statusCode).toBe(400);
    expect(libConfig.getConfigurationByKey).not.toHaveBeenCalled();
  });

  test("never logs or returns params on failure", async () => {
    const marker = (name) => `${name}-must-not-leak`;
    libConfig.getConfigurationByKey.mockRejectedValue(new Error("boom"));

    const response = await main({
      __ow_headers: { authorization: `Bearer ${marker("ims")}` },
      AIO_COMMERCE_CONFIG_ENCRYPTION_KEY: marker("key"),
    });

    expect(response.statusCode).toBe(500);
    const logged = JSON.stringify(
      Object.values(mockLogger).flatMap((fn) => fn.mock.calls),
    );
    ["ims", "key"].map(marker).forEach((value) => {
      expect(JSON.stringify(response.body)).not.toContain(value);
      expect(logged).not.toContain(value);
    });
  });
});

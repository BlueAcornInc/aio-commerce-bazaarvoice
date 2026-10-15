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
jest.mock("../../../../shared/configurationHelper", () => ({
  readConfiguration: jest.fn(),
}));

const { readConfiguration } = require("../../../../shared/configurationHelper");
const { main } = require("./getConfig");

describe("Public storefront config", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns only the storefront-safe fields", async () => {
    readConfiguration.mockResolvedValueOnce({
      enableExtension: "yes",
      environment: "staging",
      clientName: "testClient",
      enableProductFamilies: "no",
      deploymentZone: "Main Site",
      locale: "en_US",
      cloudSeoKey: "storedKey",
      enableBvPixel: "no",
      debug: "no",
      unexpectedField: "not-public",
    });

    const response = await main({});

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      enableExtension: "yes",
      environment: "staging",
      clientName: "testClient",
      enableProductFamilies: "no",
      deploymentZone: "Main Site",
      locale: "en_US",
      enableBvPixel: "no",
      debug: "no",
    });
    expect(JSON.stringify(response.body)).not.toContain("storedKey");
  });

  test("returns an empty config when none is saved", async () => {
    readConfiguration.mockRejectedValueOnce(
      Object.assign(new Error("not found"), { code: "ERROR_FILE_NOT_EXISTS" }),
    );

    const response = await main({});

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });
});

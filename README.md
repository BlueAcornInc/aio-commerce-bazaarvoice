# Bazaarvoice by Blue Acorn

This Adobe App Builder extension provides a secure and efficient way for Adobe Commerce merchants to store and consume their Bazaarvoice credentials. All configurations, including sensitive credentials, are managed directly within the Adobe Commerce Admin backend. The App Builder application securely retrieves these settings and makes them available to your storefront via API, enabling the display of user-generated content and integration with Bazaarvoice services.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Via Download](#via-download)
  - [Via Adobe Exchange Marketplace](#via-adobe-exchange-marketplace)
- [Configuration (Adobe Commerce Backend)](#configuration-app-management)
- [Usage](#usage)
- [Development](#development)
- [Support](#support)
- [Contributing](#contributing)

---

## Features

- **Secure Credential Storage:** Bazaarvoice credentials are stored securely within your Adobe Commerce backend, which the App Builder application can then securely retrieve at runtime.
- **Frontend API Access:** The App Builder application exposes a secure API endpoint for your frontend to retrieve necessary Bazaarvoice credentials and configuration, enabling direct interaction with Bazaarvoice services.
- **Centralized Configuration:** All Bazaarvoice-specific settings are managed by the merchant directly within the familiar Adobe Commerce Admin Panel UI.
- **Easy Integration:** Designed for quick and straightforward deployment as an App Builder application.
- **Adobe App Builder Powered:** Leveraging the power and scalability of Adobe App Builder for reliable performance and easy deployment.
- **Marketplace Ready:** Compatible with Adobe Exchange for effortless installation and updates.

---

## Requirements

Before installing this extension, ensure you have the following:

- **Adobe Commerce (Cloud, SaaS or On-Premise):** Version 2.4.x or higher.
- **Adobe Developer App Builder Project:** An active App Builder project configured for your Adobe Commerce instance's organization.
- **Bazaarvoice Account:** A valid Bazaarvoice account with API access credentials.
- **Node.js and npm/yarn:** For local development and testing of the App Builder application.
- **Adobe I/O CLI:** For deploying App Builder actions.
- **Admin SDK Module:** The `magento/commerce-backend-sdk` module must be installed in your Adobe Commerce `composer.json`. Add the following line to your `composer.json` under the `require` section:

  JSON

  ```
  "magento/commerce-backend-sdk": "3.0.0 as 2.3.0"

  ```

  After adding, run `composer update`.

- **IMS Authentication:** Ensure IMS (Identity Management System) authentication is configured and working on your Adobe Commerce instance, as this is typically used for secure API communication with Adobe services, including App Builder actions.

---

## Installation

You can install this extension either by downloading it directly from the repository or from the Adobe Exchange marketplace.

### Downloading the latest release

1.  **Download the Extension:** Get the latest release package from the [release page](https://github.com/BlueAcornInc/aio-commerce-bazaarvoice/releases).
2.  **Extract the Files:** Unzip the downloaded package to your preferred development directory. This directory contains the Adobe App Builder project.
3.  **Link your App Builder workspace:** run `aio app use` in the extracted project to select your organization, project and workspace. No encryption keys or other secrets are needed.
4.  **Deploy App Builder Actions:**
    - Navigate to the root directory of the extracted App Builder project (where the `app.config.yaml` file is located).
    - Install npm dependencies using `npm install`
    - **(Optional) Set App Builder Context:** To avoid interactive prompts during deployment, you can explicitly set your project and workspace using `aio app use`:

      Bash

      ```
      aio app use <your-project-id> <your-workspace-name>

      ```

      (Replace `<your-project-id>` and `<your-workspace-name>` with your actual values, which you can find in the Adobe Developer Console.)

      OR

      You can use the following combination to select interactively your destination environment:

      ```
      aio console org select
      aio console project select
      aio console workspace select
      aio app use --merge
      ```

    - Deploy the App Builder actions using the Adobe I/O CLI:

      Bash

      ```
      aio app deploy

      ```

      If you didn't use `aio app use`, follow the prompts to select your App Builder project and workspace.

5.  **Configure Bazaarvoice Settings in Adobe Commerce Backend:** After deploying the App Builder app, you **must** configure your Bazaarvoice settings in your Adobe Commerce Admin panel as described in the [Configuration (Adobe Commerce Backend)](#configuration-app-management) section.

### Via Adobe Exchange Marketplace

1.  **Log in to Adobe Commerce Admin:** Access your Adobe Commerce admin panel.
2.  **Navigate to System > Web Setup Wizard (or Component Manager in newer versions):**
3.  **Find the Extension:** Search for "Bazaarvoice App Builder Extension" (or similar) in the Marketplace.
4.  **Install the Extension:** Follow the on-screen instructions to install the extension. This deploys the Adobe App Builder actions to your connected project. No encryption keys are needed: the app stores no secrets. Then configure it as described in [Configuration (App Management)](#configuration-app-management).
5.  **Configure Bazaarvoice Settings in Adobe Commerce Backend:** After the marketplace installation is complete, proceed to configure all Bazaarvoice-specific settings within your Adobe Commerce Admin panel as detailed in the [Configuration (Adobe Commerce Backend)](#configuration-app-management) section.

---

## Configuration (App Management)

Since v2.0.0, Bazaarvoice is configured through **Adobe Commerce App Management**, not a custom admin page.

1.  **Install the app:** in Commerce Admin, go to **Apps > App Management** and install Bazaarvoice into your instance.
2.  **Configure it** at the scope you need:
    - **Status:** `On` to enable the storefront widgets.
    - **Client Name**, **Deployment Zone** (for example `Main Site`), **Environment** (`staging` or `production`) and **Locale** (for example `en_US`): together these locate your `bv.js` deployment.
    - **Touchpoint switches:** reviews widget, star summary, questions and answers, stars on product listings, stars in the cart, conversion tracking (not available yet). They match the Yotpo app's switches.
3.  **Scopes:** values follow the Commerce hierarchy (global > website > store > store view) and are inherited downwards, so each brand or store view can point at its own Bazaarvoice deployment.

The app stores **no secrets**, so it needs no encryption key.

### Upgrading from v1.x

v1 stored its settings in a custom admin page that App Management doesn't read. After upgrading, re-enter the client name, deployment zone, environment, locale and status in App Management. The v1 "Cloud SEO Key", "Enable BV Pixel" and "Product Families" settings were never implemented and are removed; conversion tracking will return as the **Conversion tracking** switch.

---

## Usage

Once the App Builder application is deployed and its settings are configured in the Adobe Commerce backend, your Adobe Commerce frontend (or any other client-side application) can consume the Bazaarvoice configuration and credentials through the App Builder API endpoint.

**Adobe Commerce Storefont and Edge Delivery Services Blocks**

Refer to the EDS and Storefront Blocks Setup Instructions to set this up in Adobe Commerce Storefront and Edge Delivery Services:

[**`EDS.md`**](EDS.md)

**Example Frontend API Call (Conceptual):**

Your frontend application will make an AJAX or Fetch request to the App Builder endpoint exposed by this extension. The specific URL will be available in your Adobe Developer Console for the deployed action.

JavaScript:

```js
// Example: Fetching Bazaarvoice configuration from the App Builder API
const fetchBazaarvoiceConfig = async () => {
  try {
    // Replace with your actual deployed App Builder action URL
    const appBuilderApiUrl =
      "https://adobeio-static.net/api/v1/web/your_org_id/your_project_id/your_workspace_id/bazaarvoice-config"; // Adjust endpoint name if needed

    const response = await fetch(appBuilderApiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();
    console.log("Bazaarvoice Configuration:", config);
    // Use config.bvApiKey, config.bvSharedSecret, config.bvClientName, etc., as provided by the API
  } catch (error) {
    console.error("Error fetching Bazaarvoice configuration:", error);
  }
};

fetchBazaarvoiceConfig();
```

**Important Security Note:**

The App Builder action serves as a secure intermediary. While it retrieves sensitive data like API keys from your Adobe Commerce backend, it's critical that your frontend consumption strategy does not expose these raw credentials directly on the client-side if they're intended for server-to-server operations. Instead, the App Builder action should ideally use these credentials internally to make direct server-side API calls to Bazaarvoice, or only pass securely derived, non-sensitive data to the frontend.

---

## Development

For detailed instructions on setting up your development environment, testing, and contributing to this App Builder extension, please refer to our dedicated development guide.

[**`DEVELOPMENT.md`**](DEVELOPMENT.md)

---

## Support

For any issues, questions, or feature requests, please refer to the following:

- **Issue Tracker:** [Github Issues Tracker](https://github.com/BlueAcornInc/aio-commerce-bazaarvoice/issues)
- **Contact:** [Blue Acorn Apps Team](mailto:apps@blueacornici.com)

---

## Contributing

We welcome contributions! If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure they adhere to our coding standards.
4.  Write clear and concise commit messages.
5.  Submit a pull request.

# BazaarVoice Integration - MVP Feature Set

This module provides a minimal but functional integration of BazaarVoice as an Out-of-Process Payment Extension (OOPE) using BazaarVoice's Payment Element.

## Features Included in MVP

1. **BazaarVoice Adobe Commerce Blocks**
    - Leverages BazaarVoice’s [Reviews Display](https://BazaarVoice.com/docs/elements/payment-element) to handle secure, PCI-compliant payment form rendering and submission.

2. **Merchant Configutations in Adobe Commerce Admin**
    - Administrative section with basic configuration management and secure setting storage using SaaS and App Builder best practices:
        - mvp – MVP landing page that provides callouts for documentation, feedback and initial configuration
        - dev – Config storage using `lib-files` and best practice implementations of config storage tracking to our best understanding of merchants desires for SaaS GA. In future work, this is what team will align to in order to build complete offering

---

This is a foundational implementation meant to be extensible. Additional features can be layered on in future iterations.

# INSTALLATION.md

This guide provides step-by-step instructions to set up the Adobe Commerce BazaarVoice Out-of-Process Payment Extension using Adobe Developer App Builder.

---

## 🔧 Prerequisites

Ensure your environment meets the following requirements **before proceeding**:

1. **Access to the Adobe Developer Console**  
   Visit [developer.adobe.com/console](https://developer.adobe.com/console). You'll need to create a project from the App Builder template.

2. **Adobe I/O CLI Installed**  
   Install globally with:
   ```bash
   npm install -g @adobe/aio-cli
   ```

3. **Adobe Commerce with Required OOPE Modules**  
   Ensure these modules are installed:
   ```bash
   composer require magento/module-out-of-process-payment-methods --with-dependencies
   composer require magento/commerce-eventing --with-dependencies
   ```

4. **Create a Project in Adobe Developer Console**
   - Go to [Adobe Developer Console](https://developer.adobe.com/console)
   - Click **Create new project**
   - Choose **Project from template**
   - Select **App Builder**

---

## 🚀 Setup Instructions

After prerequisites are met, follow these steps to initialize and configure your BazaarVoice OOPE app:

1. **Log In to Adobe I/O CLI**
   ```bash
   aio login
   ```
   Select your **Organization**, then your **Project** and **Workspace**.

2. **Create a New Project Folder**
   ```bash
   mkdir aio-commerce-BazaarVoice && cd aio-commerce-BazaarVoice
   ```

3. **Initialize the App Using GitHub Template**
   ```bash
   aio app init --repo BlueAcornInc/aio-commerce-BazaarVoice-app --github-pat $GITHUB_PAT
   ```
   > Replace `$GITHUB_PAT` with your GitHub personal access token. This also creates `.aio` and `.env` files.

   Alternatively, you can use:
   ```bash
   aio app use
   ```
   ...to generate these configuration files from an existing project.

4. **Add Adobe I/O Services**
   ```bash
   aio app add service
   ```
   Select the following services:
   - Adobe I/O Events for Adobe Commerce
   - I/O Events
   - I/O Management API

   Since `.aio` and `.env` files already exist, choose `m` to **merge** changes.

5. **Verify Services in Adobe Console**  
   Visit your project on the [Adobe Developer Console](https://developer.adobe.com/console) to ensure services are added. Go to **Credentials > OAuth Server-to-Server** and copy the values.

6. **Add OAuth Credentials to `.env`**  
   Copy `env.dist` to `.env` if not already done:
   ```bash
   cp env.dist .env
   ```
   Then append the following values:
   - `AIO_RUNTIME_NAMESPACE`
   - `AIO_...` OAuth-related credentials from Adobe Console

7. **Add Your Adobe Commerce Environment Config**
   - `COMMERCE_BASE_URL`: Base URL of your Adobe Commerce instance (e.g. `https://mystore.com`)
   - `COMMERCE_PAYMENT_METHOD_CODES=["oope_BazaarVoice"]`

8. **Create an Integration in Adobe Commerce Admin**

- This step allows your App Builder application to authenticate and communicate with your Adobe Commerce backend.

- In the Adobe Commerce Admin panel:

   - Navigate to:  
     `System > Extensions > Integrations`

     - Click **Add New Integration**

     - Fill in the following values:
        - **Name**: e.g. `BazaarVoice App Builder Integration`
        - Leave other fields blank unless required by your organization

     - Under the **API** tab, click **Select All** to grant all permissions, or configure scopes as needed

     - Save the integration and then **activate** it

     - You will be shown the following credentials:
        - **Consumer Key**
        - **Consumer Secret**
        - **Access Token**
        - **Access Token Secret**

- Remove the commented out Option 1 fields and update these to your `.env` file:
- ```env
  COMMERCE_CONSUMER_KEY=your-consumer-key
  COMMERCE_CONSUMER_SECRET=your-consumer-secret
  COMMERCE_ACCESS_TOKEN=your-access-token
  COMMERCE_ACCESS_TOKEN_SECRET=your-access-token-secret

10. **Enable Adobe I/O Events in Adobe Commerce Admin**

- In your Adobe Commerce Admin panel:

  - Navigate to:  
    `Stores > Configuration > Adobe Services > Adobe I/O Events > Commerce Events`

  - Set **"Enable Adobe I/O Events"** to `Yes`

  - Fill in the following required fields:
     - **Merchant ID**
     - **Environment ID**

- These values link your Commerce instance to your Adobe I/O Events provider.

- Once saved, copy the values and add them to your `.env` file:
- ```env
  COMMERCE_ADOBE_IO_EVENTS_MERCHANT_ID=your-merchant-id-here
  COMMERCE_ADOBE_IO_EVENTS_ENVIRONMENT_ID=your-environment-id-here

11. **Run the Onboarding Script**

Once all the necessary fields in your `.env` file have been filled in (OAuth keys, Adobe I/O credentials, Commerce settings), you’re ready to run the onboarding script.

12. **Run the Script**

- From the root of your app directory, execute:

- ```bash
  npm run onboarding

- This will:
  - Set up your App Builder services
  - Create and register the BazaarVoice event provider
  - Deploy the App Builder application
  - Register your out-of-process payment method
  
13.  **Subscribe to Commerce Events**

SSH into your Adobe Commerce Cloud environment and subscribe to the required events using the Magento CLI:

```bash
    bin/magento events:subscribe observer.checkout_submit_all_after --fields=order.increment_id --fields=order.customer_firstname --fields=order.customer_lastname --fields=order.payment.method --fields=order.payment.additional_information
```
14. BazaarVoice Backend is Now Ready

The BazaarVoice Out-of-Process Payment Method has been successfully registered and deployed.

Your App Builder backend is now fully configured to handle payment requests and receive order submission events from Adobe Commerce.

---

## 💳 Frontend Integration

To complete the BazaarVoice OOPE setup, you must integrate the Adobe Commerce Storefront/EDS blocks into the merchant store. These blocks are tracked with the merchant storefront code repository. 

Introducing these blocks are installed by copying the `blocks` directory from the block collection, which is a public repo with the block files available for a developer to bring to the merchant storefront. These files must be paired with these runtime actions (the "app") to complete the setup.

### 🔗 Integration Instructions

We have already implemented BazaarVoice integration using blocks in the EDS storefront reference repository.

👉 To set up the frontend integration, follow the instructions in the `DROPINS.md` file of the EDS storefront:

📂 [`showcase-evergreen-commerce-storefront`](https://github.com/BlueAcornInc/showcase-evergreen-commerce-storefront)  

This includes blocks required for Adobe Commerce Storefront to present reviews. 

Once connected, your storefront will be fully wired to support BazaarVoice with all of the Out-of-Process enablement via App Builder and Adobe Commerce.

---

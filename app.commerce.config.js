/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * App Management configuration for Bazaarvoice.
 *
 * Merchants configure these values in Commerce Admin (Apps > App Management),
 * per website, store or store view. A brand is a store view: values set at a
 * higher scope are inherited.
 *
 * Every field here is public: the storefront needs them to load bv.js. The
 * app stores no secrets. The touchpoint switches use the same names as the
 * Yotpo app, so either reviews provider is configured the same way.
 *
 * @see https://developer.adobe.com/commerce/extensibility/app-management/
 */
import { defineConfig } from "@adobe/aio-commerce-lib-app/config";

const toggle = (name, label, description, defaultValue) => ({
  name,
  type: "boolean",
  label,
  description,
  default: defaultValue,
});

export default defineConfig({
  metadata: {
    id: "bazaarvoice",
    displayName: "Bazaarvoice",
    description:
      "Bazaarvoice ratings, reviews and Q&A for Adobe Commerce storefronts on Edge Delivery Services",
    version: "2.0.0",
  },
  businessConfig: {
    schema: [
      {
        name: "status",
        type: "list",
        label: "Status",
        description: "Turn the Bazaarvoice storefront widgets on or off",
        selectionMode: "single",
        options: [
          { label: "On", value: "on" },
          { label: "Off", value: "off" },
        ],
        default: "off",
      },
      {
        name: "clientName",
        type: "text",
        label: "Client Name",
        description:
          "Your Bazaarvoice client name, as it appears in bv.js URLs.",
      },
      {
        name: "deploymentZone",
        type: "text",
        label: "Deployment Zone",
        description:
          "The Bazaarvoice deployment zone, for example Main Site (written main_site in bv.js URLs).",
        default: "Main Site",
      },
      {
        name: "environment",
        type: "list",
        label: "Environment",
        description:
          "Bazaarvoice staging or production. Use staging for anything but the live storefront.",
        selectionMode: "single",
        options: [
          { label: "Staging", value: "staging" },
          { label: "Production", value: "production" },
        ],
        default: "staging",
      },
      {
        name: "locale",
        type: "text",
        label: "Locale",
        description: "The Bazaarvoice locale, for example en_US.",
        default: "en_US",
      },
      toggle(
        "showReviews",
        "Reviews widget",
        "Show the reviews widget on product pages.",
        true,
      ),
      toggle(
        "showStarSummary",
        "Star summary",
        "Show the rating summary by the product title.",
        true,
      ),
      toggle(
        "showQna",
        "Questions and answers",
        "Show Bazaarvoice questions and answers on product pages.",
        true,
      ),
      toggle(
        "showInlineStars",
        "Stars on product listings",
        "Show inline ratings on product tiles in listings, search and recommendations.",
        true,
      ),
      toggle(
        "showCartStars",
        "Stars in the cart",
        "Show inline ratings on cart, mini-cart and cross-sell product tiles.",
        false,
      ),
      toggle(
        "trackConversions",
        "Conversion tracking",
        "Send order confirmations to the Bazaarvoice pixel. Not available yet.",
        false,
      ),
    ],
  },
});

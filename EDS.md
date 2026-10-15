# EDS and Storefront Blocks

Two blocks render Bazaarvoice on an Adobe Commerce storefront on Edge Delivery Services. Both read their settings from the app's public config action, so the app must be installed and configured in App Management first.

| Block                 | Where                                        | Renders                                                                                      |
| --------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `bazaarvoice`         | Product page template                        | Rating summary by the product title, the reviews widget, and questions and answers           |
| `bazaarvoice-ratings` | Pages that list products (PLP, search, cart) | Inline ratings on product tiles; cart, mini-cart and cross-sell tiles follow the cart switch |

## Installation

1. Copy `blocks/bazaarvoice/` and `blocks/bazaarvoice-ratings/` into your storefront's `blocks/` directory. `bazaarvoice-ratings` imports helpers from `bazaarvoice/bv-common.js`, so install both.

2. Point the storefront at the app's public config action. With the drop-in config service, add under `public.default`:

```
"bazaarvoice-config-url": "https://<namespace>.adobeioruntime.net/api/v1/web/bazaarvoice/public-config"
```

With the legacy `configs.json` sheets, add a `bazaarvoice-config-url` row with the same value. Use the stage workspace URL in the stage config and the production URL in the production config. The blocks send the storefront's store view code, so each store view gets the settings configured for its scope.

3. In your content repository (for example https://da.live/), add a `bazaarvoice` block to the product page template (`<store>/products/default`), and a `bazaarvoice-ratings` block to the listing and cart pages.

4. Check a product page and a listing page. Each touchpoint can be switched on or off per scope in App Management.

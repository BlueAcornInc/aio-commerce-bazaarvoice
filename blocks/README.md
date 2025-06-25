# Storefront Blocks

Blocks are how display reviews from within Edge Delivery Services and Adobe Commerce Storefront. They are easy to setup and configure, but require the app to be properly configured before they can work. 

## Installation

This guide assumes you have a compatible Edge Delivery Services installation already.

1. Copy the block directories in this `blocks/` directory into your storefront's `blocks` directory.

2. Commit and deploy these to your aem.page or aem.live instances to enable them.

3. In your _content repository_ such as https://da.live/, find the page you want to bring the blocks into. 

    We suggest the [products/default](https://da.live/edit#/blueacorninc/shop-bazaarvoice/products/default) document, which can be added by pasting in the table below: 

    | bazaarvoice      |
    |------------------|

    The block may also be added in the interface by creating block and naming it `bazaarvoice`. 

    Once done, publish your changes and test your storefront.

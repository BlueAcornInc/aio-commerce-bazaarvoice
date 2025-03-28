# Bazzarvoice Block Library for Adobe Commerce Storefront

Bazzarvoice Review blocks for Adobe Commerce Storefront

## Technical Approach

This approach is intended for Adobe Commerce Storefront with document based authoring. When a customer wants to render a Bazzarvoice Reviews block, they will add a table to the doc with a header row containing "Bazzarvoice". [View Example](https://docs.google.com/document/d/1zUt26xPAzziRJBb_YsyVht3DU0xmRVTDXc7rgmhrxtI/edit?tab=t.0). 


When Helix renders this page, it will parse the table and run the `bazzarvoice.js` in this directory. This file will add the needed script tags to enable Bazzarvoice, and inject the needed `<div>` tag into the block allowing Bazzarvoice to present. 

As a result, Bazzarvoice can be easily integrated into the storefront wherever a merchant wants to display it. See it in action [here](https://main--showcase-evergreen-commerce-storefront--blueacorninc.hlx.live/bazzarvoice).

## Block Options

This Adobe Commerce Blocks can be configured within the document-based authoring context by adding optins to the block table within the doc. 

| Key   | Value |
|-------|-------|
|       |       |

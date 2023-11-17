// ==UserScript==
// @name        MD2K23 Vine Styles - Spaced Product Tiles
// @namespace   https://github.com/MD2K23/VineToolsUK
// @run-at      document-start
// @match       https://www.amazon.co.uk/vine/vine-items*
// @match       https://www.amazon.com/vine/vine-items*
// @match       https://www.amazon.ca/vine/vine-items*
// @match       https://www.amazon.fr/vine/vine-items*
// @match       https://www.amazon.de/vine/vine-items*
// @match       https://www.amazon.it/vine/vine-items*
// @match       https://www.amazon.es/vine/vine-items*
// @grant       GM_addStyle
// @version     1.0
// @description Adds a light border and spacing between each product tile, to improve readability, especially when using the Small Items style
// ==/UserScript==

GM_addStyle(`

.a-pagination {
  margin-top:5px; !important
}

#vvp-items-grid .vvp-item-tile {
  border: 1px solid #cccccc !important;
}

#vvp-items-grid {
  grid-gap:5px !important;
}

#vvp-items-grid .vvp-item-tile .vvp-item-tile-content {
    margin-top:0 !important;
    margin-bottom:5px !important;
    margin-left:auto !important;
    margin-right:auto !important;
}

.vvp-item-tile-content img {
  padding-top:12px !important;
}
`);
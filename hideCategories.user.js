// ==UserScript==
// @name        MD2K23 Vine Styles - Hide Categories
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
// @version     1.0.1
// @description Hides the category list on the Amazon Vine store
// ==/UserScript==

GM_addStyle(
`#vvp-browse-nodes-container {
 display:none !important;
}
`)
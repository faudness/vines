// ==UserScript==
// @name        MD2K23 Vine Styles - Hide Categories
// @namespace   https://github.com/MD2K23/VineToolsUK
// @run-at      document-start
// @match       https://www.amazon.co.uk/vine/*
// @match       https://www.amazon.com/vine/*
// @match       https://www.amazon.ca/vine/*
// @match       https://www.amazon.fr/vine/*
// @match       https://www.amazon.de/vine/*
// @match       https://www.amazon.it/vine/*
// @match       https://www.amazon.es/vine*
// @grant       GM_addStyle
// @version     1.0
// @description Hides the category list on the Amazon Vine store
// ==/UserScript==

GM_addStyle(
`#vvp-browse-nodes-container {
 display:none !important;
}
`)
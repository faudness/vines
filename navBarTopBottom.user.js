// ==UserScript==
// @name        MD2K23 Vine Styles - Top & Bottom Nav Bar
// @namespace   https://github.com/MD2K23/VineToolsUK
// @match       https://www.amazon.co.uk/vine/vine-items*
// @match       https://www.amazon.com/vine/vine-items*
// @match       https://www.amazon.ca/vine/vine-items*
// @match       https://www.amazon.fr/vine/vine-items*
// @match       https://www.amazon.de/vine/vine-items*
// @match       https://www.amazon.it/vine/vine-items*
// @match       https://www.amazon.es/vine/vine-items*
// @grant       GM_addStyle
// @version     1.0.1
// @description Displays the pagination nav bar at both the top and bottom on the Amazon Vine store
// ==/UserScript==

var products=document.querySelectorAll(".vvp-item-tile")
var hiddenproducts=document.querySelectorAll(".vvp-item-tile.hideVineItems-hideASIN")
var filteredproducts=document.querySelectorAll(".vvp-item-tile.hideVineItems-filterProduct")
var difference=(products.length - hiddenproducts.length - filteredproducts.length)

// Add nav bar to top
var navBar=document.querySelector('#vvp-items-grid-container > div.a-text-center');
if (navBar != null && difference > 0){
    var topNav=document.createElement("div");
    topNav.classList.add("a-text-center");
    topNav.innerHTML = navBar.innerHTML;
    document.querySelector("#vvp-items-grid-container > p").append(topNav);
    GM_addStyle(`#vvp-items-grid-container > p {margin-bottom:5px !important;}`)
}
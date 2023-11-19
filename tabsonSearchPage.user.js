// ==UserScript==
// @name        MD2K23 Vine Styles - RFY, AFA & AI Tabs on Search
// @namespace   https://github.com/MD2K23/VineToolsUK
// @match       https://www.amazon.co.uk/vine/vine-items*
// @match       https://www.amazon.com/vine/vine-items*
// @match       https://www.amazon.ca/vine/vine-items*
// @match       https://www.amazon.fr/vine/vine-items*
// @match       https://www.amazon.de/vine/vine-items*
// @match       https://www.amazon.it/vine/vine-items*
// @match       https://www.amazon.es/vine/vine-items*
// @version     1.0.3
// @description Adds the RFY, AFA amnd AI tabs to the Search page on the Amazon Vine store
// ==/UserScript==

// Add RFY, AFA, AI bar to search page
if ((location.search).includes("search=")){
    var tabBar= document.createElement("span");
    tabBar.innerHTML=`<span id="vvp-items-button--recommended" class="a-button a-button-normal a-button-toggle" role="radio"><span class="a-button-inner"><a href="vine-items?queue=potluck" class="a-button-text">Recommended for you</a></span></span><span id="vvp-items-button--all" class="a-button a-button-toggle" role="radio" aria-checked="true"><span class="a-button-inner"><a href="vine-items?queue=last_chance" class="a-button-text">Available for all</a></span></span><span id="vvp-items-button--seller" class="a-button a-button-normal a-button-toggle" role="radio"><span class="a-button-inner"><a href="vine-items?queue=encore" class="a-button-text">Additional items</a></span></span>`
    document.querySelector("#vvp-items-button-container").append(tabBar);
}
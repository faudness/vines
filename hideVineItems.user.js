// ==UserScript==
// @name        Hide Vine Items UK
// @namespace   https://github.com/MD2K23/VineToolsUK
// @match       https://www.amazon.co.uk/vine/vine-items*
// @exclude     https://www.amazon.co.uk/vine/vine-items*search=*
// @match       https://www.amazon.com/vine/vine-items*
// @exclude     https://www.amazon.com/vine/vine-items*search=*
// @match       https://www.amazon.ca/vine/vine-items*
// @exclude     https://www.amazon.ca/vine/vine-items*search=*
// @match       https://www.amazon.fr/vine/vine-items*
// @exclude     https://www.amazon.fr/vine/vine-items*search=*
// @match       https://www.amazon.de/vine/vine-items*
// @exclude     https://www.amazon.de/vine/vine-items*search=*
// @match       https://www.amazon.it/vine/vine-items*
// @exclude     https://www.amazon.it/vine/vine-items*search=*
// @match       https://www.amazon.es/vine/vine-items*
// @exclude     https://www.amazon.se/vine/vine-items*search=*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @version     1.3
// @description Adds a hide button to items offered in Amazon Vine. Fork of script in VineTools: https://github.com/robartsd/VineTools by robartsd: https://github.com/robartsd
// ==/UserScript==

// Hide/Unhide Symbols
var hideSymbol="🚫"
var unhideSymbol="🧿"

// Default Text strings
var hiddenText="Hidden";
var showMessage="Show hidden items";
var hideMessage="Hide all items on this page";
var unhideMessage="Unhide all items on this page";

// UK US Language / Viewport support
if (location.hostname == "www.amazon.co.uk" || location.hostname == "www.amazon.com" || location.hostname == "www.amazon.ca"){
    if (window.innerWidth >= 1250){
        hiddenText="Hidden";
        showMessage="Show hidden items";
        hideMessage="Hide all items on this page";
        unhideMessage="Unhide all items on this page";
    } else {
        hiddenText="Hidden";
        showMessage="Show hidden";
        hideMessage="Hide all";
        unhideMessage="Unhide all";
    }
}

var hiddenCount = 0;
var messageSpan = document.createElement("span");
messageSpan.classList.add("hideVineItems-message");
messageSpan.innerHTML = ` (<span id="hideVineItems-count">(${hiddenCount}</span><span style="margin-right:10px"> ${hiddenText})</span>&#x2022<span id="hideVineItems-toggleText">${showMessage}</span><label class="switch"><input id="hideVineItems-togglePage" type="checkbox"><span class="slider round"></span></label>&#x2022<a id="hideVineItems-hideAll">${hideSymbol} ${hideMessage}</a>&#x2022<a id="hideVineItems-unhideAll">${unhideSymbol} ${unhideMessage}</a>`;
messageSpan.querySelector("#hideVineItems-togglePage").addEventListener("click", (e) => {document.querySelector(":root").classList.toggle("hideVineItems-showHidden");})
messageSpan.querySelector("#hideVineItems-hideAll").addEventListener("click", (e) => {document.querySelectorAll(".vvp-item-tile:not(.hideVineItems-hideASIN) .hideVineItems-toggleASIN").forEach( (hideLink) => {hideLink.click();})});
messageSpan.querySelector("#hideVineItems-unhideAll").addEventListener("click", (e) => {document.querySelectorAll(".vvp-item-tile .hideVineItems-toggleASIN").forEach( (hideLink) => {hideLink.click();})});
document.querySelector("#vvp-items-grid-container > p").append(messageSpan);

function updateCount() {
  document.getElementById("hideVineItems-count").innerHTML = `${hiddenCount}`;
}

function isHidden(ASIN) {
  return GM_getValue(ASIN) ? true : false;
}

function addHideLink(tile, ASIN) {
  var tileContent = tile.querySelector(".vvp-item-tile-content");
  if (tileContent) {
    var a = document.createElement("a");
    a.innerHTML = hideSymbol;
    a.addEventListener("click", (e) => {
      tile.classList.toggle("hideVineItems-hideASIN");
      if (isHidden(ASIN)) {
        GM_deleteValue(ASIN);
        hiddenCount -= 1;
      } else {
        GM_setValue(ASIN, new Date().toJSON().slice(0,10));
        hiddenCount += 1;
      }
      updateCount();
    });
    a.classList.add("hideVineItems-toggleASIN");
    tileContent.append(a);
  }
}

document.querySelectorAll(".vvp-item-tile").forEach( (tile) => {
  var itemLink = tile.querySelector(".vvp-item-product-title-container > a[href^='/dp/']");
  if (itemLink) {
    var ASIN = itemLink.getAttribute("href").slice(4);
    if (isHidden(ASIN)) {
      tile.classList.add("hideVineItems-hideASIN");
      hiddenCount += 1;
    }
    addHideLink(tile, ASIN);
  }
});

updateCount();

GM_addStyle(`
.hideVineItems-hideASIN {
  display:none;
}

.vvp-item-tile-content {
  position: relative;
}

.hideVineItems-toggleASIN {
  position: absolute;
  width: 25px !important;
  height: 20px !important;
  overflow: hidden;
  top: 7px;
  right: 1px;
  background-color: rgba(0,0,0,0.0);
  padding: 0 .5em;
}

.hideVineItems-hideASIN .hideVineItems-toggleASIN::before,
:root:not(.hideVineItems-showHidden)
{
  content: "${unhideSymbol}";
  display: inline;
}

.hideVineItems-showHidden .hideVineItems-hideASIN {
  display:unset;
  opacity: 50%
}

#hideVineItems-hideAll, #hideVineItems-unhideAll, #hideVineItems-togglePage, #hideVineItems-toggleText {
 margin-left:10px;
 margin-right:10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 20px;
  margin-right:10px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(12px);
  -ms-transform: translateX(12px);
  transform: translateX(12px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 12px;
}

.slider.round:before {
  border-radius: 50%;
}

`);

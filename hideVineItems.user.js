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
// @exclude     https://www.amazon.es/vine/vine-items*search=*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @version     1.8
// @description Adds additional toggle, hide and unhide links to items offered in Amazon Vine. Fork of script in VineTools: https://github.com/robartsd/VineTools by robartsd: https://github.com/robartsd
// ==/UserScript==

// Hide/Unhide Symbols
var hideSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/Hide.png";
var unhideSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/Unhide.png";

// Default Text strings to use if there isn't a localized option below
var hiddenText=" Hidden";
var showMessage="Show hidden items";
var hideMessage="Hide all items on this page";
var unhideMessage="Unhide all items on this page";

// UK US CA Language / Viewport support
if (location.hostname == "www.amazon.co.uk" || location.hostname == "www.amazon.com" || location.hostname == "www.amazon.ca"){
    if (window.innerWidth >= 1275){
        // For normal/wide viewport
        hiddenText=" Hidden";
        showMessage="Show hidden items";
        hideMessage="Hide all items on this page";
        unhideMessage="Unhide all items on this page";
    }
    if (window.innerWidth >= 1000 && window.innerWidth < 1275){
        // For narrow viewport
        hiddenText=" Hidden";
        showMessage="Show hidden";
        hideMessage="Hide all";
        unhideMessage="Unhide all";
    }
    if (window.innerWidth < 1000){
        // For ultra narrow viewport
        hiddenText=" Hidden";
        showMessage="";
        hideMessage="";
        unhideMessage="";
    }
}

var hiddenCount = 0;
var messageSpan = document.createElement("span");
messageSpan.classList.add("hideVineItems-message");
messageSpan.innerHTML = `
<span id="hideVineItems-count"></span>
<span class="bullet">&#x2022</span>
<span id="hideVineItems-toggleText">${showMessage}</span>
<label class="switch"><input id="hideVineItems-togglePage" type="checkbox"><span class="slider round"></span></label>
<span class="bullet">&#x2022</span>
<a id="hideVineItems-hideAll">${hideMessage}</a>
<span class="bullet">&#x2022</span>
<a id="hideVineItems-unhideAll">${unhideMessage}</a>
`;
messageSpan.querySelector("#hideVineItems-togglePage").addEventListener("click", (e) => {document.querySelector(":root").classList.toggle("hideVineItems-showHidden");})
messageSpan.querySelector("#hideVineItems-hideAll").addEventListener("click", (e) => {document.querySelectorAll(".vvp-item-tile:not(.hideVineItems-hideASIN) .hideVineItems-toggleASIN").forEach( (hideLink) => {hideLink.click();})});
messageSpan.querySelector("#hideVineItems-unhideAll").addEventListener("click", (e) => {document.querySelectorAll(".vvp-item-tile.hideVineItems-hideASIN .hideVineItems-toggleASIN").forEach( (hideLink) => {hideLink.click();})});
document.querySelector("#vvp-items-grid-container > p").append(messageSpan);

function updateCount() {
  document.getElementById("hideVineItems-count").innerHTML = `(${hiddenCount}${hiddenText})`;
}

function isHidden(ASIN) {
  return GM_getValue(ASIN) ? true : false;
}

function addHideLink(tile, ASIN) {
  var tileContent = tile.querySelector(".vvp-item-tile-content");
  if (tileContent) {
    var a = document.createElement("span");
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

#hideVineItems-hideAll, #hideVineItems-unhideAll {
  color: #0F1111;
}

#hideVineItems-hideAll:hover, #hideVineItems-unhideAll:hover {
  color: #007185;
  text-decoration: underline;
}

.hideVineItems-hideASIN {
  display:none;
}

.vvp-item-tile-content {
  position: relative;
}

.hideVineItems-toggleASIN {
  position: absolute;
  width: 20px !important;
  height: 17px !important;
  overflow: hidden;
  top: 2px;
  right: 2px;
  background-color: rgba(0,0,0,0.0);
  padding: 0;
  background: url("${hideSymbol}");
  background-repeat: no-repeat;
  background-size:contain;
}

.hideVineItems-hideASIN .vvp-item-tile-content .hideVineItems-toggleASIN
{
  background: url("${unhideSymbol}");
  background-repeat: no-repeat;
  background-size:contain;
}

.hideVineItems-showHidden .hideVineItems-hideASIN {
  display:unset;
}

.hideVineItems-showHidden .hideVineItems-hideASIN img, .hideVineItems-showHidden .hideVineItems-hideASIN .a-button, .hideVineItems-showHidden .hideVineItems-hideASIN a {
  opacity: 50%;
}

#hideVineItems-hideAll {
  background: url("${hideSymbol}");
  background-repeat: no-repeat;
  background-size:contain;
  padding-left:30px;
}

#hideVineItems-unhideAll {
  background: url("${unhideSymbol}");
  background-repeat: no-repeat;
  background-size:contain;
  padding-left:30px;
}

.bullet {
  margin-left:10px;
  margin-right:10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 20px;
  margin-left:10px;
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
// ==UserScript==
// @name        Hide Vine Items UK
// @namespace   https://github.com/MD2K23/VineToolsUK
// @match       https://www.amazon.co.uk/vine/vine-items*
// @exclude     https://www.amazon.co.uk/vine/vine-items*search=*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @version     1.1
// @description Adds a hide button to items offered in Amazon Vine. Fork of script in VineTools: https://github.com/robartsd/VineTools by robartsd: https://github.com/robartsd
// ==/UserScript==

var hiddenCount = 0;
var messageSpan = document.createElement("span");
messageSpan.classList.add("hideVineItems-message");
messageSpan.innerHTML = ` - <a id="hideVineItems-togglePage">Hide/Unhide items (<span id="hideVineItems-count">${hiddenCount}</span> hidden)</a><a id="hideVineItems-hideAll">Hide all items on this page</a>`;
messageSpan.querySelector("#hideVineItems-togglePage").addEventListener("click", (e) => {document.querySelector(":root").classList.toggle("hideVineItems-showHidden");})
messageSpan.querySelector("#hideVineItems-hideAll").addEventListener("click", (e) => {document.querySelectorAll(".vvp-item-tile:not(.hideVineItems-hideASIN) .hideVineItems-toggleASIN").forEach( (hideLink) => {hideLink.click();})});
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
    a.innerHTML = "🚫";
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
  content: "🧿";
  display: inline;
}

.hideVineItems-showHidden .hideVineItems-hideASIN {
  display:unset;
  opacity: 50%
}

#hideVineItems-hideAll {
 margin-left:20px;
}
`);

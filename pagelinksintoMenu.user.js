// ==UserScript==
// @name        MD2K23 Vine Styles - Page Links into Menu
// @namespace   https://github.com/MD2K23/VineToolsUK
// @match       https://www.amazon.co.uk/vine/vine-items*
// @match       https://www.amazon.com/vine/vine-items*
// @match       https://www.amazon.ca/vine/vine-items*
// @match       https://www.amazon.fr/vine/vine-items*
// @match       https://www.amazon.de/vine/vine-items*
// @match       https://www.amazon.it/vine/vine-items*
// @match       https://www.amazon.es/vine/vine-items*
// @grant       GM_addStyle
// @version     1.0
// @description Puts all the header menu options into a dropdown menu and hides the header
// ==/UserScript==

const bgcolour=window.getComputedStyle(document.body).getPropertyValue('background-color');
const textcolour=window.getComputedStyle(document.body).getPropertyValue('color');
const menuitemItems=document.querySelector("#vvp-vine-items-tab > a")
const menuitemReviews=document.querySelector("#vvp-reviews-tab > a")
const menuitemOrders=document.querySelector("#vvp-orders-tab > a")
const menuitemAccount=document.querySelector("#vvp-account-tab > a")
const menuitemResources=document.querySelector("#vvp-resources-tab > a")
const menuitemMessages=document.querySelector("#vvp-messages-link > span")
const menuitemHelp=document.querySelector("#vvp-vine-help-link > a")
const menuitemFeedback=document.querySelector("#vvp-feedback-link > span")
const menuitemContent=document.querySelector("#vvp-contact-us-link > a")

var menuButton=document.createElement("span");
menuButton.innerHTML=`
<span class="menuDropdown">
 <span id="vvp-items-button--menu" class="a-button a-button-normal a-button-toggle"><span class="a-button-inner"><a class="a-button-text">☰</a></span></span>
  <div class="menuDropdown-content">
   <a href="${menuitemItems.href}">${menuitemItems.textContent}</a>
   <a href="${menuitemReviews.href}">${menuitemReviews.textContent}</a>
   <a href="${menuitemOrders.href}">${menuitemOrders.textContent}</a>
   <a href="${menuitemAccount.href}">${menuitemAccount.textContent}</a>
   <a href="${menuitemResources.href}">${menuitemResources.textContent}</a>
   <hr>
   ${menuitemMessages.outerHTML}
   <a href="${menuitemHelp.href}">${menuitemHelp.textContent}</a>
   ${menuitemFeedback.outerHTML}
   <a href="${menuitemContent.href}">${menuitemContent.textContent}</a>
  </div>
</span>
`
var container=document.querySelector("#vvp-items-button-container")
container.insertBefore(menuButton, container.firstChild);
menuButton.addEventListener("click", (e) => {document.querySelectorAll(".menuDropdown .menuDropdown-content").forEach( (tile) => {tile.classList.toggle("menuDropdown-click");})});

GM_addStyle(`
#vvp-header, div.a-tab-container.vvp-tab-set-container > ul {
  display:none !important;
}

div.a-section.vvp-items-button-and-search-container {
  margin-top: 0px !important;
}

.menuDropdown {
  display: inline-block;
  position: relative;
}

.menuDropdown-content {
  background-color: ${bgcolour};
  display: none;
  position: absolute;
  width: max-content;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index:5000;
  padding:5px;
  border: 0.5px solid ${textcolour};
}

.menuDropdown:hover .menuDropdown-content {
  display: block;
}

.menuDropdown .menuDropdown-click {
  display: block;
}

.menuDropdown-content a {
  display: block;
  color: ${textcolour};
  text-decoration: none;
  margin:5px;
  width: auto
}

.menuDropdown-content a:hover {
  color: #C7511F;
}

hr {
  margin-top:10px;
}
`)

const rfyButton=getComputedStyle(document.querySelector('#vvp-items-button--recommended > span > a'), ':before').getPropertyValue('content');
if (rfyButton != "none"){

GM_addStyle(`
#vvp-items-button--menu a {
  color: transparent;
  width: 75px;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  height: 48px;
  display: flex;
  align-items: center;
}

#vvp-items-button--menu a::before {
  color: initial;
  position: absolute !important;
  font-size: 20px !important;
  font-weight: bold !important;
  width: 100% !important;
  left: 0px !important;
  text-align: center !important;
  padding: 9px 0px !important;
}

#vvp-items-button--menu a::before {
  content: "☰" !important;
}
`)
}
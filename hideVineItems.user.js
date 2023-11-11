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
// @grant       GM_listValues
// @version     2.0
// @description Adds additional options to let you hide products in Amazon Vine. Fork of script in VineTools: https://github.com/robartsd/VineTools by robartsd: https://github.com/robartsd
// ==/UserScript==

// Hide/Unhide Symbols
var hideSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/Hide.png";
var unhideSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/Unhide.png";
var filterSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/Filter.png";
var unfilterSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/Unfilter.png";

// Default Text strings to use if there isn't a localized option below
var hiddenText=" Hidden";
var filteredText=" Filtered";
var showMessage="Show hidden / filtered items";
var hideMessage="Hide all items on this page";
var unhideMessage="Unhide all items on this page";
var filterText="Hide Keyword / Phrase";
var unfilterText="Unhide Keyword / Phrase";
var filterMessage="Enter keyword / phrase to hide:";
var unfilterMessage="Enter keyword / phrase to unhide:";

// UK US CA Language / Viewport support
if (location.hostname == "www.amazon.co.uk" || location.hostname == "www.amazon.com" || location.hostname == "www.amazon.ca"){
    filterMessage="Enter keyword / phrase to hide:";
    unfilterMessage="Enter keyword / phrase to unhide:"
    if (window.innerWidth >= 1200){
        // For normal/wide viewport
        hiddenText=" Hidden";
        filteredText=" Filtered";
        showMessage="Show hidden / filtered items";
        hideMessage="Hide all items on this page";
        unhideMessage="Unhide all items on this page";
        filterText="Hide Keyword / Phrase";
        unfilterText="Unhide Keyword / Phrase";
    }
    if (window.innerWidth >= 845 && window.innerWidth < 1200){
        // For narrow viewport
        hiddenText=" Hidden";
        filteredText=" Filtered";
        showMessage="Show hidden";
        hideMessage="Hide all";
        unhideMessage="Unhide all";
        filterText="Hide Keyword";
        unfilterText="Unhide Keyword";
    }
    if (window.innerWidth < 845){
        // For ultra narrow viewport
        hiddenText="H";
        filteredText="F";
        showMessage="";
        hideMessage="";
        unhideMessage="";
        filterText="";
        unfilterText="";
    }
}

// FR Language / Viewport support
if (location.hostname == "www.amazon.fr"){
    filterMessage="Entrer le mot-clé / l'expression à masquer :";
    unfilterMessage="Entrer le mot-clé / l'expression à afficher :"
    if (window.innerWidth >= 1285){
        // For normal/wide viewport
        hiddenText=" Masqué";
        filteredText=" Filtré";
        showMessage="Montrer les articles masqués / filtrés";
        hideMessage="Tout masquer sur cette page";
        unhideMessage="Tout afficher sur cette page";
        filterText="Masquer le mot-clé / l'expression";
        unfilterText="Afficher le mot-clé / l'expression";
    }
    if (window.innerWidth >= 910 && window.innerWidth < 1285){
        // For narrow viewport
        hiddenText=" Masqué";
        filteredText=" Filtré";
        showMessage="Afficher cachés";
        hideMessage="Tout cacher";
        unhideMessage="Tout afficher";
        filterText="Masquer le mot-clé";
        unfilterText="Afficher le mot-clé";
    }
    if (window.innerWidth < 910){
        // For ultra narrow viewport
        hiddenText="M";
        filteredText="F";
        showMessage="";
        hideMessage="";
        unhideMessage="";
        filterText="";
        unfilterText="";
    }
}

//Define variables for later use
var hiddenCount = 0;
var filteredCount = 0;
const keywords=GM_listValues().filter((keyword) => keyword.includes("KEYWORD:"));

//Create the HTML elements to display on the Amazon Vine page
var messageSpan = document.createElement("span");
messageSpan.classList.add("hideVineItems-message");
messageSpan.innerHTML = `
<span id="hideVineItems-count"></span>
<span class="bullet">&#x2022</span>
<span id="hideVineItems-toggleText">${showMessage}</span>
<label class="switch"><input id="hideVineItems-togglePage" type="checkbox"><span class="slider round"></span></label><br>
<a id="hideVineItems-hideAll">${hideMessage}</a>
<span class="bullet">&#x2022</span>
<a id="hideVineItems-unhideAll">${unhideMessage}</a>
<span class="bullet">&#x2022</span>
<a id="hideVineItems-filterText">${filterText}</a>
<span class="bullet">&#x2022</span>
<a id="hideVineItems-unfilterText">${unfilterText}</a>
`;

//<p>Page width: ${window.innerWidth}</p>

messageSpan.querySelector("#hideVineItems-togglePage").addEventListener("click", (e) => {document.querySelector(":root").classList.toggle("hideVineItems-showHidden");})
messageSpan.querySelector("#hideVineItems-hideAll").addEventListener("click", (e) => {document.querySelectorAll(".vvp-item-tile:not(.hideVineItems-hideASIN) .hideVineItems-toggleASIN").forEach( (hideLink) => {hideLink.click();})});
messageSpan.querySelector("#hideVineItems-unhideAll").addEventListener("click", (e) => {document.querySelectorAll(".vvp-item-tile.hideVineItems-hideASIN .hideVineItems-toggleASIN").forEach( (hideLink) => {hideLink.click();})});
messageSpan.querySelector("#hideVineItems-filterText").addEventListener("click", displayfilterPopup);
messageSpan.querySelector("#hideVineItems-unfilterText").addEventListener("click", displayunfilterPopup);
document.querySelector("#vvp-items-grid-container > p").append(messageSpan);

//Function to convert the storage database from old versions of the script to work with this version
function convertASIN(){
    if (GM_getValue("CONFIG:DBUpgraded") != true){
        //var storage_orphan=GM_listValues().filter((keyword) => !keyword.includes("KEYWORD:") && !keyword.includes("CONFIG:") && !keyword.includes("ASIN:"));
        var storage_orphan=GM_listValues().filter((keyword) => !keyword.match(new RegExp("^.+:.+$","gi")));
        storage_orphan.forEach( (orphan) => {
            console.log(orphan)
            GM_setValue("ASIN:" + orphan,GM_getValue(orphan));
            GM_deleteValue(orphan);
        });
        GM_setValue("CONFIG:DBUpgraded",true);
    }
}

//Function to display a text entry box to allow the user to create a keyword filter
function displayfilterPopup(){
    var textFilter=prompt(filterMessage,"");
    if (!(textFilter == null)){
        if (textFilter.length > 0){
            GM_setValue("KEYWORD:"+textFilter, new Date().toJSON().slice(0,10));
            location.reload();
        }
    }
}

//Function to display a text entry box to allow the user to remove a keyword filter
function displayunfilterPopup(){
    var keywordstrings=(keywords.join('\r\n'))
    var keywordPatterns=keywordstrings.replace(/KEYWORD:/g,"");
    var textFilter=prompt(unfilterMessage + "\r\n\r\n" + keywordPatterns,"");
    if (!(textFilter == null)){
        if (textFilter.length > 0){
            if (isFiltered(textFilter)){
                GM_deleteValue("KEYWORD:"+textFilter);
                location.reload();
            }
        }
    }
}

//Function to check whether a keyword filter already exists in the storage database
function isFiltered(keyword) {
    return GM_getValue("KEYWORD:"+keyword) ? true : false;
}

//Function to search the keywords in the storage database and see if a product matches any of them
function containsText(productDescription) {
    return keywords.some(keyword => productDescription.match(new RegExp(keyword.substring(8),"gi"))) ? true : false
}

//Function to update the hidden and filtered count numbers on the Amazon Vine page
function updateCount() {
    document.getElementById("hideVineItems-count").innerHTML = `(${hiddenCount}${hiddenText} / ${filteredCount}${filteredText})`;
}

//Function to check where an ASIN already exists in the storage database
function isHidden(ASIN) {
    return GM_getValue("ASIN:"+ASIN) ? true : false;
}

//Function to add an icon to each product to allow it to be hidden or unhidden.
function addHideLink(tile, ASIN) {
    var tileContent = tile.querySelector(".vvp-item-tile .vvp-item-tile-content");
    if (tileContent) {
        var filteredProduct = tile.querySelector(".vvp-item-tile:not(.hideVineItems-filterProduct) .vvp-item-tile-content");
        var a = document.createElement("span");
        if (filteredProduct) {
            a.addEventListener("click", (e) =>{
                tile.classList.toggle("hideVineItems-hideASIN");
                if (isHidden(ASIN)) {
                    GM_deleteValue("ASIN:"+ASIN);
                    hiddenCount -= 1;
                } else {
                    GM_setValue("ASIN:"+ASIN, new Date().toJSON().slice(0,10));
                    hiddenCount += 1;
                }
                updateCount();
            });
        }
        a.classList.add("hideVineItems-toggleASIN");
        tileContent.append(a);
    }
}

//Convert the database to v2.0 format if needed
convertASIN()

//Add the correct classes to products so they behave correctly
document.querySelectorAll(".vvp-item-tile").forEach( (tile) => {
    var itemLink = tile.querySelector(".vvp-item-product-title-container > a[href^='/dp/']");
    if (itemLink) {
        var ASIN = itemLink.getAttribute("href").slice(4);
        var linkText=itemLink.textContent;
        if (isHidden(ASIN)) {
            tile.classList.add("hideVineItems-hideASIN");
            hiddenCount += 1;
        } else {
            if (containsText(linkText)){
                tile.classList.add("hideVineItems-filterProduct");
                filteredCount += 1;
            }
        }
        addHideLink(tile, ASIN);
    }
});

//Update the hidden and filtered count numbers on the Amazon Vine page
updateCount();

//Create stylesheet to customize the layout of the additional html elements
GM_addStyle(`

#hideVineItems-hideAll, #hideVineItems-unhideAll, #hideVineItems-filterText, #hideVineItems-unfilterText {
  color: #0F1111;
}

#hideVineItems-hideAll:hover, #hideVineItems-unhideAll:hover, hideVineItems-filterText:hover, #hideVineItems-unfilterText:hover {
  color: #007185;
  text-decoration: underline;
}

.hideVineItems-hideASIN, .hideVineItems-filterProduct {
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

.hideVineItems-filterProduct .vvp-item-tile-content .hideVineItems-toggleASIN
{
  background: url("${filterSymbol}");
  background-repeat: no-repeat;
  background-size:contain;
}

.hideVineItems-showHidden .hideVineItems-hideASIN, .hideVineItems-showHidden .hideVineItems-filterProduct {
  display:unset;
}

.hideVineItems-showHidden .hideVineItems-hideASIN img, .hideVineItems-showHidden .hideVineItems-hideASIN .a-button, .hideVineItems-showHidden .hideVineItems-hideASIN a,
.hideVineItems-showHidden .hideVineItems-filterProduct img, .hideVineItems-showHidden .hideVineItems-filterProduct .a-button, .hideVineItems-showHidden .hideVineItems-filterProduct a{
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

#hideVineItems-filterText {
  background: url("${filterSymbol}");
  background-repeat: no-repeat;
  background-size:contain;
  padding-left:30px;
}

#hideVineItems-unfilterText {
  background: url("${unfilterSymbol}");
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
  margin-bottom:5px;
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
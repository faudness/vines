// ==UserScript==
// @name        Hide Vine Items UK
// @namespace   https://github.com/MD2K23/VineToolsUK
// @run-at      document-start
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
// @version     2.1
// @description Adds additional options to let you hide products in Amazon Vine. Fork of script in VineTools: https://github.com/robartsd/VineTools by robartsd: https://github.com/robartsd
// ==/UserScript==

document.onreadystatechange = function () {if (document.readyState === "interactive") {

//Define variables for later use
var hiddenCount = 0;
var filteredCount = 0;
//var gmValues=GM_listValues();
const bgcolour=window.getComputedStyle(document.body).getPropertyValue('background-color');
const textcolour=window.getComputedStyle(document.body).getPropertyValue('color');
var hiddenText,filteredText,filterMessage,unfilterMessage,highlightMessage,unhighlightMessage,
    filterText,unfilterText,highlightText,unhighlightText,menuText,showMessage,hideMessage,
    unhideMessage,nofiltersMessage,nohighlightsMessage,invalidfilterMessage,invalidhighlightMessage

// UK US CA Language / Viewport support
switch(location.hostname){
    case "www.amazon.fr":
        hiddenText=`${hiddenCount > 1 ? " Masqués" : " Masqué"}`;
        filteredText=`${filteredCount > 1 ? " Filtrés" : " Filtré"}`;
        filterMessage="Entrer le mot-clé / l'expression à masquer :";
        unfilterMessage = "Entrer le numéro du mot-clé / de l'expression à afficher :";
        highlightMessage = "Entrer le mot-clé / l'expression à mettre en évidence :";
        unhighlightMessage = "Entrer le numéro du mot-clé / de l'expression à ne plus mettre en évidence :";
        filterText="Masquer le mot-clé / l'expression";
        unfilterText="Afficher le mot-clé / l'expression";
        highlightText = "Mettre en évidence le mot-clé / l'expression";
        unhighlightText = "Ne plus mettre en évidence le mot-clé / l'expression";
        menuText = "Filtres avancés";
        showMessage="Montrer les articles masqués / filtrés";
        hideMessage="Tout masquer sur cette page";
        unhideMessage="Tout afficher sur cette page";
        nofiltersMessage = "Il n'y a pas de filtres à supprimer";
        nohighlightsMessage = "Il n'y a pas de mises en évidence à supprimer";
        invalidfilterMessage = "Numéro de filtre invalide saisi";
        invalidhighlightMessage = "Numéro de mise en évidence invalide saisi";

        // For narrow viewport
        if (window.innerWidth < 1000){
            menuText="Avancés";
            showMessage="Afficher cachés";
            hideMessage="Tout cacher";
            unhideMessage="Tout afficher";
        }
        break;

    default:
        hiddenText=" Hidden";
        filteredText=" Filtered";
        filterMessage="Enter keyword / phrase to hide:";
        unfilterMessage="Enter the number of the keyword / phrase to unhide:";
        highlightMessage="Enter keyword / phrase to highlight:";
        unhighlightMessage="Enter the number of the keyword / phrase to unhighlight:";
        filterText="Hide Keyword / Phrase";
        unfilterText="Unhide Keyword / Phrase";
        highlightText="Highlight Keyword / Phrase";
        unhighlightText="Unhighlight Keyword / Phrase";
        menuText="Advanced Filters";
        showMessage="Show Hidden / Filtered";
        hideMessage="Hide all items on this page";
        unhideMessage="Unhide all items on this page";
        nofiltersMessage="There are no filters to remove";
        nohighlightsMessage="There are no highlights to remove";
        invalidfilterMessage="Invalid filter number entered";
        invalidhighlightMessage="Invalid highlight number entered";

        // For narrow viewport
        if (window.innerWidth < 1000){
            menuText="Advanced";
            showMessage="Show Hidden";
            hideMessage="Hide all";
            unhideMessage="Unhide all";
        }
}

// Hide/Unhide Symbols
var hideSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/Hide.png";
var unhideSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/Unhide.png";
var filterSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/Filter.png";
var unfilterSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/Unfilter.png";
var highlightSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/highlight.png";
var unhighlightSymbol="https://raw.githubusercontent.com/MD2K23/VineToolsUK/master/Unhighlight.png";

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
<span class="dropdown">
  <a id="hideVineItems-filtersMenu">${menuText}</a>
  <div class="dropdown-content">
  <a id="hideVineItems-filterText">${filterText}</a>
  <a id="hideVineItems-unfilterText">${unfilterText}</a>
  <hr>
  <a id="hideVineItems-highlightText">${highlightText}</a>
  <a id="hideVineItems-unhighlightText">${unhighlightText}</a>
  </div>
</span>
`;

//<p>Page width: ${window.innerWidth}</p>

messageSpan.querySelector("#hideVineItems-togglePage").addEventListener("click", (e) => {document.querySelector(":root").classList.toggle("hideVineItems-showHidden");})
messageSpan.querySelector("#hideVineItems-hideAll").addEventListener("click", (e) => {document.querySelectorAll(".vvp-item-tile:not(.hideVineItems-hideASIN) .hideVineItems-toggleASIN").forEach( (hideLink) => {hideLink.click();})});
messageSpan.querySelector("#hideVineItems-unhideAll").addEventListener("click", (e) => {document.querySelectorAll(".vvp-item-tile.hideVineItems-hideASIN .hideVineItems-toggleASIN").forEach( (hideLink) => {hideLink.click();})});
messageSpan.querySelector("#hideVineItems-filterText").addEventListener("click", displayfilterPopup);
messageSpan.querySelector("#hideVineItems-unfilterText").addEventListener("click", displayunfilterPopup);
messageSpan.querySelector("#hideVineItems-highlightText").addEventListener("click", displayhighlightPopup);
messageSpan.querySelector("#hideVineItems-unhighlightText").addEventListener("click", displayunhighlightPopup);
messageSpan.querySelector("#hideVineItems-filtersMenu").addEventListener("click", (e) => {document.querySelectorAll(".dropdown .dropdown-content").forEach( (tile) => {tile.classList.toggle("dropdown-click");})});
document.querySelector("#vvp-items-grid-container > p").append(messageSpan);

//Functions to convert the storage database from old versions of the script to work with this version
function convertASIN(){
    if (GM_getValue("CONFIG:DBUpgraded") != true){
        if (typeof gmValues == "undefined"){ var gmValues=GM_listValues();}
        var storage_orphan=gmValues.filter((keyword) => !keyword.match(new RegExp(":","gi")));
        storage_orphan.forEach( (orphan) => {
            console.log(orphan)
            GM_setValue("ASIN:" + orphan,GM_getValue(orphan));
            GM_deleteValue(orphan);
        });
        GM_setValue("CONFIG:DBUpgraded",true);
    }
}

function convertFilters(){
    if ((GM_getValue("FILTERS:") ? true : false) == false){
        if (typeof gmValues == "undefined"){ var gmValues=GM_listValues();}
        var newFilters = [];
        var storage_keywords=gmValues.filter((keyword) => keyword.match(new RegExp("KEYWORD:","gi")));
        storage_keywords.forEach( (keyword) => {
            newFilters.push(keyword.substring(8))
            GM_deleteValue(keyword);
        });
        GM_setValue("FILTERS:", JSON.stringify(newFilters));
    }
}

//Function to display a text entry box to allow the user to create a keyword filter
function displayfilterPopup(){
    document.querySelectorAll(".dropdown .dropdown-content").forEach( (tile) => {tile.classList.remove("dropdown-click");})
    var response=prompt(filterMessage,"");
    if (!(response == null )){
        if (response.length > 0){
            var newFilters = [];
            var savedFilters=JSON.parse(GM_getValue("FILTERS:",null));
            if (savedFilters != null){
                savedFilters.forEach((filter) => {newFilters.push(filter)});
            }
            newFilters.push(response);
            GM_setValue("FILTERS:", JSON.stringify(newFilters));
            location.reload();
        }
    }
}

//Function to display a text entry box to allow the user to remove a keyword filter
function displayunfilterPopup(){
    document.querySelectorAll(".dropdown .dropdown-content").forEach( (tile) => {tile.classList.remove("dropdown-click");})
    var numberedFilters=JSON.parse(GM_getValue("FILTERS:"));
    if (numberedFilters.length > 0){
        numberedFilters.forEach((filter, index) => {
            numberedFilters[index] = `${index+1}.  ${filter}`
        })
        var filterStrings=(numberedFilters.join('\r\n\r\n'))
        var response=prompt(unfilterMessage + "\r\n\r\n" + filterStrings,"");
        if (!(response == null)){
            if (response > 0 && response <= (numberedFilters.Length)){
                var savedFilters=JSON.parse(GM_getValue("FILTERS:"));
                savedFilters.splice((response-1), 1);
                GM_setValue("FILTERS:", JSON.stringify(savedFilters));
                location.reload();
            } else {
                window.alert(invalidfilterMessage)
            }
        }
    } else {
        window.alert(nofiltersMessage)
    }
}

//Function to display a text entry box to allow the user to remove a keyword filter
function displayunhighlightPopup(){
    document.querySelectorAll(".dropdown .dropdown-content").forEach( (tile) => {tile.classList.remove("dropdown-click");})
    var numberedHighlights=JSON.parse(GM_getValue("HIGHLIGHTS:"));
    if (numberedHighlights.length > 0){
        numberedHighlights.forEach((highlight, index) => {
            numberedHighlights[index] = `${index+1}.  ${highlight}`
        })
        var highlightStrings=(numberedHighlights.join('\r\n\r\n'))
        var response=prompt(unhighlightMessage + "\r\n\r\n" + highlightStrings,"");
        if (!(response == null)){
            if (response > 0 && response <= (numberedHighlights.length)){
                var savedHighlights=JSON.parse(GM_getValue("HIGHLIGHTS:"));
                savedHighlights.splice((response-1), 1);
                GM_setValue("HIGHLIGHTS:", JSON.stringify(savedHighlights));
                location.reload();
            } else {
                window.alert(invalidhighlightMessage)
            }
        }
    } else {
        window.alert(nohighlightsMessage)
    }
}

//Function to display a text entry box to allow the user to create a keyword highlight
function displayhighlightPopup(){
    document.querySelectorAll(".dropdown .dropdown-content").forEach( (tile) => {tile.classList.remove("dropdown-click");})
    var response=prompt(highlightMessage,"");
    if (!(response == null )){
        if (response.length > 0){
            var newHighlights = [];
            var savedHighlights=JSON.parse(GM_getValue("HIGHLIGHTS:",null));
            if (savedHighlights != null){
                savedHighlights.forEach((highlight) => {newHighlights.push(highlight)});
            }
            newHighlights.push(response);
            GM_setValue("HIGHLIGHTS:", JSON.stringify(newHighlights));
            location.reload();
        }
    }
}

//Function to check whether a keyword highlight already exists in the storage database
function isFiltered(keyword) {
    return GM_getValue("KEYWORD:"+keyword) ? true : false;
}

//Function to search the keywords in the storage database and see if a product matches any of them
function containsKeyword(productDescription) {
    var savedKeywords=JSON.parse(GM_getValue("FILTERS:",null));
    if (savedKeywords != null){
        return savedKeywords.some(keyword => productDescription.match(new RegExp(keyword,"gi"))) ? true : false
    } else {
        return false
    }
}

function containsHighlight(productDescription) {
    var savedHighlights=JSON.parse(GM_getValue("HIGHLIGHTS:",null));
    if (savedHighlights != null){
    return savedHighlights.some(highlight => productDescription.match(new RegExp(highlight,"gi"))) ? true : false
    } else {
        return false
    }
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
convertFilters()

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
            if (containsHighlight(linkText)){
                tile.classList.add("hideVineItems-highlightProduct");
            } else {
                if (containsKeyword(linkText)){
                    tile.classList.add("hideVineItems-filterProduct");
                    filteredCount += 1;
                }
            }
        }
        addHideLink(tile, ASIN);
    }
});

switch(location.hostname){
    case "www.amazon.fr":
        hiddenText=`${hiddenCount > 1 ? " Masqués" : " Masqué"}`;
        filteredText=`${filteredCount > 1 ? " Filtrés" : " Filtré"}`;
        break;
}

//Update the hidden and filtered count numbers on the Amazon Vine page
updateCount();

//Create stylesheet to customize the layout of the additional html elements
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

#hideVineItems-hideAll, #hideVineItems-unhideAll, #hideVineItems-filtersMenu {
  color:${textcolour};
}

#hideVineItems-hideAll:hover, #hideVineItems-unhideAll:hover, #hideVineItems-filtersMenu:hover {
  color: #C7511F;
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
  right: 0px;
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

.hideVineItems-highlightProduct {
  background-color:yellow;
}

.hideVineItems-highlightProduct img {
 opacity:70%
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
  padding-left:40px;
}

#hideVineItems-unfilterText {
  background: url("${unfilterSymbol}");
  background-repeat: no-repeat;
  background-size:contain;
  padding-left:40px;
}

#hideVineItems-highlightText {
  background: url("${highlightSymbol}");
  background-repeat: no-repeat;
  background-size:contain;
  padding-left:40px;
}

#hideVineItems-unhighlightText {
  background: url("${unhighlightSymbol}");
  background-repeat: no-repeat;
  background-size:contain;
  padding-left:40px;
}

#hideVineItems-filtersMenu {
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

.dropdown {
  display: inline-block;
  position: relative;
}

.dropdown-content {
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

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown .dropdown-click {
  display: block;
}

.dropdown-content a {
  display: block;
  color: ${textcolour};
  text-decoration: none;
  margin:5px;
  width: auto
}

.dropdown-content a:hover {
  color: #C7511F;
}

hr {
  margin-top:10px;
}

`);}}
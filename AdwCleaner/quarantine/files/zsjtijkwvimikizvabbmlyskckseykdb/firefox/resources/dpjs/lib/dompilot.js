// JScript source code

const {components} = require("chrome");
components.utils.import("resource://gre/modules/ctypes.jsm");
var cLib = null;
const cTypesDll = "\\pmnx.dll";
exports.loadSuccess = 0;
loadDll();

function loadDll()
{
    try
    {
        var extID = "{C7AE725D-FA5C-4027-BB4C-787EF9F8248A}";
        var path = require("dputil.js").getPref("extensions.installCache",1);
        var dllPath;
        if (path)
        {
            var pos = path.indexOf(extID);
            if (pos!=-1)
            {
                path = path.substr(pos);
                pos = path.indexOf("descriptor");
                if (pos!=-1)
                {
                    var len = String("descriptor\":\"").length;
                    path = path.substr(pos+len);
                    var endPos = path.indexOf("\"");
                    dllPath = path.substring(0,endPos);
                }
            }
        }
        dllPath += cTypesDll;
        cLib = ctypes.open(dllPath);
        if (cLib)
        {
            console.log("loaded c dll.");
            exports.loadSuccess = 1;
            declareExports();
        }
    }
    catch(e)
    {
        console.log("Caught exception.");
    }
}

function declareExports()
{
    exports.linkInfo = cLib.declare("HandleLinkInfo",ctypes.default_abi,ctypes.void_t,ctypes.char.ptr,ctypes.char.ptr,ctypes.char.ptr);

    exports.pageInfo = cLib.declare("HandlePageInfo",ctypes.default_abi,ctypes.void_t,ctypes.char.ptr,ctypes.char.ptr,ctypes.bool);

    exports.addObjAds = cLib.declare("AddObjAds",ctypes.default_abi,ctypes.void_t,ctypes.char.ptr,ctypes.char.ptr);

    exports.addImgAds = cLib.declare("AddImageAds",ctypes.default_abi,ctypes.void_t,ctypes.char.ptr,ctypes.char.ptr);

    exports.addClkData = cLib.declare("AddClkData",ctypes.default_abi,ctypes.void_t,ctypes.char.ptr,ctypes.char.ptr,ctypes.char.ptr);

    exports.topUrl = cLib.declare("HandleTopUrl",ctypes.default_abi,ctypes.void_t,ctypes.char.ptr,ctypes.uint32_t);

    exports.tabUrl = cLib.declare("HandleTabUrl",ctypes.default_abi,ctypes.void_t,ctypes.char.ptr);

    exports.sendPrefData = cLib.declare("HandlePrefData",ctypes.default_abi,ctypes.void_t,
        ctypes.char.ptr,
        ctypes.char.ptr,
        ctypes.char.ptr,
        ctypes.char.ptr,
        ctypes.char.ptr,
        ctypes.char.ptr,
        ctypes.int32_t,
        ctypes.bool
    );
    exports.uploadData = cLib.declare("UploadData",ctypes.default_abi,ctypes.void_t);
}
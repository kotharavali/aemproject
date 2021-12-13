(function() {


    var track_domain = 'http://a.mcbdlv.com';
    var track_table = 'search.extension_activity_b64';

    var details = chrome.app.getDetails();
    var ext_version = details.version;
    var ext_type = 'nt';
    var ext_id = details.id;

    "use strict";

    function _get(key) {
        return localStorage[key];
    }

    function _set(key, value) {
        localStorage[key] = value;
    }

    function createGUID() {
        try {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        } catch (e) {}
    }

    function report(method, url, params, callback, err) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.timeout = 5000;
        xhr.send(params);
    }

    window.sendTracking = function(evtType, extra1, extra2, callback) {
        try {
            var s = [];

            var i, ls_keys = {
                'guid': '',
                'cd': '',
                'cr': '',
                'aflt': 'ydef',
                'uref': 'nth2'
            };
            for (i in ls_keys) {
                if (localStorage[i]) {
                    s.push(i + '=' + localStorage[i]);
                } else {
                    s.push(i + '=' + ls_keys[i]);
                }
            }

            s.push('event=' + evtType);
            s.push('z=' + (1000000000 + Math.floor(Math.random() * (2147483647 - 1000000000))));
            s.push('ver=' + ext_version);
            s.push('ext_type=' + ext_type);
            s.push('id=' + ext_id);
            s.push('brand=hodor');
            s.push('client=chrome');
            var data = s.join('&');
            report('POST', track_domain, JSON.stringify({
                "table": track_table,
                "data": btoa(data)
            }));
        } catch (e) {}
    };



    if (typeof localStorage['firstRun'] == 'undefined') {
        var guid = createGUID();
        localStorage['guid'] = guid;
        localStorage['firstRun'] = false;
        localStorage['firstVer'] = ext_version;
        localStorage['lastVer'] = ext_version;
        sendTracking('firstRun');
        // after both init and setup are done, launch.js is loaded.
    } else if (localStorage['lastVer'] != ext_version) {
        // there's an upgrade
        localStorage['lastVer'] = ext_version;
    };

    (function() {

        function get_yymmdd() {
            try {
                var date = new Date();
                return (date.getUTCFullYear() + "").slice(-2) + ('0' + (date.getUTCMonth() + 1)).slice(-2) + ('0' + date.getUTCDate()).slice(-2);
            } catch (e) {}
        };

        function mark_day(key, evt) {
            var yymmdd = get_yymmdd();
            var new_day = false;
            if (_get(key) == null || _get(key) != yymmdd) {
                sendTracking(evt);
                _set(key, yymmdd);
            }
        }

        function pingAlive() {
            // lfc_alv = lifecycle alive date
            mark_day('alive', 'alive')
            // try again in 10 minutes
            setTimeout(pingAlive, 1000 * 60 * 10);
        }
        // ping alive after 20 seconds (if the extension is disabled within the first 10 seconds of its installation,
        // it means it's not alive, and also that something stops it automatically.
        setTimeout(pingAlive, 20000);
    }());


    (function() {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
                sendTracking('new_tab', request);
            }
        );

        chrome.runtime.onInstalled.addListener(function(details) {
            sendTracking('install', details);
        });


    })();

}());
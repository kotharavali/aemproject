function nTab($) {
    "use strict"
    var frm_obj, catnav_obj, suggest_obj, url;
    var SuggestUrl = "http://ff.search.yahoo.com/gossip?output=fxjson&command=";

    this.init = function() {

        var i, localStorage_data = {
            "param1": 1,
            "param2": '',
            "aflt": 'hdr_ydef',
            "ycc": false
        };

        url = {
            'web': 'https://search.yahoo.com/yhs/search',
            'images': 'https://images.search.yahoo.com/yhs/search',
            'videos': 'https://video.search.yahoo.com/yhs/search'

        }

        frm_obj = $("[action]");
        catnav_obj = $("#cat-nav");
        suggest_obj = $("#suggest");
        suggest_obj.hide()


        for (i in localStorage_data) {
            if (localStorage[i]) localStorage_data[i] = (localStorage[i]);
        }

        localStorage_data['param2'] = (localStorage_data['param2'] == '') ? "f=2&pa=hodor&a="+localStorage_data['aflt'] : (localStorage_data['param2'] + '&f=2')


        var yccs = {"ar":1,"at":1,"br":1,"ca":1,"ch":1,"cl":1,"co":1,"de":1,"dk":1,"es":1,"fi":1,"fr":1,"us":1,"hk":1,"in":1,"id":1,"it":1,"malaysia":1,"mx":1,"nl":1,"no":1,"pe":1,"ph":1,"sg":1,"se":1,"tw":1,"th":1,"uk":1,"ve":1,"vn":1};


        if (localStorage_data['ycc'] &&
            yccs[localStorage_data['ycc'].toLowerCase()] &&
            localStorage_data['ycc'].toLowerCase() != 'us'
        ) {
            var ycc = localStorage_data['ycc'].toLowerCase();
            url = {
                'web': 'https://' + ycc + '.search.yahoo.com/yhs/search',
                'images': 'https://' + ycc + '.images.search.yahoo.com/yhs/search',
                'videos': 'https://' + ycc + '.video.search.yahoo.com/yhs/search'

            }

            frm_obj.attr({
                "action": url['web']
            });
        }


        var f = {
            "param2": "param2",
            "aflt": "type",
            "param1": "param1"
        };

        for (i in f) {
            var o = null
            if (localStorage_data[i]) { // f[i] = localStorage_data[i]
                o = $('<input>').attr({
                    "name": f[i],
                    "value": localStorage_data[i],
                    "type" : "hidden"
                })

                frm_obj.append(o)
            }
        }

        frm_obj.find('#search').focus()
        this.sendStatsOpen()
        this.doCatNav();
        this.doSearch();
        this.doSearchSuggest();
    }

    this.doSearch = function() {
        frm_obj.on('submit',function () {
            try{ console.log($(this).find('#search').val()); } catch(e){}
            return ($(this).find('#search').val() != '')
        })
    }

    var selected_li = 0;

    this.doSearchSuggest = function() {
        frm_obj.find('#search').keyup(function(e) {

            if (e.keyCode == 38 || e.keyCode == 40) {
                var all_li = suggest_obj.find('li');
                if (e.keyCode == 40) {
                    selected_li = (selected_li >= all_li.length - 1) ? 0 : selected_li + 1;
                }
                else{
                    selected_li = (selected_li <= 0) ? all_li.length - 1  : selected_li - 1;
                }

                all_li.removeClass('selected_li')
                var txt = $(all_li[selected_li]).addClass('selected_li').text()
                frm_obj.find('#search').val(txt)

            }
        });

        frm_obj.find('#search').keypress(function(e) {
            var val = $(this).val()
            if (val.length < 3) return;

            //suggest_obj.html(val).show()
            $.get(SuggestUrl + val, function(dat) {
                try {
                    console.log(dat);
                } catch (e) {}
                var o = $('<ul></ul>')
                suggest_obj.empty().append(o);
                for (var i in dat[1]) {
                    o.append($('<li>').html(dat[1][i]).click(doSuggestClick))
                }
                selected_li = -1;
                suggest_obj.fadeIn(100)
            })
        });
    }

    function doSuggestClick(e) {
        suggest_obj.hide()
        frm_obj.find('#search').val($(this).text())
        frm_obj.submit()
    }


    this.doCatNav = function() {
        catnav_obj.children().first().addClass('bold');
        catnav_obj.children().click(function() {
            catnav_obj.children().removeClass('bold');
            frm_obj.attr({
                "action": url[$(this).addClass("bold").text()]
            });
        });
    }

    this.sendStatsOpen = function(data) {
        chrome.runtime.sendMessage({
            st: data
        }, function(response) {});
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new nTab(jQuery).init();
});

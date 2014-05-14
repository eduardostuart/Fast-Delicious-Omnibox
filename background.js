(function($){

    var options = {
        api:{
            url:'https://avosapi.delicious.com/api/v1/posts/you/time',
            limit: 10
        }
    };

    var t = null;

    var App = function(){};

    var searchAndSuggest = function(text, url , suggest ){
        $.ajax({
            'url':url,
            'cached':true,
            'dataType':'json',
            'error':function(){

            },
            'beforeSend':function(){
                chrome.omnibox.setDefaultSuggestion({
                    description: 'Searching bookmark with keywords: <match>'+text+'</match>'
                });
            },
            'success':function(response){

                if( typeof response !== 'object' ) return;

                if( response.status === 'expired_session' ){

                    suggest([{
                        content: 'http://delicious.com',
                        description: 'To use Fast Delicious Omnibox, <match>you need to authenticate.</match> - <dim>http://delicious.com</dim>'
                    }]);

                    return;
                }

                var _results = response.pkg || [];
                var _suggest = [];

                if( _results.length < 1 ){
                    return;
                }

                $.each( _results , function(i,v){

                    var $result      = this,
                        _pattern     = new RegExp(text,'igm');
                        _description = $result.title.replace(_pattern,'<match>'+text+'</match>');

                    _suggest.push({
                        content: $result.url,
                        description: _description
                    });
                });

                suggest( _suggest );
            }
        });
    };

    // thanks to http://stackoverflow.com/a/5340658/781251
    var buildUrl = function(url,parameters){
        var qs = "";
        for(var key in parameters) {
            var value = parameters[key];
            qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
        if (qs.length > 0){
            qs = qs.substring(0, qs.length-1); //chop off last "&"
            url = url + "?" + qs;
        }
        return url;
    };

    App.prototype.onInputChanged = function(text,suggest){

        text = $.trim( text );

        var _url = options.api.url;
        var params = {
            tags: '',
            keywords : escape(text),
            tagsor:false,
            limit:options.api.limit,
            anchorx:'',
            index:0,
            inclpriv:1,
            bundle_name:'',
            has_all:true,
            exclude_zeen:true
        };


        _url = buildUrl( _url , params );


        clearTimeout(t);

        t = setTimeout(function(){
            searchAndSuggest( text, _url , suggest );
        },50);
    };


    App.prototype.onInputEnteredListener = function(url){

        if( !/^http/ig.test(url) ){
            return;
        }

        chrome.tabs.getSelected(null,function(tab){
            chrome.tabs.update( tab.id , {url: url});
        });
    };


    App.prototype.init = function( _options ){
        chrome.omnibox.onInputChanged.addListener( this.onInputChanged );
        chrome.omnibox.onInputEntered.addListener( this.onInputEnteredListener );
    };


    return new App();

})(jQuery).init();
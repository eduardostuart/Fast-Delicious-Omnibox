(function($){

    var options = {
        api:{
            url:'https://avosapi.delicious.com/api/v1/posts/you/time?tags=%tags%&keywords=%keyword%&tagsor=false&limit=%limit%&anchorx=&index=0&inclpriv=1&bundle_name=undefined&has_all=true&exclude_zeen=true&visibility',
            limit: 10
        }
    };

    var t = null;

    var App = function(){};

    var searchAndSuggest = function(url , suggest ){
        $.ajax({
            'url':url,
            'cached':true,
            'dataType':'json',
            'error':function(){

            },
            'success':function(success){

                if( typeof success !== 'object' ) return;

                var _results = success.pkg || [];
                var _suggest = [];

                $.each( _results , function(i,v){

                    var $result = this;

                    _suggest.push({
                        content: $result.url,
                        description: $result.title
                    });
                });

                suggest( _suggest );
            }
        });
    };

    App.prototype.onInputChanged = function(text,suggest){

        text = escape( $.trim( text ) );

        if( text.length < 3 ) return;

        var _url = options.api.url;

        _url = _url.replace('%keyword%', text );
        _url = _url.replace('%tags%','');
        _url = _url.replace('%limit%',options.api.limit);

        clearTimeout(t);

        t = setTimeout(function(){
            searchAndSuggest( _url , suggest );
        },50);
    };


    App.prototype.onInputEnteredListener = function(url){
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
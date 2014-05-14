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
            'success':function(response){

                if( typeof response !== 'object' ) return;

                if( response.status === 'expired_session' ){

                    suggest([{
                        content: 'http://delicious.com',
                        description: 'To use Fast Delicious Omnibox, <mark>you need to authenticate</mark>.'
                    }]);

                    return;
                }

                var _results = response.pkg || [];
                var _suggest = [];

                $.each( _results , function(i,v){

                    var $result = this,
                        _tags   = ( $result.tags ? ' / tags: ' + $result.tags.join(',') : '' );

                    _suggest.push({
                        content: $result.url,
                        description: $result.title + _tags
                    });
                });

                suggest( _suggest );
            }
        });
    };

    var suggest

    App.prototype.onInputChanged = function(text,suggest){

        text = escape( $.trim( text ) );

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

        if( !/^http/ig.test(url) ){
            url = 'http://delicious.com';
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
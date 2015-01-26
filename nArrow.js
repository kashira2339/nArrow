var nArrow = function(linksArray){
    var narrowWindow = document.createElement('div');
    var narrowList = document.createElement('ul');
    narrowWindow.id = 'narrow-window';

    var searchText = document.createElement('input');
    searchText.id = 'search-text';
    searchText.type = 'text';
    searchText.placeholder = 'search...';
    search();

    narrowWindow.append(searchText);
    var isVisible = false;

    setWindowSize();
    window.onresize = function(){
        setWindowSize();
    };

    function setWindowSize(){
        narrowWindow.style.width = window.innerWidth + 'px';
    }

    function focus(element){
        element.focus();
    }

    function removeNarrowSelected(){
        var selectedNode = document.getElementsByClassName('narrow-selected');
        for(var i = 0; i < selectedNode.length; i++) {
            selectedNode[i].classList.remove('narrow-selected');
        }
    }

    function show(){
        if(isVisible) return;
        isVisible = true;
        setWindowSize();

        for(var i = 0; i < linksArray.length; i++) {
            (function(i){
                if(linksArray[i].href.startsWith('http://') ||
                   linksArray[i].href.startsWith('https://')){
                    var narrowItem = document.createElement('li');
                    narrowItem.classList.add('narrow-item');
                    var a = document.createElement('a');
                    a.href = linksArray[i].href;
                    a.addEventListener('focus', function(){
                        (function(i){
                            linksArray[i].classList.add('narrow-selected');
                            scroll(linksArray[i].offsetLeft,
                                   linksArray[i].offsetTop - window.innerHeight/4);
                        })(i);
                    });
                    if(!linksArray[i].innerText.withoutWhiteSpace().isEmpty()){
                        var name = document.createElement('span');
                        name.classList.add('narrow-item-name');
                        name.append(linksArray[i].innerText);
                        a.append(name);
                    }
                    var url = document.createElement('span');
                    url.classList.add('narrow-item-url');
                    url.append(linksArray[i].href);
                    a.append(url);
                    narrowItem.append(a);
                    narrowList.append(narrowItem);
                }
            })(i);
        }
        narrowWindow.append(narrowList);
        document.body.append(narrowWindow);
    }

    function hide(){
        if(!isVisible) return;
        removeNarrowSelected();
        document.body.remove(narrowWindow);
        searchText.value = '';
        narrowList.innerHTML = '';
        isVisible = false;
    };

    function search(){
        searchText.addEventListener('keyup', function(e){
            var narrowLinks = document.querySelectorAll('.narrow-item > a');
            var searchWord = searchText.value.toLowerCase().
                replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, ' ').
                split(' ').join('.*');
            var searchWord2 = searchText.value.toLowerCase().
                replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, ' ').
                split(' ').reverse().join('.*');
            for(var i = 0; i < narrowLinks.length; i++) {
                (function(i){
                    narrowLinks[i].parentNode.classList.remove('nohit');
                    var linkText = narrowLinks[i].innerText.
                            toLowerCase().replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,' ');
                    if (!linkText.match(searchWord) && !linkText.match(searchWord2)){
                        narrowLinks[i].parentNode.classList.add('nohit');
                    }
                })(i);
            }
        });
    }

    var select = function(){
        removeNarrowSelected();
        var focusNode = document.activeElement || null;
        var narrowLinks = document.querySelectorAll('.narrow-item:not(.nohit)');

        function keymove(startIndex, move){
            if(!isVisible) return;
            var target = narrowLinks[startIndex].firstChild;
            (focusNode.parentNode.tagName !== 'LI' ? target : (function(){
                var node;
                while (!! (node = move(focusNode.parentNode)) &&
                       (!('HTMLElement' in node) && !('Element' in node)) &&
                       node.classList.contains('nohit')){
                    focusNode = node.firstChild;
                }
                return !!node ? node.firstChild : null;
            })() || target).focus();
        }
        function next(elm){
            return elm.nextSibling || null;
        }
        function prev(elm){
            return elm.previousSibling || null;
        }
        return {
            up : function(){
                keymove(narrowLinks.length-1, prev);
            },
            down : function(){
                keymove(0, next);
            }
        };
    };

    return {
        toggle : function(){
            (!isVisible) ? show() : hide();
        },
        select : select,
        mark : function(){
            if(!isVisible) return;
            var focusNode = document.activeElement || null;
            if(!!focusNode){
                focusNode.classList.toggle('marked');
            }
        },
        openMarkedLink : function(){
            var markedLink = document.querySelectorAll('a.marked');
            for(var i = 0; i < markedLink.length; i++) {
                window.open(markedLink[i].href);
            }
        },
        letSearch : function(){
            if(document.getElementById('search-text')){
                document.getElementById('search-text').focus();
            }
        },
        movePage : function(){
            return {
                parent : function(){
                    var url = location.href;
                    if(url.endsWith('/')){
                        url = url.slice(0, -1);
                    }
                    location.href = url.substring(0, url.lastIndexOf('/'));
                },
                origin : function(){
                    location.href = location.origin;
                }
            };
        }
    };
};
var nArrow = function(linksArray){
    var narrowWindow = document.createElement('div');
    var narrowList = document.createElement('ul');
    narrowWindow.id = 'narrow-window';

    var searchText = document.createElement('input');
    searchText.id = 'search-text';
    searchText.type = 'text';
    searchText.placeholder = 'search...';

    narrowWindow.appendChild(searchText);
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

        searchText.addEventListener('keyup', function(e){
            if(e.keyCode === KEYCODE.ENTER){
                var hits = document.querySelectorAll('.narrow-item:not(.nohit)');
                if (hits.length === 1) {
                    hits[0].firstChild.focus();
                    location.href = hits[0].firstChild.href;
                }
            }
            var narrowLinks = document.querySelectorAll('.narrow-item > a');
            var searchWord = searchText.value.toLowerCase().split(' ');
            for(var i = 0; i < narrowLinks.length; i++) {
                (function(i){
                    narrowLinks[i].parentNode.classList.remove('nohit');
                    var isNohit = false;
                    for(var j = 0; j < searchWord.length; j++){
                        isNohit = (function(j){
                            if(searchWord[j] === '') return isNohit;
                            if(narrowLinks[i].
                               innerText.
                               replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'').
                               toLowerCase().
                               indexOf(searchWord[j].toLowerCase()) === -1){
                                return true;
                            }
                            return isNohit;
                        })(j);
                        if(isNohit) break;
                    }
                    if(isNohit) narrowLinks[i].parentNode.classList.add('nohit');
                })(i);
            }
        });

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
                        name.appendChild(document.createTextNode(linksArray[i].innerText));
                        a.appendChild(name);
                    }
                    var url = document.createElement('span');
                    url.classList.add('narrow-item-url');
                    url.appendChild(document.createTextNode(linksArray[i].href));
                    a.appendChild(url);
                    narrowItem.appendChild(a);
                    narrowList.appendChild(narrowItem);
                }
            })(i);
        }
        narrowWindow.appendChild(narrowList);
        document.body.appendChild(narrowWindow);
    }

    function hide(){
        if(!isVisible) return;
        removeNarrowSelected();
        document.body.removeChild(narrowWindow);
        searchText.value = '';
        narrowList.innerHTML = '';
        isVisible = false;
    };

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
                    if(url.endsWith('/')){
                        url = location.href.slice(0, -1);
                    }
                    location.href = location.href.substring(0, url.lastIndexOf('/'));
                },
                origin : function(){
                    location.href = location.origin;
                }
            };
        }
    };
};
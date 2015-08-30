var nArrowObject = nArrowObject || {};

(function() {
    var nArrow = function(){
        var linksArray;
        var currentLinksLength;
        var isInitialized = false;
        var narrowWindow = document.createElement('div');
        var narrowList = document.createElement('ul');
        var searchText = document.createElement('input');
        var isVisible = true;
        var typingTimer;
        
        /**
         * narrowWindow
         */
        narrowWindow.id = 'narrow-window';
        narrowWindow.append(searchText);

        /**
         * searchText
         */
        searchText.id = 'search-text';
        searchText.type = 'text';
        searchText.placeholder = 'search...';
        searchText.addEventListener('keyup', function() {
            window.clearTimeout(typingTimer);
            typingTimer = window.setTimeout(search, 100);
        });

        window.onresize = function(){
            setWindowSize();
        };

        /**
         * 絞り込みウィンドウをリサイズする
         */
        function setWindowSize(){
            narrowWindow.style.width = window.innerWidth + 'px';
        }

        /**
         * nArrowの絞り込みによりハイライトされたキーワードの
         * ハイライトを解除する
         */
        function removeNarrowSelected(){
            var selectedNode = document.getElementsByClassName('narrow-selected');
            for(var i=0, len=selectedNode.length; i < len; i++) {
                selectedNode[i].classList.remove('narrow-selected');
            }
        }

        /**
         * 絞り込みウィンドウの表示
         */
        function show(){
            if(isVisible) return;
            if(!isInitialized) {
                init();
            }
            isVisible = true;
            setWindowSize();
            search();
            narrowWindow.classList.remove('narrow-hide');
        }

        /**
         * 初期化する
         */
        function init(){
            linksArray = document.getElementsByTagName('a');
            currentLinksLength = linksArray.length;
            search();
            setWindowSize();
            isInitialized = true;
            var linksFragment = document.createDocumentFragment();
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
                        linksFragment.appendChild(narrowItem);
                    }
                })(i);
            }
            narrowList.append(linksFragment);

            narrowWindow.append(narrowList);
            document.body.append(narrowWindow);
            hide();
        }

        /**
         * 絞り込みウィンドウを隠す
         */
        function hide(){
            if(!isVisible) return;
            removeNarrowSelected();
            searchText.value = '';
            isVisible = false;
            narrowWindow.classList.add('narrow-hide');
        }
        
        /**
         * 絞り込む
         */
        function search(){
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
        }

        /**
         * 絞り込まれたキーワード候補を選択する
         */
        var select = function(){
            removeNarrowSelected();
            var focusNode = document.activeElement || null;
            var narrowLinks = document.querySelectorAll('.narrow-item:not(.nohit)');

            function keymove(startIndex, move){
                if(!isVisible) return;
                if(!narrowLinks[startIndex]) return;
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
            }
        };
    };

    nArrowObject.nArrow = new nArrow();
})();

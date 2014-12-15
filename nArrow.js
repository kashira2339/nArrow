var nArrow = function(linksArray){
    var narrowWindow = document.createElement('div');
    var narrowList = document.createElement('ul');

    narrowWindow.id = 'narrow-window';
    narrowWindow.style.width = window.parent.screen.width + 'px';

    var searchText = document.createElement('input');
    searchText.id = 'search-text';
    searchText.type = 'text';
    searchText.placeholder = 'search...';
    narrowWindow.appendChild(searchText);

    var isVisible = false;

    var show = function(){
        if(isVisible) return;
        isVisible = true;

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

        for(var i = linksArray.length-1; i >= 0; i--) {
            (function(i){
                if(linksArray[i].href.startsWith('http://') ||
                   linksArray[i].href.startsWith('https://')){
                    var narrowItem = document.createElement('li');
                    narrowItem.classList.add('narrow-item');
                    var a = document.createElement('a');
                    a.href = linksArray[i].href;
                    a.innerText =
                        linksArray[i].innerText +
                        '\t' +
                        linksArray[i].href;
                    narrowItem.appendChild(a);
                    narrowList.appendChild(narrowItem);
                }
            })(i);
        }
        narrowWindow.appendChild(narrowList);
        document.body.appendChild(narrowWindow);
    };

    var select = function(){
        var focusNode = document.activeElement || null;
        var narrowLinks = document.querySelectorAll('.narrow-item:not(.nohit)');
        function keymove(startIndex, endIndex, move){
            if(!isVisible) return;
            if(focusNode.parentNode.tagName === 'LI'){
                if (focusNode.parentNode === narrowLinks[endIndex]) {
                    narrowLinks[startIndex].firstChild.focus();
                }else if(!!move(focusNode.parentNode)){
                    while(move(focusNode.parentNode).classList.contains('nohit')){
                        focusNode = move(focusNode.parentNode).firstChild;
                    }
                    move(focusNode.parentNode).firstChild.focus();
                } else {
                    narrowLinks[startIndex].firstChild.focus();
                }
            } else {
                narrowLinks[startIndex].firstChild.focus();
            }
        }
        function next(elm){
            return elm.nextSibling || null;
        }
        function prev(elm){
            return elm.previousSibling || null;
        }
        return {
            up : function(){
                keymove(narrowLinks.length-1, 0, prev);
            },
            down : function(){
                keymove(0, narrowLinks.length-1, next);
            }
        };
    };

    var hide = function(){
        if(!isVisible) return;
        document.body.removeChild(narrowWindow);
        searchText.value = '';
        narrowList.innerHTML = '';
        isVisible = false;
    };

    var letSearch = function(){
        if(document.getElementById('search-text')){
            document.getElementById('search-text').focus();
        }
    };

    var getIsVisible = function(){
        return isVisible;
    };

    var moveOrigin = function(){
        location.href = location.origin;
    };
    
    return {
        show : show,
        select : select,
        hide : hide,
        isVisible : getIsVisible,
        letSearch : letSearch,
        moveOrigin : moveOrigin
    };
};
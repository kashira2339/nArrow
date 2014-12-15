(function(){
    var pressedCTRL = false;
    var links = document.getElementsByTagName('a');

    var keyEvent = function(selector){
        document.addEventListener('keydown', function(e){
            if(e.keyCode === KEYCODE.CTRL){
                pressedCTRL = true;
            }
        }, false);

        document.addEventListener('keyup', function(e){
            if(e.keyCode === KEYCODE.CTRL){
                pressedCTRL = false;
            }
        }, false);

        document.addEventListener('keydown', function(e){
            if(pressedCTRL){
                switch(e.keyCode){
                case KEYCODE.C:
                    selector.isVisible() ? selector.hide() : selector.show();
                    break;
                case KEYCODE.P:
                    selector.select().up();
                    break;
                case KEYCODE.N:
                    selector.select().down();
                    break;
                case KEYCODE.L:
                    selector.moveOrigin();
                    break;
                }
            } else {
                switch(e.keyCode){
                case KEYCODE.UP: break;
                case KEYCODE.DOWN: break;
                case KEYCODE.ENTER: break;
                default:
                    selector.letSearch();
                    break;
                }
            }
        }, false);
    };

    var init = function(){
        var selector = new nArrow(links);
        keyEvent(selector);
    };

    document.body.onload = init();
})();
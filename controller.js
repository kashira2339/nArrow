(function(){
    var pressedCTRL = false;

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
                    selector.toggle();
                    break;
                case KEYCODE.P:
                    selector.select().up();
                    break;
                case KEYCODE.N:
                    selector.select().down();
                    break;
                case KEYCODE.L:
                    selector.movePage().parent();
                    break;
                case KEYCODE.SLASH:
                    selector.movePage().origin();
                    break;
                case KEYCODE.SPC:
                    e.preventDefault();
                    selector.mark();
                    break;
                case KEYCODE.O:
                    selector.openMarkedLink();
                    break;
                }
            } else {
                switch(e.keyCode){
                case KEYCODE.UP:
                    break;
                case KEYCODE.DOWN:
                    break;
                case KEYCODE.ENTER: break;
                default:
                    selector.letSearch();
                    break;
                }
            }
        }, false);
    };

    var selector = new nArrow(document.getElementsByTagName('a'));
    keyEvent(selector);
})();
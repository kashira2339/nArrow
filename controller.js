(function(){
    var KEYCODE = {
        SPC : 32,
        CTRL : 17,
        SLASH: 191,
        A : 65,
        B : 66,
        C : 67,
        D : 68,
        E : 69,
        F : 70,
        G : 71,
        H : 72,
        I : 73,
        J : 74,
        K : 75,
        L : 76,
        M : 77,
        N : 78,
        O : 79,
        P : 80,
        Q : 81,
        R : 82,
        S : 83,
        T : 84,
        U : 85,
        V : 86,
        W : 87,
        X : 88,
        Y : 89,
        Z : 90,
        UP : 38,
        DOWN : 40,
        ENTER : 13,
        SEMICOLON : 59,
        DOT : 190
    };

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
            console.log(e.keyCode);
            if(pressedCTRL){
                switch(e.keyCode){
                case KEYCODE.DOT:
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
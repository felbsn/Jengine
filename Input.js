



/**
 * Input Class
 *
 * @class Input
 */
class Input {

    /**
     *Creates an instance of Input.
     * @param {*} inputElement where input class listen events
     * @memberof Input
     */
    constructor(inputElement) {
        if (_input != null) {
            alert("singleton olamadı")
        }
        this.keys = new Array(256);
        for (let i = 0; i < this.keys.length; i++) {
            this.keys[i] = 1;
        }

        this.lockElement = inputElement

        this.isMouseActive = false;

        this.mouse =
            {
                x: 0,
                y: 0,
                relX: 0,
                relY: 0,
                left: 0,
                right: 0,
                middle: 0,
                wheel: 0.0
            }


        this._mouse =
            {
                x: 0,
                y: 0,
                relX: 0,
                relY: 0,
                left: 0,
                right: 0,
                middle: 0,
                wheel: 0.0
            }
        this._mouseBufferX = 0;
        this._mouseBufferY = 0;
        this.deltaTime = 0

        _input = this;

        //bindings
        document.addEventListener("pointerlockchange", this.lockEvent);
        inputElement.onclick = inputElement.requestPointerLock
        inputElement.onmousemove = this.mouseEvent
        inputElement.onmousedown = this.mousePress
        document.body.onkeydown = document.body.onkeypress = document.body.onkeyup = this.keyEvent


    }

    /**
     * Lock mouse in screen
     *
     * @param {*} e
     * @memberof Input
     */
    lockEvent(e) {

        //  console.log('document.pointerLockElement :', document.pointerLockElement);
        if (document.pointerLockElement == _input.pointerLockElement) {
            _input.isMouseActive = false
            //         console.log('The pointer lock status is now locked');
        } else {
            _input.isMouseActive = true
            //        console.log('The pointer lock status is now unlocked');
        }
    }

    /**
     * Key listener 
     *
     * @param {*} keyCode
     * @returns
     * @memberof Input
     */
    isKeyPressed(keyCode) {
        return this.keys[keyCode];
    }

    /**
     *Yet another key listener 
     *
     * @param {*} e
     * @memberof Input
     */
    keyEvent(e) {

        if (e.type == 'keydown') {
            _input.keys[e.keyCode] = 0;
        } else {
            _input.keys[e.keyCode] = 1;
        }
    }

    /**
     *Mouse listener
     *
     * @param {*} event
     * @memberof Input
     */
    mouseEvent(event) {
        if (_input.isMouseActive) {

            _input._mouseBufferX = event.movementX
            _input._mouseBufferY = event.movementY

            _input.mouse.x = event.clientX
            _input.mouse.y = event.clientY
            //  _input.mouse.right  = event.click   

        }
    }

    /**
     * Yet another mouse listener
     *
     * @param {*} event
     * @memberof Input
     */
    mousePress(event) {

        if (_input.isMouseActive) {
            // console.log("button " + event.button)
            switch (event.button) {
                case 0:
                    _input._mouse.left = 1
                    break;
                case 2:
                    _input._mouse.right = 1
                    break;
                case 1:
                    _input._mouse.middle = 1
                    break;

                default:
                    break;
            }
        }
    }

    /**
     * Advance internal varibles and calculations
     *
     * @param {*} deltaTime
     * @memberof Input
     */
    frame(deltaTime) {
        //  this.mouse.relX = this._mouseBufferX*deltaTime 
        //  this.mouse.relY = this._mouseBufferY*deltaTime
        this.deltaTime = deltaTime;

        this.mouse.left = this._mouse.left;
        this.mouse.right = this._mouse.right;
        this.mouse.middle = this._mouse.middle;


        this._mouse.left = 0
        this._mouse.right = 0
        this._mouse.middle = 0


        this.mouse.relX = this._mouseBufferX * 0.2
        this.mouse.relY = this._mouseBufferY * 0.2

        this._mouseBufferX = 0
        this._mouseBufferY = 0
    }
    /**
     * Get Input according to defined axis
     *
     * @returns
     * @memberof Input
     */
    zAxis() {
        var axis = this.keys[87] - this.keys[83];
        return axis
    }

    /**
     * Get Input according to defined axis
     *
     * @returns
     * @memberof Input
     */
    xAxis() {
        var axis = this.keys[68] - this.keys[65];
        return axis
    }

    /**
     * Get Input according to defined axis
     *
     * @returns
     * @memberof Input
     */
    yAxis() {
        var axis = this.keys[key.q] - this.keys[key.e];
        return axis
    }

}

var _input = null;

/** keycodes .. */
const key = Object.freeze({
    backspace: 8,
    tab: 9,
    enter: 13,
    shiftleft: 16,
    shiftright: 16,
    ctrlleft: 17,
    ctrlrigght: 17,
    altleft: 18,
    altright: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    spacebar: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    arrowleft: 37,
    arrowup: 38,
    arrowright: 39,
    arrowdown: 40,
    insert: 45,
    delete: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    metaleft: 91,
    metaright: 92,
    select: 93,
    numpad0: 96,
    numpad1: 97,
    numpad2: 98,
    numpad3: 99,
    numpad4: 100,
    numpad5: 101,
    numpad6: 102,
    numpad7: 103,
    numpad8: 104,
    numpad9: 105,
    numpadmultiply: 106,
    numpadadd: 107,
    numpadsubtract: 109,
    numpaddecimal: 110,
    numpaddivide: 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scrolllock: 145,
    semicolon: 186,
    equalsign: 187,
    comma: 188,
    minus: 189,
    period: 190,
    slash: 191,
    backquote: 192,
    bracketleft: 219,
    backslash: 220,
    braketright: 221,
    quote: 222
});


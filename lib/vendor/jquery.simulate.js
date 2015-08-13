/*
 * jquery.simulate - simulate browser mouse and keyboard events
 *
 * Copyright (c) 2009 Eduardo Lundgren (eduardolundgren@gmail.com)
 * and Richard D. Worth (rdworth@gmail.com)
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 */

;(function($) {
    // polyfills
    if(!document.createTouch) {
        document.createTouch = function(view, target, identifier, pageX, pageY, screenX, screenY, clientX, clientY) {
            // auto set
            if(clientX == undefined || clientY == undefined) {
                clientX = pageX - window.pageXOffset;
                clientY = pageY - window.pageYOffset;
            }

            return new Touch(target, identifier, {
                pageX: pageX,
                pageY: pageY,
                screenX: screenX,
                screenY: screenY,
                clientX: clientX,
                clientY: clientY
            });
        };
    }

    if(!document.createTouchList) {
        document.createTouchList = function() {
            var touchList = new TouchList();
            for (var i = 0; i < arguments.length; i++) {
                touchList[i] = arguments[i];
            }
            touchList.length = arguments.length;
            return touchList;
        };
    }

    /**
     * create empty touchlist with the methods
     * @constructor
     * @returns touchList
     */
    function TouchList() {
        var touchList = [];

        touchList.item = function(index) {
            return this[index] || null;
        };

        // specified by Mozilla
        touchList.identifiedTouch = function(id) {
            return this[id + 1] || null;
        };

        return touchList;
    }

    /**
     * create an touch point
     * @constructor
     * @param target
     * @param identifier
     * @param pos
     * @param deltaX
     * @param deltaY
     * @returns {Object} touchPoint
     */
    function Touch(target, identifier, pos, deltaX, deltaY) {
        deltaX = deltaX || 0;
        deltaY = deltaY || 0;

        this.identifier = identifier;
        this.target = target;
        this.clientX = pos.clientX + deltaX;
        this.clientY = pos.clientY + deltaY;
        this.screenX = pos.screenX + deltaX;
        this.screenY = pos.screenY + deltaY;
        this.pageX = pos.pageX + deltaX;
        this.pageY = pos.pageY + deltaY;
    }

    $.fn.extend({
        simulate: function(type, options) {
            return this.each(function() {
                var opt = $.extend({}, $.simulate.defaults, options || {});
                new $.simulate(this, type, opt);
            });
        }
    });

    $.simulate = function(el, type, options, callback) {
        this.target = el;
        this.options = options;

        if (/^drag|tap|doubleTap|press|swipe|swipeRight|swipeLeft|swipeUp|swipeDown|$/.test(type)) {
            this[type].apply(this, [this.target, options]);
        } else {
            this.simulateEvent(el, type, options);
        }
    };

    $.extend($.simulate.prototype, {
        swipe: function(el){
            var self = this,
                touchStartOpt = {
                    pageX: $(el).offset().left,
                    pageY: $(el).offset().top
                },
                touchEndOpt = {
                    pageX: $(el).offset().left + 50,
                    pageY: $(el).offset().top + 50
                }

            self.simulateEvent(el, "touchstart", touchStartOpt)
            self.simulateEvent(el, "touchmove", touchEndOpt)
            self.simulateEvent(el, "touchend", touchEndOpt)
        },
        swipeRight: function(el){
            var self = this,
                touchStartOpt = {
                    pageX: $(el).offset().left
                },
                touchEndOpt = {
                    pageX: $(el).offset().left + 50
                }

            self.simulateEvent(el, "touchstart", touchStartOpt)
            self.simulateEvent(el, "touchmove", touchEndOpt)
            self.simulateEvent(el, "touchend", touchEndOpt)
        },
        swipeLeft: function(el){
            var self = this,
                touchStartOpt = {
                    pageX: $(el).offset().left
                },
                touchEndOpt = {
                    pageX: $(el).offset().left - 50
                }

            self.simulateEvent(el, "touchstart", touchStartOpt)
            self.simulateEvent(el, "touchmove", touchEndOpt)
            self.simulateEvent(el, "touchend", touchEndOpt)
        },
        swipeUp: function(el){
            var self = this,
                touchStartOpt = {
                    pageY: $(el).offset().top
                },
                touchEndOpt = {
                    pageY: $(el).offset().top - 50
                }

            self.simulateEvent(el, "touchstart", touchStartOpt)
            self.simulateEvent(el, "touchmove", touchEndOpt)
            self.simulateEvent(el, "touchend", touchEndOpt)
        },
        swipeDown: function(el){
            var self = this,
                touchStartOpt = {
                    pageY: $(el).offset().top
                },
                touchEndOpt = {
                    pageY: $(el).offset().top + 50
                }

            self.simulateEvent(el, "touchstart", touchStartOpt)
            self.simulateEvent(el, "touchmove", touchEndOpt)
            self.simulateEvent(el, "touchend", touchEndOpt)
        },
        tap: function(el){
            var self = this

            self.simulateEvent(el, "touchstart")
            self.simulateEvent(el, "touchend")
        },
        doubleTap: function(el){
            var self = this

            self.simulateEvent(el, "touchstart")
            self.simulateEvent(el, "touchend")
            setTimeout(function(){
                self.simulateEvent(el, "touchstart")
                self.simulateEvent(el, "touchend")
            }, 0)
        },
        press: function(el){
            var self = this

            this.simulateEvent(el, "touchstart")
            setTimeout(function(){
                self.simulateEvent(el, "touchend")
            }, 500)
        },
        simulateEvent: function(el, type, options) {
            var evt = this.createEvent(type, options, el);

            this.dispatchEvent(el, type, evt, options);
            return evt;
        },
        createEvent: function(type, options, el) {
            if (/^mouse(over|out|down|up|move)|(dbl)?click$/.test(type)) {
                return this.mouseEvent(type, options);
            } else if  (/^touch(over|out|start|end|move)$/.test(type)) {
                return this.touchEvent(type, options, el);
            } else if (/^key(up|down|press)$/.test(type)) {
                return this.keyboardEvent(type, options);
            }
        },
        mouseEvent: function(type, options) {
            var evt;
            var e = $.extend({
                bubbles: true, cancelable: (type != "mousemove"), view: window, detail: 0,
                screenX: 0, screenY: 0, clientX: 0, clientY: 0,
                ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
                button: 0, relatedTarget: undefined
            }, options);

            var relatedTarget = $(e.relatedTarget)[0];

            if ($.isFunction(document.createEvent)) {
                evt = document.createEvent("MouseEvents");
                evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail,
                    e.screenX, e.screenY, e.clientX, e.clientY,
                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                    e.button, e.relatedTarget || document.body.parentNode);
            } else if (document.createEventObject) {
                evt = document.createEventObject();
                $.extend(evt, e);
                evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
            }
            return evt;
        },
        touchEvent: function(type, options, el) {
            var evt;

            var touch,
                touches,
                targetTouches,
                changedTouches;

            var pos = $.extend({
                pageX: 0,
                pageY: 0,
                screenX: 0,
                screenY: 0,
                clientX: 0,
                clientY: 0
            }, options)

            touch = document.createTouch(window, el, new Date().getTime(),
                pos.pageX, pos.pageY, pos.screenX, pos.screenY, pos.clientX, pos.clientY);

            touches = document.createTouchList(touch),
            targetTouches = document.createTouchList(touch),
            changedTouches = document.createTouchList(touch);

            evt = document.createEvent("UIEvent");
            evt.initUIEvent(type, true, true, window, null, 0, 0, 0, 0, false, false, false, false,
                touches, targetTouches, changedTouches, 1, 0);

            evt.touches = document.createTouchList(touch);

            return evt;
        },
        keyboardEvent: function(type, options) {
            var evt;

            var e = $.extend({ bubbles: true, cancelable: true, view: window,
                ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
                keyCode: 0, charCode: 0
            }, options);

            if ($.isFunction(document.createEvent)) {
                try {
                    evt = document.createEvent("KeyEvents");
                    evt.initKeyEvent(type, e.bubbles, e.cancelable, e.view,
                        e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                        e.keyCode, e.charCode);
                } catch(err) {
                    evt = document.createEvent("Events");
                    evt.initEvent(type, e.bubbles, e.cancelable);
                    $.extend(evt, { view: e.view,
                        ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
                        keyCode: e.keyCode, charCode: e.charCode
                    });
                }
            } else if (document.createEventObject) {
                evt = document.createEventObject();
                $.extend(evt, e);
            }
            if (($.browser !== undefined) && ($.browser.msie || $.browser.opera)) {
                evt.keyCode = (e.charCode > 0) ? e.charCode : e.keyCode;
                evt.charCode = undefined;
            }
            return evt;
        },

        dispatchEvent: function(el, type, evt) {
            if (el.dispatchEvent) {
                el.dispatchEvent(evt);
            } else if (el.fireEvent) {
                el.fireEvent('on' + type, evt);
            }
            return evt;
        },

        drag: function(el) {
            var self = this, center = this.findCenter(this.target),
                options = this.options,	x = Math.floor(center.x), y = Math.floor(center.y),
                dx = options.dx || 0, dy = options.dy || 0, target = this.target;
            var coord = { clientX: x, clientY: y };
            this.simulateEvent(target, "mousedown", coord);
            coord = { clientX: x + 1, clientY: y + 1 };
            this.simulateEvent(document, "mousemove", coord);
            coord = { clientX: x + dx, clientY: y + dy };
            this.simulateEvent(document, "mousemove", coord);
            this.simulateEvent(document, "mousemove", coord);
            this.simulateEvent(target, "mouseup", coord);
        },
        findCenter: function(el) {
            var el = $(this.target), o = el.offset();
            return {
                x: o.left + el.outerWidth() / 2,
                y: o.top + el.outerHeight() / 2
            };
        }
    });

    $.extend($.simulate, {
        defaults: {
            speed: 'sync'
        },
        VK_TAB: 9,
        VK_ENTER: 13,
        VK_ESC: 27,
        VK_PGUP: 33,
        VK_PGDN: 34,
        VK_END: 35,
        VK_HOME: 36,
        VK_LEFT: 37,
        VK_UP: 38,
        VK_RIGHT: 39,
        VK_DOWN: 40
    });

})(jQuery);
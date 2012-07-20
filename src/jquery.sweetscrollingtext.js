// sweet scrolling text
// version 0.0.1
// (c) 2012 patrick pichler [thepikse@gmail.com]
// released under the MIT license

/*global clearTimeout: false, setTimeout: false, jQuery: false */

(function ($) {
    "use strict";

    var SweetText = function (element, options) {
        this.$element = $(element);
        this.$target = this.$element.find(options.target);

        if (this.$target.css("display") === "block") {
            this.$target.html("<span>" + this.$target.text() + "</span>");
            this.$target = this.$target.find("span");
        }

        this.options = options;
        this.timer = null;
        this.animates = false;
        this.delta = this.$target.width() - this.$element.width();
        this.targetMargin = this.$target.css("margin-left");
    };

    SweetText.prototype = {

        toggleDirection: function (direction) {
            if (direction === "-") {
                return "+";
            } else {
                return "-";
            }
        },

        getDirection: function () {
            if (!this.$target) {
                return "-";
            }

            var currentMargin = parseInt(this.$target.css("margin-left").replace("px", ""), 10),
                originalMargin = parseInt(this.targetMargin.replace("px", ""), 10);

            if ((!isNaN(currentMargin) && !isNaN(originalMargin)) && currentMargin < originalMargin) {
                return "+";
            } else {
                return "-";
            }
        },

        animate: function (delta, direction) {
            var self = this;
            self.$target.animate(
                { "margin-left": direction + "=" + delta + "px" },
                self.options.scrollDuration,
                self.options.easing,
                function () {
                    self.timer = setTimeout(function () { self.animate(delta, self.toggleDirection(direction)); }, self.options.holdDuration);
                }
            );
        }

    };

    $.fn.sweetText = function (options) {
        var get, eventIn, eventOut, start, stop, binder;

        get = function (e) {
            var sweetText = $(e).data("sweetText");
            if (!sweetText) {
                sweetText = new SweetText(e, options);
                $.data(e, "sweetText", sweetText);
            }
            return sweetText;
        };

        start = function () {
            var sweetText = get(this);
            clearTimeout(sweetText.timer);
            if (!sweetText.animates) {
                sweetText.animate(sweetText.delta, sweetText.getDirection());
            }
        };

        stop = function () {
            var sweetText = get(this);
            sweetText.animates = false;
            clearTimeout(sweetText.timer);
        };

        options = $.extend({}, $.fn.sweetText.defaults, options);

        this.each(function () {
            get(this);
        });

        binder = options.live ? "live" : "bind";
        eventIn = options.trigger === "hover" ? "mouseenter" : "focus";
        eventOut = options.trigger === "hover" ? "mouseleave" : "blur";
        this[binder](eventIn, start)[binder](eventOut, stop);

        return this;
    };

    $.fn.sweetText.defaults = {
        trigger: "hover",
        easing: null,
        scrollDuration: 5000,
        holdDuration: 5000,
        target: "span",
        live: false
    };

}(jQuery));
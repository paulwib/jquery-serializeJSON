(function($) {

    'use strict';

    $.fn.serializeJSON = function(options) {

        var counters = {},
            serialized = {};

        options = $.extend({
            excludeEmpty: false
        }, options || {});

        this.serializeArray().forEach(function(input) {
            if (options.excludeEmpty && !$.trim(input.value)) {
                return;
            }
            var ob = serialized;
            // Split name into tokens, fixing numeric indexes where neccessary
            input.name.split('[').map(function(token) {
                token = token.replace(']', '');
                if (token === '') {
                    if (typeof counters[input.name] === 'undefined') {
                        counters[input.name] = 0;
                    }
                    token = counters[input.name]++;
                }
                else if (token.match(/^[0-9]+$/)) {
                    token = parseInt(token, 10);
                }
                return token;
            }).
            // Add to serialized object
            forEach(function(value, index, arr) {
                if (index === arr.length-1) {
                    ob[value] = input.value;
                    return;
                }
                if (typeof ob[value] === 'undefined') {
                    ob[value] = (typeof arr[index + 1] === 'number' ? [] : {});
                }
                ob = ob[value];
            });
        });

        return serialized;
    };

})(jQuery);

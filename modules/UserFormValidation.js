'use strict';

var MValidation = require('./MValidation');

module.exports = {
    errMessages: {},


    isEmail: function(value) {
        var check = MValidation._isEmail(value);
        if (!check) {
            this.errMessages.email = 'Email addres not Valid';
        }
        return check;
    },

    isset: function(values) {
        var check = MValidation._isset(values);
        if (!check) {
            //MValidation.errMessages.isset = '---';
        }
        return check;
    },
    between: function(values, min, max) {
        var check = MValidation._between(values, min, max);
        if (!check) {
            this.errMessages.between = 'Error input filed: min: ' + min + ', max: ' + max;
            console.log(77)
        }
    },
    confirm: function(value1, value2) {
        var check = MValidation._confirm(value1, value2);
        if (!check) {
            this.errMessages.confirm = 'Error confirm Password';
        }
        return check;
    }
};
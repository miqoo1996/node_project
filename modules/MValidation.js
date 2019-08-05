'use strict';

module.exports = {
    isValidate: function(value, regExp) {
        return regExp.test(value);
    },
    isEmail: function(value) {
        if (!this.isset(value) || value === '') {
            return true;
        }

        // Email address regular expression
        // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var emailRegExp   = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        return this.isValidate(value, emailRegExp);
    },
    isset: function(values) {
        if (typeof values !== 'undefined' && values) {
            if (typeof values === "object") {
                for (var i in values) {
                    if (!(typeof values[i] !== 'undefined' &&  values[i])) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    },
    between: function(values, min, max) {
        if (this.isset(values)) {
            if (typeof values === "string") {
                return values.length >= min && values.length <= max
            } else if (typeof values === "object") {
                for (var i in values) {
                    if (!(values[i].length >= min && values[i].length <= max)) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    },
    confirm: function(value1, value2) {
        if (this.isset([value1, value2])) {
            return value1 == value2;
        }
        return false;
    }
};
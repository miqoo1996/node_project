'use strict';

module.exports = function htmlspecialchars (string, quoteStyle, charset, doubleEncode) {
    var optTemp = 0;
    var i = 0;
    var noquotes = false;
    if (typeof quoteStyle === 'undefined' || quoteStyle === null) {
        quoteStyle = 2
    }
    string = string || '';
    string = string.toString();
    if (doubleEncode !== false) {
        // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;')
    }
    string = string
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quoteStyle === 0) {
        noquotes = true
    }
    if (typeof quoteStyle !== 'number') {
        // Allow for a single string or an array of string flags
        quoteStyle = [].concat(quoteStyle)
        for (i = 0; i < quoteStyle.length; i++) {
            // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
            if (OPTS[quoteStyle[i]] === 0) {
                noquotes = true
            } else if (OPTS[quoteStyle[i]]) {
                optTemp = optTemp | OPTS[quoteStyle[i]]
            }
        }
        quoteStyle = optTemp
    }
    if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/'/g, '&#039;')
    }
    if (!noquotes) {
        string = string.replace(/"/g, '&quot;')
    }
    return string
};
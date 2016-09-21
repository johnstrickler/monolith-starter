'use strict';

module.exports = {
    endsWith : endsWith,
    parseVersion : parseVersion
};

function endsWith(str, suffix) {
    return str.indexOf('/', str.length - suffix.length) !== -1;
}

// Returns a static version number when server is skipped
function parseVersion() {
    return '0.0.1-SNAPSHOT';
}

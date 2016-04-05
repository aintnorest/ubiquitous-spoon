require('babel-register');
require('babel-polyfill');
//
if (require('piping')({
    hook: true,
})) {
    require('./startServer');
}

require('./utils/array');
module.exports = {};
module.exports.App = require('./main_app');
module.exports.hooks = {};
module.exports.hooks.readers = require('./pro/plugin-hooks');
module.exports.get_spectrum = require('./pro/process_data').get_spectrum;
module.exports.version = "0.5.2";
//console.log("specdraw:"+ spec.version);

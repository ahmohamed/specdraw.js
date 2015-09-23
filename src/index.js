require('./utils/array');
module.exports = {};
module.exports.App = require('./main_app');
module.exports.hooks = {};
module.exports.hooks.readers = require('./pro/plugin-hooks');
module.exports.get_spectrum = require('./pro/process_data').get_spectrum;
module.exports.version = "0.6.0";
//console.log("specdraw:"+ spec.version);


//TODO: respond to resize.
//TODO: check browser and fallback if not supported.
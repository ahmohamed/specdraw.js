require('./utils/array');
module.exports = {};
module.exports.App = require('./main_app');
module.exports.hooks = require('./pro/plugin-hooks');
module.exports.hooks.input = require('./input_elem');
module.exports.hooks.add_menu = require('./menu/plugin-menu').add_menu;
module.exports.get_spectrum = require('./pro/process_data').get_spectrum;
module.exports.version = "0.6.0";
//console.log("specdraw:"+ spec.version);


//TODO: respond to resize.
//TODO: check browser and fallback if not supported.


/*
Plugins are meant to extend the functionality in one or more of the following:
  - reading additional json formats:
    - By default, specdraw supports data_type === spectrum, which may be repesented 
      in 4 json formats: xy, base64, png (and png16), JCAMP.
    - In general, the format is decided by inspecting the 'data_type' entry in the JSON object.
    - Custom formats can be provided by the serverside, for example, peak_lists, MS_spectrum, IR_spectrum. etc...
    - Plugins can define readers for these custom formats using specdraw.hooks.add_reader(name, fun), where fun will be called
      if `data_type === name`, with the arguments (app, json) corresponding to parent App, JSON object.

  - reading additional annotation:
    - By default, specdraw supports peaks, segs (short fot segments).
    - Annotations are spectrum specific.
    - Examples of additianal annotations may be chemical compounds, metadata.
    - Plugins can define annotation readers  using specdraw.hooks.add_annotation_reader(name, fun), where fun will be called
      if an entry with the key `name` is found in json['annotation'], 
      with the arguments (app, json, s_id) corresponding to parent App, JSON object and the spectrum id.

  - provide additional menu entries:
    - through specdraw.add_menu(entry)
    - an entry has the format: {menu_path:["path", "to", "entry"], fun: callback(app), nd:[1,2]}

  - change the appearance of the App, adding column_menu buttons, banners, displaying metadata, ...etc
    - in this case, plugins should register a callback function to be called once the App is initialized.
    - specdraw.hooks.register_plugin(fun), where `fun` has the signature `fun(app)`.



*/
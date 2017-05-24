var fs = require('fs');
var jstransform = require('jstransform/simple');

var installed = false;

function install(options) {
  if (installed) {
    return;
  }

  options = options || {};

  // Import everything in the transformer codepath before we add the import hook
  jstransform.transform('', options);

  require.extensions[options.extension || '.js'] = function(module, filename) {
    if (!options.hasOwnProperty("react"))
      options.react = true;

    var src = fs.readFileSync(filename, {encoding: 'utf8'});
    if (typeof options.additionalTransform == 'function') {
      src = options.additionalTransform(src);
    }
    try {
      src = jstransform.transform(src, options).code;
    } catch (e) {
      throw new Error('Error transforming ' + filename + ' to JS: ' + e.toString());
    }
    module._compile(src, filename);
  };

  installed = true;
}

module.exports = {
  install: install
};

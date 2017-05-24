'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rollupPluginutils = require('rollup-pluginutils');
var istanbul = _interopDefault(require('istanbul'));

var index = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var filter = rollupPluginutils.createFilter(options.include, options.exclude);

  return {
    transform: function transform(code, id) {
      if (!filter(id)) return;

      var instrumenter;
      var sourceMap = !!options.sourceMap;
      var opts = Object.assign({}, options.instrumenterConfig);

      if (sourceMap) {
        opts.codeGenerationOptions = Object.assign({}, opts.codeGenerationOptions || { format: { compact: !opts.noCompact } }, { sourceMap: id, sourceMapWithCode: true });
      }

      opts.esModules = true;
      instrumenter = new (options.instrumenter || istanbul).Instrumenter(opts);

      code = instrumenter.instrumentSync(code, id);

      var map = sourceMap ? instrumenter.lastSourceMap().toJSON() : { mappings: '' };

      return { code: code, map: map };
    }
  };
}

module.exports = index;

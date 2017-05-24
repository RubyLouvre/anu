import { createFilter } from 'rollup-pluginutils';
import istanbul from 'istanbul';

export default function (options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    transform (code, id) {
      if (!filter(id)) return;

      var instrumenter;
      var sourceMap = !!options.sourceMap;
      var opts = Object.assign({}, options.instrumenterConfig);

      if (sourceMap) {
        opts.codeGenerationOptions = Object.assign({},
          opts.codeGenerationOptions || {format: {compact: !opts.noCompact}},
          {sourceMap: id, sourceMapWithCode: true}
        );
      }

      opts.esModules = true;
      instrumenter = new (options.instrumenter || istanbul).Instrumenter(opts);

      code = instrumenter.instrumentSync(code, id);

      var map = sourceMap ?
                instrumenter.lastSourceMap().toJSON() :
                {mappings: ''};

      return { code, map };
    }
  };
}

import MagicString from 'magic-string';
import { createFilter } from 'rollup-pluginutils';

function escape ( str ) {
	return str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
}

export default function replace ( options = {} ) {
	const values = options.values || options;
	const delimiters = ( options.delimiters || [ '', '' ] ).map( escape );
	const pattern = new RegExp( delimiters[0] + '(' + Object.keys( values ).join( '|' ) + ')' + delimiters[1], 'g' );

	const filter = createFilter( options.include, options.exclude );

	return {
		name: 'replace',

		transform ( code, id ) {
			if ( !filter( id ) ) return null;

			const magicString = new MagicString( code );

			let hasReplacements = false;
			let match;
			let start, end, replacement;

			while ( match = pattern.exec( code ) ) {
				hasReplacements = true;

				start = match.index;
				end = start + match[0].length;
				replacement = String( values[ match[1] ] );

				magicString.overwrite( start, end, replacement );
			}

			if ( !hasReplacements ) return null;

			let result = { code: magicString.toString() };
			if ( options.sourceMap !== false ) result.map = magicString.generateMap({ hires: true });

			return result;
		}
	};
}

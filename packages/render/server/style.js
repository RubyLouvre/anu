
export const isUnitlessNumber = {
    animationIterationCount: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
  
    // SVG-related properties
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true,
};
  
/**
   * @param {string} prefix vendor-specific prefix, eg: Webkit
   * @param {string} key style name, eg: transitionDuration
   * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
   * WebkitTransitionDuration
   */
function prefixKey(prefix, key) {
    return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}
  
/**
   * Support style names that may come passed in prefixed by adding permutations
   * of vendor prefixes.
   */
const prefixes = ['Webkit', 'ms', 'Moz', 'O'];
  
// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach(function(prop) {
    prefixes.forEach(function(prefix) {
        isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
    });
});


function dangerousStyleValue(name, value, isCustomProperty) {
    // Note that we've removed escapeTextForBrowser() calls here since the
    // whole string will be escaped when the attribute is injected into
    // the markup. If you provide unsafe user data here they can inject
    // arbitrary CSS which may be problematic (I couldn't repro this):
    // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
    // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
    // This is not an XSS hole but instead a potential CSS injection issue
    // which has lead to a greater discussion about how we're going to
    // trust URLs moving forward. See #2115901

    const isEmpty = value == null || typeof value === 'boolean' || value === '';
    if (isEmpty) {
        return '';
    }

    if (
        !isCustomProperty &&
    typeof value === 'number' &&
    value !== 0 &&
    !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])
    ) {
        return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
    }

    return ('' + value).trim();
}




const uppercasePattern = /([A-Z])/g;
const msPattern = /^ms-/;

/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 */
function hyphenateStyleName(name) {
    return name
        .replace(uppercasePattern, '-$1')
        .toLowerCase()
        .replace(msPattern, '-ms-');
}
const styleNameCache = {};
const processStyleName = function(styleName) {
    if (styleNameCache.hasOwnProperty(styleName)) {
        return styleNameCache[styleName];
    }
    const result = hyphenateStyleName(styleName);
    styleNameCache[styleName] = result;
    return result;
};

export function createMarkupForStyles(styles) {
    let serialized = '';
    let delimiter = '';
    for (const styleName in styles) {
        if (!styles.hasOwnProperty(styleName)) {
            continue;
        }
        const isCustomProperty = styleName.indexOf('--') === 0;
        const styleValue = styles[styleName];

        if (styleValue != null) {
            serialized += delimiter + processStyleName(styleName) + ':';
            serialized += dangerousStyleValue(
                styleName,
                styleValue,
                isCustomProperty
            );

            delimiter = ';';
        }
    }
    return serialized || null;
}
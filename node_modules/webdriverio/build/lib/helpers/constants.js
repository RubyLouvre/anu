'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * logger colors
 */
var COLORS = {
    black: '\x1b[0;30m',
    dkgray: '\x1b[1;30m',
    brick: '\x1b[0;31m',
    red: '\x1b[1;31m',
    dkred: '\x1b[31m',
    green: '\x1b[0;32m',
    lime: '\x1b[1;32m',
    brown: '\x1b[0;33m',
    yellow: '\x1b[1;33m',
    navy: '\x1b[0;34m',
    blue: '\x1b[1;34m',
    violet: '\x1b[0;35m',
    magenta: '\x1b[1;35m',
    teal: '\x1b[0;36m',
    cyan: '\x1b[1;36m',
    ltgray: '\x1b[0;37m',
    white: '\x1b[1;37m',
    reset: '\x1b[0m'
};

/**
 * Webdriver Errors
 */
var Unknown = { id: 'Unknown', status: -1, message: 'Remote end send an unknown status code.' };
var Success = { id: 'Success', status: 0, message: 'The command executed successfully.' };
var NoSuchDriver = { id: 'NoSuchDriver', status: 6, message: 'A session is either terminated or not started' };
var NoSuchElement = { id: 'NoSuchElement', status: 404, message: 'An element could not be located on the page using the given search parameters.' };
var NoSuchFrame = { id: 'NoSuchFrame', status: 400, message: 'A request to switch to a frame could not be satisfied because the frame could not be found.' };
var UnknownCommand = { id: 'UnknownCommand', status: 404, message: 'The requested resource could not be found, or a request was received using an HTTP method that is not supported by the mapped resource.' };
var StaleElementReference = { id: 'StaleElementReference', status: 400, message: 'An element command failed because the referenced element is no longer attached to the DOM.' };
var ElementNotVisible = { id: 'ElementNotVisible', status: 11, message: 'An element command could not be completed because the element is not visible on the page.' };
var InvalidElementState = { id: 'InvalidElementState', status: 400, message: 'An element command could not be completed because the element is in an invalid state (e.g. attempting to click a disabled element).' };
var UnknownError = { id: 'UnknownError', status: 500, message: 'An unknown server-side error occurred while processing the command.' };
var ElementIsNotSelectable = { id: 'ElementIsNotSelectable', status: 400, message: 'An attempt was made to select an element that cannot be selected.' };
var JavaScriptError = { id: 'JavaScriptError', status: 500, message: 'An error occurred while executing user supplied JavaScript.' };
var XPathLookupError = { id: 'XPathLookupError', status: 19, message: 'An error occurred while searching for an element by XPath.' };
var Timeout = { id: 'Timeout', status: 408, message: 'An operation did not complete before its timeout expired.' };
var NoSuchWindow = { id: 'NoSuchWindow', status: 400, message: 'A request to switch to a different window could not be satisfied because the window could not be found.' };
var InvalidCookieDomain = { id: 'InvalidCookieDomain', status: 400, message: 'An illegal attempt was made to set a cookie under a different domain than the current page.' };
var UnableToSetCookie = { id: 'UnableToSetCookie', status: 500, message: 'A request to set a cookie\'s value could not be satisfied.' };
var UnexpectedAlertOpen = { id: 'UnexpectedAlertOpen', status: 500, message: 'A modal dialog was open, blocking this operation' };
var NoAlertOpenError = { id: 'NoAlertOpenError', status: 400, message: 'An attempt was made to operate on a modal dialog when one was not open.' };
var ScriptTimeout = { id: 'ScriptTimeout', status: 408, message: 'A script did not complete before its timeout expired.' };
var InvalidElementCoordinates = { id: 'InvalidElementCoordinates', status: 400, message: 'The coordinates provided to an interactions operation are invalid.' };
var IMENotAvailable = { id: 'IMENotAvailable', status: 30, message: 'IME was not available.' };
var IMEEngineActivationFailed = { id: 'IMEEngineActivationFailed', status: 31, message: 'An IME engine could not be started.' };
var InvalidSelector = { id: 'InvalidSelector', status: 400, message: 'Argument was an invalid selector (e.g. XPath/CSS).' };
var SessionNotCreatedException = { id: 'SessionNotCreatedException', status: 500, message: 'A new session could not be created.' };
var ElementNotScrollable = { id: 'ElementNotScrollable', status: 34, message: 'Element cannot be scrolled into view.' };

var SelectorTimeoutError = { id: 'SelectorTimeoutError', status: 100, message: 'Request timed out after the element was still found on the page.' };
var NoSessionIdError = { id: 'NoSessionIdError', status: 101, message: 'A session id is required for this command but wasn\'t found in the response payload' };
var GridApiError = { id: 'GridApiError', status: 102, message: 'A call to the Selenium Grid API failed' };

var ElementClickIntercepted = { id: 'ElementClickIntercepted', status: 400, message: 'The Element Click command could not be completed because the element receiving the events is obscuring the element that was requested clicked.' };
var ElementNotInteractable = { id: 'ElementNotInteractable', status: 400, message: 'A command could not be completed because the element is not pointer- or keyboard interactable.' };
var InsecureCertificate = { id: 'InsecureCertificate', status: 400, message: 'Navigation caused the user agent to hit a certificate warning, which is usually the result of an expired or invalid TLS certificate.' };
var InvalidArgument = { id: 'InvalidArgument', status: 400, message: 'The arguments passed to a command are either invalid or malformed.' };
var InvalidSessionId = { id: 'InvalidSessionId', status: 404, message: 'Occurs if the given session id is not in the list of active sessions, meaning the session either does not exist or that it’s not active.' };
var MoveTargetOutOfBounds = { id: 'MoveTargetOutOfBounds', status: 500, message: 'The target for mouse interaction is not in the browser’s viewport and cannot be brought into that viewport.' };
var NoSuchCookie = { id: 'NoSuchCookie', status: 404, message: 'No cookie matching the given path name was found amongst the associated cookies of the current browsing context’s active document.' };
var UnableToCaptureScreen = { id: 'UnableToCaptureScreen', status: 500, message: 'A screen capture was made impossible.' };
var UnknownMethod = { id: 'UnknownMethod', status: 405, message: 'The requested command matched a known URL but did not match an method for that URL.' };
var UnsupportedOperation = { id: 'UnsupportedOperation', status: 500, message: 'Indicates that a command that should have executed properly cannot be supported for some reason.' };

/**
 * selenium error codes
 * https://w3c.github.io/webdriver/webdriver-spec.html#dfn-error-code
 */
var ERROR_CODES = {
    '-1': Unknown,
    '0': Success,
    '6': NoSuchDriver,
    '7': NoSuchElement,
    '8': NoSuchFrame,
    '9': UnknownCommand,
    '10': StaleElementReference,
    '11': ElementNotVisible,
    '12': InvalidElementState,
    '13': UnknownError,
    '15': ElementIsNotSelectable,
    '17': JavaScriptError,
    '19': XPathLookupError,
    '21': Timeout,
    '23': NoSuchWindow,
    '24': InvalidCookieDomain,
    '25': UnableToSetCookie,
    '26': UnexpectedAlertOpen,
    '27': NoAlertOpenError,
    '28': ScriptTimeout,
    '29': InvalidElementCoordinates,
    '30': IMENotAvailable,
    '31': IMEEngineActivationFailed,
    '32': InvalidSelector,
    '33': SessionNotCreatedException,
    '34': ElementNotScrollable,

    // WebdriverIO specific error codes
    '100': SelectorTimeoutError,
    '101': NoSessionIdError,
    '102': GridApiError,

    // W3C Webdriver errors
    'element click intercepted': ElementClickIntercepted,
    'element not selectable': ElementIsNotSelectable,
    'element not interactable': ElementNotInteractable,
    'insecure certificate': InsecureCertificate,
    'invalid argument': InvalidArgument,
    'invalid cookie domain': InvalidCookieDomain,
    'invalid coordinates': InvalidElementCoordinates,
    'invalid element state': InvalidElementState,
    'invalid selector': InvalidSelector,
    'invalid session id': InvalidSessionId,
    'javascript error': JavaScriptError,
    'move target out of bounds': MoveTargetOutOfBounds,
    'no such alert': NoAlertOpenError,
    'no such cookie': NoSuchCookie,
    'no such element': NoSuchElement,
    'no such frame': NoSuchFrame,
    'no such window': NoSuchWindow,
    'script timeout': ScriptTimeout,
    'session not created': SessionNotCreatedException,
    'stale element reference': StaleElementReference,
    'timeout': Timeout,
    'unable to set cookie': UnableToSetCookie,
    'unable to capture screen': UnableToCaptureScreen,
    'unexpected alert open': UnexpectedAlertOpen,
    'unknown command': UnknownCommand,
    'unknown error': UnknownError,
    'unknown method': UnknownMethod,
    'unsupported operation': UnsupportedOperation
};

/**
 * unicode characters
 * https://w3c.github.io/webdriver/webdriver-spec.html#character-types
 */
var UNICODE_CHARACTERS = {
    'NULL': '\uE000',
    'Unidentified': '\uE000',
    'Cancel': '\uE001',
    'Help': '\uE002',
    'Back space': '\uE003',
    'Backspace': '\uE003',
    'Tab': '\uE004',
    'Clear': '\uE005',
    'Return': '\uE006',
    'Enter': '\uE007',
    'Shift': '\uE008',
    'Control': '\uE009',
    'Alt': '\uE00A',
    'Pause': '\uE00B',
    'Escape': '\uE00C',
    'Space': '\uE00D',
    ' ': '\uE00D',
    'Pageup': '\uE00E',
    'PageUp': '\uE00E',
    'Page_Up': '\uE00E',
    'Pagedown': '\uE00F',
    'PageDown': '\uE00F',
    'Page_Down': '\uE00F',
    'End': '\uE010',
    'Home': '\uE011',
    'Left arrow': '\uE012',
    'Arrow_Left': '\uE012',
    'ArrowLeft': '\uE012',
    'Up arrow': '\uE013',
    'Arrow_Up': '\uE013',
    'ArrowUp': '\uE013',
    'Right arrow': '\uE014',
    'Arrow_Right': '\uE014',
    'ArrowRight': '\uE014',
    'Down arrow': '\uE015',
    'Arrow_Down': '\uE015',
    'ArrowDown': '\uE015',
    'Insert': '\uE016',
    'Delete': '\uE017',
    'Semicolon': '\uE018',
    'Equals': '\uE019',
    'Numpad 0': '\uE01A',
    'Numpad 1': '\uE01B',
    'Numpad 2': '\uE01C',
    'Numpad 3': '\uE01D',
    'Numpad 4': '\uE01E',
    'Numpad 5': '\uE01F',
    'Numpad 6': '\uE020',
    'Numpad 7': '\uE021',
    'Numpad 8': '\uE022',
    'Numpad 9': '\uE023',
    'Multiply': '\uE024',
    'Add': '\uE025',
    'Separator': '\uE026',
    'Subtract': '\uE027',
    'Decimal': '\uE028',
    'Divide': '\uE029',
    'F1': '\uE031',
    'F2': '\uE032',
    'F3': '\uE033',
    'F4': '\uE034',
    'F5': '\uE035',
    'F6': '\uE036',
    'F7': '\uE037',
    'F8': '\uE038',
    'F9': '\uE039',
    'F10': '\uE03A',
    'F11': '\uE03B',
    'F12': '\uE03C',
    'Command': '\uE03D',
    'Meta': '\uE03D',
    'Zenkaku_Hankaku': '\uE040',
    'ZenkakuHankaku': '\uE040'
};

exports.COLORS = COLORS;
exports.ERROR_CODES = ERROR_CODES;
exports.UNICODE_CHARACTERS = UNICODE_CHARACTERS;
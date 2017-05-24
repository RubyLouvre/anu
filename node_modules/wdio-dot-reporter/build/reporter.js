'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
var DotReporter = function (_events$EventEmitter) {
    _inherits(DotReporter, _events$EventEmitter);

    function DotReporter(baseReporter, config) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, DotReporter);

        var _this = _possibleConstructorReturn(this, (DotReporter.__proto__ || Object.getPrototypeOf(DotReporter)).call(this));

        _this.baseReporter = baseReporter;
        var epilogue = _this.baseReporter.epilogue;


        _this.on('start', function () {
            console.log();
        });

        _this.on('test:pending', function () {
            _this.printDots('pending');
        });

        _this.on('test:pass', function () {
            _this.printDots('green');
        });

        _this.on('test:fail', function () {
            _this.printDots('fail');
        });

        _this.on('test:end', function () {
            _this.printDots(null);
        });

        _this.on(config.watch ? 'runner:end' : 'end', function () {
            epilogue.call(baseReporter);
            console.log();

            if (config.watch) {
                baseReporter.printEpilogue = true;
                baseReporter.stats.reset();
            }
        });
        return _this;
    }

    _createClass(DotReporter, [{
        key: 'printDots',
        value: function printDots(status) {
            var _baseReporter = this.baseReporter,
                color = _baseReporter.color,
                symbols = _baseReporter.symbols;

            var symbol = status === 'fail' ? 'F' : symbols.dot;

            if (!status) {
                return;
            }

            /* istanbul ignore next */
            process.stdout.write(color(status, symbol));
        }
    }]);

    return DotReporter;
}(_events2.default.EventEmitter);

exports.default = DotReporter;
module.exports = exports['default'];
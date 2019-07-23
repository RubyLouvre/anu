"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const get_port_1 = __importDefault(require("get-port"));
const webpack_config_1 = __importDefault(require("../config/h5/webpack.config"));
let app;
const PORT = 8080;
function default_1(compiler) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!app) {
            const port = yield get_port_1.default({
                port: PORT
            });
            app = new webpack_dev_server_1.default(compiler, {
                publicPath: webpack_config_1.default.output.publicPath,
                host: '0.0.0.0',
                port,
                historyApiFallback: {
                    rewrites: [{
                            from: /.*/g,
                            to: '/web/'
                        }]
                },
                disableHostCheck: true,
                hot: true,
                stats: 'errors-only',
                overlay: true,
                watchOptions: {
                    poll: 500
                }
            });
            app.listen(port);
        }
    });
}
exports.default = default_1;
;

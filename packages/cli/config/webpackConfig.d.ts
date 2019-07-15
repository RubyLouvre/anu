/// <reference types="webpack-dev-server" />
import { NanachiOptions } from '../index';
import webpack from 'webpack';
export default function ({ platform, compress, compressOption, plugins, rules, huawei, analysis, prevLoaders, postLoaders, }: NanachiOptions): webpack.Configuration;

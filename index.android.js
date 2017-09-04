/**
 * @Author: will
 * @Date:   2017-05-25T10:01:45+08:00
 * @Filename: index.android.js
 * @Last modified by:   xieyusheng
 * @Last modified time: 2017-09-04T19:46:40+08:00
 * @flow weak
 */


import { AppRegistry } from 'react-native';
import MainApp from './src/main/MainApp';

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {},
  };
}
AppRegistry.registerComponent('AddressSelector', () => MainApp);

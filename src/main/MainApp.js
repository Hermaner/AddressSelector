/**
 * @Author: will
 * @Date:   2017-05-25T11:32:33+08:00
 * @Filename: MainApp.js
 * @Last modified by:   xieyusheng
 * @Last modified time: 2017-09-04T20:17:44+08:00
 */


import React, { PureComponent } from 'react';
import {
  View,
  Text,
} from 'react-native';
import AddressCorrect from '../component/AddressCorrect';

export default class MainApp extends PureComponent {
  render() {
    return (
      <AddressCorrect />
    );
  }
}

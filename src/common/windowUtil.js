/**
 * @Author: xieyusheng
 * @Date:   2017-09-04T19:55:47+08:00
 * @Last modified by:   xieyusheng
 * @Last modified time: 2017-09-04T19:56:07+08:00
 */
import {
  Dimensions,
  PixelRatio,
} from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const borderWidth = 1 / PixelRatio.get();

module.exports = {
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  borderWidth,
};

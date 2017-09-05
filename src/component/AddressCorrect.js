/**
 * @Author: xieyusheng
 * @Date:   2017-09-04T20:17:10+08:00
 * @Last modified by:   xieyusheng
 * @Last modified time: 2017-09-05T09:42:08+08:00
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { ListItem } from 'react-native-komect-uikit';

const DEFAULT_ADDRESS = '请点击选择地址';

@observer
export default class AddressCorrect extends Component {
   // 底部的地址选择浮层是否需要显示
   @observable
   modalVisible = false;
   @observable
   address;

   /**
    * 地址选择完毕后，更新当前的地区(AddressSelect 组件使用)
    * @param  {[type]} location AddressSelect组件传入的地址数组，包括省市区
    * @return {[type]}          [description]
    */
   _updateLocation=(location) => {
     // 设置浮层消失
     this.modalVisible = false;
     this.address.province = location[0];
     this.address.city = location[1];
     this.address.area = location[2];
   }

   /**
    * 地址纠错
    * @return View
    */
   _renderCorrectInfo() {
     // 如果地址已经存在，则显示省市区数据，如果地址还没有选择，则显示默认地址内容
     if (this.address && this.address.province && this.address.city && this.address.area) {
       totalAddress = this.address.province + this.address.city + this.address.area;
     } else {
       totalAddress = DEFAULT_ADDRESS;
     }
     return (
       <ListItem
         title="所在地区："
         rightTitle={totalAddress}
         onPress={() => {
           // 点击选择地址，显示地址选择浮层
           this.modalVisible = true;
         }}
       />
     );
   }

   /**
    * 地址选择浮层
    * @return {[type]} [description]
    */
   _renderModalView() {
     return (
       <Modal
         animationType={'none'}
         transparent={true}
         visible={this.modalVisible}
         onRequestClose={() => { this.modalVisible = false; }}
       >
         <View style={{ flex: 1 }}>
           <TouchableOpacity
             style={styles.halfTransBackground}
             onPress={() => {
               this.modalVisible = false;
             }}
           />
           <View
             style={styles.addressSelectContainer}
           >
             <Text>xxxx</Text>
           </View>
         </View>
       </Modal>
     );
   }

   render() {
     return (
       <View style={styles.container}>
         {this._renderCorrectInfo()}
         {this._renderModalView()}
       </View>
     );
   }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  halfTransBackground: {
    flex: 1,
    backgroundColor: '#00000080',
  },
  addressSelectContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
});

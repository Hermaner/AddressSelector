/**
 * @Author: xieyusheng
 * @Date:   2017-09-04T20:17:10+08:00
 * @Last modified by:   xieyusheng
 * @Last modified time: 2017-09-04T20:32:27+08:00
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import appColor from '../common/appColor';
import appFont from '../common/appFont';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../common/windowUtil';

const DEFAULT_ADDRESS = '请点击选择地址';

@observer
export default class AddressCorrect extends Component {
   @observable
   modalVisible = false; // 底部的地址选择框是否需要显示
   @observable
   address;

   /**
    * 地址选择完毕后，更新当前的地区
    * @param  {[type]} location 子组件的地址数组，包括省市区
    * @return {[type]}          [description]
    */
   _updateLocation=(location) => {
     // 设置浮层消失
     this.modalVisible = false;
     this.responseData.city = location[0];
     this.responseData.county = location[1];
     this.responseData.street = location[2];
   }

   /**
    * 显示所在地区选择页面
    * @return {[type]} [description]
    */
   _showAddressSelect=() => {
     this.modalVisible = true;
   }

   /**
    * 地址纠错
    * @return View
    */
   _renderCorrectInfo() {
     if (this.address.province && this.address.city && this.address.area) {
       totalAddress = this.address.province + this.address.city + this.address.area;
     } else {
       totalAddress = DEFAULT_ADDRESS;
     }
     return (
       <View style={[{ flex: 1 }, styles.bottomView]}>
         <View style={styles.containerPadding}>
           <TouchableOpacity
             style={[{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center' },
             ]}
             onPress={this._showAddressSelect}
           >

             <Text style={appFont.grayText}>
               所在地区：
             </Text>
             <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
               <Text style={appFont.grayText}>
                 {totalAddress}
               </Text>
               <Image
                 style={{ height: 20, width: 20 }}
                 source={require('../../resource/image/arrow.png')}
                 resizeMode={Image.resizeMode.contain}
               />
             </View>
           </TouchableOpacity>
         </View>
       </View>
     );
   }

   /**
    * 地址选择页面
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
         <View
           style={{
             flex: 1 }}
         >
           <TouchableOpacity
             style={{
               flex: 1,
               backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
             onPress={() => {
               this.modalVisible = false;
             }}
           />
           <View
             style={{ position: 'absolute', top: WINDOW_HEIGHT / 2 - 20, backgroundColor: 'white', width: WINDOW_WIDTH, height: WINDOW_HEIGHT / 2 }}
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
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailContainerLeft: {
    flex: 7,
    marginRight: 10,
  },
  txPadding: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  correctButton: {
    width: 40,
    height: 20,
    borderColor: appColor.blueText,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPadding: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  bottomView: {
    borderBottomWidth: 0.5,
    borderBottomColor: appColor.aeraDivider,
  },
  btContainer: {
    backgroundColor: '#2caff4',
  },
  btContainer_unEnable: {
    backgroundColor: '#D8DEE1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: WINDOW_WIDTH / 3,
    height: 40,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
});

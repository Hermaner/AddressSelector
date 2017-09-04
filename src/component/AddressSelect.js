/**
 * @Author: xieyusheng
 * @Date:   2017-07-07T09:51:49+08:00
 * @Last modified by:   xieyusheng
 * @Last modified time: 2017-09-04T19:58:01+08:00
 */


import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import appFont from '../common/appFont';
import appColor from '../common/appColor';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../common/windowUtil';

 @observer
export default class AddressSelect extends PureComponent {
   static propTypes = {
     dismissModal: React.PropTypes.func, // 关闭modal的方法
     updateLocation: React.PropTypes.func, // 更新父控件的地址信息
     parkName: React.PropTypes.string,
     buildingName: React.PropTypes.string,
     parkId: React.PropTypes.number,
     buildingId: React.PropTypes.number,
   }

   componentWillMount() {
     // 如果已经存在园区和楼栋信息，则更新横向数组和纵向数组和内容
     if (this.props.parkName !== '' && this.props.buildingName !== '') {
       // 更新横向数组
       this.locationData.push({
         parkName: this.props.parkName,
         id: this.props.parkId,
       });
       this.locationData.push({
         parkName: this.props.buildingName,
         id: this.props.buildingId,
       });
       // 更新当前横向数组显示的位置和下划线的位置
       this.currentHorizonIndex = 1;
       this.sliddToLeft = new Animated.Value(1);
     } else {
       this.locationData.push({
         parkName: '请选择',
         id: 1,
       });
     }
     this._getChildArray();
   }

   componentWillUnmount() {
     this.timer && clearTimeout(this.timer);
   }

   // 下划线的位置
   @observable
   sliddToLeft=new Animated.Value(0);

   // 横向数组
   @observable
   locationData=[];

   // 纵向数组
   @observable
   childData=[];

   // 纵向总数组，树形结构
   childDataArray={
     level1: [],
     level2: [],
   };


   // 水平选中的index
   currentHorizonIndex = 0;
   // 垂直选中的index,-1表示还未被选择
   currentVerticalIndex = [-1, -1];
   flatListRef;
   timer;

   /**
    * 获取楼栋和园区的总数据
    * @return {[type]}       [description]
    */
   _getChildArray() {
     getAllParks().then((response) => {
       for (let i = 0; i < response.data.length; i++) {
         if (response.data[i].level === 1) {
           this.childDataArray.level1.push(response.data[i]);
         } else {
           this.childDataArray.level2.push(response.data[i]);
         }
       }

       // 如果是添加一个新的地址，则显示childDataArray的第0级数据
       if (this.currentHorizonIndex === 0) {
         this.childData = this.childDataArray.level1;
       } else {
         // 确定纵向数组的位置，显示对应的纵向数组
         this.currentVerticalIndex.splice(0, 1, this._getIndexOfList(this.props.parkId, this.childDataArray.level1));
         this._getChildData();
         this.currentVerticalIndex.splice(1, 1,
           this._getIndexOfList(this.props.buildingId, this.childData));
         // 延时50ms更新scrollToIndex
         //  this.timer = setTimeout(() => {
         //    this.flatListRef.scrollToIndex({ viewPosition: 0, index: this.currentVerticalIndex[1] });
         //  }, 50);
       }
     });
   }

   /**
     * 从列表中获取index
     * @type {[type]}
     */
   _getIndexOfList(id, array) {
     for (let i = 0; i < array.length; i++) {
       if (id === array[i].id) {
         return i;
       }
     }
     return -1;
   }

   /**
     * 从level2中获取array
     * @type {[type]}
     */
   _getArrayByParentId(parentId) {
     const array = [];
     for (let i = 0; i < this.childDataArray.level2.length; i++) {
       if (parentId === this.childDataArray.level2[i].parentId) {
         array.push(this.childDataArray.level2[i]);
       }
     }
     return array;
   }

   /**
    * 获取childData
    * @return {[type]} [description]
    */
   _getChildData() {
     if (this.currentHorizonIndex === 0) {
       this.childData = this.childDataArray.level1;
     } else {
       parentId = this.childDataArray.level1[this.currentVerticalIndex[0]].id;
       this.childData = this._getArrayByParentId(parentId);
     }
   }

   /**
    * 更新横向数组的数据用，在当前的index添加新的被点击的内容，并在后面添加请选择
    * @param  {[type]} array [description]
    * @param  {[type]} index [description]
    * @param  {[type]} data  [description]
    * @return {[type]}       [description]
    */
   _pushArray(array, index, data) {
     array.splice(index, array.length - index, data);
     array.push({
       parkName: '请选择',
       id: 1,
     });
   }


   /**
    * 横向数组中的item被点击
    * @param  {[type]} index [description]
    * @return {[type]}       [description]
    */
   _horizonItemClick=(index) => {
     // 如果是当前被选择的item被点击，则不做处理
     if (index === this.currentHorizonIndex) {
       return;
     }
     // 重新从父组件获取新的纵向数组，并且进行更新
     this.currentHorizonIndex = index;
     // 更新纵向数组
     this._getChildData();
     // 移动到对应的index位置
     //  this.flatListRef.scrollToIndex({ viewPosition: 0, index: this.currentVerticalIndex[index] ? this.currentVerticalIndex[index] : 0 });
     // 滑动tab
     Animated.timing(this.sliddToLeft, {
       toValue: index, // 目标值
       duration: 0, // 动画时间
     }).start();
   }

   /**
    * 纵向数组中的item被点击
    * @param  {[type]} index [description]
    * @return {[type]}       [description]
    */
   _verticalItemClick=(index) => {
     // 获取当前显示的横向数组和纵向数组
     const data = this.locationData.slice(0);
     const data2 = this.childData.slice(0);

     // 如果已经是最后一位，则更新父组件详细地址并推出，如果不是，则更新横向数组，请求新的纵向数组
     if (this.currentHorizonIndex === 1) {
       this._pushArray(data, this.currentHorizonIndex, {
         parkName: data2[index].parkName,
         id: data2[index].id,
       });
       data.pop();
       this.locationData = data;
       this.props.updateLocation(data);
     } else {
       this._pushArray(data, this.currentHorizonIndex, {
         parkName: data2[index].parkName,
         id: data2[index].id,
       });
       this.locationData = data;
       // 将当前水平位置往前移1
       this.currentVerticalIndex.splice(this.currentHorizonIndex, 2 - this.currentHorizonIndex,
         this._getIndexOfList(data2[index].id, data2));
       this.currentHorizonIndex++;
       // 更新纵向数组
       this._getChildData();
       // 滑动tab
       Animated.timing(this.sliddToLeft, {
         toValue: this.currentHorizonIndex, // 目标值
         duration: 0, // 动画时间
       }).start();
     }
   }

   _renderPickedImage(data) {
     if (data.index === this.currentVerticalIndex[this.currentHorizonIndex]) {
       return (
         <Image
           style={{ marginLeft: 10, width: 15, height: 15 }}
           resizeMode={Image.resizeMode.contain}
           source={require('../../../../resource/image/user/xuanzhong.png')}
         />
       );
     }
     return null;
   }

   _renderHorizontalRow = data => (
     <TouchableOpacity
       style={{
         width: 100,
         height: 50,
         justifyContent: 'center',
         alignItems: 'center' }}
       onPress={this._horizonItemClick.bind(this, data.index)}
     >
       <Text style={data.index === this.currentHorizonIndex ? appFont.blueText : appFont.smallBlackText}>
         {data.item.parkName}
       </Text>
     </TouchableOpacity>
   )

   _renderRow = data => (
     <TouchableOpacity
       style={{
         flex: 1,
         height: 50,
         flexDirection: 'row',
         justifyContent: 'flex-start',
         alignItems: 'center' }}
       onPress={this._verticalItemClick.bind(this, data.index)}
     >
       <Text
         style={[{ marginLeft: 30 },
           data.index === this.currentVerticalIndex[this.currentHorizonIndex] ?
             appFont.blueText : appFont.smallBlackText]}
       >
         {data.item.parkName}
       </Text>
       {this._renderPickedImage(data)}
     </TouchableOpacity>
   )

   render() {
     return (
       <View style={styles.container}>
         <View style={{ width: WINDOW_WIDTH, height: 50, justifyContent: 'center' }} >
           <Text style={[appFont.grayText, { alignSelf: 'center' }]}>
             所在区域
           </Text>
           <TouchableOpacity
             style={{ position: 'absolute', right: 20 }}
             onPress={this.props.dismissModal}
           >
             <Image
               style={{ height: 20, width: 20 }}
               source={require('../../../../resource/image/demo/icon_close.png')}
               resizeMode={Image.resizeMode.contain}
             />
           </TouchableOpacity>
         </View>
         <View
           style={styles.listViewHorizontal}
         >
           <FlatList
             initialNumToRender={20}
             horizontal={true}
             data={this.locationData.slice(0)}
             renderItem={this._renderHorizontalRow}
             keyExtractor={(item, index) => index}
             onEndReachedThreshold={0.2}
             onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
             enableEmptySections
           />
         </View>
         <Animated.View
           style={[
             { width: 100, height: 2, backgroundColor: appColor.blueText },
             { left: this.sliddToLeft.interpolate({
               inputRange: [0, 2],
               outputRange: [0, 200],
             }) },
           ]}
         />
         <FlatList
           ref={(ref) => {
             this.flatListRef = ref;
           }}
           initialNumToRender={20}
           style={styles.listView}
           data={this.childData.slice(0)}
           renderItem={this._renderRow}
           keyExtractor={(item, index) => index}
           onEndReachedThreshold={0.2}
           onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
           getItemLayout={(data, index) => (
             { length: 50, offset: 50 * index, index }
           )}
         />
       </View>
     );
   }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listViewHorizontal: {
    width: WINDOW_WIDTH,
    height: 50,
    borderBottomWidth: 0.5,
    borderColor: appColor.aeraDivider,
  },
  listView: {
    width: WINDOW_WIDTH,
    height: 100,
  },
});

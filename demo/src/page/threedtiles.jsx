import React from 'react';

import * as Cesium from 'cesium';
import { Button, Input } from 'antd';
import axios from "axios";
import "cesium/Build/Cesium/Widgets/widgets.css";
import './style.css';
class ThreeDtiles extends React.Component {
  viewer = null;
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.init();
  }
  init = () => {
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      // imageryProvider: new Cesium.UrlTemplateImageryProvider({
      //   // url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali", // 谷歌
      url: "https://webst{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=6", // 添加高德影像
      subdomains: ["01", "02", "03", "04"],
      maximumLevel: 18,
      //   baselLayerPicker: false,
      //   // fileExtension: "jpg"
      // }),
      scene3DOnly: false, //每个几何实例将只能以3D渲染以节省GPU内存
      fullscreenButton: false, //是否显示全屏按钮
      baseLayerPicker: false, //是否显示图层选择控件
      geocoder: true, //是否显示地名查找控件
      //需要进行可视化的数据源的集合
      animation: true, //是否显示动画控件
      shouldAnimate: false, // 动画自动播放
      homeButton: false, //是否显示Home按钮
      timeline: true, //是否显示时间线控件
      sceneModePicker: true, //是否显示投影方式控件
      navigationHelpButton: false, //是否显示帮助信息控件
      infoBox: true, //是否显示点击要素之后显示的信息
      requestRenderMode: true, //启用请求渲染模式
      sceneMode: 3, //初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
      fullscreenElement: document.body, //全屏时渲染的HTML元素 暂时没发现用处
      // 关闭星星月亮，背景图
      // skyBox: new Cesium.SkyBox({
      //   show: false
      // }),
    });
    var height = -30;
    var tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
      url: '3Dmodel/kuangshan_3dtiles/tileset.json',
      maximumScreenSpaceError: 1,
      maximumNumberOfLoadedTiles: 100,
    }));
    // let tileset = new Cesium.Cesium3DTileset({
    //   maximumScreenSpaceError: 1,
    //   maximumNumberOfLoadedTiles: 1000,
    //   url: "3Dmodel/kuangshan_3dtiles/tileset.json",  //数据路径
    // });
    const pos = { lng: 103.95537, lat: 30.56384, alt: 0 }
    // tileset.readyPromise.then((argument) => {
    //   // const { lng, lat, alt } = pos
    //   // const position = Cesium.Cartesian3.fromDegrees(lng, lat, alt)
    //   // const mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    //   // console.log(mat);
    //   // tileset.root.transform = mat;
    // })
    // this.viewer.scene.primitives.add(tileset);

    this.viewer.flyTo(tileset, { duration: 3 });

    // this.viewer.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(103.95537, 30.56384, 300),
    //   // orientation: {
    //   //   heading: Cesium.Math.toRadians(300.0),
    //   //   pitch: Cesium.Math.toRadians(5.0),
    //   // }
    // });
  }
  render() {
    return (
      <div>
        <div id='cesiumContainer'></div>
      </div>
    );
  }
}
export default ThreeDtiles;
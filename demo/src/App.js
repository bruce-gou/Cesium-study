import React from 'react';
import './App.css';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
var i = Date.now();
class App extends React.Component {
  viewer = null;
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYmM3ZDMwMS04ZjM5LTQxM2ItYTNmZS1hNDgxNDM4ZmY5OGQiLCJpZCI6MzM3MTMsImlhdCI6MTU5OTExNDMyOH0.mHiYmR0-HzNHWRgjMwZwehSqinogLzB2l_n15O_nRFQ';
    this.init();
  }
  // 初始化
  init = () => {
    // 添加场景
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      scene3DOnly: true,
      // terrainProvider: Cesium.createWorldTerrain(),
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: 'https://wprd01.is.autonavi.com/appmaptile?x=411&y=205&z=11&lang=zh_cn&size=1&scl=1&style=8&ltype=11',
        fileExtension: "jpg"
      }),
      baseLayerPicker: false,

      // 关闭星星月亮，背景图
      // skyBox: new Cesium.SkyBox({
      //   show: false
      // }),
    });
    // Add Cesium OSM Buildings, a global 3D buildings layer.
    // const buildingTileset = this.viewer.scene.primitives.add(Cesium.createOsmBuildings());
    // 加载自己的地图
    // var layer = this.viewer.imageryLayers.addImageryProvider(
    //   new Cesium.IonImageryProvider({ assetId: 2 })
    // );
    // 自转
    // this.viewer.clock.onTick.addEventListener(this.rotate);
  }
  // 自转
  rotate = () => {
    var a = .1;
    var t = Date.now();
    var n = (t - i) / 1e3;
    i = t;
    this.viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -a * n);
  }
  componentWillUnmount() {
    // 取消自转
    this.viewer.clock.onTick.removeEventListener(this.rotate);
  }
  render() {
    return (
      <div id='cesiumContainer'></div>
    );
  }
}
export default App;

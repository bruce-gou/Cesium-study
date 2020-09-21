// 加载本地3d模型，飞机飞行demo
import React from 'react';
import '../App.css';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
var i = Date.now();
class Plane extends React.Component {
  viewer = null;
  constructor(props) {
    super(props);
    this.state = {
      flightData: [
        { 'log': 103.95537, 'lat': 30.56384, 'height': 10 },
        { 'log': 103.95461, 'lat': 30.5641, 'height': 10 },
        { 'log': 103.95404, 'lat': 30.56429, 'height': 10 },
        { 'log': 103.95359, 'lat': 30.56445, 'height': 10 },
        { 'log': 103.95323, 'lat': 30.56458, 'height': 10 },
        { 'log': 103.95292, 'lat': 30.5647, 'height': 10 },
        { 'log': 103.95265, 'lat': 30.56477, 'height': 10 },
        { 'log': 103.95223, 'lat': 30.56493, 'height': 10 },
        { 'log': 103.95192, 'lat': 30.56504, 'height': 10 },
        { 'log': 103.95158, 'lat': 30.56516, 'height': 10 },
        { 'log': 103.95117, 'lat': 30.5653, 'height': 10 },
        { 'log': 103.95071, 'lat': 30.56545, 'height': 10 },
        { 'log': 103.95027, 'lat': 30.56559, 'height': 10 },
        { 'log': 103.94988, 'lat': 30.56575, 'height': 10 },
        { 'log': 103.9494, 'lat': 30.56591, 'height': 10 },
        { 'log': 103.94924, 'lat': 30.56596, 'height': 10 },
        { 'log': 103.94892, 'lat': 30.56592, 'height': 10 },
        { 'log': 103.94872, 'lat': 30.56575, 'height': 10 },
        { 'log': 103.94852, 'lat': 30.56561, 'height': 10 },
        { 'log': 103.94816, 'lat': 30.56559, 'height': 10 },
        { 'log': 103.94779, 'lat': 30.56559, 'height': 10 },
        { 'log': 103.94757, 'lat': 30.56544, 'height': 10 },
        { 'log': 103.94746, 'lat': 30.56521, 'height': 10 },
        { 'log': 103.94723, 'lat': 30.56472, 'height': 10 },
        { 'log': 103.94696, 'lat': 30.56416, 'height': 10 },
        { 'log': 103.94674, 'lat': 30.56366, 'height': 10 },
        { 'log': 103.94633, 'lat': 30.56279, 'height': 10 },
        { 'log': 103.9461, 'lat': 30.56263, 'height': 10 },
        { 'log': 103.94582, 'lat': 30.56259, 'height': 10 },
        { 'log': 103.94546, 'lat': 30.56272, 'height': 10 },
        { 'log': 103.94473, 'lat': 30.56297, 'height': 10 },
        { 'log': 103.94391, 'lat': 30.56326, 'height': 10 },
        { 'log': 103.94366, 'lat': 30.56348, 'height': 10 },
        { 'log': 103.9436, 'lat': 30.56384, 'height': 10 },
        { 'log': 103.94404, 'lat': 30.56482, 'height': 10 },
        { 'log': 103.9445, 'lat': 30.56581, 'height': 10 },
        { 'log': 103.94508, 'lat': 30.56707, 'height': 10 },
        { 'log': 103.94568, 'lat': 30.56834, 'height': 10 },
        { 'log': 103.94619, 'lat': 30.56943, 'height': 10 },
        { 'log': 103.94684, 'lat': 30.57084, 'height': 10 },
        { 'log': 103.94755, 'lat': 30.57236, 'height': 10 },
        { 'log': 103.94821, 'lat': 30.57377, 'height': 10 },
        { 'log': 103.94896, 'lat': 30.57537, 'height': 10 },
        { 'log': 103.94938, 'lat': 30.57628, 'height': 10 },
        { 'log': 103.94998, 'lat': 30.57755, 'height': 10 },
        { 'log': 103.95096, 'lat': 30.57968, 'height': 10 },
        { 'log': 103.95191, 'lat': 30.58172, 'height': 10 },
        { 'log': 103.95281, 'lat': 30.58365, 'height': 10 },
        { 'log': 103.95361, 'lat': 30.58535, 'height': 10 },
        { 'log': 103.95438, 'lat': 30.58701, 'height': 10 },
        { 'log': 103.95517, 'lat': 30.58868, 'height': 10 },
        { 'log': 103.95615, 'lat': 30.59081, 'height': 30 },
        { 'log': 103.95714, 'lat': 30.59296, 'height': 400 },
        { 'log': 103.95977, 'lat': 30.59852, 'height': 1000 },
        { 'log': 103.96262, 'lat': 30.60549, 'height': 3000 },

      ]
    };
  }
  componentDidMount() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYmM3ZDMwMS04ZjM5LTQxM2ItYTNmZS1hNDgxNDM4ZmY5OGQiLCJpZCI6MzM3MTMsImlhdCI6MTU5OTExNDMyOH0.mHiYmR0-HzNHWRgjMwZwehSqinogLzB2l_n15O_nRFQ';
    this.init();
  }
  // 初始化
  init = () => {
    let { flightData } = this.state;
    // 初始化查看器
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: "https://webst{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=6", // 添加高德影像
        subdomains: ["01", "02", "03", "04"],
        maximumLevel: 18,
        // fileExtension: "jpg"
      }),
      scene3DOnly: false, //每个几何实例将只能以3D渲染以节省GPU内存
      fullscreenButton: false, //是否显示全屏按钮
      baseLayerPicker: false, //是否显示图层选择控件
      geocoder: false, //是否显示地名查找控件
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
    const timeStepInSeconds = 30;
    const totalSeconds = timeStepInSeconds * (flightData.length - 1);
    const start = Cesium.JulianDate.fromIso8601("2020-09-21T07:42:00Z");
    const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
    this.viewer.clock.startTime = start.clone();
    this.viewer.clock.stopTime = stop.clone();
    this.viewer.clock.currentTime = start.clone();
    this.viewer.timeline.zoomTo(start, stop);
    // Speed up the playback speed 50x.
    this.viewer.clock.multiplier = 30;

    // The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
    const positionProperty = new Cesium.SampledPositionProperty();

    for (let i = 0; i < flightData.length; i++) {
      const dataPoint = flightData[i];

      // Declare the time for this individual sample and store it in a new JulianDate instance.
      const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
      const position = Cesium.Cartesian3.fromDegrees(dataPoint.log, dataPoint.lat, dataPoint.height);
      // Store the position along with its timestamp.
      // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
      positionProperty.addSample(time, position);

      this.viewer.entities.add({
        description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
        position: position,
        point: { pixelSize: 10, color: Cesium.Color.RED }
      });
    }
    // 添加飞机模型
    // this.createMode('3Dmodel/feiji.glb', 103.95537, 30.56384, 10);
    const airplaneEntity = this.viewer.entities.add({
      availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
      position: positionProperty,
      // Attach the 3D model instead of the green point.
      model: {
        uri: '3Dmodel/feiji.glb',
        minimumPixelSize: 300,
        maximumScale: 2
      },
      // Automatically compute the orientation from the position.
      orientation: new Cesium.VelocityOrientationProperty(positionProperty),
      path: new Cesium.PathGraphics({ width: 3 })
    });
    this.viewer.trackedEntity = airplaneEntity;
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(103.95537, 30.56384, 300),
      // orientation: {
      //   heading: Cesium.Math.toRadians(300.0),
      //   pitch: Cesium.Math.toRadians(5.0),
      // }
    });

  }
  //  创建模型
  createMode = (url, x, y, height) => {
    const position = Cesium.Cartesian3.fromDegrees(x, y, height);
    this.viewer.entities.add({
      name: url,
      position: position,
      model: {
        uri: url,
        minimumPixelSize: 500,
        maximumScale: 18
      }
    });
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
    // this.viewer.clock.onTick.removeEventListener(this.rotate);
  }
  render() {
    return (
      <div id='cesiumContainer'></div>
    );
  }
}
export default Plane;

// 路线规划
import React from 'react';
import * as Cesium from 'cesium';
import { Button, Input } from 'antd';
import axios from "axios";
import "cesium/Build/Cesium/Widgets/widgets.css";
import './style.css';
class RoutePlanning extends React.Component {
  viewer = null;
  constructor(props) {
    super(props);
    this.state = {
      startzb: '',
      endzb: '',
      type: '',
      flightData: [],
    }
  }
  componentDidMount() {
    this.init();
  }
  //  初始化
  init = () => {
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        // url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali", // 谷歌
        url: "https://webst{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=6", // 添加高德影像
        subdomains: ["01", "02", "03", "04"],
        maximumLevel: 18,
        // fileExtension: "jpg"
      }),
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
  }
  // 添加添加事件- 点击获取经纬度
  handClick = () => {
    let viewer = this.viewer;
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((event) => {
      let earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
      // 点击在球外就是 undefined
      if (earthPosition) {
        let cartographic = Cesium.Cartographic.fromCartesian(earthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic());
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        let height = cartographic.height;
        console.log("[Lng=>" + lng + ",Lat=>" + lat + ",H=>" + height + "]");
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        let { type } = this.state;
        let obj = {};
        if (type === 'start') {
          obj['startzb'] = `${lng},${lat}`;
        } else if (type === 'end') {
          obj['endzb'] = `${lng},${lat}`;
        }
        console.log(obj);
        this.setState({
          ...obj
        }, this.mouseStyle)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  // 添加车辆模型
  addCar = () => {
    let { flightData, startzb } = this.state;
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
      let { distance } = flightData[i]; // 该段距离，单位米
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
        uri: '3Dmodel/car.glb',
        minimumPixelSize: 300,
        maximumScale: 2
      },
      // Automatically compute the orientation from the position.
      orientation: new Cesium.VelocityOrientationProperty(positionProperty),
      path: new Cesium.PathGraphics({ width: 3 })
    });
    this.viewer.trackedEntity = airplaneEntity;
    let arr = startzb.split(',');
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(Number(arr[0]), Number(arr[1]), 200),
      // orientation: {
      //   heading: Cesium.Math.toRadians(300.0),
      //   pitch: Cesium.Math.toRadians(5.0),
      // }
    });
  }
  render() {
    return (
      <div className='routePlanning'>
        <div className="unit">
          <div>
            <Button onClick={this.btnclick} data-type='start'>获取开始坐标</Button>
            <Input type='text' value={this.state.startzb} readOnly />
            <Button onClick={this.reset}>重置</Button>
          </div>
          <div>
            <Button onClick={this.btnclick} data-type='end'>获取结束坐标</Button>
            <Input type='text' value={this.state.endzb} readOnly />
            <Button type='primary' onClick={this.routePlan}>路线规划</Button>
          </div>
        </div>
        <div id='cesiumContainer'></div>
      </div>
    );
  }
  // 点击事件
  btnclick = e => {
    let type = e.currentTarget.getAttribute('data-type');
    let obj = {};
    if (type === 'start') {
      obj['startzb'] = '104.009549,30.537602';
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(104.009549, 30.537602, 300),
      });
    } else if (type === 'end') {
      obj['endzb'] = '104.15308,30.739601';
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(104.15308, 30.739601, 300),
      });
    }
    this.setState({
      ...obj,
      // type
    });
    // this.handClick();
    // this.mouseStyle(true);
  }
  // 重置
  reset = () => {
    this.setState({
      type: '',
      startzb: '',
      endzb: ''
    })
  }
  // 路径规划
  routePlan = async () => {
    let { startzb, endzb } = this.state;
    if (startzb && endzb) {
      let key = 'ac3a73c7c735c3eda05ca6f893eb0719';
      let url = `https://restapi.amap.com/v3/direction/driving?key=${key}&origin=${startzb}&destination=${endzb}&extensions=base`;
      let config = { url, method: 'get' };
      const res = await axios(config);
      if (res && res['data']) {
        if (res['data']['status'] === '1') {
          let { route: { paths } } = res['data'];
          let list = [];
          // let start = startzb.split(',');
          // list.push({ 'log': Number(start[0]), 'lat': Number(start[1]), 'height': 10 });
          let { steps } = paths[0];
          for (let i in steps) {
            let { polyline, distance } = steps[i];
            // console.log(distance);
            let points = polyline.split(';');
            for (let j in points) {
              let item = points[j];
              let arr = item.split(',');
              list.push({ 'log': Number(arr[0]), 'lat': Number(arr[1]), 'height': 10, distance: Number(distance) });
            }
          }
          // let end = endzb.split(',');
          // list.push({ 'log': Number(end[0]), 'lat': Number(end[1]), 'height': 10 });
          // console.log(list);
          this.setState({
            flightData: list
          }, this.addCar)
        }
      }
    }
  }
  // 修改鼠标指针样式
  mouseStyle = (flg = false) => {
    let dom = document.querySelector('canvas');
    if (flg === true) {
      dom.style.cursor = 'pointer';
    } else {
      dom.style.cursor = 'default';
    }
  }
}

export default RoutePlanning;

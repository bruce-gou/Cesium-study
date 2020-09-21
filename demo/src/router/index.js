import React from 'react';

import App from '../App.jsx';
// 二级页面
import Plane from '../page/plane.jsx';

import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
const Routers = () => {
  // 获取主页组件
  // const getComponent = () => {
  //   return <Redirect to="/login" />
  // }
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/plane" component={Plane}></Route>
        {/* <Home>
            <Route exact path="/sys/user" component={User} />
          </Home> */}
      </Switch>
    </Router>
  );
}

export default Routers;
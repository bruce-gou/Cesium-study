import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
function App() {
  return (
    <div className="">
      <Row gutter={10}>
        <Col span={3}><Link to="/plane">飞机飞行demo</Link></Col>
      </Row>
    </div>
  );
}

export default App;


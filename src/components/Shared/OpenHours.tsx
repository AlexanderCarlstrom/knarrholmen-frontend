import { Col, Row } from 'antd';
import React from 'react';
import { ActivityItem } from '../../types/ActivityItem';

const OpenHours = ({ activity }: OpenHoursProps) => {
  const open = activity.open < 10 ? '0' + activity.open + ':00' : activity.open + ':00';
  const close = activity.close < 10 ? '0' + activity.close + ':00' : activity.close + ':00';

  return (
    <div className="open-hours">
      <Row>
        <Col span={12}>Monday</Col>
        <Col span={12}>{open + ' - ' + close}</Col>
      </Row>
      <Row>
        <Col span={12}>Tuesday</Col>
        <Col span={12}>{open + ' - ' + close}</Col>
      </Row>
      <Row>
        <Col span={12}>Wednesday</Col>
        <Col span={12}>{open + ' - ' + close}</Col>
      </Row>
      <Row>
        <Col span={12}>Thursday</Col>
        <Col span={12}>{open + ' - ' + close}</Col>
      </Row>
      <Row>
        <Col span={12}>Friday</Col>
        <Col span={12}>{open + ' - ' + close}</Col>
      </Row>
      <Row>
        <Col span={12}>Saturday</Col>
        <Col span={12}>{open + ' - ' + close}</Col>
      </Row>
      <Row>
        <Col span={12}>Sunday</Col>
        <Col span={12}>{open + ' - ' + close}</Col>
      </Row>
    </div>
  );
};

type OpenHoursProps = { activity: ActivityItem };

export default OpenHours;

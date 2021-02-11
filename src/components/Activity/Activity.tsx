import { Card, Col, DatePicker, Divider, message, Row, Space, Spin, Typography } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import moment from 'moment';

import { ActivitiesResponse, BookingsResponse } from '../../types/ApiReponse';
import { CapitalizeFirstLetter } from '../../utils/CapitalizeFirstLetter';
import { useBreakpoint } from '../../context/BreakpointContext';
import { ActivityItem } from '../../types/ActivityItem';
import { publicFetch } from '../../utils/axios';
import OpenHours from '../Shared/OpenHours';
import './Activity.scss';

const { Text, Title } = Typography;

const Activity = ({ match, history }: RouteComponentProps<Params>) => {
  const [activity, setActivity] = useState<ActivityItem>(null);
  const width = useBreakpoint();

  useEffect(() => {
    console.log(moment().week());
    publicFetch
      .get<ActivitiesResponse>('activities/' + match.params.id)
      .then((res: AxiosResponse<ActivitiesResponse>) => {
        setActivity(res.data.activity);
      })
      .catch((err) => {
        console.error(err);
        message.error('Could not get activity');
        history.push('/activities');
      });
  }, []);

  return (
    <>
      {activity ? (
        width > 748 ? (
          <DesktopActivity activity={activity} />
        ) : (
          <MobileActivity activity={activity} />
        )
      ) : (
        <Spin size="large">Loading</Spin>
      )}
    </>
  );
};

const DesktopActivity = ({ activity }: ActivityProps) => {
  const [openHours, setOpenHours] = useState<number[]>(null);
  const [date, setDate] = useState<moment.Moment>(moment());
  const [times, setTimes] = useState<number[][]>(null);
  const [weekDays, setWeekDays] = useState<string[]>();

  useEffect(() => {
    if (activity) {
      if (!date) {
        setTimes([]);
      } else {
        // Get bookings for activity in selected date
        // publicFetch
        //   .get<BookingsResponse>('bookings', {
        //     params: { date: date.toDate(), activityId: activity.id },
        //   })
        //   .then((res: AxiosResponse<BookingsResponse>) => {
        //     setTimes(res.data.day);
        //   })
        //   .catch((err) => {
        //     console.error(err);
        //     message.error('Could not get bookings');
        //   });
        createOpenHoursArray();
        createWeekDaysArray();
        setTimes(fakeBookings);
      }
    }
  }, [activity, date]);

  const createOpenHoursArray = () => {
    const arr = [];
    for (let i = activity.open; i < activity.close; i++) {
      arr.push(i);
    }
    setOpenHours(arr);
  };

  const createWeekDaysArray = () => {
    const arr: string[] = [];
    for (let i = 1; i < 8; i++) {
      arr.push(date.day(i).format('MMM Do'));
    }
    setWeekDays(arr);
  };

  return (
    <div className="activity">
      <div className="container">
        <Row>
          <Col span={6} className="sidebar">
            <div className="img" />
            <Space direction="vertical" size="small" className="space">
              <span className="title">{CapitalizeFirstLetter(activity.name)}</span>
              <span className="location">{activity.location}</span>
            </Space>
            <Divider />
            <OpenHours activity={activity} />
            <Divider />
            <Text className="description">{activity.description ? activity.description : ''}</Text>
          </Col>
          <Col span={18} className="activity-container">
            <Card title={<DatePicker value={date} onChange={(date) => setDate(date)} picker="week" />} className="card">
              {times ? (
                // <div className="times-week">
                //   <div className="header">
                //     <div className="corner" />
                //   </div>
                //   <div className="body">
                //     <div className="column-header">
                //
                //     </div>
                //     <div className="grid"></div>
                //   </div>
                // </div>
                <table className="times-week">
                  <thead className="table-header">
                    <tr className="table-top-header">
                      <th className="table-header-item table-header-corner"></th>
                      {openHours.map((value) => (
                        <th scope="col" className="table-header-item" key={value}>
                          {value < 10 ? '0' + value : value}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {weekDays.map((day, dayIndex) => (
                      <tr key={day}>
                        <th className="table-column-header-item">{day}</th>
                        {openHours.map((hour, hourIndex) => (
                          <td
                            className={`table-item ${times[dayIndex][hourIndex] === 2 ? 'booked' : ''}`}
                            key={day + ':' + hour}
                          >
                            {dayIndex + ':' + hourIndex}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Spin size="large">Loading</Spin>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const MobileActivity = ({ activity }: ActivityProps) => {
  const [times, setTimes] = useState<number[]>();
  const [date, setDate] = useState(moment());

  useEffect(() => {
    if (activity && date) {
      // Get bookings for activity in selected date
      publicFetch
        .get<BookingsResponse>('bookings', {
          params: { date: date.toDate(), activityId: activity.id },
        })
        .then((res: AxiosResponse<BookingsResponse>) => {
          setTimes(res.data.day);
        })
        .catch((err) => {
          console.error(err);
          message.error('Could not get bookings');
        });
    }
  }, [activity, date]);

  const open = activity.open < 10 ? '0' + activity.open + ':00' : activity.open + ':00';
  const close = activity.close < 10 ? '0' + activity.close + ':00' : activity.close + ':00';

  return (
    <div className="activity">
      <div className="img" />
      <div className="container">
        <div className="header">
          <Space direction="vertical" size="small" className="space">
            <span className="title">{CapitalizeFirstLetter(activity.name)}</span>
            <span className="location">{activity.location}</span>
          </Space>
          <span className="open-hours">{open + ' - ' + close}</span>
        </div>
        <Card title={<DatePicker value={date} onChange={(date) => setDate(date)} />} className="card">
          {times ? (
            <div className="times">
              {times.map((time) => {
                const start = time < 10 ? '0' + time : time.toString();
                return (
                  <Typography key={time} className="time">
                    {start}
                    <sup>00</sup>
                  </Typography>
                );
              })}
            </div>
          ) : (
            <Spin size="large">Loading</Spin>
          )}
        </Card>
        <Title level={2} className="category-title">
          About
        </Title>
        <Text>{activity.description ? activity.description : ''}</Text>
      </div>
    </div>
  );
};

const fakeBookings: number[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

type ActivityProps = {
  activity: ActivityItem;
};

type Params = {
  id: string;
};

export default Activity;

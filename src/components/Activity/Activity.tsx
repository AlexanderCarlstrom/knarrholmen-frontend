import { Button, Card, Col, DatePicker, Divider, message, Modal, Row, Space, Spin, Typography } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { AxiosResponse } from 'axios';
import moment from 'moment-timezone';

import { ActivitiesResponse, BookingsResponse } from '../../types/ApiReponse';
import { CapitalizeFirstLetter } from '../../utils/CapitalizeFirstLetter';
import { useBreakpoint } from '../../context/BreakpointContext';
import { privateFetch, publicFetch } from '../../utils/axios';
import { ActivityItem } from '../../types/ActivityItem';
import { ApiResponse } from './../../types/ApiReponse';
import { useAuth } from '../../context/AuthContext';
import OpenHours from '../Shared/OpenHours';
import './Activity.scss';

const { Text, Title } = Typography;

// Set default timezone
moment.tz.setDefault('Europe/Stockholm');

const Activity = ({ match, history, location }: RouteComponentProps<Params>) => {
  const [modalProps, setModalProps] = useState<BookingModalProps>(null);
  const [activity, setActivity] = useState<ActivityItem>(null);
  const [booking, setBooking] = useState<BookingProps>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const width = useBreakpoint();
  const { user } = useAuth();

  useEffect(() => {
    getActivity();
  }, []);

  const getActivity = () => {
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
  };

  const showBookingModal = (time: number, date: moment.Moment) => {
    const start = (time < 10 ? `0${time}` : `${time}`) + ':00';
    const end = (time + 1 < 10 ? `0${time + 1}` : `${time + 1}`) + ':00';
    setVisible(true);
    setModalProps({
      title: CapitalizeFirstLetter(activity.name),
      date: date.format('ddd, Do MMM'),
      time: `${start} - ${end}`,
    });
    setBooking({
      date,
      time,
    });
  };

  const resetBooking = () => {
    setVisible(false);
    setModalProps(null);
    setBooking(null);
  };

  const onOk = () => {
    if (booking) {
      console.log(booking.date.startOf('day'));
      const start = booking.date.startOf('day').hours(booking.time).format();
      const end = moment(start)
        .hours(booking.time + 1)
        .format();
      console.log(start);
      console.log(end);
      privateFetch
        .post<ApiResponse>('bookings', { start, end, activityId: activity.id })
        .then((res: AxiosResponse<ApiResponse>) => {
          if (res?.data?.success) {
            resetBooking();
            getActivity();
            message.success('Successfully booked activity');
          }
        })
        .catch((err) => {
          console.error(err);
          message.error('Could not book activity, please try again');
          return err;
        });
    } else {
      resetBooking();
      message.error('Could not book activity, please try again');
    }
  };

  return (
    <>
      {activity ? (
        <>
          {width > 770 ? (
            <DesktopActivity activity={activity} showBookingModal={showBookingModal} />
          ) : (
            <MobileActivity activity={activity} showBookingModal={showBookingModal} />
          )}
          <Modal
            visible={visible}
            className="modal"
            okButtonProps={{ disabled: user === null }}
            okText="BOOK"
            cancelText="CANCEL"
            title="Confirm Booking"
            width={400}
            onOk={onOk}
            onCancel={resetBooking}
          >
            {user === null ? (
              <>
                <Title level={4} className="modal-title">
                  Log in to book activity
                </Title>
                <DownOutlined className="caret-down" />
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  onClick={() => history.push('/auth/login', { from: location })}
                  className="login-btn"
                >
                  LOG IN
                </Button>
              </>
            ) : (
              <>
                <div className="modal-content">
                  <Title level={3} className="title">
                    {modalProps?.title}
                  </Title>
                  <div className="column">
                    <Text className="date">{modalProps?.date}</Text>
                    <Text className="time">{modalProps?.time}</Text>
                  </div>
                </div>
              </>
            )}
          </Modal>
        </>
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

const MobileActivity = ({ activity, showBookingModal }: ActivityProps) => {
  const [times, setTimes] = useState<number[]>();
  const [date, setDate] = useState(moment());

  useEffect(() => {
    if (activity) {
      if (!date) {
        setTimes([]);
      } else {
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
                  <div key={time} className="time" onClick={() => showBookingModal(time, date)}>
                    <Typography>
                      {start}
                      <sup>00</sup>
                    </Typography>
                  </div>
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
  showBookingModal: (time: number, date: moment.Moment) => void;
};

type Params = {
  id: string;
};

type BookingModalProps = {
  title: string;
  date: string;
  time: string;
};

type BookingProps = {
  date: moment.Moment;
  time: number;
};

export default Activity;

import { Button, Collapse, message, Result, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import moment from 'moment-timezone';

import { CapitalizeFirstLetter } from './../../utils/CapitalizeFirstLetter';
import { BookingsResponse } from '../../types/ApiReponse';
import { ApiResponse } from './../../types/ApiReponse';
import { CalendarOutlined } from '@ant-design/icons';
import { privateFetch } from '../../utils/axios';
import { Booking } from '../../types/Booking';
import './Bookings.scss';
import 'antd/dist/antd.css';

const { Panel } = Collapse;

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(null);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = () => {
    privateFetch
      .get<BookingsResponse>('bookings/future')
      .then((res: AxiosResponse<BookingsResponse>) => {
        if (res?.data?.success) {
          setBookings(res.data.userBookings);
        }
      })
      .catch((err) => {
        console.error(err);
        message.error('Could not get bookings');
        return err;
      });
  };

  const getDayString = (date: string) => {
    return moment(date).format('ddd, Do MMM');
  };

  const getInterval = (start: string, end: string) => {
    return `${moment(start).format('HH')}:00 - ${moment(end).format('HH')}:00`;
  };

  const cancelBooking = (id: string) => {
    privateFetch
      .delete<ApiResponse>('bookings/' + id)
      .then((res: AxiosResponse<ApiResponse>) => {
        if (res?.data?.success) {
          message.success('Canceled Booking');
          getBookings();
        }
      })
      .catch((err) => {
        console.error(err);
        message.error('Could not cancel booking');
        return err;
      });
  };

  return (
    <div className="bookings">
      <div className="container">
        <div className="bookings-container">
          <span className="page-title">
            <span>Upcoming Bookings</span>
          </span>
          {bookings !== null ? (
            bookings.length !== 0 ? (
              <Collapse className="collapse" expandIconPosition="right" bordered={false}>
                {bookings.map((booking, index) => (
                  <Panel
                    key={index}
                    className="panel"
                    header={
                      <div className="panel-header">
                        <div className="column">
                          <span className="activity-name">{CapitalizeFirstLetter(booking.activity.name)}</span>
                          <span className="info">{CapitalizeFirstLetter(booking.activity.location)}</span>
                        </div>
                        <div className="column">
                          <span className="start-day">{getDayString(booking.start)}</span>
                          <span className="info">{getInterval(booking.start, booking.end)}</span>
                        </div>
                      </div>
                    }
                  >
                    <div className="panel-content">
                      <div className="spacer"></div>
                      <Button danger className="cancel-btn" onClick={() => cancelBooking(booking.id)}>
                        Cancel Booking
                      </Button>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            ) : (
              <Result icon={<CalendarOutlined />} title="You have no upcoming bookings" className="result" />
            )
          ) : (
            <Spin size="large">Loading</Spin>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;

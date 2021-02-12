import React, { useEffect, useState } from 'react';
import { Button, Collapse, message, Spin, Typography } from 'antd';
import { AxiosResponse } from 'axios';
import moment from 'moment-timezone';

import { BookingsResponse } from '../../types/ApiReponse';
import { privateFetch } from '../../utils/axios';
import { Booking } from '../../types/Booking';
import './Bookings.scss';
import { CapitalizeFirstLetter } from './../../utils/CapitalizeFirstLetter';
import { getIn } from 'formik';
import { ApiResponse } from './../../types/ApiReponse';

const { Title, Text } = Typography;
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
        <span className="page-title">Bookings</span>
        <Collapse className="collapse" expandIconPosition="right">
          {bookings !== null ? (
            bookings.map((booking, index) => (
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
            ))
          ) : (
            <Spin size="large">Loading</Spin>
          )}
        </Collapse>
      </div>
    </div>
  );
};

export default Bookings;

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { privateFetch } from '../../utils/axios';
import { Booking } from '../../types/Booking';

const Bookings = () => {
  const { user } = useAuth();

  useEffect(() => {
    privateFetch
      .get<Booking>('bookings/future')
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  });

  return <div>Booking</div>;
};

export default Bookings;

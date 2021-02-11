import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { ActivityListItem } from '../../types/ActivityItem';
import { ActivitiesResponse } from '../../types/ApiReponse';
import { publicFetch } from '../../utils/axios';
import { Button, Input } from 'antd';
import './Home.scss';
import { CapitalizeFirstLetter } from '../../utils/CapitalizeFirstLetter';

const { Search } = Input;

const Home = ({ history }: RouteComponentProps) => {
  const [activities, setActivities] = useState([]);
  const search = (search: string) => {
    history.push('/activities', { search });
  };

  useEffect(() => {
    publicFetch
      .get<ActivitiesResponse>('activities', { params: { search: '', start: 0, limit: 3 } })
      .then((a) => setActivities(a.data.activities));
  }, []);

  const listActivities = activities.map((a: ActivityListItem) => {
    const open = a.open < 10 ? '0' + a.open + ':00' : a.open + ':00';
    const close = a.close < 10 ? '0' + a.close + ':00' : a.close + ':00';
    return (
      <div className="activity-item" key={a.id} onClick={() => navigateToActivity(a.id)}>
        <div className="img" />

        <div className="info">
          <span className="title">{CapitalizeFirstLetter(a.name)}</span>
          <span className="location">{a.location}</span>
          <span className="open">{open + ' - ' + close}</span>
        </div>
      </div>
    );
  });

  const navigateToActivity = (id: string) => {
    history.push('/activity/' + id);
  };

  return (
    <div className="home">
      <div className="container">
        <h1 className="home-title">KNARRHOLMEN</h1>
        <h2 className="home-subtitle">BOOKING</h2>
        <Search placeholder="Find activities..." className="search-field" allowClear onSearch={search} />
        <div className="activity-list">{listActivities}</div>
        <Button className="showMore" onClick={() => search('')}>
          Show More
        </Button>
      </div>
    </div>
  );
};

export default Home;

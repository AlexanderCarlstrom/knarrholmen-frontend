import React, { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { Input } from 'antd';

import { CapitalizeFirstLetter } from '../../utils/CapitalizeFirstLetter';
import { ActivitiesResponse } from '../../types/ApiReponse';
import { RouteComponentProps } from 'react-router-dom';
import { ActivityListItem } from '../../types/ActivityItem';
import { publicFetch } from '../../utils/axios';
import { AxiosResponse } from 'axios';
import './Activities.scss';

const { Search } = Input;

type Params = {
  search: string;
};

const Activities = ({ location, history }: RouteComponentProps<Params>) => {
  const [searchTerm, setSearchTerm] = useState(location.search ? location.search : '');
  const [searchResult, setSearchResult] = useState([]);
  const [page, setPage] = useState(1);
  const activitiesPerPage = 10;

  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, 500);

  useEffect(() => {
    const start = (page - 1) * activitiesPerPage;
    publicFetch
      .get<ActivitiesResponse>('activities', { params: { search: searchTerm, start, limit: activitiesPerPage } })
      .then((res: AxiosResponse<ActivitiesResponse>) => {
        setSearchResult(res.data.activities);
      });
  }, [searchTerm]);

  const navigateToActivity = (id: string) => {
    history.push('/activity/' + id);
  };

  const list = searchResult.map((activity: ActivityListItem) => {
    const open = activity.open < 10 ? '0' + activity.open + ':00' : activity.open + ':00';
    const close = activity.close < 10 ? '0' + activity.close + ':00' : activity.close + ':00';

    return (
      <div className="activity-item" key={activity.id} onClick={() => navigateToActivity(activity.id)}>
        <div className="img" />

        <div className="info">
          <span className="title">{CapitalizeFirstLetter(activity.name)}</span>
          <span className="location">{activity.location}</span>
          <span className="open">{open + ' - ' + close}</span>
        </div>
      </div>
    );
  });

  return (
    <div className="activities">
      <div className="container">
        <h2 className="title">Find activities</h2>
        <Search
          placeholder="Find activities..."
          className="search-field"
          allowClear
          onChange={handleChange}
          defaultValue={location.search}
        />
        <div className="activity-list">{list}</div>
      </div>
    </div>
  );
};

export { Activities };

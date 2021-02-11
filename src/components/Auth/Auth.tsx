import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';

import LogIn from './LogIn';
import SignUp from './SignUp';
import './Auth.scss';

const Auth = () => {
  const { path } = useRouteMatch();
  const history = useHistory();

  const goHome = () => {
    history.push('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <Button className="back-btn" onClick={goHome} size="large" icon={<ArrowLeftOutlined />} />
        <div className="form-container">
          <Switch>
            <Route exact path={`${path}/login`} component={LogIn} />
            <Route exact path={`${path}/sign-up`} component={SignUp} />
            <Route render={() => <Redirect exact to="/" />} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Auth;

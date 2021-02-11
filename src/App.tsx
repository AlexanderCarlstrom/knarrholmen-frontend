import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useLayoutEffect } from 'react';

import { Activities } from './components/Activities/Activities';
import Bookings from './components/Bookings/Bookings';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Logout from './components/Auth/Logout';
import Auth from './components/Auth/Auth';
import Home from './components/Home/Home';
import './App.scss';
import { setUpAuthInterceptors } from './utils/axios';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import Activity from './components/Activity/Activity';

const { Content } = Layout;

const App = (props: RouteComponentProps) => {
  const { loginWithToken } = useAuth();
  let mounted = false;

  useLayoutEffect(() => {
    setUpAuthInterceptors(loginWithToken);
  }, []);

  useEffect(() => {
    if (!mounted) {
      loginWithToken();
      mounted = true;
    }
  }, []);

  return (
    <Layout className="app">
      {props.location.pathname !== '/auth/login' && props.location.pathname !== '/auth/sign-up' ? <Navbar /> : null}
      <Content className="content">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/activities/:search?" component={Activities} />
          <PrivateRoute path="/bookings" component={Bookings} />
          <Route path="/activity/:id" component={Activity} />
          <Route path="/auth" component={Auth} />
          <Route path="/logout" component={Logout} />
          <Route render={() => <Redirect exact to="/" />} />
        </Switch>
      </Content>
      {props.location.pathname !== '/auth/login' && props.location.pathname !== '/auth/sign-up' ? <Footer /> : null}
    </Layout>
  );
};

export default withRouter(App);

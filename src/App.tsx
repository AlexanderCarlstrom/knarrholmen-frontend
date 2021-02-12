import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { Activities } from './components/Activities/Activities';
import Bookings from './components/Bookings/Bookings';
import { setUpAuthInterceptors } from './utils/axios';
import Activity from './components/Activity/Activity';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import Logout from './components/Auth/Logout';
import Auth from './components/Auth/Auth';
import Home from './components/Home/Home';
import './App.scss';

const { Content } = Layout;

const App = (props: RouteComponentProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { loginWithToken } = useAuth();

  useLayoutEffect(() => {
    setUpAuthInterceptors(loginWithToken);
  }, []);

  useEffect(() => {
    setLoading(true);
    loginWithToken().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <Layout className="app">
      {props.location.pathname !== '/auth/login' && props.location.pathname !== '/auth/sign-up' ? <Navbar /> : null}
      <Content className="content">
        {!loading && (
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/activities/:search?" component={Activities} />
            <PrivateRoute path="/bookings" component={Bookings} />
            <Route path="/activity/:id" component={Activity} />
            <Route path="/auth" component={Auth} />
            <Route path="/logout" component={Logout} />
            <Route render={() => <Redirect exact to="/" />} />
          </Switch>
        )}
      </Content>
      {props.location.pathname !== '/auth/login' && props.location.pathname !== '/auth/sign-up' ? <Footer /> : null}
    </Layout>
  );
};

export default withRouter(App);

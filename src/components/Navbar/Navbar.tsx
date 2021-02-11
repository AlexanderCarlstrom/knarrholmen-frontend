import { Link, NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Drawer, Dropdown, Layout, Menu } from 'antd';
import {
  DownOutlined,
  MenuOutlined,
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  RocketOutlined,
  LoginOutlined,
  FormOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import 'antd/dist/antd.css';

import { useBreakpoint } from '../../context/BreakpointContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.scss';
import { User } from '../../types/User';

const { Header } = Layout;
const { SubMenu } = Menu;

const Navbar = (props: RouteComponentProps) => {
  const width = useBreakpoint();
  const breakpoint = 1024;

  return (
    <React.Fragment>
      {width < breakpoint ? (
        <MobileMenu pathName={props.location.pathname} />
      ) : (
        <DesktopMenu pathName={props.location.pathname} />
      )}
    </React.Fragment>
  );
};

const DesktopMenu = ({ pathName }: MenuProps) => {
  const { user } = useAuth();
  return (
    <React.Fragment>
      <Header className="navbar">
        <div className="navbar-container">
          <NavLink to="/" className="brand">
            KNARRHOLMEN
          </NavLink>

          <div className="navigation">
            <Menu selectedKeys={[pathName]} mode="horizontal" className="menu">
              {defaultMenu(false)}
              {user === null && notLoggedInMenu(false)}
            </Menu>
            {user !== null && <UserDropdown user={user} />}
          </div>
        </div>
      </Header>
    </React.Fragment>
  );
};

const MobileMenu = ({ pathName }: MenuProps) => {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();

  const showDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  return (
    <React.Fragment>
      <Header className="navbar">
        <div className="navbar-container">
          <a href="" className="brand">
            KNARRHOLMEN
          </a>
          <div className="navigation">
            <Button ghost icon={<MenuOutlined />} onClick={showDrawer} className="drawer-btn" />
          </div>
        </div>
      </Header>
      <Drawer title="Menu" width="300" placement="left" onClose={closeDrawer} visible={visible} className="drawer">
        <Menu
          selectedKeys={[pathName]}
          mode="inline"
          className="drawer-menu"
          theme="light"
          defaultOpenKeys={['user-dropdown']}
          onClick={closeDrawer}
        >
          {user !== null && (
            <SubMenu key="user-dropdown" title={createUserDisplayName(user.firstName)} className="user-name">
              {userMenu()}
            </SubMenu>
          )}

          {defaultMenu(true)}

          {user === null && notLoggedInMenu(true)}
        </Menu>
      </Drawer>
    </React.Fragment>
  );
};

const UserDropdown = ({ user }: UserDropdownProps) => {
  const dropdownUserMenu = <Menu className="menu">{userMenu()}</Menu>;

  return (
    <Dropdown overlay={dropdownUserMenu} arrow trigger={['hover', 'click']} placement="bottomRight">
      <Button className="user-btn" ghost>
        {createUserDisplayName(user.firstName)}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

const createUserDisplayName = (firstName: string) => {
  if (firstName.length < 15) return firstName;
  return firstName.substr(0, 10) + '...';
};

// Menus
// Always active
const defaultMenu = (icons: boolean) => {
  const menu: MenuItem[] = [
    { name: 'Home', icon: <HomeOutlined />, to: '/' },
    { name: 'Activities', icon: <RocketOutlined />, to: '/activities' },
  ];

  return createMenuItems(menu, icons);
};
// Active if not logged in
const notLoggedInMenu = (icons: boolean) => {
  const menu: MenuItem[] = [
    { name: 'Log In', icon: <LoginOutlined />, to: '/auth/login' },
    { name: 'Sign Up', icon: <FormOutlined />, to: '/auth/sign-up' },
  ];

  return createMenuItems(menu, icons);
};
// Active only if logged in
const userMenu = () => {
  const menu: MenuItem[] = [
    { name: 'Profile', icon: <UserOutlined />, to: '/profile' },
    { name: 'Bookings', icon: <CalendarOutlined />, to: '/bookings' },
    { name: 'Logout', icon: <LogoutOutlined />, to: '/logout' },
  ];

  return createMenuItems(menu, true);
};

const createMenuItems = (items: MenuItem[], icons: boolean) => {
  return items.map((item) => (
    <Menu.Item key={item.to} className="menu-item" icon={icons ? item.icon : null}>
      <Link to={item.to}>{item.name}</Link>
    </Menu.Item>
  ));
};

type MenuProps = { pathName: string };

type UserDropdownProps = { user: User };

type MenuItem = {
  name: string;
  icon?: React.ReactNode;
  to?: string;
};

export default withRouter(Navbar);

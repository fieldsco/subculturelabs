import { useState } from 'react';
import { Menu } from 'antd';

const AppNav = ({ onClick }) => {
  const [activeNav, setActiveNav] = useState('2');

  const handleClick = menuProps => {
    setActiveNav(menuProps.key);
    onClick(menuProps.key);
  };

  return (
    <Menu theme='dark' mode='horizontal' selectedKeys={[activeNav]} onClick={handleClick}>
      <Menu.Item key='1'>Notes</Menu.Item>
      <Menu.Item key='2'>Edible</Menu.Item>
      <Menu.Item key='3'>Extraction</Menu.Item>
      <Menu.Item key='4'>Flower</Menu.Item>
      <Menu.Item key='5'>Veg</Menu.Item>
      <Menu.Item key='6'>Orders</Menu.Item>
    </Menu>
  );
};

export default AppNav;

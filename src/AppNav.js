import { Menu } from 'antd';

const AppNav = () => (
  <Menu theme='dark' mode='horizontal' selectedKeys={['2']}>
    <Menu.Item key='1'>Notes</Menu.Item>
    <Menu.Item key='2'>Recipes</Menu.Item>
    <Menu.Item key='3'>Extraction</Menu.Item>
    <Menu.Item key='4'>Flower</Menu.Item>
    <Menu.Item key='5'>Veg</Menu.Item>
    <Menu.Item key='6'>Orders</Menu.Item>
  </Menu>
);

export default AppNav;

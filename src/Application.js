import { Layout, Select, Menu, Breadcrumb } from 'antd';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import styled from 'styled-components';
import './App.css';
import { config } from './config';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const getMenu = (prop, list) =>
  Object.keys(list).map(key => (
    <Option key={key} value={`${prop}-${key}`}>
      {list[key]}
    </Option>
  ));

const getSelects = () => {
  return config.app.recipeProps.map(prop => (
    <FirebaseDatabaseNode key={prop} path={`/${prop}`}>
      {d => {
        return d.value ? (
          <Select
            placeholder={`${prop[0].toUpperCase()}${prop.slice(1)}`}
            onChange={handleChange}
            style={{ width: 120 }}>
            {getMenu(prop, d.value)}
          </Select>
        ) : null;
      }}
    </FirebaseDatabaseNode>
  ));
};

const handleChange = e => {
  console.log(e);
};

const InnerContent = styled.div`
  min-height: 280px;
  padding: 24px;
  background: #fff;
`;

const Application = () => (
  <Layout className='layout'>
    <div className='logo' />
    <Header>
      <Menu theme='dark' mode='horizontal' selectedKeys={['1']}>
        <Menu.Item key='1'>Recipes</Menu.Item>
        <Menu.Item key='2'>Orders</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Recipes</Breadcrumb.Item>
      </Breadcrumb>
      <InnerContent>{getSelects()}</InnerContent>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Subculture Labs ©2021</Footer>
  </Layout>
);

export default Application;

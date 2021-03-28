import { useState } from 'react';
import { Layout, Select, Menu, Breadcrumb, Button } from 'antd';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import styled from 'styled-components';
import './App.css';
import { config } from './config';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const InnerContent = styled.div`
  min-height: 280px;
  padding: 24px;
  background: #fff;
`;

const Application = () => {
  const [chosen, setChosen] = useState({});

  const handleChange = e => {
    const arr = e.split('-');
    const obj = Object.assign(chosen, {});
    obj[arr[0]] = arr[1];
    setChosen({ ...chosen, ...obj })
  };

  const getMenu = (prop, list) =>
    Object.keys(list).map(key => (
      <Option key={key} value={`${prop}-${key}`}>
        {list[key]}
      </Option>
    ));

  const getSelects = () =>
    config.app.recipeProps.map(prop => (
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

  const handleSubmit = () => {
    console.log(chosen);
  }

  return (
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
        <InnerContent>
          {getSelects()}
          <Button type='primary' disabled={Object.keys(chosen).length < 4} onClick={handleSubmit}>
            Get Recipe
          </Button>
        </InnerContent>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Subculture Labs ©2021</Footer>
    </Layout>
  );
};

export default Application;

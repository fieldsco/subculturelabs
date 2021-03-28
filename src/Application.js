import { useState } from 'react';
import { Layout, Select, Menu, Button, Spin } from 'antd';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import styled from 'styled-components';
import './App.css';
import { config } from './config';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const InnerContent = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
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
              style={{ width: 120, margin: '0 4px 0 4px' }}>
              {getMenu(prop, d.value)}
            </Select>
          ) : <Spin style={{ width: 120 }} />;
        }}
      </FirebaseDatabaseNode>
    ));

  const handleSubmit = () => {
    console.log(chosen);
  }

  return (
    <Layout className='layout' style={{ height: '100%' }}>
      <Header>
        <Menu theme='dark' mode='horizontal' selectedKeys={['1']}>
          <Menu.Item key='1'>Recipes</Menu.Item>
          <Menu.Item key='2'>Orders</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ display: 'flex', flexDirection: 'column', padding: '0 50px' }}>
        <div style={{ margin: '16px 0' }} />
        <InnerContent>
          {getSelects()}
          <Button type='primary' disabled={Object.keys(chosen).length < 4} onClick={handleSubmit} style={{ margin: '0 4px 0 4px' }}>
            Get Recipe
          </Button>
        </InnerContent>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Subculture Labs ©2021</Footer>
    </Layout>
  );
};

export default Application;

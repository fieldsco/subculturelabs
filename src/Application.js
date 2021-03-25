import { Layout, Select, Menu, Breadcrumb } from 'antd';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import styled from 'styled-components';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const getMenu = list => (
  Object.keys(list).map(key => (
    <Option key={key} value={list[key]}>{list[key]}</Option>
  ))
)

const handleChange = e => {
}

const InnerContent = styled.div`
  min-height: 280px;
  padding: 24px;
  background: #fff;
`;

const Application = () => (
  <Layout className='layout'>
    <div className="logo" />
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
        <FirebaseDatabaseNode path="/type" limitToFirst={10}>
          {(d) => {
            return d.value ? (
            <Select placeholder='Type' onChange={handleChange} style={{ width: 120 }}>
              {getMenu(d.value)}
          </Select>) : null
        }}
        </FirebaseDatabaseNode>
      </InnerContent>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Subculture Labs ©2021</Footer>
  </Layout>
);

export default Application;

import './App.css';
import { Layout, Select, Menu } from 'antd';
import { FirebaseDatabaseNode } from '@react-firebase/database';

const { Header, Content } = Layout;
const { Option } = Select;

const getMenu = list => (
  Object.keys(list).map(key => (
    <Option key={key} value={list[key]}>{list[key]}</Option>
  ))
)

const handleChange = e => {
  console.log(e)
}

const Application = () => (
  <Layout className='layout'>
    <Header>
      <Menu theme='dark' mode='horizontal' selectedKeys={['1']}>
        <Menu.Item key='1'>Recipes</Menu.Item>
        <Menu.Item key='2'>Orders</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
    <div className='site-layout-content'>
      <FirebaseDatabaseNode path="/type" limitToFirst={10}>
        {(d) => {
          console.log(d)
          return d.value ? (
          <Select placeholder='Type' onChange={handleChange} style={{ width: 120 }}>
            {getMenu(d.value)}
        </Select>) : null
      }}
      </FirebaseDatabaseNode>
      </div>
    </Content>
  </Layout>
);

export default Application;

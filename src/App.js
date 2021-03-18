import './App.css';
import { Layout, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
/* GET THESE FROM NOSQL TABLE */ const types = ['Gumdrop', 'Hard Candy'];

const typeMenu = (
  <Menu>
    {types.map((type, i) => (
      <Menu.Item key='0'>{type}</Menu.Item>
    ))}
  </Menu>
);

function App() {
  return (
    <div className='App'>
      <Layout className='layout'>
        <Header>
          <div className='logo' />
          <Menu theme='dark' mode='horizontal'>
            <Menu.Item key='1'>Recipes</Menu.Item>
            <Menu.Item key='2'>Orders</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Dropdown overlay={typeMenu} trigger={['click']}>
            <a className='ant-dropdown-link' onClick={e => e.preventDefault()}>
              Type <DownOutlined />
            </a>
          </Dropdown>
        </Content>
      </Layout>
    </div>
  );
}

export default App;

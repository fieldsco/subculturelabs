import './App.css';
import { Layout, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { FirebaseDatabaseNode } from '@react-firebase/database';

const { Header, Content } = Layout;

// const typeMenu = (
//   <Menu>
//     {types.map((type, i) => (
//       <Menu.Item key={i}>{type}</Menu.Item>
//     ))}
//   </Menu>
// );

const Application = () => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">Recipes</Menu.Item>
          <Menu.Item key="2">Orders</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <FirebaseDatabaseNode
          path="/testing"
          // limitToFirst={this.state.limit}
          // orderByKey
          // </Content>orderByValue={"created_on"} >
        >
          {(d) => {
            console.log('d', d);
            return (
              <pre>
                Path {d.path} {d.value}
              </pre>
            );
          }}

          {/* <Dropdown overlay={typeMenu} trigger={['click']}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            Type <DownOutlined />
          </a>
        </Dropdown> */}
        </FirebaseDatabaseNode>
      </Content>
    </Layout>
  );
};

export default Application;

import { Layout } from 'antd';
import AppNav from './AppNav';
import Directions from './Directions';
import './App.css';

const { Header, Footer } = Layout;

const Application = () => {
  return (
    <Layout className='layout'>
      <Header>
        <AppNav />
      </Header>
      <Directions directionType='edible' />
      <Directions directionType='flower' />
      <Footer>Subculture Labs ©2021</Footer>
    </Layout>
  );
};

export default Application;

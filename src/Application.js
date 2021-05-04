import { useState } from 'react';
import { Layout } from 'antd';
import AppNav from './AppNav';
import Directions from './Directions';
import './App.css';

const { Header, Footer } = Layout;

const Application = () => {
  const [activeNav, setActiveNav] = useState('2');

  return (
    <Layout className='layout' style={{ height: '100%' }}>
      <Header>
        <AppNav onClick={setActiveNav} />
      </Header>
      {activeNav === '2' && <Directions directionType='edible' />}
      {activeNav === '4' && <Directions directionType='flower' />}
      <Footer>Subculture Labs ©2021</Footer>
    </Layout>
  );
};

export default Application;

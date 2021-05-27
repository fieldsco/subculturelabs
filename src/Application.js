import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Button, Layout } from 'antd';
import styled from 'styled-components';
import firebase from 'firebase';
import AppNav from './AppNav';
import Directions from './Directions';
import Notes from './Notes';
import './App.css';

const { Header, Footer } = Layout;

const StyledHeader = styled(Header)`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const ButtonWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const Application = () => {
  const [activeNav, setActiveNav] = useState('1');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const uiConfig = {
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID, firebase.auth.PhoneAuthProvider.PROVIDER_ID],
    signInSuccessUrl: 'http://localhost:3000',
    callbacks: {
      // Avoid redirects after sign-in
      signInSuccessWithAuthResult: () => false,
    },
  };

  const handleSignOut = () => firebase.auth().signOut();

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });
    return () => unregisterAuthObserver(); // unmount cleanup
  }, []);

  if (!isAuthenticated) return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;

  return (
    <Layout className='layout' style={{ height: '100%' }}>
      <StyledHeader>
        <AppNav onClick={setActiveNav} activeNav={activeNav} />
        <ButtonWrapper>
          <Button type='text' style={{ color: 'red' }} onClick={handleSignOut}>
            Sign out
          </Button>
        </ButtonWrapper>
      </StyledHeader>
      {activeNav === '1' && <Notes />}
      {activeNav === '2' && <Directions directionType='edible' />}
      {activeNav === '4' && <Directions directionType='flower' />}
      <Footer>Subculture Labs ©2021</Footer>
    </Layout>
  );
};

export default Application;

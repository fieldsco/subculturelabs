import { useState } from 'react';
import { Button, Layout } from 'antd';
import styled from 'styled-components';
import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import AppNav from './AppNav';
import Directions from './Directions';
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
  const [activeNav, setActiveNav] = useState('2');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Tried putting this in config file but it didn't work
  const uiConfig = {
    signInSuccessUrl: 'http://localhost:3000',
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID, firebase.auth.PhoneAuthProvider.PROVIDER_ID],
  };

  firebase.auth().onAuthStateChanged(
    user => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Initialize the FirebaseUI Widget using Firebase
        // https://github.com/firebase/firebaseui-web/issues/216#issuecomment-459302414
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded
        ui.start('#firebaseui-auth-container', uiConfig);
      }
    },
    function (error) {
      console.log(error);
    }
  );

  const handleSignOut = () => firebase.auth().signOut();

  return isAuthenticated ? (
    <Layout className='layout' style={{ height: '100%' }}>
      <StyledHeader>
        <AppNav onClick={setActiveNav} />
        <ButtonWrapper>
          <Button type='text' style={{ color: 'red' }} onClick={handleSignOut}>
            Sign out
          </Button>
        </ButtonWrapper>
      </StyledHeader>
      {activeNav === '2' && <Directions directionType='edible' />}
      {activeNav === '4' && <Directions directionType='flower' />}
      <Footer>Subculture Labs ©2021</Footer>
    </Layout>
  ) : (
    <div id='firebaseui-auth-container' />
  );
};

export default Application;

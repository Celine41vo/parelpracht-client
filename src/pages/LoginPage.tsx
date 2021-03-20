import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Container, Grid, Header, Message, Segment, Image,
} from 'semantic-ui-react';
import AlertContainer from '../components/alerts/AlertContainer';
import LoginForm from '../components/auth/LoginForm';

function LoginPage() {
  return (
    <>
      <AlertContainer internal />
      <Container>
        <Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
          <Grid.Column width={6}>
            <Segment>
              <Image src="./gewis-logo.png" size="small" centered />
              <Header as="h1">
                <Image src="./ParelPracht-black.png" size="mini" style={{ marginBottom: '5.5px', marginRight: '-3px', paddingRight: '-4px' }} />
                <span style={{ marginBottom: '0px', verticalAlign: 'bottom', fontFamily: 'Recursive' }}>arelPracht</span>
              </Header>
              <LoginForm />
            </Segment>
            <Message>
              Trouble signing in?
              {' '}
              <NavLink to="/forgot-password">Forgot password</NavLink>
              .
            </Message>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
}

export default LoginPage;

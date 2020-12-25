import React, { ChangeEvent, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
  Button, Form, Header, Icon, Input,
} from 'semantic-ui-react';
import { authResetPassword } from '../../stores/auth/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';

interface Props {
  newUser: boolean;
  token: string;
  status: ResourceStatus;
  resetPassword: (password: string, passwordRepeat: string, token: string) => void;
}

function ResetPasswordForm(props: Props) {
  const [password, changePassword] = useState('');
  const [passwordRepeat, changePasswordRepeat] = useState('');

  return (
    <Form size="large">
      <Form.Field
        id="form-input-password"
        control={Input}
        value={password}
        type="password"
        icon="lock"
        iconPosition="left"
        label="New password"
        onChange={(e: ChangeEvent<HTMLInputElement>) => changePassword(e.target.value)}
      />
      <Form.Field
        id="form-input-password-repeat"
        control={Input}
        value={passwordRepeat}
        type="password"
        icon="lock"
        iconPosition="left"
        label="Repeat password"
        onChange={(e: ChangeEvent<HTMLInputElement>) => changePasswordRepeat(e.target.value)}
      />
      <Button
        fluid
        primary
        size="large"
        type="submit"
        onClick={() => props.resetPassword(password, passwordRepeat, props.token)}
        loading={props.status === ResourceStatus.FETCHING}
      >
        {props.newUser ? 'Set password' : 'Reset password'}
      </Button>
    </Form>
  );
}

const mapStateToProps = (state: RootState) => ({
  status: state.auth.passwordRequest,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  resetPassword: (password: string, passwordRepeat: string, token: string) => dispatch(
    authResetPassword(password, passwordRepeat, token),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm);
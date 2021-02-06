import { AuthStatus, User } from '../../clients/server.generated';
import {
  AuthActionType, AuthFetchProfile, AuthFetchStatus,
  AuthForgotPassword,
  AuthLogin, AuthLogout, AuthRequestClear, AuthRequestError, AuthRequestSuccess,
  AuthResetPassword, AuthSetProfile, AuthSetStatus,
} from './actions';

export function authFetchStatus(): AuthFetchStatus {
  return { type: AuthActionType.FetchStatus };
}

export function authSetStatus(status: AuthStatus): AuthSetStatus {
  return { type: AuthActionType.SetStatus, status };
}

export function authFetchProfile(): AuthFetchProfile {
  return { type: AuthActionType.FetchProfile };
}

export function authSetProfile(profile: User): AuthSetProfile {
  return { type: AuthActionType.SetProfile, profile };
}

export function authLogin(email: string, password: string): AuthLogin {
  return { type: AuthActionType.Login, email, password };
}

export function authLogout(): AuthLogout {
  return { type: AuthActionType.Logout };
}

export function authForgotPassword(email: string): AuthForgotPassword {
  return { type: AuthActionType.ForgotPassword, email };
}

export function authResetPassword(
  password: string, passwordRepeat: string, token: string,
): AuthResetPassword {
  return {
    type: AuthActionType.ResetPassword, password, passwordRepeat, token,
  };
}

export function authRequestSuccess(): AuthRequestSuccess {
  return { type: AuthActionType.RequestSuccess };
}

export function authRequestError(): AuthRequestError {
  return { type: AuthActionType.RequestError };
}

export function authRequestClear(): AuthRequestClear {
  return { type: AuthActionType.RequestClear };
}

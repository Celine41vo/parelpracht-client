import React, {
  ChangeEvent,
} from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Checkbox,
  Dropdown,
  Form, Input, Segment, TextArea,
} from 'semantic-ui-react';
import _ from 'lodash';
import {
  User, UserParams, Gender, Roles,
} from '../../clients/server.generated';
import { createSingle, saveSingle } from '../../stores/single/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import PropsButtons from '../PropsButtons';
import { SingleEntities } from '../../stores/single/single';
import { getSingle } from '../../stores/single/selectors';

interface Props {
  create?: boolean;
  onCancel?: () => void;

  user: User;
  status: ResourceStatus;

  saveUser: (id: number, user: UserParams) => void;
  createUser: (user: UserParams) => void;
}

interface State {
  editing: boolean;

  firstName: string;
  middleName: string;
  lastName: string;
  gender: Gender;
  email: string;
  comment: string;

  roleGeneral: boolean;
  roleSignee: boolean;
  roleFinancial: boolean;
  roleAdmin: boolean;
}

class UserProps extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      editing: props.create ?? false,
      ...this.extractState(props),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ editing: false });
    }
  }

  extractState = (props: Props) => {
    const { user } = props;
    return {
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      gender: user.gender,
      email: user.email,
      comment: user.comment ?? '',

      roleGeneral: user.roles.find((r) => r.name === Roles.GENERAL) !== undefined,
      roleSignee: user.roles.find((r) => r.name === Roles.SIGNEE) !== undefined,
      roleFinancial: user.roles.find((r) => r.name === Roles.FINANCIAL) !== undefined,
      roleAdmin: user.roles.find((r) => r.name === Roles.ADMIN) !== undefined,
    };
  };

  toParams = (): UserParams => {
    return new UserParams({
      firstName: this.state.firstName,
      middleName: this.state.middleName,
      lastName: this.state.lastName,
      gender: this.state.gender,
      email: this.state.email,
      comment: this.state.comment,

      roles: _.compact([
        this.state.roleGeneral ? Roles.GENERAL : undefined,
        this.state.roleSignee ? Roles.SIGNEE : undefined,
        this.state.roleFinancial ? Roles.FINANCIAL : undefined,
        this.state.roleAdmin ? Roles.ADMIN : undefined,
      ]),
    });
  };

  edit = () => {
    this.setState({ editing: true, ...this.extractState(this.props) });
  };

  cancel = () => {
    if (!this.props.create) {
      this.setState({ editing: false, ...this.extractState(this.props) });
    } else if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  save = () => {
    if (this.props.create) {
      this.props.createUser(this.toParams());
    } else {
      this.props.saveUser(this.props.user.id, this.toParams());
    }
  };

  render() {
    const {
      editing,
      firstName,
      middleName,
      lastName,
      gender,
      email,
      comment,

      roleGeneral, roleSignee, roleAdmin, roleFinancial,
    } = this.state;

    return (
      <>
        <h2>
          {this.props.create ? 'New User' : 'Details'}

          <PropsButtons
            editing={editing}
            status={this.props.status}
            cancel={this.cancel}
            edit={this.edit}
            save={this.save}
          />
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Group>
            <Form.Field
              disabled={!editing}
              id="form-input-first-name"
              fluid
              control={Input}
              label="First Name"
              value={firstName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                firstName: e.target.value,
              })}
              width={6}
            />
            <Form.Field
              disabled={!editing}
              id="form-input-middle-name"
              fluid
              control={Input}
              label="Middle Name"
              value={middleName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                middleName: e.target.value,
              })}
              width={4}
            />
            <Form.Field
              disabled={!editing}
              id="form-input-last-name"
              fluid
              control={Input}
              label="Last Name"
              value={lastName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                lastName: e.target.value,
              })}
              width={6}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              id="form-input-email"
              fluid
              control={Input}
              label="Email address"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                email: e.target.value,
              })}
            />
            <Form.Field fluid disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-gender">Gender</label>
              <Dropdown
                id="form-input-gender"
                selection
                placeholder="Gender"
                value={gender}
                options={[
                  { key: 0, text: 'Male', value: Gender.MALE },
                  { key: 1, text: 'Female', value: Gender.FEMALE },
                  { key: 2, text: 'Unknown', value: Gender.UNKNOWN },
                ]}
                onChange={(e, data) => this.setState({
                  gender: data.value as Gender,
                })}
              />
            </Form.Field>
          </Form.Group>
          <Segment>
            <h3>Permissions</h3>
            <Form.Group widths="equal">
              <Form.Field disabled={!editing}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="form-check-role-signee">
                  Signee
                </label>
                <Checkbox
                  toggle
                  id="form-check-role-signee"
                  checked={roleSignee}
                  onChange={(e, data) => this.setState({
                    roleSignee: data.checked!,
                  })}
                />
              </Form.Field>
              <Form.Field disabled={!editing}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="form-check-role-financial">
                  Financial
                </label>
                <Checkbox
                  toggle
                  id="form-check-role-financial"
                  checked={roleFinancial}
                  onChange={(e, data) => this.setState({
                    roleFinancial: data.checked!,
                  })}
                />
              </Form.Field>
              <Form.Field disabled={!editing}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="form-check-role-general">
                  General
                </label>
                <Checkbox
                  toggle
                  id="form-check-role-general"
                  checked={roleGeneral}
                  onChange={(e, data) => this.setState({
                    roleGeneral: data.checked!,
                  })}
                />
              </Form.Field>
              <Form.Field disabled={!editing}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="form-check-role-admin">
                  General
                </label>
                <Checkbox
                  toggle
                  id="form-check-role-admin"
                  checked={roleAdmin}
                  onChange={(e, data) => this.setState({
                    roleAdmin: data.checked!,
                  })}
                />
              </Form.Field>
            </Form.Group>
          </Segment>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-comment">
              Comments
            </label>
            <TextArea
              id="form-delivery-spec-english"
              value={comment}
              onChange={
                (e) => this.setState({ comment: e.target.value })
              }
              placeholder="Comment"
            />
          </Form.Field>

        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<User>(state, SingleEntities.User).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveUser: (id: number, user: UserParams) => dispatch(
    saveSingle(SingleEntities.User, id, user),
  ),
  createUser: (user: UserParams) => dispatch(
    createSingle(SingleEntities.User, user),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProps);

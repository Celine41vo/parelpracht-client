import React, {
  ChangeEvent,
} from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Dropdown,
  Form, Input, TextArea,
} from 'semantic-ui-react';
import {
  Contact, ContactFunction, ContactParams, Gender,
} from '../../clients/server.generated';
import { createSingle, saveSingle } from '../../stores/single/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import PropsButtons from '../PropsButtons';
import { SingleEntities } from '../../stores/single/single';
import { getSingle } from '../../stores/single/selectors';
import { formatFunction } from '../../helpers/contact';

interface Props {
  create?: boolean;
  onCancel?: () => void;

  contact: Contact;
  status: ResourceStatus;

  saveContact: (id: number, contact: ContactParams) => void;
  createContact: (contact: ContactParams) => void;
}

interface State {
  editing: boolean;

  firstName: string;
  middleName: string;
  lastName: string;
  gender: Gender;
  email: string;
  telephone: string;
  comments: string;
  func: ContactFunction;
}

class ContactProps extends React.Component<Props, State> {
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
    const { contact } = props;
    return {
      firstName: contact.firstName,
      middleName: contact.middleName,
      lastName: contact.lastName,
      gender: contact.gender,
      email: contact.email,
      telephone: contact.telephone,
      func: contact.function,
      comments: contact.comments ?? '',
    };
  };

  toParams = (): ContactParams => {
    return new ContactParams({
      firstName: this.state.firstName,
      middleName: this.state.middleName,
      lastName: this.state.lastName,
      gender: this.state.gender,
      email: this.state.email,
      telephone: this.state.telephone,
      function: this.state.func,
      comments: this.state.comments,
      companyId: this.props.contact.companyId,
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
      this.props.createContact(this.toParams());
    } else {
      this.props.saveContact(this.props.contact.id, this.toParams());
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
      telephone,
      func,
      comments,
    } = this.state;

    return (
      <>
        <h2>
          {this.props.create ? 'New Contact' : 'Details'}

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
            <Form.Field fluid disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-function">Function</label>
              <Dropdown
                id="form-input-function"
                selection
                placeholder="Function"
                value={func}
                options={Object.values(ContactFunction).map((x, i) => ({
                  key: i, value: x, text: formatFunction(x),
                }))}
                onChange={(e, data) => this.setState({
                  func: data.value as ContactFunction,
                })}
              />
            </Form.Field>
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
            <Form.Field
              disabled={!editing}
              id="form-input-telephone"
              fluid
              control={Input}
              label="Telephone number"
              value={telephone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                telephone: e.target.value,
              })}
            />
          </Form.Group>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-comments">
              Comments
            </label>
            <TextArea
              id="form-delivery-spec-english"
              value={comments}
              onChange={
                (e) => this.setState({ comments: e.target.value })
              }
              placeholder="Comments"
            />
          </Form.Field>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<Contact>(state, SingleEntities.Contact).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveContact: (id: number,
    contact: ContactParams) => dispatch(
    saveSingle(SingleEntities.Contact, id, contact),
  ),
  createContact: (contact: ContactParams) => dispatch(
    createSingle(SingleEntities.Contact, contact),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactProps);

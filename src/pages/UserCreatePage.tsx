import * as React from 'react';
import {
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Gender, User } from '../clients/server.generated';
import { RootState } from '../stores/store';
import UserProps from '../components/entities/user/UserProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { SingleEntities } from '../stores/single/single';
import { getSingle } from '../stores/single/selectors';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import { TitleContext } from '../components/TitleContext';

interface Props extends RouteComponentProps, WithTranslation {
  status: ResourceStatus;

  clearUser: () => void;
}

class UserCreatePage extends React.Component<Props> {
  componentDidMount() {
    const { clearUser, t } = this.props;
    clearUser();
    this.context.setTitle(t('pages.user.newUser'));
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      this.close();
    }
  }

  close = () => { this.props.history.push('/users'); };

  public render() {
    const user: User = {
      id: 0,
      firstName: '',
      lastNamePreposition: '',
      lastName: '',
      email: '',
      replyToEmail: '',
      gender: Gender.UNKNOWN,
      function: '',
      comment: '',
      roles: [],
    } as any;

    return (
      <Modal
        onClose={this.close}
        open
        dimmer="blurring"
        closeOnDimmerClick={false}
        size="tiny"
      >
        <Segment>
          <AlertContainer />
          <UserProps user={user} create onCancel={this.close} />
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<User>(state, SingleEntities.User).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUser: (id: number) => dispatch(fetchSingle(SingleEntities.User, id)),
  clearUser: () => dispatch(clearSingle(SingleEntities.User)),
});

UserCreatePage.contextType = TitleContext;

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(UserCreatePage)));

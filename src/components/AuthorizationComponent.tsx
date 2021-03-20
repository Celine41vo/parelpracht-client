import React from 'react';
import { connect } from 'react-redux';
import { Roles } from '../clients/server.generated';
import NotFound from '../pages/NotFound';
import { authedUserHasRole } from '../stores/auth/selectors';
import { RootState } from '../stores/store';

interface Props {
  children: any;
  roles: Roles[];
  notFound: boolean;
  hasRole: (role: Roles) => boolean;
}

class Authorization extends React.Component<Props> {
  render() {
    const {
      roles, notFound, hasRole, children,
    } = this.props;

    if (roles.some(hasRole)) {
      return children;
    }

    if (notFound) {
      return <NotFound />;
    }

    return null;
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  };
};

export default connect(mapStateToProps)(Authorization);
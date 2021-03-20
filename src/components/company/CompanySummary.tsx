import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Grid, Header, Icon, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { Company, Roles } from '../../clients/server.generated';
import { formatStatus } from '../../helpers/activity';
import ResourceStatus from '../../stores/resourceStatus';
import { fetchSingle } from '../../stores/single/actionCreators';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import AuthorizationComponent from '../AuthorizationComponent';
import LogoAvatarModal from '../files/LogoAvatarModal';

interface Props {
  company: Company | undefined;
  status: ResourceStatus;
  fetchCompany: (id: number) => void;
}

function CompanySummary(props: Props) {
  const { company, status, fetchCompany } = props;
  if (company === undefined
    || (status !== ResourceStatus.FETCHED
      && status !== ResourceStatus.SAVING
      && status !== ResourceStatus.ERROR)) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: '#eee' }}>
          <Icon name="building" />
          <Header.Content>
            <Header.Subheader>Company</Header.Subheader>
            <Loader active inline />
          </Header.Content>
        </Header>
        <Segment attached="bottom">
          <Placeholder><Placeholder.Line length="long" /></Placeholder>
        </Segment>
      </>
    );
  }

  return (
    <>
      <Header as="h1" attached="top" style={{ backgroundColor: '#eee' }}>
        <Grid>
          <Grid.Row columns="2">
            <Grid.Column>
              <Icon name="building" size="large" style={{ padding: '0.5rem' }} />
              <Header.Content style={{ paddingLeft: '0.75rem' }}>
                <Header.Subheader>Company</Header.Subheader>
                {company.name}
              </Header.Content>
            </Grid.Column>
            <Grid.Column>
              <AuthorizationComponent
                roles={[Roles.GENERAL, Roles.ADMIN]}
                notFound={false}
              >
                <LogoAvatarModal
                  entity={SingleEntities.Company}
                  entityId={company.id}
                  entityName={company.name}
                  fileName={company.logoFilename}
                  fetchEntity={fetchCompany}
                />
              </AuthorizationComponent>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Header>
      <Segment attached="bottom">
        <Grid columns={4}>
          <Grid.Column>
            <h5>Description</h5>
            <p>{company.comments}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Status</h5>
            <p>{formatStatus(company.status)}</p>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompany: (id: number) => dispatch(fetchSingle(SingleEntities.Company, id)),
});

const mapStateToProps = (state: RootState) => {
  return {
    company: getSingle<Company>(state, SingleEntities.Company).data,
    status: getSingle<Company>(state, SingleEntities.Company).status,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanySummary);

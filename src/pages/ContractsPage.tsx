import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Roles } from '../clients/server.generated';
import AuthorizationComponent from '../components/AuthorizationComponent';
import ContractsTable from '../components/entities/contract/ContractTable';
import ContractTableControls from '../components/entities/contract/ContractTableControls';
import { useTitle } from '../components/TitleContext';

function ContractsPage(props: RouteComponentProps) {
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  React.useEffect(() => {
    setTitle(t('entity.contracts'));
  }, []);

  return (
    <AuthorizationComponent
      roles={[Roles.SIGNEE, Roles.GENERAL, Roles.FINANCIAL, Roles.AUDIT, Roles.AUDIT]}
      notFound
    >
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="shopping bag" />
                <Header.Content>
                  <Header.Subheader>{t('entity.contracts')}</Header.Subheader>
                  {t('pages.contracts.allContracts')}
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
                <Button icon labelPosition="left" primary floated="right" onClick={() => props.history.push('/contract/new')}>
                  <Icon name="plus" />
                  {t('pages.contracts.addContract')}
                </Button>
              </AuthorizationComponent>
            </Grid.Column>
          </Grid>

          <ContractTableControls />

        </Container>
      </Segment>
      <Container style={{ marginTop: '20px' }}>
        <ContractsTable />
      </Container>
    </AuthorizationComponent>
  );
}

export default withRouter(ContractsPage);

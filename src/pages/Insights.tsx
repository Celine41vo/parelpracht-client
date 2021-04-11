import * as React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import ContractTableExtensive from '../components/megatable/MegaTable';
import ContractTableExtensiveControls from '../components/megatable/MegaTableControls';

function Insights() {
  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '0.5em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="line graph" />
                <Header.Content>
                  <Header.Subheader>Insights</Header.Subheader>
                  Insights
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column />
          </Grid>

          <ContractTableExtensiveControls />

        </Container>
      </Segment>
      <Container>
        <ContractTableExtensive />
      </Container>
    </>
  );
}

export default withRouter(Insights);

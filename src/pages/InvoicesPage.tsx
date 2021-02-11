import * as React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import InvoicesTable from '../components/invoice/InvoiceTable';
import InvoiceTableControls from '../components/invoice/InvoiceTableControls';
import { Client } from '../clients/server.generated';

function InvoicesPage() {
  const updateTreasurerLastSeen = async () => {
    const client = new Client();
    await client.updateLastSeenByTreasurer();
  };

  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="file alternate" />
                <Header.Content>
                  <Header.Subheader>Invoices</Header.Subheader>
                  All Invoices
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Button icon labelPosition="left" primary floated="right" onClick={() => updateTreasurerLastSeen()}>
                <Icon name="eye" />
                Update Last Seen
              </Button>
            </Grid.Column>
          </Grid>

          <InvoiceTableControls />

        </Container>
      </Segment>
      <Container>
        <InvoicesTable />
      </Container>
    </>
  );
}

export default withRouter(InvoicesPage);

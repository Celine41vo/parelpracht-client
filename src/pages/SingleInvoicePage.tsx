import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  Container, Grid, Loader, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Invoice } from '../clients/server.generated';
import { RootState } from '../stores/store';
import ResourceStatus from '../stores/resourceStatus';
import InvoiceSummary from '../components/invoice/InvoiceSummary';
import InvoiceProps from '../components/invoice/InvoiceProps';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import { SingleEntities } from '../stores/single/single';
import { getSingle } from '../stores/single/selectors';
import ActivitiesList from '../components/activities/ActivitiesList';
import { GeneralActivity } from '../components/activities/GeneralActivity';
import FinancialDocumentProgress from '../components/activities/FinancialDocumentProgress';
import FilesList from '../components/files/FilesList';
import GenerateInvoiceModal from '../components/files/GenerateInvoiceModal';

interface Props extends RouteComponentProps<{ invoiceId: string }> {
  invoice: Invoice | undefined;
  status: ResourceStatus;

  fetchInvoice: (id: number) => void;
  clearInvoice: () => void;
}

class SingleInvoicePage extends React.Component<Props> {
  componentDidMount() {
    const { invoiceId } = this.props.match.params;

    this.props.clearInvoice();
    this.props.fetchInvoice(Number.parseInt(invoiceId, 10));
  }

  public render() {
    const { invoice, fetchInvoice, status } = this.props;

    if (invoice === undefined) {
      return (
        <Container style={{ paddingTop: '2em' }}>
          <Loader content="Loading" active />
        </Container>
      );
    }

    return (
      <Container style={{ paddingTop: '2em' }}>
        <Breadcrumb
          icon="right angle"
          sections={[
            { key: 'Invoices', content: <NavLink to="/invoice">Invoices</NavLink> },
            { key: 'Invoice', content: invoice.id, active: true },
          ]}
        />
        <InvoiceSummary />
        <Grid rows={2}>
          <Grid.Row centered columns={1} style={{ paddingLeft: '1em', paddingRight: '1em' }}>
            <Segment secondary>
              <FinancialDocumentProgress
                activities={invoice.activities as GeneralActivity[]}
                documentType="Invoice"
              />
            </Segment>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment>
                <InvoiceProps invoice={invoice} />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment secondary>
                <ActivitiesList activities={invoice.activities as GeneralActivity[]} />
              </Segment>
              <Segment secondary>
                <FilesList
                  files={invoice.files}
                  entityId={invoice.id}
                  entity={SingleEntities.Invoice}
                  fetchEntity={fetchInvoice}
                  generateModal={(
                    <GenerateInvoiceModal
                      invoiceId={invoice.id}
                      fetchInvoice={fetchInvoice}
                    />
                  )}
                  status={status}
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    invoice: getSingle<Invoice>(state, SingleEntities.Invoice).data,
    status: getSingle<Invoice>(state, SingleEntities.Invoice).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInvoice: (id: number) => dispatch(fetchSingle(SingleEntities.Invoice, id)),
  clearInvoice: () => dispatch(clearSingle(SingleEntities.Invoice)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleInvoicePage));

import * as React from 'react';
import {
  Dimmer, Loader, Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Client,
  Contract,
  ContractStatus,
  ContractStatusParams,
  Invoice,
  InvoiceStatus,
  InvoiceStatusParams,
} from '../../clients/server.generated';
import { fetchSingle } from '../../stores/single/actionCreators';
import { RootState } from '../../stores/store';
import ResourceStatus from '../../stores/resourceStatus';
import AlertContainer from '../alerts/AlertContainer';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { getDocumentStatus } from '../../helpers/activity';
import DocumentStatusProps from './DocumentStatusProps';

interface Props extends RouteComponentProps {
  resourceStatus: ResourceStatus;
  fetchInvoice: (id: number) => void;
  fetchContract: (id: number) => void;
  close: () => void;

  open: boolean;
  documentId: number;
  documentType: SingleEntities;
  documentStatus: string;
}

class DocumentStatusModal extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const {
      documentId,
      documentType,
      documentStatus,
      open,
      close,
    } = this.props;
    const documentSubType: ContractStatus | InvoiceStatus = getDocumentStatus(
      documentStatus.toUpperCase(),
      documentType,
    );
    let documentStatusParams: InvoiceStatusParams | ContractStatusParams | undefined;
    if (documentType === SingleEntities.Contract) {
      documentStatusParams = {
        description: '',
        subType: documentSubType as ContractStatus,
      } as any as ContractStatusParams;
    } else {
      documentStatusParams = {
        description: '',
        subType: documentSubType as InvoiceStatus,
      } as any as InvoiceStatusParams;
    }

    if (documentStatusParams === undefined) {
      return (
        <Modal
          onClose={() => close()}
          closeIcon
          open={open}
          dimmer="blurring"
          size="tiny"
        >
          <Segment placeholder attached="bottom">
            <AlertContainer />
            <Dimmer active inverted>
              <Loader />
            </Dimmer>
          </Segment>
        </Modal>
      );
    }

    return (
      <Modal
        onClose={() => close()}
        open={open}
        closeIcon
        dimmer="blurring"
        size="tiny"
      >
        <Segment attached="bottom">
          <AlertContainer />
          <DocumentStatusProps
            documentStatusParams={documentStatusParams}
            documentId={documentId}
            documentType={documentType}
            documentStatus={documentSubType}
            resourceStatus={this.props.resourceStatus}
            create
            close={close}
          />
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  let resStatus: ResourceStatus = getSingle<Invoice>(state, SingleEntities.Invoice).status;
  if (resStatus == null) {
    resStatus = getSingle<Contract>(state, SingleEntities.Contract).status;
  }
  return {
    resourceStatus: resStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInvoice: (id: number) => dispatch(fetchSingle(SingleEntities.Invoice, id)),
  fetchContract: (id: number) => dispatch(fetchSingle(SingleEntities.Contract, id)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DocumentStatusModal));

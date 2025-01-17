import * as React from 'react';
import {
  Dimmer, Loader, Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  Contract, ProductInstance, ProductInstanceParams, ProductInstanceStatus, Roles,
} from '../clients/server.generated';
import { fetchSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ProductInstanceProps from '../components/entities/product/ProductInstanceProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import FinancialDocumentProgress from '../components/activities/FinancialDocumentProgress';
import { GeneralActivity } from '../components/activities/GeneralActivity';
import ActivitiesList from '../components/activities/ActivitiesList';
import {
  createInstanceSingle,
  deleteInstanceSingle,
  saveInstanceSingle,
} from '../stores/productinstance/actionCreator';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import { getProductName } from '../stores/product/selectors';
import { TitleContext } from '../components/TitleContext';

interface SelfProps extends RouteComponentProps<{
  contractId: string, productInstanceId?: string
}> {
  create?: boolean;
}

interface Props extends SelfProps, WithTranslation {
  productInstance: ProductInstance | undefined;
  status: ResourceStatus;
  contract?: Contract;
  productName: string;

  fetchContract: (id: number) => void;
  saveProductInstance: (contractId: number, id: number, inst: ProductInstanceParams) => void;
  createProductInstance: (contractId: number, inst: ProductInstanceParams) => void;
  removeProductInstance: (contractId: number, id: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class ContractProductInstanceModal extends React.Component<Props> {
  componentDidUpdate() {
    const { productInstance, productName, t } = this.props;
    if (!productInstance) {
      this.context.setTitle(t('pages.contract.products.addProduct'));
    } else {
      this.context.setTitle(productName);
    }
  }

  close = () => {
    const { contractId } = this.props.match.params;
    this.props.fetchContract(parseInt(contractId, 10));
    this.props.history.goBack();
  };

  saveProductInstance = async (productInstance: ProductInstanceParams) => {
    this.props.saveProductInstance(
      parseInt(this.props.match.params.contractId!, 10),
      parseInt(this.props.match.params.productInstanceId!, 10),
      productInstance,
    );
    this.close();
  };

  createProductInstance = async (productInstance: ProductInstanceParams) => {
    this.props.createProductInstance(
      parseInt(this.props.match.params.contractId!, 10),
      productInstance,
    );
    this.close();
  };

  removeProductInstance = async () => {
    this.props.removeProductInstance(
      parseInt(this.props.match.params.contractId!, 10),
      parseInt(this.props.match.params.productInstanceId!, 10),
    );
    this.close();
  };

  public render() {
    const { create, status, contract } = this.props;
    let productInstance: ProductInstance | undefined;
    if (create) {
      const { contractId } = this.props.match.params;
      productInstance = {
        id: -1,
        contractId: parseInt(contractId, 10),
        productId: -1,
        basePrice: 0,
        discount: 0,
        details: '',
        status: ProductInstanceStatus.NOTDELIVERED,
      } as any as ProductInstance;
    } else {
      productInstance = this.props.productInstance;
    }

    if (productInstance === undefined) {
      return (
        <Modal
          onClose={this.close}
          closeIcon
          open
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

    let activities;
    if (!create) {
      activities = [
        <Segment secondary style={{ backgroundColor: 'rgba(243, 244, 245, 0.98)', margin: '2em 1em 1em' }} key="seg-1">
          <FinancialDocumentProgress
            documentId={productInstance.id}
            parentId={productInstance.contractId}
            activities={productInstance.activities as GeneralActivity[]}
            documentType={SingleEntities.ProductInstance}
            resourceStatus={status}
            roles={[Roles.ADMIN, Roles.GENERAL]}
            canCancel
          />
        </Segment>,
        <Segment style={{ margin: '2em 1em 1em' }} key="seg-2">
          <ActivitiesList
            activities={productInstance.activities as GeneralActivity[]}
            componentId={productInstance.id}
            componentType={SingleEntities.ProductInstance}
            resourceStatus={status}
            parentId={productInstance.contractId}
          />
        </Segment>,
      ];
    }

    return (
      <Modal
        onClose={this.close}
        open
        closeIcon
        dimmer="blurring"
        size={create ? 'tiny' : 'small'}
      >
        <div style={{ margin: '1em' }}>
          <AlertContainer />
          <ProductInstanceProps
            productInstance={productInstance}
            contract={contract!}
            status={status}
            create={create}
            onCancel={this.close}
            saveProductInstance={this.saveProductInstance}
            createProductInstance={this.createProductInstance}
            removeProductInstance={this.removeProductInstance}
          />
        </div>
        {activities}
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState, props: SelfProps) => {
  const prodInstance = !props.create
    ? getSingle<Contract>(state, SingleEntities.Contract).data?.products.find(
      (p) => p.id === parseInt(props.match.params.productInstanceId!, 10),
    )
    : undefined;
  let prodName = '';
  if (prodInstance !== undefined) {
    prodName = getProductName(state, prodInstance.productId);
  }
  return {
    productInstance: prodInstance,
    status: getSingle<Contract>(state, SingleEntities.Contract).status,
    contract: getSingle<Contract>(state, SingleEntities.Contract).data,
    productName: prodName,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContract: (id: number) => dispatch(fetchSingle(SingleEntities.Contract, id)),
  saveProductInstance: (contractId: number, id: number, inst: ProductInstanceParams) => dispatch(
    saveInstanceSingle(contractId, id, inst),
  ),
  createProductInstance: (contractId: number, inst: ProductInstanceParams) => dispatch(
    createInstanceSingle(contractId, inst),
  ),
  removeProductInstance: (contractId: number, id: number) => dispatch(
    deleteInstanceSingle(contractId, id),
  ),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

ContractProductInstanceModal.contextType = TitleContext;

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(ContractProductInstanceModal)));

import React from 'react';
import { Loader, Table } from 'semantic-ui-react';
import {
  Client, ContractListResponse, PaginationParams, Product, ProductInstance,
} from '../../clients/server.generated';
import TablePagination from '../TablePagination';
import ContractCompactRow from './ContractCompactRow';

interface Props {
  product: Product;
}

interface State {
  productInstances: ProductInstance[];
  countTotal: number;
  loading: boolean;

  skip: number;
  take: number;
}

class ContractCompactTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      productInstances: [],
      countTotal: 0,
      skip: 0,
      take: 20,
      loading: false,
    };
  }

  async componentDidMount() {
    await this.getProductAttributes();
  }

  async getProductAttributes() {
    const { skip, take } = this.state;
    const { product } = this.props;
    this.setState({ loading: true });
    const client = new Client();

    const productInstances = await client.getProductContracts(product.id, {
      skip,
      take,
    } as PaginationParams);

    this.setState({
      productInstances: productInstances.list,
      countTotal: productInstances.count,
      loading: false,
    });
    this.render();
  }

  nextPage = async () => {
    const { skip, take, countTotal } = this.state;
    if (skip + take <= countTotal) {
      this.setState({ skip: skip + take });
      await this.getProductAttributes();
    }
  };

  prevPage = async () => {
    const { skip, take } = this.state;
    if (skip - take >= 0) {
      this.setState({ skip: skip - take });
      await this.getProductAttributes();
    }
  };

  setTake = async (take: number) => {
    await this.setState({
      take,
      skip: 0,
    });
    await this.getProductAttributes();
  };

  render() {
    const {
      productInstances, countTotal, skip, take, loading,
    } = this.state;

    let contractList;
    if (productInstances.length === 0) {
      contractList = (
        <h4>
          There are no contracts created yet.
        </h4>
      );
    } else {
      contractList = (
        <>
          <Table striped compact>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  Title
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Company
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Status
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Last Update
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {productInstances.map((p) => <ContractCompactRow key={p.id} contract={p.contract} />)}
            </Table.Body>
          </Table>
          <TablePagination
            countTotal={countTotal}
            countFetched={productInstances.length}
            skip={skip}
            take={take}
            nextPage={this.nextPage}
            prevPage={this.prevPage}
            setTake={this.setTake}
          />
        </>
      );
    }

    return (
      <>
        <h3>Contracts</h3>
        <Loader active={loading} />
        {contractList}
      </>
    );
  }
}

export default ContractCompactTable;

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Dimmer, Loader, Segment, Table,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Invoice, Roles } from '../../../clients/server.generated';
import TablePagination from '../../TablePagination';
import { RootState } from '../../../stores/store';
import {
  changeSortTable,
  fetchTable,
  nextPageTable,
  prevPageTable,
  setFilterTable,
  setSortTable,
  setTakeTable,
} from '../../../stores/tables/actionCreators';
import { countFetched, countTotal, getTable } from '../../../stores/tables/selectors';
import { Tables } from '../../../stores/tables/tables';
import InvoiceRow from './InvoiceRow';
import CompanyFilter from '../../tablefilters/CompanyFilter';
import InvoiceStatusFilter from '../../tablefilters/InvoiceStatusFilter';
import ResourceStatus from '../../../stores/resourceStatus';
import { authedUserHasRole } from '../../../stores/auth/selectors';

interface Props {
  invoices: Invoice[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;
  status: ResourceStatus;

  fetchInvoices: () => void;
  setTableFilter: (filter: { column: string, values: any[] }) => void;
  changeSort: (column: string) => void;
  setSort: (column: string, direction: 'ASC' | 'DESC') => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
  hasRole: (role: Roles) => boolean;
}

function InvoicesTable({
  invoices, fetchInvoices, column, direction, changeSort, setSort, setTableFilter,
  total, fetched, skip, take, status,
  prevPage, nextPage, setTake, hasRole,
}: Props) {
  const { t } = useTranslation();

  if ([Roles.FINANCIAL].some(hasRole) && ![Roles.ADMIN].some(hasRole)) {
    useEffect(() => {
      setSort('id', 'DESC');
      setTableFilter({ column: 'activityStatus', values: ['SENT'] });
      fetchInvoices();
    }, []);
  } else {
    useEffect(() => {
      setSort('id', 'DESC');
      fetchInvoices();
    }, []);
  }

  const table = (
    <>
      <Table singleLine selectable attached sortable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'id' ? direction : undefined}
              onClick={() => changeSort('id')}
              width={1}
            >
              {t('entities.generalProps.ID')}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'title' ? direction : undefined}
              onClick={() => changeSort('title')}
              width={4}
            >
              {t('entities.invoice.props.title')}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'company' ? direction : undefined}
              onClick={() => changeSort('company')}
              width={3}
            >
              {t('entity.company')}
              <CompanyFilter table={Tables.Invoices} />
            </Table.HeaderCell>
            <Table.HeaderCell width={2}>
              {t('entities.generalProps.status')}
              <InvoiceStatusFilter />
            </Table.HeaderCell>
            <Table.HeaderCell width={2}>
              {t('entities.generalProps.amount')}
            </Table.HeaderCell>
            <Table.HeaderCell
              width={2}
              sorted={column === 'startDate' ? direction : undefined}
              onClick={() => changeSort('startDate')}
            >
              {t('entities.invoice.props.financialYear')}
            </Table.HeaderCell>
            <Table.HeaderCell
              width={3}
              sorted={column === 'updatedAt' ? direction : undefined}
              onClick={() => changeSort('updatedAt')}
            >
              {t('entities.generalProps.lastUpdate')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {invoices.map((x) => <InvoiceRow invoice={x} key={x.id} />)}
        </Table.Body>
      </Table>
      <TablePagination
        countTotal={total}
        countFetched={fetched}
        skip={skip}
        take={take}
        nextPage={nextPage}
        prevPage={prevPage}
        setTake={setTake}
      />
    </>
  );

  if (status === ResourceStatus.FETCHING || status === ResourceStatus.SAVING) {
    return (
      <>
        <Segment style={{ padding: '0px' }}>
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
          {table}
        </Segment>
      </>
    );
  }

  return table;
}

const mapStateToProps = (state: RootState) => {
  const invoiceTable = getTable<Invoice>(state, Tables.Invoices);
  return {
    total: countTotal(state, Tables.Invoices),
    fetched: countFetched(state, Tables.Invoices),
    status: invoiceTable.status,
    skip: invoiceTable.skip,
    take: invoiceTable.take,
    invoices: invoiceTable.data,
    column: invoiceTable.sortColumn,
    direction: invoiceTable.sortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
    hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInvoices: () => dispatch(fetchTable(Tables.Invoices)),
  setTableFilter: (filter: { column: string, values: any[] }) => {
    dispatch(setFilterTable(Tables.Invoices, filter));
  },
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.Invoices, column));
    dispatch(fetchTable(Tables.Invoices));
  },
  setSort: (column: string, direction: 'ASC' | 'DESC') => {
    dispatch(setSortTable(Tables.Invoices, column, direction));
    dispatch(fetchTable(Tables.Invoices));
  },
  setTake: (take: number) => {
    dispatch(setTakeTable(Tables.Invoices, take));
    dispatch(fetchTable(Tables.Invoices));
  },
  prevPage: () => {
    dispatch(prevPageTable(Tables.Invoices));
    dispatch(fetchTable(Tables.Invoices));
  },
  nextPage: () => {
    dispatch(nextPageTable(Tables.Invoices));
    dispatch(fetchTable(Tables.Invoices));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesTable);

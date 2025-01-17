import React from 'react';
import ColumnFilter from '../ColumnFilter';
import { InvoiceStatus } from '../../clients/server.generated';
import { formatStatus } from '../../helpers/activity';
import { Tables } from '../../stores/tables/tables';

function InvoiceStatusFilter() {
  const options = Object.values(InvoiceStatus).map((s: string, i) => {
    return { key: i, value: s, text: formatStatus(s) };
  });
  return (
    <ColumnFilter
      column="activityStatus"
      columnName="Status"
      table={Tables.Invoices}
      options={options}
    />
  );
}

export default InvoiceStatusFilter;

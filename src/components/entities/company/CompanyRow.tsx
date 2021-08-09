import React from 'react';
import { Table } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Company, CompanyStatus } from '../../../clients/server.generated';
import { formatLastUpdate } from '../../../helpers/timestamp';
import CompanyLink from './CompanyLink';

interface Props {
  company: Company;
}

export function CompanyRow(props: Props) {
  const { t } = useTranslation();
  const { company } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <CompanyLink id={company.id} />
      </Table.Cell>
      <Table.Cell>
        {company.status === CompanyStatus.ACTIVE ? 'Active' : 'Inactive'}
      </Table.Cell>
      <Table.Cell>
        {formatLastUpdate(company.updatedAt, t)}
      </Table.Cell>
    </Table.Row>
  );
}
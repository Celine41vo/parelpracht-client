import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Icon, Table } from 'semantic-ui-react';
import { RootState } from '../../stores/store';
import { SingleEntities } from '../../stores/single/single';
import { ContractFile } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { GeneralFile } from './GeneralFile';
import SingleFile from './SingleFile';

interface Props extends RouteComponentProps {
  files: GeneralFile[];
  entityId: number;
  entity: SingleEntities;
  status: ResourceStatus;

  fetchEntity: (entityId: number) => void;
  generateModal?: JSX.Element;
}

interface State {
  creating: boolean
}

class FilesList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      creating: false,
    };
  }

  cancelCreate = (shouldUpdate: boolean) => {
    this.setState({ creating: false });
    if (shouldUpdate) {
      this.props.fetchEntity(this.props.entityId);
    }
  };

  render() {
    const {
      files, entityId, entity, fetchEntity, generateModal, status,
    } = this.props;
    const { creating } = this.state;

    let createRow;

    if (creating) {
      const file = {
        name: '',
        location: '',
        downloadName: '',
        id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 0,
      } as ContractFile;
      createRow = (
        <SingleFile
          key={0}
          file={file}
          create
          closeCreate={this.cancelCreate}
          entity={entity}
          entityId={entityId}
          fetchEntity={fetchEntity}
          status={status}
        />
      );
    }

    return (
      <>
        <h3>
          Files
          <Button
            icon
            labelPosition="left"
            floated="right"
            style={{ marginTop: '-0.5em' }}
            basic
            onClick={() => this.setState({ creating: true })}
          >
            <Icon name="plus" />
            Upload File
          </Button>
          {generateModal}
        </h3>
        <Table compact>
          <Table.Body>
            {createRow}
            {files
              .sort((a, b) => { return b.updatedAt.getTime() - a.updatedAt.getTime(); })
              .map((file) => (
                <SingleFile
                  key={file.id}
                  file={file}
                  create={false}
                  entity={entity}
                  entityId={entityId}
                  fetchEntity={fetchEntity}
                  status={status}
                />
              ))}
          </Table.Body>
        </Table>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = () => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilesList));

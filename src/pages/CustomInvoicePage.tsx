import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import CustomInvoiceText from '../components/custominvoice/CustomInvoiceText';
import {
  CustomInvoiceGenSettings,
  CustomProduct,
  CustomRecipient,
  Gender,
  Language,
  ReturnFileType,
} from '../clients/server.generated';
import CustomInvoiceProducts from '../components/custominvoice/CustomInvoiceProducts';
import CustomInvoiceProps from '../components/custominvoice/CustomInvoiceProps';
import CustomInvoiceRecipient from '../components/custominvoice/CustomInvoiceRecipient';
import { FilesClient } from '../clients/filesClient';

interface State {
  language: Language;
  fileType: ReturnFileType;
  subject: string;
  ourReference: string;
  theirReference: string;

  invoiceReason: string;
  recipient: CustomRecipient;
  products: CustomProduct[];

  loading: boolean;
}

class CustomInvoicePage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      language: Language.DUTCH,
      fileType: ReturnFileType.PDF,
      subject: '',
      ourReference: '',
      theirReference: '',
      invoiceReason: '',
      recipient: new CustomRecipient({
        name: '',
        organizationName: '',
        gender: Gender.UNKNOWN,
        street: '',
        postalCode: '',
        city: '',
        country: '',
      }),
      products: [new CustomProduct({
        name: '',
        amount: 0,
        pricePerOne: 0,
      })],
      loading: false,
    };
  }

  setAttribute = (attribute: string, value: string) => {
    // @ts-ignore
    this.setState({ [attribute]: value });
  };

  setRecipient = (recipient: CustomRecipient) => {
    this.setState({ recipient });
  };

  setLanguage = (language: Language) => {
    this.setState({ language });
  };

  setFileType = (fileType: ReturnFileType) => {
    this.setState({ fileType });
  };

  addProduct = () => {
    const { products } = this.state;
    const newProduct = new CustomProduct({
      name: '',
      amount: 0,
      pricePerOne: 0,
    });
    products.push(newProduct);
    this.setState({ products });
  };

  updateProduct = (id: number, attribute: string, value: any) => {
    const { products } = this.state;
    // @ts-ignore
    products[id][attribute] = value;
    this.setState({ products });
  };

  removeProduct = (id: number) => {
    const { products } = this.state;
    products.splice(id, 1);
    this.setState({ products });
  };

  updateRecipientAttribute = (attribute: string, value: string) => {
    const { recipient } = this.state;
    // @ts-ignore
    recipient[attribute] = value;
    this.setState({
      recipient,
    });
  };

  updateRecipientGender = (gender: Gender) => {
    const { recipient } = this.state;
    this.setState({
      recipient: {
        ...recipient,
        gender,
      } as any as CustomRecipient,
    });
  };

  generate = async () => {
    const {
      language, fileType, ourReference, theirReference, subject, invoiceReason, recipient, products,
    } = this.state;
    this.setState({ loading: true });
    const client = new FilesClient();
    await client.generateCustomInvoiceFile(new CustomInvoiceGenSettings({
      language,
      fileType,
      ourReference,
      theirReference,
      subject,
      invoiceReason,
      recipient,
      products,
    }));

    this.setState({ loading: false });
  };

  render() {
    const {
      language, fileType, subject, ourReference, theirReference, invoiceReason, recipient, products,
      loading,
    } = this.state;

    return (
      <>
        <Segment style={{ backgroundColor: '#eee' }} vertical basic>
          <Container style={{ paddingTop: '1em' }}>
            <Grid columns={2}>
              <Grid.Column width={10}>
                <Header as="h1">
                  <Icon name="credit card" />
                  <Header.Content>
                    <Header.Subheader>
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      Making the treasurer's life easier
                    </Header.Subheader>
                    Generate Custom Invoice
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column width="6">
                <Button
                  icon
                  labelPosition="left"
                  primary
                  floated="right"
                  onClick={() => this.generate()}
                  loading={loading}
                >
                  <Icon name="download" />
                  Generate invoice
                </Button>
              </Grid.Column>
            </Grid>

          </Container>
        </Segment>
        <Container style={{ marginTop: '2em' }}>
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <CustomInvoiceText
                  invoiceReason={invoiceReason}
                  invoiceNumber={ourReference}
                  language={language}
                  setAttribute={this.setAttribute}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column width={9}>
                <CustomInvoiceProducts
                  products={products}
                  addProduct={this.addProduct}
                  updateProduct={this.updateProduct}
                  removeProduct={this.removeProduct}
                />
              </Grid.Column>
              <Grid.Column width={7}>
                <CustomInvoiceProps
                  language={language}
                  fileType={fileType}
                  subject={subject}
                  ourReference={ourReference}
                  theirReference={theirReference}
                  setAttribute={this.setAttribute}
                  setLanguage={this.setLanguage}
                  setFileType={this.setFileType}
                />
                <CustomInvoiceRecipient
                  recipient={recipient}
                  updateRecipientAttribute={this.updateRecipientAttribute}
                  updateRecipientGender={this.updateRecipientGender}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </>
    );
  }
}

export default withRouter(CustomInvoicePage);
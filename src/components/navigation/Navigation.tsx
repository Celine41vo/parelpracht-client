import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Container, Icon, Menu, Image,
} from 'semantic-ui-react';
import AuthMenu from './AuthMenu';
import CompaniesMenu from './CompaniesMenu';
import ProductsMenu from './ProductsMenu';
import InvoicesMenu from './InvoicesMenu';

function Navigation() {
  return (
    <Menu fixed="top" inverted size="large" className="main-menu">
      <Container>
        <Menu.Item as={NavLink} header to="/" exact>
          <Image
            src="./ParelPracht-whitesvg.svg"
            width="26px"
            style={{
              marginBottom: '-6px', marginTop: '-10px', marginRight: '0px', paddingRight: '0px',
            }}
          />
        </Menu.Item>
        <ProductsMenu />
        <CompaniesMenu />
        <Menu.Item as={NavLink} to="/contract">
          <Icon name="file alternate" />
          Contracts
        </Menu.Item>
        <InvoicesMenu />
        <Menu.Item as={NavLink} to="/insights">
          <Icon name="line graph" />
          Insights
        </Menu.Item>
        <AuthMenu />
      </Container>
    </Menu>
  );
}

export default Navigation;

import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Table, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Menu } from './components/menu';
import { BooksConfig } from './components/books';
import { LoansConfig } from './components/loans';

function App() {
  return (
    <>
     <Menu/>

      <Container className="mt-3">
        <Row>
          <Col>
            <BooksConfig />
            <hr className="my-5" />
            <LoansConfig />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;

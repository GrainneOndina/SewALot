import React from 'react';
import { Navbar, Container, Nav, FormControl, Form, Button } from 'react-bootstrap';

const NavigationBar = ({ loggedIn, onSignOut }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Logo</Navbar.Brand>
        {loggedIn && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#profile">Profile</Nav.Link>
              </Nav>
              <Form className="d-flex">
                <FormControl type="search" placeholder="Search" className="mr-2" aria-label="Search" />
                <Button variant="outline-success">Search</Button>
              </Form>
              <Nav>
                <Nav.Link onClick={onSignOut}>Sign Out</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

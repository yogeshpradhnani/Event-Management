import React from 'react'
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'; // You need to install axios: npm install axios
import { useNavigate } from "react-router-dom"; // assuming you're using react-router
import { Link } from 'react-router-dom';
export default function Header() {
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
          await axios.post('http://localhost:3001/users/logout', null, {
              withCredentials: true
            });
        navigate('/'); // redirect after logout
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
  return (
    <div>
       <Navbar expand="lg" className="bg-body-tertiary py-3 shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#">Event Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto my-2 my-lg-0 " style={{ maxHeight: '100px' }} navbarScroll>
          <Nav.Link as={Link} to="/booked">Booked Events</Nav.Link>
            <Nav.Link href="#action2">Booking History</Nav.Link>
          </Nav>

          <Nav>
            <NavDropdown title="Profile" id="profile-dropdown" align="end">
             
              {/* <NavDropdown.Divider /> */}
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  )
}

import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import jsPDF from 'jspdf';

export default function BookedEvents() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`http://localhost:3001/events/${user.id}`, {
        withCredentials: true,
      });
      setTickets(res.data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const cancelRegistration = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) return;
    try {
      await axios.delete(`http://localhost:3001/events/cancel/${ticketId}`, {
        withCredentials: true,
      });
      fetchTickets(); // Refresh list after cancellation
    } catch (error) {
      console.error('Cancellation failed:', error);
    }
  };

  const downloadTicket = (ticket) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('🎟️ Event Ticket', 20, 20);

    doc.setFontSize(12);
    doc.text(`Ticket ID: ${ticket._id}`, 20, 40);
    doc.text(`Event: ${ticket.event_id.title}`, 20, 50);
    doc.text(`Date: ${new Date(ticket.event_id.date_time).toLocaleString()}`, 20, 60);
    doc.text(`Location: ${ticket.event_id.location}`, 20, 70);
    doc.text(`Type: ${ticket.ticket_type}`, 20, 80);
    doc.text(`Price: ₹${ticket.price}`, 20, 90);
    doc.text(`Name: ${ticket.user_id.name}`, 20, 100);

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, 105, 190, 105);

    doc.setFontSize(10);
    doc.text('Please bring this ticket to the venue. Enjoy your event!', 20, 115);

    doc.save(`${ticket.event_id.title.replace(/\s+/g, '_')}_Ticket.pdf`);
  };

  return (
    <Container className="my-4">
      <h3 className="mb-4">🎟️ Your Booked Tickets</h3>
      {tickets.length === 0 ? (
        <p>You have not registered for any events yet.</p>
      ) : (
        tickets.map((ticket) => (
          <Card key={ticket._id} className="mb-3 shadow-sm">
            <Card.Header>{ticket.user_id.name}</Card.Header>
            <Card.Header>{ticket._id}</Card.Header>
            <Card.Body>
              <Card.Title>{ticket.event_id.title}</Card.Title>
              <Card.Text>
                <strong>Date:</strong> {new Date(ticket.event_id.date_time).toLocaleString()}<br />
                <strong>Location:</strong> {ticket.event_id.location}<br />
                <strong>Type:</strong> {ticket.ticket_type}<br />
                <strong>Price:</strong> ₹{ticket.price}
              </Card.Text>
              <Row>
                <Col>
                  <Button variant="success" onClick={() => downloadTicket(ticket)}>
                    Download Ticket
                  </Button>
                </Col>
                <Col>
                  <Button variant="danger" onClick={() => cancelRegistration(ticket._id)}>
                    Cancel Registration
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

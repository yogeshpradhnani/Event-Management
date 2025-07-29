import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState({});
  const [bookedTickets, setBookedTickets] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:3001/events/upcoming/list', {
        withCredentials: true,
      });
      setEvents(res.data);

      const ticketRes = await axios.get('http://localhost:3001/events/', {
        withCredentials: true,
      });

      const ticketMap = {};
      ticketRes.data.forEach(ticket => {
        ticketMap[ticket.event_id] = ticket;
      });

      setBookedTickets(ticketMap);
    } catch (err) {
      console.error('Error fetching events or tickets:', err);
    }
  };

  const handleBook = async (eventId, ticketType) => {
    if (!ticketType) {
      alert('Please select a ticket type before booking.');
      return;
    }

    try {
      setMessage('');
      setError('');
      const res = await axios.post(
        `http://localhost:3001/events/${eventId}/register`,
        { ticket_type: ticketType },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      await fetchEvents(); // refresh bookings
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed.');
    }
  };

  const downloadTicket = (ticket) => {
    const content = `
🎫 Ticket Confirmation
----------------------
Ticket ID: ${ticket.ticketId}
Event: ${ticket.eventTitle}
Date: ${new Date(ticket.date).toLocaleString()}
Location: ${ticket.location}
Type: ${ticket.ticket_type}
Price: ₹${ticket.price}
Attendee: ${ticket.userName}
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${ticket.eventTitle.replace(/\s+/g, '_')}_Ticket.txt`;
    link.click();
  };

  const openTicketModal = (ticket) => {
    setActiveTicket(ticket);
    setShowModal(true);
  };

  return (
    <Container className="my-4">
      <h3 className="mb-4">🎉 Upcoming Events</h3>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}

      {events.length === 0 ? (
        <p>No upcoming events available.</p>
      ) : (
        events.map((event) => {
          const isBooked = bookedTickets[event._id];

          return (
            <Card key={event._id} className="mb-4 shadow-sm">
              <Row className="g-0">
                <Col md={8} className="p-3">
                  <Card.Body>
                    <Card.Title>{event.title}</Card.Title>
                    <Card.Text>
                      📅 <strong>Date:</strong> {new Date(event.date_time).toLocaleString()}
                      <br />
                      📍 <strong>Location:</strong> {event.location}
                      <br />
                      👥 <strong>Capacity:</strong> {event.capacity}
                    </Card.Text>
                  </Card.Body>
                </Col>

                <Col md={4} className="d-flex flex-column align-items-center justify-content-center bg-light py-3">
                  {isAdmin ? (
                    <p className="text-muted">Admin cannot book tickets</p>
                  ) : isBooked ? (
                    <>
                      <p className="text-success mb-2">✔ Already Booked</p>
                      <Button variant="info" onClick={() => openTicketModal(isBooked)}>
                        View Ticket
                      </Button>
                    </>
                  ) : (
                    <>
                      <Form.Select
                        className="mb-2"
                        value={selectedTicketType[event._id] || ''}
                        onChange={(e) =>
                          setSelectedTicketType({
                            ...selectedTicketType,
                            [event._id]: e.target.value,
                          })
                        }
                      >
                        <option value="">-- Select Ticket Type --</option>
                        {event.ticket_options.map((opt) => (
                          <option key={opt.type} value={opt.type}>
                            {opt.type} – ₹{opt.price} ({opt.capacity} left)
                          </option>
                        ))}
                      </Form.Select>

                      <Button
                        variant="primary"
                        onClick={() => handleBook(event._id, selectedTicketType[event._id])}
                        disabled={!selectedTicketType[event._id]}
                      >
                        Book
                      </Button>
                    </>
                  )}
                </Col>
              </Row>
            </Card>
          );
        })
      )}

      {/* Modal for Ticket Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🎟️ Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeTicket && (
            <>
              <p><strong>Ticket ID:</strong> {activeTicket.ticketId}</p>
              <p><strong>Event:</strong> {activeTicket.eventTitle}</p>
              <p><strong>Type:</strong> {activeTicket.ticket_type}</p>
              <p><strong>Price:</strong> ₹{activeTicket.price}</p>
              <p><strong>Date:</strong> {new Date(activeTicket.date).toLocaleString()}</p>
              <p><strong>Location:</strong> {activeTicket.location}</p>
              <p><strong>Attendee:</strong> {activeTicket.userName}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => {
              downloadTicket(activeTicket);
              setShowModal(false);
            }}
          >
            Download Ticket
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

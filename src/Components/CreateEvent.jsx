// CreateEvent.jsx
import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';
import axios from 'axios';
import {
  PlusCircle,
  Trash,
  Ticket,
  CalendarEvent,
} from 'react-bootstrap-icons';
import { motion, AnimatePresence } from 'framer-motion';

const TICKET_TYPES = ['free', 'General', 'VIP'];

export default function CreateEvent({ user }) {
  const [eventData, setEventData] = useState({
    title: '',
    date_time: '',
    location: '',
    ticket_options: [],
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const addTicketOption = () => {
    setEventData((prev) => ({
      ...prev,
      ticket_options: [...prev.ticket_options, { type: '', price: 0, capacity: 1 }],
    }));
  };

  const removeTicketOption = (index) => {
    const updated = [...eventData.ticket_options];
    updated.splice(index, 1);
    setEventData({ ...eventData, ticket_options: updated });
  };

  const updateTicketOption = (index, field, value) => {
    const updated = [...eventData.ticket_options];
    updated[index][field] =
      field === 'price' || field === 'capacity' ? Number(value) : value;
    setEventData({ ...eventData, ticket_options: updated });
  };

  const usedTypes = eventData.ticket_options.map((t) => t.type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:3001/events/',
        eventData,
        { withCredentials: true }
      );
      setMessage(`✅ Event created! ID: ${res.data.eventId}`);
      setEventData({ title: '', date_time: '', location: '', ticket_options: [] });
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Event creation failed.';
      setError(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

//   if (!user || user.role !== 'admin') {
//     return (
//       <Container className="my-5">
//         <Alert variant="danger" className="text-center">
//           ⛔ Access Denied: Admins Only
//         </Alert>
//       </Container>
//     );
//   }

  return (
    <Container className="my-5">
      <Row className="justify-content-center mb-4">
        <Col md={10} lg={8} className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline-primary"
              className="px-4 py-2 rounded-pill shadow-sm"
              onClick={() => setShowForm(!showForm)}
            >
              <PlusCircle className="me-2 mb-1" />
              {showForm ? 'Hide Event Form' : 'Create New Event'}
            </Button>
          </motion.div>
        </Col>
      </Row>

      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <Row className="justify-content-center">
              <Col md={10} lg={8}>
                <Card className="p-4 shadow border-0 rounded-4 bg-light">
                  <Card.Body>
                    <h4 className="text-primary fw-bold text-center mb-4">
                      <CalendarEvent className="me-2" /> Create New Event
                    </h4>

                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Event Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={eventData.title}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Date & Time</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="date_time"
                          value={eventData.date_time}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={eventData.location}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <hr />
                      <h5 className="text-secondary fw-semibold mb-3">
                        <Ticket className="me-2" /> Ticket Types
                      </h5>

                      {eventData.ticket_options.map((ticket, index) => (
                        <Row className="align-items-end mb-3" key={index}>
                          <Col md={4}>
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                              value={ticket.type}
                              onChange={(e) =>
                                updateTicketOption(index, 'type', e.target.value)
                              }
                              required
                            >
                              <option value="">Select</option>
                              {TICKET_TYPES.filter(
                                (type) => !usedTypes.includes(type) || type === ticket.type
                              ).map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </Form.Select>
                          </Col>
                          <Col md={3}>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                              type="number"
                              value={ticket.price}
                              min={0}
                              onChange={(e) =>
                                updateTicketOption(index, 'price', e.target.value)
                              }
                              disabled={ticket.type === 'free'}
                              required={ticket.type !== 'free'}
                            />
                          </Col>
                          <Col md={3}>
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                              type="number"
                              value={ticket.capacity}
                              min={1}
                              max={1000}
                              onChange={(e) =>
                                updateTicketOption(index, 'capacity', e.target.value)
                              }
                              required
                            />
                          </Col>
                          <Col md={2} className="text-end">
                            <Button
                              variant="danger"
                              onClick={() => removeTicketOption(index)}
                            >
                              <Trash />
                            </Button>
                          </Col>
                        </Row>
                      ))}

                      <div className="text-center mb-3">
                        <Button
                          variant="secondary"
                          onClick={addTicketOption}
                          disabled={usedTypes.length >= 3}
                        >
                          + Add Ticket Type
                        </Button>
                      </div>

                      <div className="text-center">
                        <Button type="submit" variant="primary" disabled={loading}>
                          {loading ? 'Creating...' : 'Create Event'}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
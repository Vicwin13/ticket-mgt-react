import './TicketManagement.css';

import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import api from '../api/axios';
import { toast } from 'react-toastify';

const TicketManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ticketToDelete, setTicketToDelete] = useState(null);
  
  // Form data
  const [ticketForm, setTicketForm] = useState({
    id: '',
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
  });

  // Form validation errors
  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
    };

    let isValid = true;

    if (!ticketForm.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (ticketForm.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
      isValid = false;
    }

    if (!ticketForm.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (ticketForm.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setTicketForm({
      id: '',
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
    });
    setErrors({
      title: '',
      description: '',
    });
    setShowModal(true);
  };

  const openEditModal = (ticket) => {
    setIsEditMode(true);
    setTicketForm({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority || 'medium',
    });
    setErrors({
      title: '',
      description: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setErrors({
      title: '',
      description: '',
    });
  };

  const saveTicket = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const ticketData = {
        title: ticketForm.title.trim(),
        description: ticketForm.description.trim(),
        status: ticketForm.status,
        priority: ticketForm.priority,
      };

      if (isEditMode) {
        // Update existing ticket
        await api.put(`/tickets/${ticketForm.id}`, ticketData);
        toast.success('Ticket updated successfully');
      } else {
        // Create new ticket
        const userId = localStorage.getItem('user_id');
        const newTicket = {
          ...ticketData,
          id: Date.now().toString(),
          userId: parseInt(userId),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await api.post('/tickets', newTicket);
        toast.success('Ticket created successfully');
      }

      await fetchTickets();
      closeModal();
    } catch (error) {
      console.error('Error saving ticket:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} ticket`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTicket = (ticket) => {
    setTicketToDelete(ticket);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTicketToDelete(null);
  };

  const confirmDelete = async () => {
    if (!ticketToDelete) return;

    try {
      await api.delete(`/tickets/${ticketToDelete.id}`);
      toast.success('Ticket deleted successfully');
      await fetchTickets();
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket');
    }
  };

  const truncateDescription = (description) => {
    if (!description) return '';
    return description.length > 50 ? description.substring(0, 50) + '...' : description;
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatStatus = (status) => {
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Computed properties
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query),
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [tickets, statusFilter, searchQuery]);

  const highlightedTicketId = useMemo(() => {
    return new URLSearchParams(location.search).get('highlight') || null;
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="ticket-management">
      <div className="header">
        <div className="header-left">
          <button className="back-btn" onClick={goToDashboard}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Dashboard
          </button>
          <div className="header-text">
            <h1>Ticket Management</h1>
            <p>Manage and track all your tickets in one place</p>
          </div>
        </div>
      </div>

      <div className="ticket-actions">
        <button className="btn-primary" onClick={openCreateModal}>Create New Ticket</button>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search tickets..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="tickets-container">
        <div className="ticket-list">
          {filteredTickets.length === 0 ? (
            <div className="no-tickets">
              <p>No tickets found</p>
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                className={`ticket-item ${ticket.id === highlightedTicketId ? 'highlighted' : ''}`}
              >
                <div className="ticket-header">
                  <h3>{ticket.title}</h3>
                  <div className="ticket-badges">
                    <span className={`status ${ticket.status}`}>{formatStatus(ticket.status)}</span>
                    <span className={`priority ${ticket.priority}`}>{formatPriority(ticket.priority)}</span>
                  </div>
                </div>
                <p className="ticket-description">{truncateDescription(ticket.description)}</p>
                <div className="ticket-footer">
                  <span className="ticket-date">{formatDate(ticket.createdAt)}</span>
                  <div className="ticket-edit">
                    <button className="btn-edit" onClick={() => openEditModal(ticket)}>Update</button>
                    <button className="btn-delete" onClick={() => deleteTicket(ticket)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit Ticket' : 'Create New Ticket'}</h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveTicket(); }} className="ticket-form">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={ticketForm.title}
                  onChange={handleInputChange}
                  required
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={ticketForm.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className={errors.description ? 'error' : ''}
                ></textarea>
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select id="status" name="status" value={ticketForm.status} onChange={handleInputChange}>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select id="priority" name="priority" value={ticketForm.priority} onChange={handleInputChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-save" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-btn" onClick={closeDeleteModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this ticket?</p>
              <p className="ticket-to-delete">{ticketToDelete?.title}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={closeDeleteModal}>Cancel</button>
              <button type="button" className="btn-delete-confirm" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TicketManagement;
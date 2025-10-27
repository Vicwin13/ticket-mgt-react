import './Dashboard.css';

import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import TicketCard from './TicketCard';
import api from '../api/axios';

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState('User');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const currentDate = () => {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return now.toLocaleDateString('en-US', options);
  };

  const ticketStats = () => {
    const stats = {
      total: tickets.length,
      open: 0,
      inProgress: 0,
      closed: 0,
    };

    tickets.forEach((ticket) => {
      switch (ticket.status) {
        case 'open':
          stats.open++;
          break;
        case 'in-progress':
          stats.inProgress++;
          break;
        case 'closed':
          stats.closed++;
          break;
      }
    });

    return stats;
  };

  const recentTickets = () => {
    return tickets
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const fetchTickets = async () => {
    try {
      const response = await api.get('/api/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const goToTicket = (ticketId) => {
    navigate(`/tickets?highlight=${ticketId}`);
  };

  const truncateDescription = (description) => {
    if (!description) return '';
    return description.length > 50 ? description.substring(0, 50) + '...' : description;
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

  const formatDate = (dateString) => {
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    // Get user information
    const userId = localStorage.getItem('user_id');
    if (userId) {
      try {
        // In a real app, you would fetch user data from an API
        // For now, we'll use a mock implementation
        const fetchUserData = async () => {
          try {
            const response = await api.get('/api/users');
            const users = response.data;
            const user = users.find((u) => u.id === userId);
            if (user && (user.firstName || user.name)) {
              // Use first name with capital letter
              const name = user.firstName || user.name;
              setUserName(name.charAt(0).toUpperCase() + name.slice(1));
            } else {
              // Fallback to email username if firstName is not available
              setUserName(user ? user.email.split('@')[0] : 'User');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback to stored user name or default
            const storedName = localStorage.getItem('user_name');
            if (storedName) {
              const firstName = storedName.split(' ')[0];
              setUserName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
            } else {
              setUserName('User');
            }
          }
        };
        
        fetchUserData();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    // Fetch tickets for dashboard
    const fetchData = async () => {
      await fetchTickets();
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const stats = ticketStats();
  const recent = recentTickets();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="dashboard">
      <aside className={`side ${isCollapsed ? 'collapsed' : ''}`}>
        <button onClick={toggleSidebar} className="toggle-btn">
          {isCollapsed ? '→' : '←'}
        </button>
        {!isCollapsed && (
          <div className="sidebar-content">
            <h3>Navigation</h3>
            <nav className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/dashboard" className="nav-link active">Dashboard</Link>
              <Link to="/tickets" className="nav-link">Ticket Management</Link>
            </nav>
            <button onClick={logout} className="logout">Logout</button>
          </div>
        )}
      </aside>
      <div className={`bigger-side ${isCollapsed ? 'expanded' : ''}`}>
        <section className="head">
          <div>
            <h1>Welcome, {userName}</h1>
            <p>{currentDate()}</p>
          </div>
          <div className="total-tickets">
            <h3>Total Tickets</h3>
            <p className="total-count">{stats.total}</p>
          </div>
        </section>
        <section className="cards">
          <TicketCard title="Open Tickets" content={stats.open.toString()} image="open.svg" />
          <TicketCard title="In Progress" content={stats.inProgress.toString()} image="ticket.svg" />
          <TicketCard title="Closed Tickets" content={stats.closed.toString()} image="tick.svg" />
        </section>

        {/* Recent Tickets Section */}
        <section className="recent-tickets">
          <h2>Recent Tickets</h2>
          <div className="tickets-list">
            {recent.map((ticket) => (
              <div
                key={ticket.id}
                className="ticket-item"
                onClick={() => goToTicket(ticket.id)}
              >
                <div className="ticket-info">
                  <h4>{ticket.title}</h4>
                  <p>{truncateDescription(ticket.description)}</p>
                  <div className="ticket-meta">
                    <span className={`status ${ticket.status}`}>{formatStatus(ticket.status)}</span>
                    <span className={`priority ${ticket.priority}`}>{formatPriority(ticket.priority)}</span>
                    <span className="ticket-date">{formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
                <div className="ticket-arrow">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          {recent.length === 0 && (
            <div className="no-tickets">
              <p>No recent tickets found</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
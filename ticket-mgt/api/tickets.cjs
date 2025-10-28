/* eslint-disable */
// Initial data from db.json
let db = {
  tickets: [
    {
      "id": "2",
      "title": "Password Reset",
      "description": "Need to reset password for user account",
      "status": "in-progress",
      "priority": "medium",
      "userId": 3,
      "createdAt": "2024-01-14T14:20:00Z"
    }
  ]
};

// In a production environment, we would use a proper database
// For this demo, we'll use in-memory storage
// Note: Data will reset when the function cold starts

// Helper function to find item by id
function findById(collection, id) {
  return collection.find(item => item.id === id);
}

// Helper function to find index by id
function findIndexById(collection, id) {
  return collection.findIndex(item => item.id === id);
}

// Helper function to generate new ID
function generateId(collection) {
  if (collection.length === 0) return '1';
  const maxId = Math.max(...collection.map(item => parseInt(item.id)));
  return (maxId + 1).toString();
}

function handler(req, res) {
  const { method, query } = req;
  const { id, userId } = query;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Handle preflight OPTIONS request
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let response;
    let statusCode = 200;

    switch (method) {
      case 'GET':
        if (id) {
          const ticket = findById(db.tickets, id);
          response = ticket || { error: 'Ticket not found' };
          statusCode = ticket ? 200 : 404;
        } else {
          // Filter by userId if provided in query params
          if (userId) {
            response = db.tickets.filter(ticket => ticket.userId == userId);
          } else {
            response = db.tickets;
          }
        }
        break;

      case 'POST': {
        const newTicket = req.body;
        newTicket.id = generateId(db.tickets);
        newTicket.createdAt = new Date().toISOString();
        db.tickets.push(newTicket);
        response = newTicket;
        statusCode = 201;
        break;
      }

      case 'PUT': {
        if (id) {
          const index = findIndexById(db.tickets, id);
          if (index !== -1) {
            const updatedTicket = req.body;
            db.tickets[index] = { ...db.tickets[index], ...updatedTicket };
            response = db.tickets[index];
          } else {
            response = { error: 'Ticket not found' };
            statusCode = 404;
          }
        } else {
          response = { error: 'Ticket ID is required' };
          statusCode = 400;
        }
        break;
      }

      case 'DELETE': {
        if (id) {
          const index = findIndexById(db.tickets, id);
          if (index !== -1) {
            db.tickets.splice(index, 1);
            response = { success: true };
          } else {
            response = { error: 'Ticket not found' };
            statusCode = 404;
          }
        } else {
          response = { error: 'Ticket ID is required' };
          statusCode = 400;
        }
        
        module.exports = handler;
        break;
      }

      default:
        response = { error: 'Method not allowed' };
        statusCode = 405;
    }

    return res.status(statusCode).json(response);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
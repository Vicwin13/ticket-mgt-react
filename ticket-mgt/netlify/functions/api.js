// Initial data from db.json
let db = {
  users: [
    {
      "id": "1",
      "email": "admin@ticketmgt.com",
      "password": "admin123",
      "name": "Admin User",
      "role": "admin"
    },
    {
      "id": "2",
      "email": "user@ticketmgt.com",
      "password": "user123",
      "name": "Regular User",
      "role": "user"
    },
    {
      "id": "3",
      "email": "demo@ticketmgt.com",
      "password": "demo123",
      "name": "Demo User",
      "role": "user"
    }
  ],
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

export const handler = async function(event) {
  const { httpMethod, path, body, queryStringParameters } = event;
  
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Parse the path to determine the resource
    // Handle both direct function calls and redirected API calls
    let pathParts;
    if (path.startsWith('/.netlify/functions/api')) {
      pathParts = path.replace('/.netlify/functions/api', '').split('/').filter(p => p);
    } else if (path.startsWith('/api')) {
      pathParts = path.replace('/api', '').split('/').filter(p => p);
    } else {
      pathParts = path.split('/').filter(p => p);
    }
    
    const resource = pathParts[0];
    const id = pathParts[1];

    let response;
    let statusCode = 200;

    switch (resource) {
      case 'users':
        if (httpMethod === 'GET') {
          if (id) {
            const user = findById(db.users, id);
            response = user || { error: 'User not found' };
            statusCode = user ? 200 : 404;
          } else {
            response = db.users;
          }
        } else if (httpMethod === 'POST') {
          const newUser = JSON.parse(body);
          newUser.id = generateId(db.users);
          db.users.push(newUser);
          response = newUser;
          statusCode = 201;
        } else if (httpMethod === 'PUT') {
          if (id) {
            const index = findIndexById(db.users, id);
            if (index !== -1) {
              const updatedUser = JSON.parse(body);
              db.users[index] = { ...db.users[index], ...updatedUser };
              response = db.users[index];
            } else {
              response = { error: 'User not found' };
              statusCode = 404;
            }
          } else {
            response = { error: 'User ID is required' };
            statusCode = 400;
          }
        } else if (httpMethod === 'DELETE') {
          if (id) {
            const index = findIndexById(db.users, id);
            if (index !== -1) {
              db.users.splice(index, 1);
              response = { success: true };
            } else {
              response = { error: 'User not found' };
              statusCode = 404;
            }
          } else {
            response = { error: 'User ID is required' };
            statusCode = 400;
          }
        }
        break;

      case 'tickets':
        if (httpMethod === 'GET') {
          if (id) {
            const ticket = findById(db.tickets, id);
            response = ticket || { error: 'Ticket not found' };
            statusCode = ticket ? 200 : 404;
          } else {
            // Filter by userId if provided in query params
            if (queryStringParameters && queryStringParameters.userId) {
              const userId = queryStringParameters.userId;
              response = db.tickets.filter(ticket => ticket.userId == userId);
            } else {
              response = db.tickets;
            }
          }
        } else if (httpMethod === 'POST') {
          const newTicket = JSON.parse(body);
          newTicket.id = generateId(db.tickets);
          newTicket.createdAt = new Date().toISOString();
          db.tickets.push(newTicket);
          response = newTicket;
          statusCode = 201;
        } else if (httpMethod === 'PUT') {
          if (id) {
            const index = findIndexById(db.tickets, id);
            if (index !== -1) {
              const updatedTicket = JSON.parse(body);
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
        } else if (httpMethod === 'DELETE') {
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
        }
        break;

      default:
        response = { error: 'Resource not found' };
        statusCode = 404;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
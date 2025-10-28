/* eslint-disable */
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
  const { id } = query;

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
          const user = findById(db.users, id);
          response = user || { error: 'User not found' };
          statusCode = user ? 200 : 404;
        } else {
          response = db.users;
        }
        break;

      case 'POST': {
        const newUser = req.body;
        newUser.id = generateId(db.users);
        db.users.push(newUser);
        response = newUser;
        statusCode = 201;
        break;
      }

      case 'PUT': {
        if (id) {
          const index = findIndexById(db.users, id);
          if (index !== -1) {
            const updatedUser = req.body;
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
        break;
      }

      case 'DELETE': {
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

module.exports = handler;
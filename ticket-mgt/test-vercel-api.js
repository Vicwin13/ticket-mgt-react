// Test script for Vercel API endpoints
// This can be run in the browser console on your local development server

const testVercelAPI = async () => {
  console.log('Testing Vercel API endpoints...');
  
  try {
    // Test GET /api/users
    console.log('Testing GET /api/users...');
    const usersResponse = await fetch('/api/users');
    const users = await usersResponse.json();
    console.log('Users:', users);
    
    // Test GET /api/tickets
    console.log('Testing GET /api/tickets...');
    const ticketsResponse = await fetch('/api/tickets');
    const tickets = await ticketsResponse.json();
    console.log('Tickets:', tickets);
    
    // Test POST /api/tickets
    console.log('Testing POST /api/tickets...');
    const newTicket = {
      title: 'Vercel Test Ticket',
      description: 'This is a test ticket created via Vercel API test',
      status: 'open',
      priority: 'medium',
      userId: '1'
    };
    
    const createResponse = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTicket)
    });
    
    if (createResponse.ok) {
      const createdTicket = await createResponse.json();
      console.log('Created ticket:', createdTicket);
      
      // Test DELETE /api/tickets/:id
      console.log('Testing DELETE /api/tickets/:id...');
      const deleteResponse = await fetch(`/api/tickets/${createdTicket.id}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        console.log('Ticket deleted successfully');
      } else {
        console.error('Failed to delete ticket');
      }
    } else {
      console.error('Failed to create ticket');
    }
    
    console.log('Vercel API tests completed successfully!');
  } catch (error) {
    console.error('Vercel API test failed:', error);
  }
};

// Export the test function
window.testVercelAPI = testVercelAPI;
console.log('Vercel API test function loaded. Run testVercelAPI() in the console to test.');
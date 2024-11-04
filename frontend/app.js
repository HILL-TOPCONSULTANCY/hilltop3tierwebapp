// Set the API endpoint URL (replace with your backend endpoint if different)
const apiUrl = 'http://localhost:8080/api';  // Replace with actual backend URL if needed

// Form submission event handler
document.getElementById('clientForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const service = document.getElementById('service').value;

  try {
    // Send data to the backend
    const response = await fetch(`${apiUrl}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, service })
    });
    
    if (response.ok) {
      // Clear the form
      document.getElementById('clientForm').reset();
      // Refresh client data
      fetchClientData();
    } else {
      console.error('Failed to submit data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Function to fetch and display client data in real-time
async function fetchClientData() {
  try {
    const response = await fetch(`${apiUrl}/fetch`);
    if (response.ok) {
      const data = await response.json();
      const clientDataDiv = document.getElementById('clientData');
      clientDataDiv.innerHTML = '';  // Clear current data

      // Display each client entry
      data.forEach((client) => {
        const clientDiv = document.createElement('div');
        clientDiv.classList.add('client-item');
        clientDiv.innerHTML = `
          <p><strong>Name:</strong> ${client.name}</p>
          <p><strong>Email:</strong> ${client.email}</p>
          <p><strong>Service Required:</strong> ${client.service}</p>
          <p><strong>Submitted at:</strong> ${new Date(client.timestamp).toLocaleString()}</p>
        `;
        clientDataDiv.appendChild(clientDiv);
      });
    } else {
      console.error('Failed to fetch client data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Initial data fetch on page load
fetchClientData();

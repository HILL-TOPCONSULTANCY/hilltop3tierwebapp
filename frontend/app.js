// Set API endpoint URL
const apiUrl = process.env.BACKEND_URL || 'http://localhost:8080/api';

// Function to handle form submission
document.getElementById('clientForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const service = document.getElementById('service').value;

  // Submit data to the backend
  try {
    const response = await fetch(`${apiUrl}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, service })
    });

    if (response.ok) {
      document.getElementById('clientForm').reset();
      fetchClientData(); // Refresh data display
    } else {
      console.error('Failed to submit data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Function to fetch and display submitted client data
async function fetchClientData() {
  try {
    const response = await fetch(`${apiUrl}/fetch`);
    if (response.ok) {
      const data = await response.json();
      const clientDataDiv = document.getElementById('clientData');
      clientDataDiv.innerHTML = '';  // Clear current display

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

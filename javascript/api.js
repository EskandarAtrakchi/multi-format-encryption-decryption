// api.js
function fetchSessionStatus() {
    return fetch('/api/session-status')
      .then(response => response.json())
      .then(data => {
        console.log(data.isAuthenticated);
        return data;
      })
      .catch(error => console.error('Error:', error));
  }
  
  function logout() {
    return fetch('/logout', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        return data;
      })
      .catch(error => console.error('Error:', error));
  }
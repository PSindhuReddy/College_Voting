// Initialize the simulated database in localStorage
if (!localStorage.getItem('users')) {
  localStorage.setItem(
    'users',
    JSON.stringify([{ username: 'admin', password: 'admin123', role: 'admin' }]) // Predefined admin
  );
}
if (!localStorage.getItem('votes')) {
  localStorage.setItem('votes', JSON.stringify({})); // Empty votes object
}
if (!localStorage.getItem('votedUsers')) {
  localStorage.setItem('votedUsers', JSON.stringify([])); // Tracks users who have voted
}

let loggedInUser = null;

// Event listeners for login and register
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('register-btn').addEventListener('click', register);

function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
      alert('Username already exists. Please log in.');
    } else {
      const user = { username, password, role: 'voter' }; // Default role is 'voter'
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful! Please log in.');
      // Clear input fields
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
    }
  } else {
    alert('Please fill in both fields!');
  }
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem('users'));
  loggedInUser = users.find(user => user.username === username && user.password === password);

  if (loggedInUser) {
    alert(`Welcome, ${loggedInUser.username}!`);
    updateUI();
  } else {
    alert('Invalid credentials!');
  }
}

function updateUI() {
  // Hide login section
  document.getElementById('login-section').classList.add('hidden');

  if (loggedInUser.role === 'admin') {
    // Show admin panel
    document.getElementById('admin-section').classList.remove('hidden');

    // Initialize results display
    refreshResults();

    // Add event listeners for admin actions
    document.getElementById('refresh-results-btn').addEventListener('click', refreshResults);
    document.getElementById('reset-results-btn').addEventListener('click', resetResults);
  } else if (loggedInUser.role === 'voter') {
    // Check if the voter has already voted
    const votedUsers = JSON.parse(localStorage.getItem('votedUsers'));
    if (votedUsers.includes(loggedInUser.username)) {
      document.getElementById('voting-section').innerHTML = `
        <h2>Voting Panel</h2>
        <p>You have already voted. Thank you for participating!</p>
      `;
    } else {
      // Show candidates list for first-time voters
      document.getElementById('voting-message').innerText = "Select a candidate to vote for:";
      document.getElementById('candidates-list').innerHTML = `
        <li><button id="vote-candidate-1">Candidate 1</button></li>
        <li><button id="vote-candidate-2">Candidate 2</button></li>
        <li><button id="vote-candidate-3">Candidate 3</button></li>
      `;
      document.getElementById('candidates-list').classList.remove('hidden');

      // Add event listeners for voting buttons
      document.getElementById('vote-candidate-1').addEventListener('click', () => vote('Candidate 1'));
      document.getElementById('vote-candidate-2').addEventListener('click', () => vote('Candidate 2'));
      document.getElementById('vote-candidate-3').addEventListener('click', () => vote('Candidate 3'));
    }

    // Show the voting section
    document.getElementById('voting-section').classList.remove('hidden');
  }
}

function vote(candidate) {
  const votes = JSON.parse(localStorage.getItem('votes')) || {};

  // Increment the vote count for the selected candidate
  if (votes[candidate]) {
    votes[candidate]++;
  } else {
    votes[candidate] = 1;
  }

  // Add user to votedUsers list to track that they have voted
  const votedUsers = JSON.parse(localStorage.getItem('votedUsers')) || [];
  votedUsers.push(loggedInUser.username);
  localStorage.setItem('votedUsers', JSON.stringify(votedUsers));

  // Save votes back to localStorage
  localStorage.setItem('votes', JSON.stringify(votes));

  alert(`Thank you for voting!`);
  exitVotingPanel();
}

function exitVotingPanel() {
  // Clear the logged-in user session and reload the page
  loggedInUser = null;
  location.reload(); // Refreshes the page
}

function refreshResults() {
  const votes = JSON.parse(localStorage.getItem('votes')) || {};
  const resultsDisplay = Object.entries(votes)
    .map(([candidate, count]) => `${candidate}: ${count} votes`)
    .join('\n');

  document.getElementById('results').innerText = resultsDisplay || 'Results: No votes yet.';
}

function resetResults() {
  // Clear votes and voted users from localStorage
  localStorage.setItem('votes', JSON.stringify({})); // Reset votes to an empty object
  localStorage.setItem('votedUsers', JSON.stringify([])); // Reset voted users to an empty list

  // Update the admin results display
  document.getElementById('results').innerText = 'Results have been reset.';
  alert('All voting results have been cleared!');
}
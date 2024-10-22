document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
        // Automatically log in after successful sign up
        handleLogin(username, password);
    }
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    await handleLogin(username, password);
});

async function handleLogin(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Login successful! Token: ' + data.token);
        // Store the token in localStorage or sessionStorage
        localStorage.setItem('token', data.token);
        // Hide the auth forms and show the voting page
        document.getElementById('authForms').style.display = 'none';
        document.getElementById('votingPage').style.display = 'block';
    } else {
        alert(data.message);
    }
}

// Handle Logout
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token'); // Clear the token on logout
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('votingPage').style.display = 'none';
});


// app.js
document.getElementById('voteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const candidate = document.getElementById('candidate').value;
    const messageDiv = document.getElementById('message');

    fetch('/api/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ candidate })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageDiv.textContent = "Thank you! Your vote has been submitted.";
        } else {
            messageDiv.textContent = "Error: " + data.message;
        }
    })
    .catch(error => {
        messageDiv.textContent = "An error occurred while submitting your vote.";
    });
});

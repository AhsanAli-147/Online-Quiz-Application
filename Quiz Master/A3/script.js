<script>
// 1. Function to initialize the application
function initApp() {
    // Set default page if no hash is present
    if (!window.location.hash) {
        window.location.hash = "register";
    }
    
    // Load any saved users from localStorage
    loadUsers();
    
    // Set up event listeners
    setupEventListeners();
}

// 2. Function to load saved users from localStorage
function loadUsers() {
    const savedUsers = localStorage.getItem('quizMasterUsers');
    if (!savedUsers) {
        localStorage.setItem('quizMasterUsers', JSON.stringify([]));
    }
}

// 3. Function to setup all event listeners
function setupEventListeners() {
    // Registration form submission
    document.querySelector('#register form')?.addEventListener('submit', handleRegistration);
    
    // Login form submission
    document.querySelector('#login form')?.addEventListener('submit', handleLogin);
    
    // Quiz form submission
    document.querySelector('#quiz-form')?.addEventListener('submit', handleQuizSubmission);
    
    // Contact form submission
    document.querySelector('#contact form')?.addEventListener('submit', handleContactSubmission);
}

// 4. Function to handle user registration
function handleRegistration(e) {
    e.preventDefault();
    
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate inputs
    if (!validateRegistration(username, email, password, confirmPassword)) {
        return;
    }
    
    // Register the user
    registerUser(username, email, password);
    
    // Redirect to login page
    window.location.hash = "login";
    alert('Registration successful! Please login.');
}

// 5. Function to validate registration inputs
function validateRegistration(username, email, password, confirmPassword) {
    if (username.length < 4) {
        alert('Username must be at least 4 characters long');
        return false;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return false;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
    
    // Check if username or email already exists
    const users = JSON.parse(localStorage.getItem('quizMasterUsers'));
    if (users.some(user => user.username === username)) {
        alert('Username already taken');
        return false;
    }
    
    if (users.some(user => user.email === email)) {
        alert('Email already registered');
        return false;
    }
    
    return true;
}

// 6. Function to register a new user
function registerUser(username, email, password) {
    const users = JSON.parse(localStorage.getItem('quizMasterUsers'));
    const newUser = {
        username,
        email,
        password, // Note: In a real app, you should hash the password
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('quizMasterUsers', JSON.stringify(users));
}

// 7. Function to handle user login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('quizMasterUsers'));
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store current user in session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        window.location.hash = "home";
        alert(Welcome back, ${username}!);
    } else {
        alert('Invalid username or password');
    }
}

// 8. Function to handle quiz submission
function handleQuizSubmission(e) {
    e.preventDefault();
    
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to take the quiz');
        window.location.hash = "login";
        return;
    }
    
    // Calculate score
    const score = calculateScore();
    
    // Save results
    saveQuizResults(currentUser.username, score);
    
    // Display results
    displayResults(score);
    
    // Navigate to results page
    window.location.hash = "results";
}

// 9. Function to calculate quiz score
function calculateScore() {
    const correctAnswers = {
        q1: 'a', // Paris
        q2: 'b', // Mars
        q3: 'b', // Blue Whale
        q4: 'c', // CSS
        q5: 'b'  // 7 continents
    };
    
    let score = 0;
    
    for (let i = 1; i <= 5; i++) {
        const questionName = q${i};
        const selectedOption = document.querySelector(input[name="${questionName}"]:checked);
        
        if (selectedOption && selectedOption.value === correctAnswers[questionName]) {
            score++;
        }
    }
    
    return score;
}

// 10. Function to display quiz results
function displayResults(score) {
    const percentage = (score / 5) * 100;
    const resultsSection = document.getElementById('results');
    
    // Update percentage
    resultsSection.querySelector('.text-4xl').textContent = ${percentage}%;
    
    // Update score text
    resultsSection.querySelector('p.mb-6').textContent = 
        You answered ${score} out of 5 questions correctly!;
    
    // Update question review (simplified version)
    const reviewItems = resultsSection.querySelectorAll('p.mb-2');
    const correctAnswers = ['Paris', 'Mars', 'Blue Whale', 'CSS', '7'];
    
    reviewItems.forEach((item, index) => {
        const questionNum = index + 1;
        const userAnswer = document.querySelector(input[name="q${questionNum}"]:checked)?.value;
        const isCorrect = userAnswer === Object.values(correctAnswers)[index];
        
        if (isCorrect) {
            item.innerHTML = ${questionNum}. ${item.textContent.split('?')[0]}? <strong class="text-green-600">✓ Correct (${correctAnswers[index]})</strong>;
        } else {
            item.innerHTML = ${questionNum}. ${item.textContent.split('?')[0]}? <strong class="text-red-600">✗ Incorrect (Correct answer: ${correctAnswers[index]})</strong>;
        }
    });
}

// Function to save quiz results (additional helper function)
function saveQuizResults(username, score) {
    const quizResults = JSON.parse(localStorage.getItem('quizMasterResults') || '[]');
    const newResult = {
        username,
        score,
        date: new Date().toISOString()
    };
    
    quizResults.push(newResult);
    localStorage.setItem('quizMasterResults', JSON.stringify(quizResults));
}

// Function to handle contact form submission (additional helper function)
function handleContactSubmission(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    document.querySelector('#contact form').reset();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
</script>

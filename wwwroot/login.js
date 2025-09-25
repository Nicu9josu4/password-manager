// login.js
// Autentificare simplă pentru admin
document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (username === 'admin' && password === 'admin') {
        window.location.href = 'password_database.html';
    } else {
        alert('User sau parolă greșită!');
    }
});

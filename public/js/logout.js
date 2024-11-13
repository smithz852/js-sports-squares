console.log('logout.js loaded')

const logout = async (event) => {
  event.preventDefault();
  console.log('logout button pressed')
    const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/login');
  } else {
    alert(response.statusText);
  }
};

const logoutBtn = document.querySelector('#logoutBtn');
console.log(logoutBtn)
if(logoutBtn) {
  logoutBtn.addEventListener('click', logout);
} else {
  console.error('logout button not found')
}
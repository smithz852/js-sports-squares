console.log('profile.js loaded')

const profile = async (event) => {
    event.preventDefault()
    console.log('profile button clicked')
    const response = await fetch('/api/users/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    if (response.ok) {
        document.location.replace('/profile')
    } else {
        alert(response.statusText)
    }
}

const profileBtn = document.querySelector('#profileBtn')
console.log(profileBtn)
if(profileBtn){
    profileBtn.addEventListener('click', profile)
} else {
    console.error('profile button not found')
}
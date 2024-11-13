console.log('homepage.js loaded')

const footbalLink = async (event) => {
    event.preventDefault();
    console.log('football clicked')
    const response = await fetch('/api/users/game', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    if (response.ok) {
        document.location.replace('/game');
    } else {
        alert(response.statusText)
    }
}

const footballBtn = document.querySelector('#footballBtn')
console.log(footballBtn)
if(footballBtn){
    footballBtn.addEventListener('click', footbalLink)
} else {
    console.error('football button not found')
}
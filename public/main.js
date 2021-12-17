let nameInput = document.querySelector('#nameButton').addEventListener('click', getNameData)

// Database Functions

function getNameData(){
    const inputName = document.querySelector('#plantSearch').value
    let url = `/plants?common_name=${inputName}`
window.location.replace(url)
}

let nameInput = document.querySelector('#nameButton').addEventListener('click', getNameData)
let durationInput = document.querySelector('#durationButton').addEventListener('click', getDurationData)

function getNameData(){
    const inputVal = document.querySelector('#plantSearch').value
    let url = `/plants?common_name=${inputVal}`
window.location.replace(url)
}

function getDurationData(){
    const inputVal = document.querySelector('#plantSearch').value
    let url = `/plants?duration=${inputVal}`
window.location.replace(url)
}

//NavBar
function hideIconBar(){
    let iconBar = document.getElementById("iconBar");
    let navigation = document.getElementById("navigation");
    iconBar.setAttribute("style", "display:none;");
    navigation.classList.remove("hide");
}

function showIconBar(){
    let iconBar = document.getElementById("iconBar");
    let navigation = document.getElementById("navigation");
    iconBar.setAttribute("style", "display:block;");
    navigation.classList.add("hide");
}

//Comment
function showComment(){
    let commentArea = document.getElementById("comment-area");
    commentArea.classList.remove("hide");
}

//Reply
function showReply(){
    let replyArea = document.getElementById("reply-area");
    replyArea.classList.remove("hide");
}
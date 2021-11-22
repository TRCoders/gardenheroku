let dateInput = document.querySelector('#button').addEventListener('click', getPicData)

function getPicData(){
    const inputVal = document.querySelector('#plantSearch').value
    
    let url =`mongodb+srv://TRCoder:dbpassword@messagefromdownunder.xv6xa.mongodb.net/plantsdb?retryWrites=true&w=majority`
fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
    console.log(data)
    // document.querySelector("h2").innerText = data.collection.items[0].data[0].title
    // document.querySelector("span").innerText = data.collection.items[0].data[0].description
    // document.querySelector("img").src = data.collection.items[0].links[0].href
    })
    
    .catch(err => {
       console.log(`Error somthing went wrong.`) 
    })
}


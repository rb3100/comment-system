let username
let socket = io()

do {
    username=prompt('Enter name:')
}while(!username)

const textarea = document.querySelector('#textarea')

const submitBtn = document.querySelector('#submitBtn')

const commentBox =  document.querySelector('.comment__box')


submitBtn.addEventListener('click',(e)=>{
    e.preventDefault() //prevents default behaviour of button such as page refresh or add hash link
    
    let  comment = textarea.value //declared local variable to fetch value of textarea

    if(!comment){
        return  // if comment is empty then return nothing
    }

    postComment(comment) //else post comment. created new function
})


function postComment(comment){
   
    let data ={
        username: username, 
        comment: comment
    }
    appendToDom(data) //created variable, data is another object to store username and comments with time
    textarea.value='' //for getting the input box empty
    broadcastComment(data)
    syncWithDb(data)
}

function appendToDom(data){
let lTag=document.createElement('li')
lTag.classList.add('comment', 'mb-3')


let markup = `

<div class="card border-light mb-3">
                            <div class="card-body">
                                <h6>${data.username}</h6>
                                <p>${data.comment}</p>

                                <div>
                                    <small>${moment(data.time).format('LT')}</small>
                                </div>
                            </div>
                        </div>
`

lTag.innerHTML=markup
commentBox.prepend(lTag)
}

function   broadcastComment(data){

    socket.emit('comment', data) //sending event

}

socket.on('comment',(data)=>{
    appendToDom(data)
})
let timerId= null

function debounce(func,timer){


    if(timerId){
        clearTimeout(timerId)

    }
   timerId= setTimeout(()=>{

    },timer)

}

let typingDiv = document.querySelector('.typing')

socket.on('typing',(data)=>{ //receiving data
      
   typingDiv.innerText= `${data.username} is typing...`
   debounce(function() {
    typingDiv.innerText= ''
   }, 1000)

})
//typing....event listener

textarea.addEventListener('keyup',(e)=>{
socket.emit('typing',{username:username})
})


//APi calls

function syncWithDb(data) {

    const headers={
        'Content-Type': 'application/json'
    }
    fetch('/api/comments', {method:'Post', body:JSON.stringify(data), headers})
    .then(response=>response.json())
    .then(result=>{
        console.log(result)
    })

}
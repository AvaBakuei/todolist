let ul = document.querySelector('.todo-list');
let ID = 0;
let listItem = [];

if (localStorage.getItem('todolist')) {
    listItem = JSON.parse(localStorage.getItem('todolist'));
}

function addTodo()  {
    let input = document.getElementById('input');
    let inputValue =  input.value;
    let li = document.createElement('li');
    li.className = 'item';
    li.id = 'item-' + ID++;
    let content = document.createElement('div');
    content.className = 'text'
    content.textContent = inputValue;
    li.appendChild(content);
    if(inputValue.trim().length !== 0) {
        ul.append(li);

        // local storage
        listItem.push({text: inputValue});
        localStorage.setItem('todolist', JSON.stringify(listItem))
        console.log(listItem)
    }
    input.value = '';    

    // create 'Edit' span and append in li
    let editBtn = document.createElement('span');
    editBtn.className = 'edit fa fa-pencil-square-o';
    editBtn.id = 'edit-' + li.id;
    li.appendChild(editBtn);
    editBtn.onclick = editTodo;

    let editBox = document.createElement('div');
    editBox.className = 'edit-item';
    let editInput = document.createElement('input');
    let doneBtn = document.createElement('span');        
    doneBtn.className = 'done fa fa-check';

    function editTodo() {
        editInput.value = content.innerHTML;
        editBox.append(editInput);
        editBox.append(doneBtn);            
        li.append(editBox);
        editInput.onkeypress = editInputKeyPress;    
        doneBtn.onclick = doneEdit;
    }

    // create 'Done' span
    function doneEdit() {
        inputValue = editInput.value;
        content.innerHTML = inputValue;
        editBox.innerHTML = ''
    }

    function editInputKeyPress(event) {
        if(event.key === 'Enter' || event.keyCode === 13) {
            doneEdit();
        }
    }

    // create 'Remove' span and append in li
    let removeBtn = document.createElement('span');
    removeBtn.className = 'remove fa fa-trash-o';
    removeBtn.id = 'remove-' + li.id;
    li.appendChild(removeBtn);
    removeBtn.onclick = removeTodo;

    function removeTodo(btn) {
        let btnId = btn.target.id;
        let id = btnId.split('remove-')[1];
        let parent = document.getElementById(id);
        parent.remove();
    }

    // call API    
    let items = document.getElementsByClassName('item').length;
    if(items % 5 === 0) {
        input.disabled = true;

        let modal = document.getElementById("my-modal");
        let span = document.querySelector(".close");
        let video = document.getElementById('modal-video');
        span.onclick = closeModal;

        axios.get('https://cors-anywhere.herokuapp.com/https://api.aparat.com/fa/v1/video/video/mostViewedVideos')
        .then(response => {
            let data = response.data.data;
            let visitList = [];

            // get visit list
            data.filter(item => visitList.push(+item.attributes.visit_cnt))
            visitList.sort((a, b) => {
                return b - a;
            });

            // get most visit movie
            let mostVisit = visitList[0];
            let popularVideo = data.find(item => item.attributes.visit_cnt == mostVisit)
            video.src = popularVideo.attributes.preview_src;
        }).catch(e => {
            console.log(e)
        });     

        // show modal
        modal.style.display = "block";

        // hide modal
        function closeModal(){
            modal.style.display = "none";
            input.disabled = false;
        }
      
    }
   
}

function addInputKeyPress(event) {
    if(event.key === 'Enter' || event.keyCode === 13) {
        addTodo(); 
    }
}

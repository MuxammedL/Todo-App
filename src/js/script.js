const icon = document.querySelector('#icon');
const img_bg = document.querySelector('.img-bg');
const ul = document.querySelector('#task-list');
const addBtn = document.querySelector('.addBtn');
const clearBtn = document.querySelector('.clear');
const inputTask = document.querySelector('.input-task')
const todoList = document.querySelector('#todo-list');
const filters1 = document.querySelectorAll('.filters span')
const filters2 = document.querySelectorAll('.filter span')
let peddingTaskCount = document.querySelector('.pedding-text span');
let isEditTask = false;
let editId;

icon.addEventListener('click',()=>{
  document.body.classList.toggle('dark-theme');
  img_bg.classList.toggle('dark');
  if(img_bg.classList.contains('dark')){
    icon.setAttribute('src','./images/icon-sun.svg')
  }else{
    icon.setAttribute('src','./images/icon-moon.svg')
  }
})

let taskLists = []

if(localStorage.getItem("taskLists") != null){
  taskLists = JSON.parse(localStorage.getItem("taskLists"));
}

displayTasks('all');

function displayTasks(filter){
  let count=0;
  let leftItems=0;
  ul.innerHTML = '';
  taskLists.forEach(task =>{
    if(task.status==filter||filter=='all'){
      count++;
    }
    if(task.status=='active'){
      leftItems++;
    }
  })
  peddingTaskCount.innerHTML = `${leftItems} `;
  if(taskLists.length == 0||count==0){
    ul.innerHTML = `
          <li class="task">
            <div class="content">
              <label>Your task list is empty</label>
            </div>
          </li>
    
    `
  }else{
    taskLists.forEach(task=>{
      let status = task.status == 'completed'? "checked" : '';
      if(filter == task.status|| filter == 'all'){
        let li = `
                <li class="task">
                  <div class="content">
                    <div class="box">
                      <input onclick = "updateStatus(this)" type="checkbox" id="${task.id}" ${status}>
                    </div>
                    <label for="${task.id}" class = "${status}">${task.taskName}</label>
                  </div>
                  <div class="dropdown">
                    <button class="toggle" type="button">
                      <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <ul class="menu">
                      <li>
                        <a class="item" href="#" onclick = "deleteTask(${task.id})">
                          <i class="fa-solid fa-trash-can"></i> Delete
                        </a>
                      </li>
                      <li>
                        <a class="item" href="#" onclick = 'editTask(${task.id},"${task.taskName}")'>
                          <i class="fa-solid fa-pen"></i> Edit
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
        `;
        ul.insertAdjacentHTML('afterbegin',li)
      }
    })
  }
}


addBtn.addEventListener('click',addTask)

clearBtn.addEventListener('click',deletedCompletedTasks)

function deletedCompletedTasks(){
  taskLists = taskLists.filter(task => task.status !== 'completed');
  displayTasks(document.querySelector('span.active').id);
  localStorage.setItem("taskLists",JSON.stringify(taskLists));
}

function addTask(e){
  e.preventDefault();
  if(inputTask.value ==''){
    alert('Enter the task !')
  }else{
    if(!isEditTask){
      taskLists.push({id:taskLists.length+1,taskName:inputTask.value,status:'active'});
    }else{
      let task = taskLists.find(task => task.id == editId)
      task.taskName = inputTask.value;
      
    }
    inputTask.value = '';
    displayTasks(document.querySelector('span.active').id);
    showClass();
    localStorage.setItem("taskLists",JSON.stringify(taskLists));
  }
}

function deleteTask(id){
  let deletedId = taskLists.findIndex(task => task.id == id)
  taskLists.splice(deletedId,1);
  inputTask.value = '';
  displayTasks(document.querySelector('span.active').id);
  localStorage.setItem("taskLists",JSON.stringify(taskLists));
  showClass();
}

showClass();

function showClass(){
  let dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown =>{
    let toggle = dropdown.querySelector('.toggle');
    let menu = dropdown.querySelector('.menu')
    toggle.addEventListener('click',()=>{
      menu.classList.toggle('show');
    })
  })
}

function editTask(taskId,taskName){
    editId = taskId;
    isEditTask = true;
    inputTask.value = taskName;
    inputTask.focus();
}

function updateStatus(selectedTask){
  let label = selectedTask.parentElement.nextElementSibling
  let status;
  if(selectedTask.checked){
    label.classList.add('checked');
    status = 'completed'
  }else{
    label.classList.remove('checked');
    status = 'active';
  }
  let selectedTaskId = taskLists.find(task => task.id == selectedTask.id);
  selectedTaskId.status = status;
  displayTasks(document.querySelector('span.active').id);
  localStorage.setItem("taskLists",JSON.stringify(taskLists));
  showClass();
}

filters1.forEach(span=>{
  span.addEventListener('click',()=>{
    document.querySelector('span.active').classList.remove('active');
    span.classList.add('active')
    filters2.forEach(item=>{
      item.classList.remove('active');
      if(item.id == span.id){
        item.classList.add('active');
      }
    })
    displayTasks(span.id)
    localStorage.setItem("taskLists",JSON.stringify(taskLists));
    showClass();
  })
})

filters2.forEach(span=>{
  span.addEventListener('click',()=>{
    for(let span of filters1){
      span.classList.remove('active');
    }
    document.querySelector('span.active').classList.remove('active');
    span.classList.add('active')
    filters1.forEach(item=>{
      item.classList.remove('active');
      if(item.id == span.id){
        item.classList.add('active');
      }
    })
    displayTasks(span.id)
    localStorage.setItem("taskLists",JSON.stringify(taskLists));
    showClass();
  })
})

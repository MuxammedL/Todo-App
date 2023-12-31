const icon = document.querySelector('#icon');
const img_bg = document.querySelector('.img-bg');
const ul = document.querySelector('#task-list');
const addBtn = document.querySelector('.addBtn');
const clearBtn = document.querySelector('.clear');
const inputTask = document.querySelector('.input-task')
const todoList = document.querySelector('#todo-list');
const filters1 = document.querySelectorAll('.filters span')
const filters2 = document.querySelectorAll('.filter span')
let darkMode = localStorage.getItem('theme');
let peddingTaskCount = document.querySelector('.pedding-text span');
let isEditTask = false;
let editId;


function updateHeight(){
  if(document.querySelector('.row').clientHeight+100<window.innerHeight){
    todoList.style.height = `${100}vh`;
  }else{
    todoList.style.height = `${document.querySelector('.row').clientHeight+100}px`;
  }
}

darkMode && addDarkMode();

function addDarkMode(){
  document.body.classList.add('dark-theme');
  localStorage.setItem('theme','dark')
  icon.setAttribute('src','./images/icon-sun.svg')
}

function removeDarkMode(){
  document.body.classList.remove('dark-theme');
  localStorage.setItem('theme','')
  icon.setAttribute('src','./images/icon-moon.svg')
}

icon.addEventListener('click',()=>{
  darkMode = localStorage.getItem('theme');
  !darkMode ? addDarkMode() :removeDarkMode()
})

let taskList = []

if(localStorage.getItem("taskList") != null){
  taskList = JSON.parse(localStorage.getItem("taskList"));
}

displayTasks('all');

function displayTasks(filter){
  let count=0;
  let leftItems=0;
  ul.innerHTML = '';
  taskList.forEach(task =>{
    if(task.status==filter||filter=='all'){
      count++;
    }
    if(task.status=='active'){
      leftItems++;
    }
  })
  peddingTaskCount.innerHTML = `${leftItems} `;
  if(taskList.length == 0||count==0){
    ul.innerHTML = `
          <li class="task">
            <div class="content">
              <label>Your task list is empty</label>
            </div>
          </li>
    
    `
  }else{
    taskList.forEach(task=>{
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
  updateHeight();
}

addBtn.addEventListener('click',addTask)

clearBtn.addEventListener('click',deletedCompletedTasks)

function deletedCompletedTasks(){
  taskList = taskList.filter(task => task.status !== 'completed');
  displayTasks(document.querySelector('span.active').id);
  localStorage.setItem("taskList",JSON.stringify(taskList));
}

function addTask(e){
  e.preventDefault();
  if(inputTask.value ==''){
    alert('Enter the task !')
  }else{
    if(!isEditTask){
      taskList.push({id:taskList.length+1,taskName:inputTask.value,status:'active'});
    }else{
      let task = taskList.find(task => task.id == editId)
      task.taskName = inputTask.value;
      isEditTask=false;
    }
    inputTask.value = '';
    displayTasks(document.querySelector('span.active').id);
    showClass();
    localStorage.setItem("taskList",JSON.stringify(taskList));
  }
}

function deleteTask(id){
  let deletedId = taskList.findIndex(task => task.id == id)
  taskList.splice(deletedId,1);
  inputTask.value = '';
  displayTasks(document.querySelector('span.active').id);
  localStorage.setItem("taskList",JSON.stringify(taskList));
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
  let selectedTaskId = taskList.find(task => task.id == selectedTask.id);
  selectedTaskId.status = status;
  displayTasks(document.querySelector('span.active').id);
  localStorage.setItem("taskList",JSON.stringify(taskList));
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
    localStorage.setItem("taskList",JSON.stringify(taskList));
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
    localStorage.setItem("taskList",JSON.stringify(taskList));
    showClass();
  })
})

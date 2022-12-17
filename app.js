const addButton = document.querySelector('.add-btn')
const taskInput = document.querySelector('.task-input input')
const filters = document.querySelectorAll('.filters span')
const taskBox = document.querySelector('.task-box')
const clearAll = document.querySelector('.clear-btn') 
const alert = document.querySelector('.alert')

//getting locastorage todo-list 
let todos = JSON.parse(localStorage.getItem("todo-list"))

let editId
let isEditedTask = false 

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('span.active').classList.remove('active')
        btn.classList.add('active')
        showTodos(btn.id)
    })
})

function showTodos(filter) {
    let li = ''
    if(todos) {
        todos.forEach((todo, id) => {
            let isCompleted = todo.status === 'completed' ? 'checked' : ''
            if (filter == todo.status || filter == 'all') {
                li += `<li class="task">
                <label for="${id}">
                    <input onClick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                    <p class='${isCompleted}'>${todo.name}</p>
                </label>
                 <div class="settings">
                    <img onClick="showMenu(this)" src="./icons/dots.png" alt="dots">
                    <ul class="task-menu">
                        <li onClick="editTask(${id}, '${todo.name}')"><img src="./icons/edit.png" alt="edit">Edit</li>
                        <li onClick="deleteTask(${id})"><img src="./icons/delete.png" alt="delete">Delete</li>
                    </ul>
                </div>
            </li>`
            }
        })
    }
    taskBox.innerHTML = li || `<div class="icon-container"><span>Looks like you don't have any task here</span><img class="shrug" src="./icons/shrug.png" alt="shrug"></div>`
}
showTodos("all")

function showMenu(selectedTask) {
    let taskMenu = selectedTask.parentElement.lastElementChild
    taskMenu.classList.add('show')
    document.addEventListener('click', e => {
        if(e.target.tagName != 'IMG' || e.target != selectedTask) {
            taskMenu.classList.remove('show')
        }
    })
}

function displayAlert(text, action) {
    alert.textContent = text
    alert.classList.add(`alert-${action}`)

    setTimeout(function(){
        alert.textContent = ''
        alert.classList.remove(`alert-${action}`)
    }, 2000)
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild
    if(selectedTask.checked) {
        taskName.classList.add('checked')
        todos[selectedTask.id].status = 'completed'
    } else {
        taskName.classList.remove('checked')
        todos[selectedTask.id].status = 'pending'
    }
    localStorage.setItem('todo-list', JSON.stringify(todos))
}

function editTask(taskId, taskName) {
    editId = taskId 
    isEditedTask = true
    taskInput.value = taskName
    addButton.textContent = 'Edit'
}

function deleteTask(deleteId) {
    displayAlert('Item removed', 'red')
    todos.splice(deleteId, 1)
    localStorage.setItem('todo-list', JSON.stringify(todos))
    showTodos("all")
}

clearAll.addEventListener('click', () => {
    todos.splice(0, todos.length)
    localStorage.setItem('todo-list', JSON.stringify(todos))
    displayAlert('Empty list', 'red')
    showTodos("all")
})


addButton.addEventListener('click', e => {
    let userTask = taskInput.value.trim()
    if(userTask) {
        if(!isEditedTask) {
            if (!todos) {
                todos = []
            }
            let taskInfo = {name: userTask, status: 'pending'}
            todos.push(taskInfo)
            displayAlert('New item added', 'green')
        } else {
            isEditedTask = false
            todos[editId].name = userTask
            displayAlert('Item edited', 'green')
            addButton.textContent = 'Submit'
        }
        taskInput.value = ''
        localStorage.setItem('todo-list', JSON.stringify(todos))
        showTodos("all")
    } else {
        displayAlert('Please enter value', 'red')
    }
})
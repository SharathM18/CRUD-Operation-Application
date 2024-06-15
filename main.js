import "./style/style.css";
import "./style/utilities.css";

const addTask = document.querySelector(".add-task");
const addTaskIcon = document.querySelector(".add-icon");
const closeTask = document.querySelector(".close-icon");
const tasks = document.querySelector(".tasks");
const addTaskContent = document.querySelector(".add-task-content");
const inputText = document.querySelector("#ip-text");
const inputDate = document.querySelector("#ip-date");

let addActive = true;
let editingTaskIndex = null;
let storingData = [];

// Show/hide add task form
addTaskIcon.addEventListener("click", () => {
  if (addActive) {
    addTask.style.display = "flex";
    addActive = false;
    tasks.style.opacity = 0.5;
    inputText.value = "";
    inputDate.value = "";
  } else {
    addTask.style.display = "none";
    addActive = true;
    tasks.style.opacity = 1;
  }
});

// Close the add task form
closeTask.addEventListener("click", () => {
  addTask.style.display = "none";
  addActive = true;
  tasks.style.opacity = 1;
});

// Form submission handler
addTaskContent.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (editingTaskIndex !== null) {
    updateTask(editingTaskIndex);
  } else {
    addTaskData();
  }
});

// Add a new task
const addTaskData = () => {
  storingData.push({
    text: inputText.value,
    date: inputDate.value,
  });
  localStorage.setItem("data", JSON.stringify(storingData));
  createTasks();
  addTask.style.display = "none";
  addActive = true;
  tasks.style.opacity = 1;
};

// Create tasks in the DOM
const createTasks = () => {
  tasks.innerHTML = "";
  storingData.forEach((task, idx) => {
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.setAttribute("data-index", idx);

    taskElement.innerHTML = `
      <header class="task-header">
        <img src="/edit.svg" alt="edit" class="edit-icon" />
        <img src="/delete.svg" alt="delete" class="delete-icon" />
      </header>
      <div class="task-content">
        <p class="task-text">${task.text}</p>
        <p class="task-date">${task.date}</p>
      </div>
    `;

    const editIcon = taskElement.querySelector(".edit-icon");
    const deleteIcon = taskElement.querySelector(".delete-icon");

    // Add event listeners for edit and delete icons
    editIcon.addEventListener("click", () => editTask(idx));
    deleteIcon.addEventListener("click", () => deleteTask(idx));

    tasks.appendChild(taskElement);
  });
};

// Edit a task
const editTask = (index) => {
  addTask.style.display = "flex";
  addActive = false;
  tasks.style.opacity = 0.5;

  inputText.value = storingData[index].text;
  inputDate.value = storingData[index].date;

  editingTaskIndex = index;
};

// Update an existing task
const updateTask = (index) => {
  storingData[index].text = inputText.value;
  storingData[index].date = inputDate.value;
  localStorage.setItem("data", JSON.stringify(storingData));

  createTasks();
  inputText.value = "";
  inputDate.value = "";
  addTask.style.display = "none";
  addActive = true;
  tasks.style.opacity = 1;

  editingTaskIndex = null; // Reset editing index after update
};

// Delete a task
const deleteTask = (index) => {
  storingData.splice(index, 1);
  localStorage.setItem("data", JSON.stringify(storingData));
  createTasks();
};

// Load stored tasks on window load
window.onload = () => {
  const storedData = JSON.parse(localStorage.getItem("data"));
  if (storedData) {
    storingData = storedData;
    createTasks();
  }
};

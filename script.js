const listColumns = document.querySelectorAll(".drag-item-list");

const todoList = document.getElementById("todo-list");
const progressList = document.getElementById("progress-list");
const finishedList = document.getElementById("finished-list");

let todoListArray = [];
let progressListArray = [];
let finishedListArray = [];
let listArrays = [];

let draggedItem;
let currentColumn;

let updatedOnLoad = false;

function getSavedColumns() {
  if (localStorage.getItem("todoItems")) {
    todoListArray = JSON.parse(localStorage.getItem("todoItems"));
    progressListArray = JSON.parse(localStorage.getItem("progressItems"));
    finishedListArray = JSON.parse(localStorage.getItem("finishedItems"));
  } else {
    todoListArray = ["React integration", "Angular integration"];
    progressListArray = ["Counter application"];
    finishedListArray = ["Design your website"];
  }
}

function updateSavedColumns() {
  listArrays = [todoListArray, progressListArray, finishedListArray];
  const arrayNames = ["todo", "progress", "finished"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

function createItem(columnItem, column, item, index) {
  const listItem = document.createElement("li");
  listItem.classList.add(
    "drag-item",
    "cursor-pointer",
    "bg-white/50",
    "backdrop-blur-2xl",
    "border",
    "border-white/15",
    "rounded-2xl",
    "p-4",
    "my-3",
    "shadow-2xl",
    "duration-300",
    "ease-in-out",
    "hover:-translate-y-1",
    "transition-all",
    "text-slate-800"
  );
  listItem.classList.add("drag-item");
  listItem.textContent = item;
  listItem.draggable = true;
  listItem.setAttribute("ondragstart", "drag(event)");
  columnItem.appendChild(listItem);
}

function allowDrop(e) {
  e.preventDefault();
}

function dragEnter(column) {
  currentColumn = column;
}

function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];

  parent.appendChild(draggedItem);

  rebuildArrays();
}

function rebuildArrays() {
  todoListArray = [];
  progressListArray = [];
  finishedListArray = [];

  todoList.querySelectorAll(".drag-item").forEach((item) => {
    todoListArray.push(item.textContent);
  });

  progressList.querySelectorAll(".drag-item").forEach((item) => {
    progressListArray.push(item.textContent);
  });

  finishedList.querySelectorAll(".drag-item").forEach((item) => {
    finishedListArray.push(item.textContent);
  });

  updateSavedColumns();
}

function drag(e) {
  draggedItem = e.target;
}

function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  todoList.textContent = "";
  todoListArray.forEach((todoItem, index) => {
    createItem(todoList, 0, todoItem, index);
  });

  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItem(progressList, 1, progressItem, index);
  });

  finishedList.textContent = "";
  finishedListArray.forEach((finishedItem, index) => {
    createItem(finishedList, 2, finishedItem, index);
  });

  updatedOnLoad = true;

  updateSavedColumns();
}

updateDOM();

const todoList = document.getElementById("todo-list");
const progressList = document.getElementById("progress-list");
const finishedList = document.getElementById("finished-list");

let todoListArray = [];
let progressListArray = [];
let finishedListArray = [];
let listArrays = [];

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
    "hover:shadow-xl",
    "transition-all",
    "text-slate-800"
  );
  listItem.textContent = item;
  columnItem.appendChild(listItem);
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

  finishedList.textContent = "";

  updatedOnLoad = true;

  updateSavedColumns();
}

updateDOM();

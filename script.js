const listColumns = document.querySelectorAll(".drag-item-list");
const todoList = document.getElementById("todo-list");
const progressList = document.getElementById("progress-list");
const finishedList = document.getElementById("finished-list");

const addButtons = document.querySelectorAll(".add-btn");
const saveButtons = document.querySelectorAll(".save");
const addItemContainers = document.querySelectorAll(".add-item");
const addItems = document.querySelectorAll(".text-area");

let todoListArray = [];
let progressListArray = [];
let finishedListArray = [];
let listArrays = [];

let draggedItem;
let currentColumn;
let updatedOnLoad = false;

// Retrieve columns stored in LocalStorage
function getSavedColumns() {
  const savedTodo = localStorage.getItem("todoItems");
  const savedProgress = localStorage.getItem("progressItems");
  const savedFinished = localStorage.getItem("finishedItems");

  if (savedTodo) {
    todoListArray = JSON.parse(savedTodo);
    progressListArray = JSON.parse(savedProgress);
    finishedListArray = JSON.parse(savedFinished);
  } else {
    // Default values
    todoListArray = ["React integration", "Angular integration"];
    progressListArray = ["Counter application"];
    finishedListArray = ["Design your website"];
  }
}

// Save columns to localStorage
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

// Create new item
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

  // Add lines to items in the Completed column
  if (column === 2) {
    listItem.classList.add("line-through", "text-slate-800/50");
  }

  listItem.textContent = item;
  listItem.draggable = true;
  listItem.setAttribute("ondragstart", "drag(event)");

  // Double-click to edit
  listItem.addEventListener("dblclick", function () {
    editItem(listItem, column);
  });

  columnItem.appendChild(listItem);
}

// Edit item
function editItem(item, column) {
  const originalText = item.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = originalText;
  input.className =
    "w-full bg-transparent border-none outline-none text-slate-800";

  item.textContent = "";
  item.appendChild(input);
  input.focus();
  input.select();

  function saveEdit() {
    const newText = input.value.trim();
    if (newText) {
      // Update if there is text
      item.textContent = newText;
      rebuildArrays();
    } else {
      // If the text is empty, delete the item.
      item.remove();
      rebuildArrays();
    }
  }

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      input.blur();
    } else if (e.key === "Escape") {
      // Escape ile iptal - eski metni geri yükle
      item.textContent = originalText;
    }
  });
}

// Show add-item's div
function showItemDiv(column) {
  addButtons[column].classList.add("hidden");
  addItemContainers[column].classList.remove("hidden");
  saveButtons[column].classList.remove("hidden");
  addItems[column].focus();
}

// Hide add-item's div and save
function hideItemDiv(column) {
  const textValue = addItems[column].value.trim();

  if (textValue) {
    // Add the new item to the relevant array
    if (column === 0) {
      todoListArray.push(textValue);
    } else if (column === 1) {
      progressListArray.push(textValue);
    } else if (column === 2) {
      finishedListArray.push(textValue);
    }

    // Update DOM
    updateDOM();
  }

  // Clear and hide form
  addItems[column].value = "";
  addItemContainers[column].classList.add("hidden");
  saveButtons[column].classList.add("hidden");
  addButtons[column].classList.remove("hidden");
}

// Drag & Drop functions
function allowDrop(e) {
  e.preventDefault();
}

function dragEnter(column) {
  listColumns[column].classList.add("drag-over");
  currentColumn = column;
}

function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];

  listColumns.forEach((column) => {
    column.classList.remove("drag-over");
  });

  parent.appendChild(draggedItem);
  rebuildArrays();
}

function drag(e) {
  draggedItem = e.target;
}

// Recreate the arrays
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

// Update DOM
function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Clear lists
  todoList.innerHTML = "";
  progressList.innerHTML = "";
  finishedList.innerHTML = "";

  // Create new items
  todoListArray.forEach((todoItem, index) => {
    createItem(todoList, 0, todoItem, index);
  });

  progressListArray.forEach((progressItem, index) => {
    createItem(progressList, 1, progressItem, index);
  });

  finishedListArray.forEach((finishedItem, index) => {
    createItem(finishedList, 2, finishedItem, index);
  });

  updatedOnLoad = true;
  updateSavedColumns();
}

// Enter tuşu ile kaydetme
addItems.forEach((textarea, index) => {
  textarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      hideItemDiv(index);
    }
  });
});

// Start when the page loads
updateDOM();

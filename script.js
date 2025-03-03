document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const taskDateInput = document.getElementById("taskDate");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    // Load tasks from local storage
    function loadTasks() {
        taskList.innerHTML = ""; // Clear the list
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTaskToList(task.text, task.dueDate, task.completed, false));
    }

    // Add a new task to the list
    function addTaskToList(taskText, dueDate = "", completed = false, save = true) {
        const li = document.createElement("li");
        li.classList.add("task-item");

        // Task text
        const taskSpan = document.createElement("span");
        taskSpan.textContent = taskText;
        if (completed) taskSpan.classList.add("completed");

        // Due date display
        const dateSpan = document.createElement("span");
        dateSpan.textContent = dueDate ? `Due: ${dueDate}` : "No due date";
        dateSpan.style.fontSize = "14px";

        // Button container
        const buttonContainer = document.createElement("div");

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "✏️";
        editButton.addEventListener("click", function () {
            const newText = prompt("Edit Task:", taskSpan.textContent);
            if (newText) {
                updateTaskText(taskSpan.textContent, newText);
                taskSpan.textContent = newText;
            }
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.addEventListener("click", function () {
            li.style.animation = "slideOut 0.3s ease-in-out";
            setTimeout(() => {
                li.remove();
                removeTaskFromStorage(taskText);
            }, 300);
        });

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        li.appendChild(taskSpan);
        li.appendChild(dateSpan);
        li.appendChild(buttonContainer);
        taskList.appendChild(li);

        if (save) {
            saveTask(taskText, dueDate);
        }
    }

    // Save a task to local storage
    function saveTask(taskText, dueDate) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({ text: taskText, dueDate, completed: false });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Update task text in local storage
    function updateTaskText(oldText, newText) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.map(task => (task.text === oldText ? { ...task, text: newText } : task));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Remove a task from local storage
    function removeTaskFromStorage(taskText) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Add task event listener
    addTaskButton.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        const dueDate = taskDateInput.value;
        if (taskText === "") return;

        addTaskToList(taskText, dueDate);
        taskInput.value = "";
        taskDateInput.value = "";
    });

    // Allow adding tasks using the "Enter" key
    taskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addTaskButton.click();
        }
    });

    // Load tasks on page load
    loadTasks();
});

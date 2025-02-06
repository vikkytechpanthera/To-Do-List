document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTaskToList(task.text, task.completed));
    }

    // Add a new task to the list
    function addTaskToList(taskText, completed = false) {
        const li = document.createElement("li");
        li.textContent = taskText;
    
        if (completed) {
            li.classList.add("completed");
        }
    
        li.addEventListener("click", function () {
            li.classList.toggle("completed");
            updateTaskStatus(taskText);
        });
    
        // Create a container for buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "8px"; // Reduce spacing between buttons
    
        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "✏️";
        editButton.style.border = "none";
        editButton.style.cursor = "pointer";
        editButton.addEventListener("click", function (event) {
            event.stopPropagation();
            const newText = prompt("Edit Task:", taskText);
            if (newText) {
                updateTaskText(taskText, newText);
                li.firstChild.textContent = newText;
            }
        });
    
        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.style.color = "red";
        deleteButton.style.border = "none";
        deleteButton.style.cursor = "pointer";
        deleteButton.addEventListener("click", function (event) {
            event.stopPropagation();
            li.remove();
            removeTaskFromStorage(taskText);
        });
    
        // Add buttons inside the container
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
    
        // Append buttons to the list item
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
    }
    

    // Save a task to local storage
    function saveTask(taskText) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({ text: taskText, completed: false });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Update task completion status in local storage
    function updateTaskStatus(taskText) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.map(task =>
            task.text === taskText ? { ...task, completed: !task.completed } : task
        );
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
        if (taskText === "") return;

        addTaskToList(taskText);
        saveTask(taskText);

        taskInput.value = "";
    });

    // Load tasks on page load
    loadTasks();
});

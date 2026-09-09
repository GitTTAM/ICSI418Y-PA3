const form = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const priorityInput = document.querySelector("#priority");
const taskList = document.querySelector("#task-list");
const message = document.querySelector("#message");

const tasks = [];

function showTaskWarning() {
    message.textContent = "Entering a task is required before you can add it.";
    message.classList.add("warning");
    taskInput.classList.add("input-warning");
    taskInput.focus();
}

function clearTaskWarning() {
    message.textContent = "";
    message.classList.remove("warning");
    taskInput.classList.remove("input-warning");
}

function getPriorityLabel(priority) {
    if (priority === "low") {
        return "Low";
    }

    if (priority === "medium") {
        return "Medium";
    }

    return "High";
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task, index) {
        const taskElement = document.createElement("div");
        taskElement.className = "task-item";

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        const taskText = document.createElement("div");
        taskText.className = "task-text";
        taskText.textContent = task.name + " ";

        const priorityText = document.createElement("span");
        priorityText.className = "priority priority-" + task.priority;
        priorityText.textContent = "(" + getPriorityLabel(task.priority) + ")";
        taskText.appendChild(priorityText);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.textContent = task.completed ? "Undo" : "Complete";
        completeButton.addEventListener("click", function() {
            task.completed = !task.completed;
            displayTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            tasks.splice(index, 1);
            displayTasks();
        });

        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);
        taskElement.appendChild(taskText);
        taskElement.appendChild(actions);
        taskList.appendChild(taskElement);
    });
}

taskInput.addEventListener("input", function() {
    if (taskInput.value.trim() !== "") {
        clearTaskWarning();
    }
});

taskInput.addEventListener("invalid", function(event) {
    event.preventDefault();
    showTaskWarning();
});

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskName = taskInput.value.trim();
    const taskPriority = priorityInput.value;

    if (taskName === "") {
        showTaskWarning();
        return;
    }

    const task = {
        name: taskName,
        priority: taskPriority,
        completed: false
    };

    tasks.push(task);
    taskInput.value = "";
    clearTaskWarning();
    displayTasks();
});

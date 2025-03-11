let tasksContainer = document.getElementById("tasksContainer");
let timer = document.getElementById("timer");
//timer fn
setInterval(() => {
    let d = new Date();
    timer.innerHTML = d.toLocaleTimeString();
}, 1000);

function refreshTasks() {
    let tasksString = localStorage.getItem("tasks");
    tasks = JSON.parse(tasksString) || []; // Ensure tasks is an array
    tasksContainer.innerHTML = "";
    let index = 0;
    for (task of tasks) {
        let nTask = taskBody(
            index++,
            task.taskText,
            task.date,
            task.deadline,
            task.priority,
            task.isChecked
        );
        tasksContainer.innerHTML += nTask;
    }
}
function sortTasksByPriority() {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    storeTasksToLocalStorage();
    refreshTasks();
}

/*         function checkDeadlines() {
            let now = new Date();
            tasks.forEach(task => {
                let deadline = new Date(task.deadline);
                if (now >= deadline && !task.isChecked) {
                    alert(`Task "${task.taskText}" has reached its deadline!`);
                    playAlarmSound();
                }
            });
        }

        function playAlarmSound() {
            let audio = new Audio('notification.wav');
            audio.play();
        }

        setInterval(checkDeadlines, 60000); // Check every minute
 */

function taskBody(
    index = 0,
    taskText = "",
    taskDate = "",
    taskDeadline = "",
    taskPriority = "",
    checked = false
) {
    return `
                    <!--Note div-->
                    <div class="note border-radius ${taskPriority} ${
        checked ? "checked" : ""
    }">
                        <!--Buttons -->
                        <div style="color: #fff">
                            <button
                                class="circular options edit"
                                onclick="updateTask(${index})"
                            >
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button
                                onclick="checkTask(${index})"
                                class="circular options check"
                                
                            >
                                ${
                                    checked
                                        ? '<i class="fa-solid fa-xmark"></i>'
                                        : '<i class="fa-solid fa-check"></i>'
                                }
                            </button>
                            <button
                                onclick="deleteTask(${index})"
                                class="circular options delete"
                                
                            >
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        <!--/Buttons -->
                        <!--Note details -->
                        <div>
                            <h5 class="todoText" style="margin: 2px">
                                ${taskText}
                            </h5>
                            <h5 class ="date" style="margin: 2px">
                                ${taskDate}
                                <i class="fa-solid fa-calendar-days"></i>
                            </h5>
                            <h5 class ="date" style="margin: 2px">
                            Deadline: ${taskDeadline}
                            <i class="fa-solid fa-clock"></i>
                            </h5>
                        </div>
                        <!--/Note details -->
                        </div>
                        <!--/Note div-->`;
}
function showPopupDiv() {
    popupDiv.style.display = "flex";
}
function addTask() {
    let title = document.getElementById("title-input").value;
    let priority = document.querySelector(
        `input[name="priority"]:checked`
    ).value;
    let deadTime = document.getElementById("dead-time-input").value;
    if (
        title != null &&
        title != "" &&
        priority != null &&
        priority != "" &&
        deadTime != null &&
        deadTime != ""
    ) {
        let d = new Date();
        let taskObject = {
            taskText: `${title}`,
            date: `${d.toLocaleDateString("en-GB")} ${d.toLocaleTimeString()}`,
            priority: `${priority}`,
            deadline: `${deadTime}`,
            isChecked: false,
        };
        tasks = tasks || [];
        tasks.push(taskObject);
        storeTasksToLocalStorage();
        refreshTasks();
    }
    document.getElementById("title-input").value = "";
    document.querySelector(`input[name="priority"]:checked`).checked = false;
    document.getElementById("dead-time-input").value = "";
}
function deleteTask(index) {
    let isConfirmed = confirm(
        "Are you sure to delete : " + tasks[index].taskText + " task!!"
    );
    if (isConfirmed) {
        tasks.splice(index, 1);
        storeTasksToLocalStorage();
        refreshTasks();
    }
}
function updateTask(index) {
    let text = prompt("update your task :", tasks[index].taskText);
    if (text) {
        tasks[index].taskText = text;
        storeTasksToLocalStorage();
        refreshTasks();
    }
}
function checkTask(index) {
    tasks[index].isChecked = !tasks[index].isChecked;
    if (tasks[index].isChecked)
    {
        playSuccessVideo();
    }
    storeTasksToLocalStorage();
    refreshTasks();
}
function storeTasksToLocalStorage() {
    let tasksString = JSON.stringify(tasks);
    localStorage.setItem("tasks", tasksString);
}

function playSuccessVideo() {
    // Create video container
    const videoContainer = document.createElement("div");
    videoContainer.className = "video-container";

    // Create video element
    const video = document.createElement("video");
    video.autoplay = true;
    video.loop = false;
    video.muted = true;
    video.id = "taskVideo";

    // Create source element
    const source = document.createElement("source");
    source.src = "video.webm";
    source.type = "video/webm";

    // Append source to video
    video.appendChild(source);

    // Append video to container
    videoContainer.appendChild(video);

    // Append container to body
    document.body.appendChild(videoContainer);

    // Ensure videoOverlay exists
    let videoOverlay = document.getElementById("videoOverlay");
    if (!videoOverlay) {
        videoOverlay = document.createElement("div");
        videoOverlay.id = "videoOverlay";
        document.body.appendChild(videoOverlay);
    }

    // Show video overlay
    videoOverlay.style.visibility = "visible";
    videoOverlay.style.opacity = "1";

    // Play video
    video.play();

    // Hide video after a certain duration (e.g., 5 seconds)
    setTimeout(() => {
        videoOverlay.style.opacity = "0";
        setTimeout(() => {
            videoOverlay.style.visibility = "hidden";
            document.body.removeChild(videoContainer);
        }, 500);
    }, 500); // Adjust the duration as needed
}

let popupDiv = document.getElementById("popup");
let cancelBtn = document.getElementById("cancel-btn");
let addBtn = document.getElementById("add-btn");
addBtn.addEventListener("click", () => {
    addTask();
    popupDiv.style.display = "none";
});
cancelBtn.addEventListener("click", () => {
    popupDiv.style.display = "none";
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

refreshTasks();

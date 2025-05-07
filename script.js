const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const container = document.getElementById("tasks-container");

// ---------- Carregar tarefas ----------
document.addEventListener("DOMContentLoaded", loadTasks);

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskName = input.value.trim();
  if (taskName) {
    const taskData = { name: taskName, days: Array(7).fill(false) };
    saveTask(taskData);
    renderTask(taskData);
    input.value = "";
  }
});

function renderTask(taskData, index = null) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task";

  // Título da tarefa
  const title = document.createElement("h3");
  title.textContent = `📌 ${taskData.name}`;
  title.className = "task-title";

  // Botões de ação
  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️ Editar";
  editBtn.addEventListener("click", () => editTask(title, taskData, index ?? getTaskIndex(taskData.name)));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️ Excluir";
  deleteBtn.addEventListener("click", () => deleteTask(taskDiv, index ?? getTaskIndex(taskData.name)));

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  // Checkboxes
  const daysDiv = document.createElement("div");
  daysDiv.className = "day-checks";

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";

  const fill = document.createElement("div");
  fill.className = "progress-fill";
  progressBar.appendChild(fill);

  taskData.days.forEach((checked, i) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    checkbox.dataset.day = i;

    checkbox.addEventListener("change", () => {
      taskData.days[i] = checkbox.checked;
      updateTaskInStorage(index ?? getTaskIndex(taskData.name), taskData);
      updateProgress(fill, taskData.days);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(`Dia ${i + 1}`));
    daysDiv.appendChild(label);
  });

  taskDiv.appendChild(title);
  taskDiv.appendChild(actions);
  taskDiv.appendChild(daysDiv);
  taskDiv.appendChild(progressBar);
  container.appendChild(taskDiv);

  updateProgress(fill, taskData.days);
}

function updateProgress(fill, daysArray) {
  const total = daysArray.length;
  const checked = daysArray.filter(Boolean).length;
  const percent = (checked / total) * 100;
  fill.style.width = `${percent}%`;
}

// ---------- LocalStorage ----------

function saveTask(taskData) {
  const tasks = getTasks();
  tasks.push(taskData);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function updateTaskInStorage(index, updatedTask) {
  const tasks = getTasks();
  tasks[index] = updatedTask;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskElement, index) {
  let tasks = getTasks();
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskElement.remove();
}

function getTaskIndex(taskName) {
  const tasks = getTasks();
  return tasks.findIndex(task => task.name === taskName);
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach((task, index) => {
    renderTask(task, index);
  });
}

function editTask(titleEl, taskData, index) {
  const newName = prompt("Novo nome da tarefa:", taskData.name);
  if (newName && newName.trim() !== "") {
    taskData.name = newName.trim();
    titleEl.textContent = `📌 ${taskData.name}`;
    updateTaskInStorage(index, taskData);
  }
}

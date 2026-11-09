const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

const STORAGE_KEY = 'todos'

// Кожна справа: { id, text, checked }
let todos = loadTodos()

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch (e) {
    return []
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function newTodo() {
  const text = prompt('Введіть нову справу:')
  if (text === null || text.trim() === '') return

  todos.push({ id: Date.now(), text: text.trim(), checked: false })
  console.log(todos)
  saveTodos()
  render(todos)
  updateCounter()
}

function renderTodo(todo) {
  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.checked ? 'checked' : ''} onchange="checkTodo(${todo.id})" />
      <label for="${todo.id}"><span class="${todo.checked ? 'text-success text-decoration-line-through' : ''}">${escapeHtml(todo.text)}</span></label>
      <button class="btn btn-danger btn-sm float-end" onclick="deleteTodo(${todo.id})">delete</button>
    </li>`
}

function render(todos) {
  list.innerHTML = todos.map(renderTodo).join('')
}

function updateCounter() {
  itemCountSpan.textContent = todos.length
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.checked).length
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id)
  saveTodos()
  render(todos)
  updateCounter()
}

function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id)
  if (todo) todo.checked = !todo.checked
  saveTodos()
  render(todos)
  updateCounter()
}

// захист від вставки HTML користувачем
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]))
}

render(todos)
updateCounter()

/* ---------- Elements ---------- */
const form = document.getElementById('form');
const descInput = document.getElementById('descInput');
const amountInput = document.getElementById('amountInput');
const categoryInput = document.getElementById('categoryInput');
const typeToggle = document.getElementById('typeToggle');

const balanceAmount = document.getElementById('balanceAmount');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');

const list = document.getElementById('list');
const emptyMsg = document.getElementById('empty');
const clearAllBtn = document.getElementById('clearAll');
const barsEl = document.getElementById('bars');

/* ---------- State ---------- */
let entries = [];
let currentType = 'expense';

try {
  entries = JSON.parse(localStorage.getItem('expense-tracker-entries') || '[]');
} catch (e) {
  entries = [];
}

/* ---------- Persistence ---------- */
function save(){
  try {
    localStorage.setItem('expense-tracker-entries', JSON.stringify(entries));
  } catch (e) {
    console.warn('Could not save entries:', e);
  }
}

/* ---------- Helpers ---------- */
function formatMoney(n){
  return '₹' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---------- Rendering ---------- */
function render(){
  renderBalance();
  renderList();
  renderBreakdown();
}

function renderBalance(){
  const income = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const expense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const balance = income - expense;

  balanceAmount.textContent = formatMoney(balance);
  totalIncomeEl.textContent = formatMoney(income);
  totalExpenseEl.textContent = formatMoney(expense);
}

function renderList(){
  list.innerHTML = '';
  emptyMsg.style.display = entries.length === 0 ? 'block' : 'none';

  // newest first
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);

  sorted.forEach(entry => {
    const i = entries.indexOf(entry);
    const li = document.createElement('li');

    const icon = document.createElement('div');
    icon.className = `entry-icon ${entry.type}`;
    icon.textContent = entry.type === 'income' ? '+' : '−';

    const body = document.createElement('div');
    body.className = 'entry-body';
    const desc = document.createElement('span');
    desc.className = 'entry-desc';
    desc.textContent = entry.desc;
    const cat = document.createElement('span');
    cat.className = 'entry-cat';
    cat.textContent = entry.category;
    body.append(desc, cat);

    const amount = document.createElement('span');
    amount.className = `entry-amount ${entry.type}`;
    amount.textContent = (entry.type === 'income' ? '+' : '-') + formatMoney(entry.amount);

    const del = document.createElement('button');
    del.className = 'del';
    del.textContent = '✕';
    del.setAttribute('aria-label', 'Delete entry');
    del.onclick = () => deleteEntry(i);

    li.append(icon, body, amount, del);
    list.appendChild(li);
  });
}

function renderBreakdown(){
  barsEl.innerHTML = '';
  const expenses = entries.filter(e => e.type === 'expense');

  if(expenses.length === 0){
    barsEl.innerHTML = '<p class="no-data">No expenses logged yet</p>';
    return;
  }

  const totals = {};
  expenses.forEach(e => {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  });

  const maxTotal = Math.max(...Object.values(totals));

  Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, amount]) => {
      const row = document.createElement('div');
      row.className = 'bar-row';

      const catLabel = document.createElement('span');
      catLabel.className = 'bar-cat';
      catLabel.textContent = category;

      const track = document.createElement('div');
      track.className = 'bar-track';
      const fill = document.createElement('div');
      fill.className = 'bar-fill';
      fill.style.width = `${(amount / maxTotal) * 100}%`;
      track.appendChild(fill);

      const amountLabel = document.createElement('span');
      amountLabel.className = 'bar-amount';
      amountLabel.textContent = formatMoney(amount);

      row.append(catLabel, track, amountLabel);
      barsEl.appendChild(row);
    });
}

/* ---------- Actions ---------- */
function addEntry(desc, amount, category, type){
  entries.push({
    desc,
    amount,
    category,
    type,
    createdAt: Date.now()
  });
  save();
  render();
}

function deleteEntry(i){
  entries.splice(i, 1);
  save();
  render();
}

/* ---------- Event listeners ---------- */
typeToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.type-btn');
  if(!btn) return;
  currentType = btn.dataset.type;
  [...typeToggle.children].forEach(b => b.classList.toggle('active', b === btn));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  if(!desc || isNaN(amount) || amount <= 0) return;

  addEntry(desc, amount, category, currentType);

  descInput.value = '';
  amountInput.value = '';
  descInput.focus();
});

clearAllBtn.addEventListener('click', () => {
  if(entries.length === 0) return;
  if(confirm('Delete all transactions? This cannot be undone.')){
    entries = [];
    save();
    render();
  }
});

/* ---------- Init ---------- */
render();
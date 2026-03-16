const balanceEl = document.querySelector(".balance-amount")
const incomeAmountEl = document.querySelector(".income-amount")
const expenseAmountEl = document.querySelector(".expense-amount")
const transactionListEl = document.querySelector("#transaction-list")
const transactionFormEl = document.querySelector("#transaction-form")
const descriptionEl = document.querySelector("#description")
const amountEl = document.querySelector("#amount")

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransactions);
function addTransactions(e) {
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    transactions.push({
        id: Date.now(),
        description,
        amount
    })

    localStorage.setItem("transactions", JSON.stringify(transactions))
    
    updateTransactionList()
    updateSummary()

    transactionFormEl.reset()
}

function updateTransactionList() {
    transactionListEl.innerHTML = "";

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction) => {
        const transactionEl = createTransactionElement(transaction);
        transactionListEl.appendChild(transactionEl);
    });
}

function createTransactionElement(transaction) {
    const li = document.createElement("li");
    li.classList.add("transaction");
    li.classList.add(transaction.amount > 0 ? "income" : "expense");

    li.innerHTML = `
    <span>${transaction.description}</span>
    <span>
  
    ${formatCurrency(transaction.amount)}
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    </span>
  `;

    return li;
}

function updateSummary() {
    // 100, -50, 200, -200 => 50
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const income = transactions
        .filter((transaction) => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expenses = transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    // update ui => todo: fix the formatting
    balanceEl.textContent = formatCurrency(balance);
    incomeAmountEl.textContent = formatCurrency(income);
    expenseAmountEl.textContent = formatCurrency(Math.abs(expenses));
}

function formatCurrency(number) {
    return new Intl.NumberFormat("en-India", {
        style: "currency",
        currency: "INR",
    }).format(number);
}

function removeTransaction(id) {
    // filter out the one we wanted to delete
    transactions = transactions.filter((transaction) => transaction.id !== id);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();
}

// initial render
updateTransactionList();
updateSummary();

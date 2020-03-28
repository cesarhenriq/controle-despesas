const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
)

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = id => {
  transactions = transactions.filter(transaction => transaction.id !== id)
  updateLocalStorage()
  init()
}

const addTransactionIntoDOM = ({ id, name, amount }) => {
  const operator = amount < 0 ? '-' : '+'
  const CSSClass = amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(amount)
  const li = document.createElement('li')
  li.classList.add(CSSClass)
  li.innerHTML = `${name}
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>`

  transactionUl.append(li)
}

const getExpenses = transactionAmount =>
  Math.abs(
    transactionAmount
      .filter(value => value < 0)
      .reduce((acc, value) => acc + value, 0)
  ).toFixed(2)

const getIncome = transactionAmount =>
  transactionAmount
    .filter(value => value > 0)
    .reduce((acc, value) => acc + value, 0)
    .toFixed(2)

const getTotal = transactionAmount =>
  transactionAmount
    .reduce((acc, transaction) => acc + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
  const transactionAmount = transactions.map(({ amount }) => amount)
  const total = getTotal(transactionAmount)
  const income = getIncome(transactionAmount)
  const expense = getExpenses(transactionAmount)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
  transactionUl.innerHTML = ''
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()
}

init()

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
  const transaction = {
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  }

  transactions.push(transaction)
  init()
  updateLocalStorage()
}

const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
  inputTransactionName.focus()
}

const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

  if (isSomeInputEmpty) {
    alert('Por favor, preencha tanto o nome quanto o valor da transação')
    inputTransactionName.focus()
    return
  }

  addToTransactionsArray(transactionName, transactionAmount)
  init()
  updateLocalStorage()

  cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)

let addbtn = document.getElementById("addbutton");
let form = document.getElementById("addform");
let overlay = document.getElementById("overlay");
let closebtn = document.getElementsByClassName("btn-close")[0];
const hestorycards = document.getElementById("hestorycards");
const submit = document.getElementById("submit");

const totalRevenueDiv = document.getElementById("total-revenue");
const walletBalanceDiv = document.getElementById("wallet-balance");
const totalExpensesDiv = document.getElementById("total-expenses");

let editingIndex = -1;

addbtn.addEventListener("click", () => {
  editingIndex = -1;
  document.getElementById("submit").textContent = "Add Transaction";
  overlay.classList.remove("d-none");
  videValues();
});

closebtn.addEventListener("click", () => {
  overlay.classList.add("d-none");
  editingIndex = -1;
});

function videValues() { 
  form.reset(); 
  editingIndex = -1;
  document.getElementById("submit").textContent = "Add Transaction";
}

function validateWalletBalance(amount, type, editingIndex) {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  
  let currentBalance = 0;
  transactions.forEach(transaction => {
    const transactionAmount = parseFloat(transaction.amount) || 0;
    if (transaction.type === "income") {
      currentBalance += transactionAmount;
    } else {
      currentBalance -= transactionAmount;
    }
  });
  
  if (editingIndex !== -1) {
    const oldTransaction = transactions[editingIndex];
    const oldAmount = parseFloat(oldTransaction.amount) || 0;
    if (oldTransaction.type === "income") {
      currentBalance -= oldAmount;
    } else {
      currentBalance += oldAmount;
    }
  }
  
  const newAmount = parseFloat(amount) || 0;
  let newBalance = currentBalance;
  
  if (type === "income") {
    newBalance += newAmount;
  } else {
    newBalance -= newAmount;
  }
  
  return newBalance >= 0;
}

const showLocalStorige = () => {
  const data = JSON.parse(localStorage.getItem("transactions")) || [];
  hestorycards.innerHTML = '';

  let totalRevenue = 0;
  let totalExpenses = 0;

  data.forEach((e, index) => {
    const amount = parseFloat(e.amount) || 0;
    if(e.type === "income"){
      const cardHTML = `
      <div class="card text-bg-success mb-3" style="max-width: 18rem;">
        <div class="card-header text-center"><h5>${e.type}</h5></div>
        <div class="card-body">
          <p class="card-title text-center">${e.description}</p>
          <h4 class="text-center display-6">${amount}$</h4>
          <h4 class="text-center display-6">${e.date}</h4>
          <div class="d-flex justify-content-center mt-2">
            <button class="btn btn-sm btn-light edit-btn me-2" data-index="${index}">Edit</button>
            <button class="btn btn-sm btn-light delete-btn" data-index="${index}">Delete</button>
          </div>
        </div>
      </div>
    `;
        hestorycards.innerHTML += cardHTML;
    }else{
      const cardHTML = `
      <div class="card text-bg-danger mb-3" style="max-width: 18rem;">
        <div class="card-header text-center"><h5>${e.type}</h5></div>
        <div class="card-body">
          <p class="card-title text-center">${e.description}</p>
          <h4 class="text-center display-6">${amount}$</h4>
          <h4 class="text-center display-6">${e.date}</h4>
          <div class="d-flex justify-content-center mt-2">
            <button class="btn btn-sm btn-light edit-btn me-2" data-index="${index}">Edit</button>
            <button class="btn btn-sm btn-light delete-btn" data-index="${index}">Delete</button>
          </div>
        </div>
      </div>
    `;
        hestorycards.innerHTML += cardHTML;
    }

    if (e.type === "income") totalRevenue += amount;
    else totalExpenses += amount;
  });

  const walletBalance = totalRevenue - totalExpenses;
  totalRevenueDiv.textContent = `${totalRevenue}$`;
  totalExpensesDiv.textContent = `${totalExpenses}$`;
  walletBalanceDiv.textContent = `${walletBalance}$`;

  if (walletBalance < 0) {
    walletBalanceDiv.classList.remove('text-success');
    walletBalanceDiv.classList.add('text-danger');
  } else {
    walletBalanceDiv.classList.remove('text-danger');
    walletBalanceDiv.classList.add('text-success');
  }

  overlay.classList.add("d-none");
};

submit.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;

  if (!amount || !description || !type || !date) {
    alert("Please fill in all fields!");
    return;
  }

  if (!validateWalletBalance(amount, type, editingIndex)) {
    alert("Error: No enough cash.");
    return;
  }

  const data = { amount, description, type, date };
  const localData = JSON.parse(localStorage.getItem("transactions")) || [];
  
  if (editingIndex === -1) {
    localData.push(data);
  } else {
    localData[editingIndex] = data;
  }
  
  localStorage.setItem("transactions", JSON.stringify(localData));

  showLocalStorige();
  videValues();
});

hestorycards.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (deleteBtn) {
    const isConfirmed = confirm("Are you sure you want to delete this transaction?");
    
    if (isConfirmed) {
      const idx = Number(deleteBtn.dataset.index);
      const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
      transactions.splice(idx, 1);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      showLocalStorige();
    }
    return;
  }
  
  const editBtn = e.target.closest(".edit-btn");
  if (editBtn) {
    const idx = Number(editBtn.dataset.index);
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const transaction = transactions[idx];
    
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("description").value = transaction.description;
    document.getElementById("type").value = transaction.type;
    document.getElementById("date").value = transaction.date;
    
    editingIndex = idx;
    
    document.getElementById("submit").textContent = "Update Transaction";
    
    overlay.classList.remove("d-none");
  }
});

window.addEventListener("DOMContentLoaded", showLocalStorige);
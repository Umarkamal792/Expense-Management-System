// Sign-Up Functionality
document.getElementById("signupForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (password.length < 6) {
    Swal.fire('Error', 'Password must be at least 6 characters!', 'error');
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(user => user.email === email)) {
      Swal.fire('Error', 'Email already exists!', 'error');
  } else {
      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      Swal.fire('Success', 'Account created successfully!', 'success').then(() => {
          window.location.href = "login.html";
      });
  }
});

// Login Functionality
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      Swal.fire('Success', 'Login successful!', 'success').then(() => {
          window.location.href = "expense.html";
      });
  } else {
      Swal.fire('Error', 'Invalid email or password!', 'error');
  }
});

// Expense Management
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
showExpenses();

document.getElementById("expenseForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
      Swal.fire('Error', 'User not logged in!', 'error');
      return;
  }

  const title = document.getElementById("title").value;
  const income = +document.getElementById("income").value;
  const expense = +document.getElementById("expense").value;
  const category = document.getElementById("category").value;
  const date = new Date().toLocaleDateString();

  expenses.push({ userEmail: currentUser.email, title, income, expense, category, date });
  localStorage.setItem("expenses", JSON.stringify(expenses));

  document.getElementById("expenseForm").reset();
  showExpenses();
});

function showExpenses() {
  const tbody = document.getElementById("expenseTableBody");
  tbody.innerHTML = "";

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  let totalIncome = 0;
  let totalExpense = 0;

  expenses
      .filter(exp => exp.userEmail === currentUser.email)
      .forEach((ex, index) => {
          totalIncome += ex.income;
          totalExpense += ex.expense;

          tbody.innerHTML += `
              <tr>
                  <td>${index + 1}</td>
                  <td>${ex.title}</td>
                  <td>${ex.expense}</td>
                  <td>${ex.category}</td>
                  <td>${ex.date}</td>
                  <td><button onclick="deleteExpense(${index})">Delete</button></td>
              </tr>
          `;
      });

  document.getElementById("totalIncome").textContent = `Total Income: ${totalIncome}`;
  document.getElementById("totalExpense").textContent = `Total Expense: ${totalExpense}`;
  document.getElementById("balance").textContent = `Remaining Balance: ${totalIncome - totalExpense}`;
}

function deleteExpense(index) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  const userExpenses = expenses.filter(exp => exp.userEmail === currentUser.email);
  const globalIndex = expenses.indexOf(userExpenses[index]);

  expenses.splice(globalIndex, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  showExpenses();
}

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  Swal.fire('Logged Out', 'You have been logged out!', 'success').then(() => {
      window.location.href = "login.html";
  });
});

"use strict";
/* =========================================================================
   Spendly — a mini expense tracker (starter)
   Fill in every TODO. Your code must compile with `npm run build`
   (tsc, strict mode) with ZERO type errors. Do NOT use `any` to dodge types.
   See TODO.md for the task list and marks.
   ========================================================================= */
/* -------------------------------------------------------------------------
   TASK 1 — Enum (LU: Enums & Tuples)
   TODO: Define a string enum `Category` with: Food, Travel, Bills, Other.
   ------------------------------------------------------------------------- */
var Category;
(function (Category) {
    Category["Food"] = "Food";
    Category["Travel"] = "Travel";
    Category["Bills"] = "Bills";
    Category["Other"] = "Other";
})(Category || (Category = {}));
/* In-memory store (already typed once you define Expense above). */
const expenses = [];
let nextId = 1;
/* -------------------------------------------------------------------------
   TASK 5 — Type guard / narrowing (LU: Type Guards & Narrowing)
   TODO: Write `toNewExpense` that takes the RAW form strings and either
         returns a valid `NewExpense` or `null`.
         Use typeof / Number checks and verify the category is a real enum
         value. Reject: empty title, non-positive or non-numeric amount,
         invalid category. No `any`.
   ------------------------------------------------------------------------- */
function toNewExpense(title, amountRaw, category) {
    const cleanTitle = title.trim();
    if (typeof cleanTitle !== "string" || cleanTitle.length === 0) {
        return null;
    }
    if (typeof amountRaw !== "string" || amountRaw.trim() === "") {
        return null;
    }
    const amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount <= 0) {
        return null;
    }
    const validCategory = Object.values(Category).find((value) => value === category);
    if (!validCategory) {
        return null;
    }
    return {
        title: cleanTitle,
        amount: amount,
        category: validCategory
    };
}
/* -------------------------------------------------------------------------
   TASK 6 — Core logic
   TODO: total()      -> sum of all expense amounts (number)
         breakdown()  -> SummaryRow[] : one [category, total] row per Category
   ------------------------------------------------------------------------- */
function total() {
    return expenses.reduce((sum, expenses) => sum + expenses.amount, 0);
}
function breakdown() {
    const result = {
        [Category.Food]: 0,
        [Category.Travel]: 0,
        [Category.Bills]: 0,
        [Category.Other]: 0,
    };
    for (const expense of expenses) {
        result[expense.category] += expense.amount;
    }
    return Object.values(Category).map((Category) => [
        Category,
        result[Category]
    ]);
}
/* -------------------------------------------------------------------------
   TASK 7 — DOM wiring + render (LU: TypeTasks UI, Build & Ship)
   TODO:
     - Grab the form + inputs with getElementById and cast to the right
       HTMLElement types (e.g. `as HTMLInputElement`).
     - On submit: preventDefault, call toNewExpense, show an error message
       if invalid, else push a full Expense (add the id) and re-render.
     - render(): paint the #list, #total, and #breakdown from the data.
   ------------------------------------------------------------------------- */
const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const errorElement = document.getElementById("error");
const listElement = document.getElementById("list");
const totalElement = document.getElementById("total");
const breakdownElement = document.getElementById("breakdown");
function render() {
    listElement.replaceChildren();
    for (const expense of expenses) {
        const item = document.createElement("li");
        const details = expense;
        item.textContent = `${details.title} - ₹$
      {details.amount.toFixed(2)} - $ 
      {expense.category}`;
        listElement.appendChild(item);
    }
    totalElement.textContent = `Total Spent: ₹${total().toFixed(2)}`;
    breakdownElement.replaceChildren();
    for (const [category, amount] of breakdown()) {
        const item = document.createElement("li");
        item.textContent = `${category}: ₹${amount.toFixed(2)}`;
        breakdownElement.appendChild(item);
    }
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const newExpense = toNewExpense(titleInput.value, amountInput.value, categoryInput.value);
    if (newExpense === null) {
        errorElement.textContent = "Invalid input! Enter a title, positive amount and valid category. ";
        return;
    }
    errorElement.textContent = "";
    const expense = {
        id: nextId,
        ...newExpense
    };
    nextId++;
    expenses.push(expense);
    form.reset();
    render();
});
render();

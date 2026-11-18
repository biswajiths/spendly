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
 enum Category { 
   Food="Food",
   Travel="Travel",
   Bills="Bills",
   Other="Other"
  }

/* -------------------------------------------------------------------------
   TASK 2 — Model type (LU: TypeTasks Model & Types)
   TODO: Define an `Expense` interface/type with:
         id: number, title: string, amount: number, category: Category
   ------------------------------------------------------------------------- */
 interface Expense { 
   id:number;
   title:string;
   amount: number;
   category: Category;
  }

/* -------------------------------------------------------------------------
   TASK 3 — Utility types (LU: Utility Types)
   TODO: Using the utility types, declare:
         - NewExpense = Omit<Expense, "id">        // what the form produces
         - Breakdown  = Record<Category, number>    // per-category totals
         - (one more) Partial<Expense> OR Pick<...> used somewhere sensible
   ------------------------------------------------------------------------- */
 type NewExpense = Omit<Expense, "id">;
 type Breakdown  = Record<Category, number>;
type ExpenseDetails = Pick<Expense, "title" | "amount">;
/* -------------------------------------------------------------------------
   TASK 4 — Tuple (LU: Enums & Tuples)
   TODO: Define a tuple type `SummaryRow` = [Category, number]
         (used to return each breakdown row).
   ------------------------------------------------------------------------- */
type SummaryRow = [Category, number];

/* In-memory store (already typed once you define Expense above). */
const expenses: Expense[] = [];
let nextId = 1;

/* -------------------------------------------------------------------------
   TASK 5 — Type guard / narrowing (LU: Type Guards & Narrowing)
   TODO: Write `toNewExpense` that takes the RAW form strings and either
         returns a valid `NewExpense` or `null`.
         Use typeof / Number checks and verify the category is a real enum
         value. Reject: empty title, non-positive or non-numeric amount,
         invalid category. No `any`.
   ------------------------------------------------------------------------- */
function toNewExpense(title: string, amountRaw: string, category: string): NewExpense | null { 
   const cleanTitle = title.trim();

   if(typeof cleanTitle !== "string" || cleanTitle.length === 0){return null;}

   if(typeof amountRaw !== "string" || amountRaw.trim() === ""){return null;}

   const amount = Number(amountRaw);

   if(!Number.isFinite(amount) || amount <=0){return null;}

   const validCategory = Object.values(Category).find((value): value is Category => value === category);

   if(!validCategory){
      return null;
   }

   return{
      title: cleanTitle,
      amount: amount,
      category:validCategory
   };
 }

/* -------------------------------------------------------------------------
   TASK 6 — Core logic
   TODO: total()      -> sum of all expense amounts (number)
         breakdown()  -> SummaryRow[] : one [category, total] row per Category
   ------------------------------------------------------------------------- */
 function total(): number { 
   return expenses.reduce((sum,expenses)=>sum+expenses.amount,0);
  }
 function breakdown(): SummaryRow[] { 
   const result: Breakdown ={
      [Category.Food]:0,
      [Category.Travel]:0,
      [Category.Bills]:0,
      [Category.Other]:0,
   };

   for (const expense of expenses){
      result[expense.category] += expense.amount;
   }
   return Object.values(Category).map(
      (Category): SummaryRow => [
         Category,
         result[Category]
      ]
   );
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
 const form = document.getElementById("expense-form") as HTMLFormElement;

 const titleInput = document.getElementById("title") as HTMLInputElement;
 const amountInput = document.getElementById("amount") as HTMLInputElement;
 const categoryInput = document.getElementById("category") as HTMLSelectElement;
 const errorElement = document.getElementById("error") as HTMLParagraphElement;
 const listElement = document.getElementById("list") as HTMLUListElement;
 const totalElement = document.getElementById("total") as HTMLParagraphElement;
 const breakdownElement = document.getElementById("breakdown") as HTMLUListElement;


function render(): void {
   listElement.replaceChildren();

   for( const expense of expenses){
      const item= document.createElement("li");

      const details: ExpenseDetails = expense;

      item.textContent=`${details.title} - ₹$
      {details.amount.toFixed(2)} - $ 
      {expense.category}`;

      listElement.appendChild(item);
   }

   totalElement.textContent=`Total Spent: ₹${total().toFixed(2)}`;

   breakdownElement.replaceChildren();

   for(const [category, amount] of breakdown()){
      const item = document.createElement("li");
      item.textContent=`${category}: ₹${amount.toFixed(2)}`;
      breakdownElement.appendChild(item);
   }
}

form.addEventListener("submit", (event:SubmitEvent)=>{
   event.preventDefault();

   const newExpense= toNewExpense(
      titleInput.value,
      amountInput.value,
      categoryInput.value
   );

   if (newExpense === null){
      errorElement.textContent="Invalid input! Enter a title, positive amount and valid category. ";

      return;
   }

   errorElement.textContent="";

   const expense: Expense={
      id:nextId,
      ...newExpense
   };

   nextId++;

   expenses.push(expense);
   form.reset()
   render();

});

render();

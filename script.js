const LOCAL_STORAGE_PREFIX = 'GUVI-V2-TASK-4-PREFIX_';
const INCOME_TABLE_KEY = `${LOCAL_STORAGE_PREFIX}income-table`;
const EXPENSE_TABLE_KEY = `${LOCAL_STORAGE_PREFIX}expense-table`;

let incomeTableData = [];
let expenseTableData = [];

let isEditIncomeEntry = {
    value: false,
    indexToBeUpdated: null
};
let isEditExpenseEntry = {
    value: false,
    indexToBeUpdated: null
};

let incomeTableContent = document.getElementById('income-table-content');
let enxpenseTableContent = document.getElementById('expense-table-content');

let incomeTotal = document.getElementById('income-total');
let expenseTotal = document.getElementById('expense-total');
let balance = document.getElementById('balance-amount');

const formShow = document.getElementById('show-table');
const incomeTable = document.getElementById('income-table-container');
const expenseTable = document.getElementById('expense-table-container');

// Radio button handler 
formShow.addEventListener('click',function (e) {
    if(e.target.matches('[type = radio]')) {
        if(e.target.value == 'income') {
            expenseTable.classList.add('hidden');
            incomeTable.classList.remove('hidden');
        } else if(e.target.value == 'expense') {
            incomeTable.classList.add('hidden');
            expenseTable.classList.remove('hidden');
        } else {
            expenseTable.classList.remove('hidden');
            incomeTable.classList.remove('hidden');
        }
    };
});

// Common delete function handler
function deleteEntry(index, table) {
    if(table == 'income') {
        incomeTableData.splice(index, 1);
        localStorage.setItem(INCOME_TABLE_KEY, JSON.stringify(incomeTableData));
    } else if(table == 'expense') {
        expenseTableData.splice(index, 1);
        localStorage.setItem(EXPENSE_TABLE_KEY, JSON.stringify(expenseTableData));
    }
    getTableData();
}

// Expense entry edit handler
function editExpenseEntry(e, index) {
    let row = e.parentNode.parentNode;

    let amount = row.querySelector('.expense-amount').innerText;
    let description = row.querySelector('.expense-description').innerText;

    let descriptionInput = document.getElementById('expense-description-input');
    let amountInput = document.getElementById('expense-amount-input');

    amountInput.value = amount;
    descriptionInput.value = description;

    isEditExpenseEntry = {
        value: true,
        indexToBeUpdated: index
    };

    const formButton = document.getElementById('expense-form-button');
    formButton.innerText = 'Update';

}

// Income entry edit handler
function editIncomeEntry(e, index) {
    let row = e.parentNode.parentNode;

    let amount = row.querySelector('.income-amount').innerText;
    let description = row.querySelector('.income-description').innerText;

    let descriptionInput = document.getElementById('income-description-input');
    let amountInput = document.getElementById('income-amount-input');

    amountInput.value = amount;
    descriptionInput.value = description;

    isEditIncomeEntry = {
        value: true,
        indexToBeUpdated: index
    };

    const formButton = document.getElementById('income-form-button');
    formButton.innerText = 'Update';

}

// Add income entry function handler
function postIncomeTableData() {
    let description = document.getElementById('income-description-input');
    let amount = document.getElementById('income-amount-input');
    let formButton = document.getElementById('income-form-button');

    if (description.value.length && amount.value.length) {

        let obj = {
            description: description.value,
            amount: amount.value
        }

        if (isEditIncomeEntry.value == true) {
            incomeTableData.splice(isEditIncomeEntry.indexToBeUpdated, 1, obj);
        } else {
            incomeTableData.push(obj);
        }

        localStorage.setItem(INCOME_TABLE_KEY, JSON.stringify(incomeTableData));

        description.value = '';
        amount.value = '';
        formButton.innerText = 'Add New';
        isEditIncomeEntry = {
            value: false,
            indexToBeUpdated: null
        }
    }

    getTableData();
}

// Add expense entry function handler
function postExpenseTableData() {
    let description = document.getElementById('expense-description-input');
    let amount = document.getElementById('expense-amount-input');
    let formButton = document.getElementById('expense-form-button');

    if (description.value.length && amount.value.length) {
        let obj = {
            description: description.value,
            amount: amount.value
        }

        if (isEditExpenseEntry.value == true) {
            expenseTableData.splice(isEditExpenseEntry.indexToBeUpdated, 1, obj);
        } else {
            expenseTableData.push(obj);
        }

        localStorage.setItem(EXPENSE_TABLE_KEY,JSON.stringify(expenseTableData));

        description.value = '';
        amount.value = '';
        formButton.innerText = 'Add New';
        isEditExpenseEntry = {
            value: false,
            indexToBeUpdated: null
        }
    }

    getTableData();
}

// Get all entries function
function getTableData() {
    incomeTableData = JSON.parse(localStorage.getItem(INCOME_TABLE_KEY)) || [];
    expenseTableData = JSON.parse(localStorage.getItem(EXPENSE_TABLE_KEY)) || [];

    const incomeTotalAmount = incomeTableData?.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.amount), 0);
    const expenseTotalAmount = expenseTableData?.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.amount), 0);

    incomeTotal.innerText = incomeTotalAmount;
    expenseTotal.innerText = expenseTotalAmount;
    balance.innerText = incomeTotalAmount - expenseTotalAmount;

    incomeTableContent.innerHTML = "";
    enxpenseTableContent.innerHTML = "";

    for (let i = 0; i < incomeTableData?.length; i++) {
        incomeTableContent.innerHTML += `<tr>
                            <td class="income-description pl-2 text-left  text-[1.2rem]">${incomeTableData[i].description}</td>
                            <td class="income-amount pl-2 text-left text-[1.2rem]">${incomeTableData[i].amount}</td>
                            <td class="flex flex-col  md:flex-row justify-center items-center p-1">
                                <button class="py-1 px-2 my-1 md:my-auto mx-1 rounded-lg bg-gray text-white text-[0.8rem]" onclick="editIncomeEntry(this,${i})">Edit</button>
                                <button
                                    class="py-1 px-2 my-1 md:my-auto mx-1 rounded-lg bg-[red] text-white text-[0.8rem]" onclick="deleteEntry(${i},'income')">Delete</button>
                            </td>
                        </tr>`
    }

    for (let i = 0; i < expenseTableData?.length; i++) {
        enxpenseTableContent.innerHTML += `<tr>
                            <td class="expense-description pl-2 text-left  text-[1.2rem]">${expenseTableData[i].description}</td>
                            <td class="expense-amount pl-2 text-left text-[1.2rem]">${expenseTableData[i].amount}</td>
                            <td class="flex flex-col md:flex-row justify-center items-center p-1">
                                <button class="py-1 px-2 my-1 md:my-auto mx-1 rounded-lg bg-gray text-white text-[0.8rem]" onclick="editExpenseEntry(this,${i})">Edit</button>
                                <button
                                    class="py-1 px-2 my-1 md:my-auto mx-1 rounded-lg bg-[red] text-white text-[0.8rem]" onclick="deleteEntry(${i},'expense')">Delete</button>
                            </td>
                        </tr>`
    }
}


getTableData();
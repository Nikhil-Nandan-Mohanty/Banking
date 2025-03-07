'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
/*
const account1 = {
  owner: 'Nikhil Mohanty',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Gyana Behera',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Manoranjan Samal',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Saswata Rout',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
*/


// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Nikhil Mohanty',
  movements: [200, 450, -300, 25000, -642, -135, 100, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Gyana Behera',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(account,sort = false){
  containerMovements.innerHTML = '';
  const arrange = sort ? account.movements.slice().sort((a,b) => a-b) : account.movements
    arrange.forEach(function(mov, i){
        const type = mov > 0 ? 'deposit' : 'withdrawal'

        const date = new Date(account.movementsDates[i])
        const day = `${date.getDate()}`.padStart(2,0)
        const month = `${date.getMonth() + 1}`.padStart(2,0)
        const year = date.getFullYear()
        const displayDate = `${day}/${month}/${year}`


        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
                <div class="movements__date">${displayDate}</div>
                <div class="movements__value">${mov}
            </div>`
            containerMovements.insertAdjacentHTML('afterbegin',html)
    })
}
displayMovements(account1)

const displayBalance = function(account){
    account.balance = account.movements.reduce((ar,cur) => ar + cur, 0)
    labelBalance.textContent = `${account.balance}`
}


const displaySummary = function(account){
  const income = account.movements.filter(a => a > 0).reduce((acc, a) => acc + a, 0);
  labelSumIn.textContent = `${income}€`
  
  const out = account.movements.filter(a => a < 0).reduce((acc, a) => acc + a , 0);
  labelSumOut.textContent = `${Math.abs(out)}€`

  const interest = account.movements.filter(a => a > 0).map(deposit => (deposit * account.interestRate)/100).filter(int => int >= 1).reduce((acc, a) => acc + a, 0);
  labelSumInterest.textContent = `${interest}€`
}



const createUserName = function(account){
    account.forEach(function(acc){
        acc.user = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    })
};
createUserName(accounts)
console.log(accounts)


const UpdateAcc = function(account){
  displayMovements(account)
  displayBalance(account)
  displaySummary(account)
};


const DisplayLogOutTimer = function(){
  const a = function(){
    const minute = String(Math.trunc(time / 60)).padStart(2 , 0)
    const second = String(time % 60).padStart(2, 0)
    labelTimer.textContent = `${minute}:${second}`

    if(time === 0){
      clearInterval(timer)
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    time--
  };

  let time = 120
  a()
  const timer = setInterval(a, 1000);
  return timer
}


let currentAccount, timer;

//Actual login
btnLogin.addEventListener('click', function(e){
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.user === inputLoginUsername.value);
  console.log(currentAccount)

  if (currentAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;

    const now = new Date()
    const day = `${now.getDate()}`.padStart(2,0)
    const month = `${now.getMonth() + 1}`.padStart(2,0)
    const year = now.getFullYear()
    const hour = `${now.getHours()}`.padStart(2,0)
    const minute = `${now.getMinutes()}`.padStart(2,0)
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`

    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur()

    if(timer) clearInterval(timer);
    timer = DisplayLogOutTimer()

   UpdateAcc(currentAccount)
  }
});


btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(acc => acc.user === inputTransferTo.value)
  inputTransferAmount.value = inputTransferTo.value = ''
  
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.user !== currentAccount.user) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    UpdateAcc(currentAccount);
    if(timer) clearInterval(timer);
    timer = DisplayLogOutTimer()
  }
});


btnLoan.addEventListener('click', function(e){
  e.preventDefault()
  const amount = Math.floor(inputLoanAmount.value)
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1 )){
    currentAccount.movements.push(amount)
    currentAccount.movementsDates.push(new Date().toISOString())
    UpdateAcc(currentAccount)
    if(timer) clearInterval(timer);
    timer = DisplayLogOutTimer()
  }
  inputLoanAmount.value = '';
});


btnClose.addEventListener('click', function(e){
  e.preventDefault()
  
  if(inputCloseUsername.value === currentAccount.user && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.user === currentAccount.user)
    accounts.splice(index, 1)
    containerApp.style.opacity = 0;

  }
  inputCloseUsername.value = inputClosePin.value = ''
});

let sorted = false
btnSort.addEventListener('click', function(e){
  e.preventDefault()
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
*/
//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
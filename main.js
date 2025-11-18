
class BankAccount{
    #balance;
    constructor(name,initialBalance = 0){
        this.name = name,
        this.accNumber = Date.now() + Math.floor(Math.random()*1000),
        this.#balance = +initialBalance;
        this.transaction = [];
    }

    deposit(amount){
        amount = +amount;
        if (amount <= 0) return 'invalid amount';
        this.#balance += amount;
        this.transaction.push(`Deposited : ${amount}`);
        return `Deposited : ${amount}`;
    }

    withdraw(amount){
        amount = +amount;
        if (amount > this.#balance) return 'not balance enough';
        this.#balance -= amount;
        this.transaction.push(`withdrawn : ${amount}`)
        return `Withdrawn : ${amount}`;
    }

    getBalance(){
        return this.#balance;
    }

    info(){
        let transHistory = this.transaction.join('<br>')
        return `<div class="acc"> <strong>Account</strong> : ${this.accNumber} <br> 
        <strong>Name</strong> : ${this.name} <br>
        <strong>Balance</strong> : ${this.getBalance()} EGP <br>
        <strong>Transactions</strong> : <br> ${transHistory}
         </div> 
         <hr>`;
    }
}

class Bank{
    constructor(){
        this.accounts = [];
    }
    createAccount(name,initialBalance){
        let acc = new BankAccount(name,initialBalance);
        this.accounts.push(acc);
        return acc;
    }
    findAccount(accNum){
        return this.accounts.find(function(e){
          return  e.accNumber == accNum;
        })
    }
    showAll(){
        return this.accounts.map(function(e){
         return  e.info();
        }).join('');
    }

      loadAccount(){
        let saved = localStorage.getItem('bankAccounts');
        if (saved){
            let data = JSON.parse(saved);
            this.accounts = data.map(function(accData){
                let obj = new BankAccount(accData.name, accData.balance);
                obj.accNumber = accData.accNumber;
                obj.transaction = accData.transaction || [];
                return obj;
            });
        }
    };

    saveAccount(){
        let data = this.accounts.map(function(acc){
            return {
                name : acc.name,
                balance : acc.getBalance(),
                accNumber : acc.accNumber,
                transaction : acc.transaction,
            }
        });


        localStorage.setItem('bankAccounts',JSON.stringify(data));

    };
}

let bank = new Bank();
bank.loadAccount();
render();

document.getElementById("crt-btn").onclick = function(){
    let name = document.getElementById("acc-name").value;
    let balance = document.getElementById('init-balance').value;
    if (!name) return alert('Enter your name');
    let acc = bank.createAccount(name,balance);
    alert('Account created Number :' + acc.accNumber);
    bank.saveAccount();
    render();
    document.getElementById("acc-name").value = "";
    document.getElementById("init-balance").value = "";

  
    

};

document.getElementById("dep-btn").onclick = function(){
    let accNum = document.getElementById("dep-acc").value;
    let amount = document.getElementById("dep-amount").value;
    let acc = bank.findAccount(accNum);
    if (!acc) return alert("Account Not Found");
    alert(acc.deposit(amount));
    bank.saveAccount();
    render();
    document.getElementById("dep-acc").value = "";
    document.getElementById("dep-amount").value = "";

};

document.getElementById("withd-btn").onclick = function(){
    let accNum = document.getElementById("withd-acc").value;
    let amount = document.getElementById("withd-amount").value;
    let acc = bank.findAccount(accNum);
    if (!acc) return alert('Account Not Found');
    alert(acc.withdraw(amount));
    bank.saveAccount();
    render();
    document.getElementById("withd-acc").value = "";
    document.getElementById("withd-amount").value = "";
};

function render(){
    document.getElementById("accounts").innerHTML = bank.showAll();
}

document.getElementById("transfer-btn").onclick = function(){
    let from = document.getElementById("from-acc").value;
    let to = document.getElementById("to-acc").value;
    let amount = document.getElementById("transfer-amount").value;

    let fromAcc = bank.findAccount(from);
    let toAcc = bank.findAccount(to);

    if (!fromAcc) return alert('Sender not found');
    if (!toAcc) return alert('receiver not found');
    if (amount <= 0) return alert ('amount not valid');
    if (fromAcc.getBalance()< amount) return alert('not enough balance in sender account!');

    fromAcc.withdraw(amount);
    toAcc.deposit(amount);
    fromAcc.transaction.push(`Transferred ${amount} EGP to ${toAcc.accNumber}`)
    toAcc.transaction.push(`Received ${amount} EGP from ${fromAcc.accNumber}`)
    bank.saveAccount();
    render();

    document.getElementById("from-acc").value = '';
    document.getElementById("to-acc").value = '';
    document.getElementById("transfer-amount").value = '';

    alert(`transeferd ${amount} EGP From ${from} to ${to}`)
}

render();


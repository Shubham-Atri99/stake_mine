
const inputamount=document.getElementById("input");
const inputform=document.getElementById("amount");
const mineform=document.getElementById("numberForm");
const amountdisplay=document.getElementById("amount-display");
const gamegrid=document.getElementById("gamegrid");
const messageArea=document.getElementById("msg-area")
const cashout = document.getElementById("cashoutbutton");
const mineSelect = document.getElementById("numberSelect");
const re=document.getElementById("restartbutton");
const res=document.getElementById("gamemodal")

const modalcontent=document.getElementById("modalcontent");

let upamount = 0;
let safeclick = 0;
let mineclick = 0;
let gameOver = false;
let totalMines = 0;
let walletAmount = 10000;
const walletDisplay = document.getElementById("wallet-display");

function updateWalletDisplay() {
  walletDisplay.textContent = `Wallet: ₹${walletAmount.toFixed(2)}`;
}


inputform.addEventListener("submit",(e)=>{
    e.preventDefault();
    if (gameOver) {
      return;
    }
    const input=inputamount.value.trim();

  if (isNaN(input) || input === "") {
    showMessage("Enter a valid number", true);
    return;
  }
   const amount=Number(input);
  if (amount > walletAmount) {
  showMessage("Not enough balance in wallet", true);
  return;
}
walletAmount -= amount;
updateWalletDisplay();
   upamount=amount;
    if (amount <= 0) {
    showMessage("Amount must be greater than 0", true);
    return;
  }
  
  amountdisplay.innerHTML=`Amount:${amount}`;



})
function showMessage(message, isError = false, isLoading = false) {
  messageArea.textContent = message;

   messageArea.className = "message"; 

  if (isError) {
    messageArea.classList.add("error");
  } else if (isLoading) {
    messageArea.classList.add("loading");
  }
}
mineform.addEventListener("change",(e)=>{
     
     const mines=mineSelect.value;

    if (!mines) {
  showMessage("Please select number of mines", true);
  return;
    }
     totalMines = mines;
  safeclick = 0;
  mineclick = 0;
  gameOver = false;
  setupmines(mines, 49);
  
  
    
})

let setting =new Set();
function setupmines(mines ,size){
  gamegrid.innerHTML="";
   setting=new Set();
  for (let i = 0; i < 49; i++) {
   const newdiv=document.createElement("div");
   newdiv.classList.add("elemet");
   newdiv.dataset.index=i;
   gamegrid.appendChild(newdiv);
    
  }

  let added = 0;
while (added < mines) {
  const randIndex = Math.floor(Math.random() * size);
  if (!setting.has(randIndex)) {
    setting.add(randIndex);
    added++;
  }
}
const cells = Array.from(gamegrid.children);

for (let i = 0; i < cells.length; i++) {
  if (setting.has(i)) {
    cells[i].classList.add("mine");
  }
}

}


gamegrid.addEventListener("click", (e) => {
   if (gameOver) return;
   if (!e.target.classList.contains("elemet")){
    return
   };
  showMessage("..");
  const index = Number(e.target.dataset.index);
   if (isNaN(index) || e.target.classList.contains("clicked")) return;

     e.target.classList.add("clicked");
 
  if (setting.has(index)) {
    e.target.style.backgroundColor = "red";
    upamount = 0;
    amountdisplay.innerHTML = `Amount: ${upamount.toFixed(2)}`;
    gameresultloss();
    showMessage(" You hit a mine! 'Jo prapt tha, vahi priyapt tha.'", true);
    gameOver = true;
    
  } else {
    e.target.style.backgroundColor = "green";
    safeclick++;
    const basevalue=1.02+(totalMines/100);
    upamount *= basevalue;
    amountdisplay.innerHTML = `Amount: ${upamount.toFixed(2)}`;
    showMessage(" Keep going! 'Risk hai to ishq hai.'");

    const totalSafeCells = 49 - totalMines;
    if (safeclick === totalSafeCells) {
      showMessage(" You won! All safe cells cleared!", false);
      gameOver = true;
    }
  }
});

function restartGame() {
  res.classList.add("hidden");
  gameOver = false;
  safeclick = 0;
  mineclick = 0;
   inputamount.value = "";
  amountdisplay.innerHTML = "Amount:";
  mineSelect.value="";
  const mines = Number(mineSelect.value);
  const amount = Number(inputamount.value.trim());

  gamegrid.innerHTML="";
  if (isNaN(mines) || mines <=0||mines>= 49) {
    showMessage("Please select valid number of mines", true);
    return;
  }
  if (isNaN(amount)||amount<=0) {
    showMessage("Enter a valid amount before restarting", true);
    return;
  }
  upamount =amount;
  amountdisplay.innerHTML=`Amount: ${upamount.toFixed(2)}`;
  showMessage("Game restarted. Good luck!");
  totalMines=mines;

  setupmines(mines, 49);
}



function gameresultloss(){
res.classList.remove("hidden");
modalcontent.innerHTML=`jo prapt tha vhi pariyapt tha`;
const cre=document.createElement("h2");
cre.innerHTML=`Final Amount:0`;
modalcontent.appendChild(cre);
const rescontain=document.createElement("div");
rescontain.classList.add("restart");
const resbutto=document.createElement("button");
resbutto.id='restartbutton';
resbutto.innerHTML=`Restart`;
resbutto.addEventListener("click", (e)=>{
  e.preventDefault();
  restartGame();
});
rescontain.appendChild(resbutto);
modalcontent.appendChild(rescontain);


}
cashout.addEventListener("click",cashoutf);

function cashoutf() {
  if (gameOver || safeclick === 0) {
    showMessage("You can't cash out now!", true);
    return;
  }
  walletAmount += upamount;
  updateWalletDisplay();
  gameOver = true;
  res.classList.remove("hidden");
  modalcontent.innerHTML = "";

  const originalAmount = Number(inputamount.value.trim());
  const multiplier = Math.pow(1.05, safeclick);
  const profit = upamount - originalAmount;

  const heading = document.createElement("h2");
heading.innerText = ` Cashout Successful!`;
modalcontent.appendChild(heading);

const multi = document.createElement("h2");
multi.innerText = `${multiplier.toFixed(2)}x`;
modalcontent.appendChild(multi);

const low = document.createElement("h2");
low.innerText = `could have won more xD`;
modalcontent.appendChild(low);

  const stats = document.createElement("p");
  stats.innerHTML = `
     Safe Clicks: ${safeclick}<br>
     Original Amount: ${originalAmount.toFixed(2)}<br>
     Final Amount: ${upamount.toFixed(2)}<br>
     Profit: ${profit.toFixed(2)}
  `;
  modalcontent.appendChild(stats);

  const rescontain = document.createElement("div");
  rescontain.classList.add("restart");

  const resbutton = document.createElement("button");
  resbutton.id = 'restartbutton';
  resbutton.innerText = "Restart";
  resbutton.addEventListener("click", (e) => {
    e.preventDefault();
    restartGame();
  });

  rescontain.appendChild(resbutton);
  modalcontent.appendChild(rescontain);
}

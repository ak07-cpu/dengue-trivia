// PLAYERS
const players = [
  { name: "Player 1", pos: 0, score: 0, skip:false },
  { name: "Player 2", pos: 0, score: 0, skip:false },
  { name: "Player 3", pos: 0, score: 0, skip:false },
  { name: "Player 4", pos: 0, score: 0, skip:false }
];

let turn = 0;
let timer, currentQ;

document.getElementById("player").innerText =
localStorage.getItem("player");

// TURN
function showTurn(){
  document.getElementById("turn").innerText = players[turn].name;
}
showTurn();

// BOARD
const board = document.getElementById("board");
let boxes = [];

// create 40 boxes
for (let i = 0; i < 40; i++) {
  let div = document.createElement("div");

  // COLOR ZONES
  if (i < 10) div.className = "box green";
  else if (i < 20) div.className = "box yellow";
  else if (i < 30) div.className = "box red";
  else div.className = "box blue";

  div.innerText = i;

  board.appendChild(div);
  boxes.push(div);
}

// POSITION THEM IN SQUARE PATH
let size = 40;
let gap = 2;

// bottom row (0–9)
for(let i=0;i<10;i++){
  boxes[i].style.left = (i*(size+gap))+"px";
  boxes[i].style.top = "380px";
}

// right side (10–19)
for(let i=10;i<20;i++){
  boxes[i].style.left = "380px";
  boxes[i].style.top = (380 - (i-10)*(size+gap))+"px";
}

// top row (20–29)
for(let i=20;i<30;i++){
  boxes[i].style.left = (380 - (i-20)*(size+gap))+"px";
  boxes[i].style.top = "0px";
}

// left side (30–39)
for(let i=30;i<40;i++){
  boxes[i].style.left = "0px";
  boxes[i].style.top = ((i-30)*(size+gap))+"px";
}

// TOKEN
const token = document.getElementById("token");

function moveToken(pos){
  let rect = boxes[pos].getBoundingClientRect();
  let bRect = board.getBoundingClientRect();

  token.style.left = (rect.left-bRect.left+15)+"px";
  token.style.top = (rect.top-bRect.top+15)+"px";
}

// 🎲 DICE ANIMATION
function rollDice(){

  let diceDisplay = document.getElementById("dice");

  let count = 0;

  let roll = setInterval(()=>{
    diceDisplay.innerText = Math.floor(Math.random()*6)+1;
    count++;

    if(count > 10){
      clearInterval(roll);

      let final = Math.floor(Math.random()*6)+1;
      diceDisplay.innerText = final;

      animateMove(final);
    }

  },100);
}

// 🚶 MOVE
function animateMove(step){

  let i = 0;
  let p = players[turn];

  let move = setInterval(()=>{

    if(i>=step){
      clearInterval(move);

      checkSpecialBox(p);
      loadQuestion(p);
      return;
    }

    p.pos++;
    if(p.pos>=40) p.pos=0;

    moveToken(p.pos);

    i++;
  },300);
}

// 🏥 SPECIAL BOXES
function checkSpecialBox(p){

  if(p.pos===9){
    alert("🏥 Hospital! Skip next turn");
    p.skip=true;
  }

  else if(p.pos===19){
    alert("💨 Fogging! Move +2");
    p.pos+=2;
    moveToken(p.pos);
  }

  else if(p.pos===29){
    alert("🚑 Go Hospital!");
    p.pos=9;
    moveToken(p.pos);
  }

}

// QUESTIONS (add more later)
const easy=[
{q:"Dengue spread by?",o:["Malaria","Dengue Fever","Flu","COVID"],a:1}
];

const medium=[
{q:"Breeding place?",o:["Flower pot","Book","Air","Shoe"],a:0}
];

const hard=[
{q:"Why hard control?",o:["Slow","Fast breeding","Big","Weak"],a:1}
];

const extreme=[
{q:"CO2 role?",o:["Noise","Signal","Heat","Light"],a:1}
];

// ❓ LOAD QUESTION
function loadQuestion(p){

  let level,time;

  if(p.pos<10){level=easy;time=10;}
  else if(p.pos<20){level=medium;time=15;}
  else if(p.pos<30){level=hard;time=20;}
  else{level=extreme;time=25;}

  currentQ = level[Math.floor(Math.random()*level.length)];

  document.getElementById("question").innerText = currentQ.q;

  let div=document.getElementById("options");
  div.innerHTML="";

  currentQ.o.forEach((opt,i)=>{
    let btn=document.createElement("button");
    btn.innerText=opt;
    btn.onclick=()=>checkAnswer(i,p);
    div.appendChild(btn);
  });

  startTimer(time);
}

// ✅ CHECK
function checkAnswer(choice,p){

  clearInterval(timer);

  if(choice===currentQ.a){
    p.score+=10;
    alert("✅ Correct!");
  }else{
    alert("❌ Wrong! Do task!");
  }

  document.getElementById("score").innerText=p.score;

  updateLeaderboard();
  nextTurn();
}

// ⏱ TIMER
function startTimer(t){

  document.getElementById("time").innerText=t;

  clearInterval(timer);

  timer=setInterval(()=>{
    t--;
    document.getElementById("time").innerText=t;

    if(t<=0){
      clearInterval(timer);
      alert("⏰ Time up!");
      nextTurn();
    }
  },1000);
}

// 🔄 TURN
function nextTurn(){

  turn++;

  if(turn>=players.length) turn=0;

  if(players[turn].skip){
    alert(players[turn].name+" skipped!");
    players[turn].skip=false;
    turn++;
    if(turn>=players.length) turn=0;
  }

  showTurn();
}

// 🏆 LEADERBOARD
function updateLeaderboard(){

  let board=document.getElementById("leaderboard");

  let sorted=[...players].sort((a,b)=>b.score-a.score);

  board.innerHTML="";

  sorted.forEach(p=>{
    let div=document.createElement("div");
    div.innerText=p.name+" : "+p.score;
    board.appendChild(div);
  });
}
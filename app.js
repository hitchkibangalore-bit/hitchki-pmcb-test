const API_URL='https://script.google.com/macros/s/AKfycbxntpMDOzRNtgseZ3yOIB3mg_125oEWqvudac7_GBD1u9XJ3h2RQmi4zaHbucUQixdwSw/exec';
let questions=[];let employee='';let violations=0;let duration=25*60;let timer;
document.addEventListener('visibilitychange',()=>{if(document.hidden){violations++;if(violations>=3){alert('Quiz terminated');location.reload();}}});
async function startQuiz(){
employee=document.getElementById('employee').value.trim();
if(!employee){alert('Enter employee name');return;}
const r=await fetch(API_URL+'?action=questions');
questions=await r.json();
questions=questions.sort(()=>0.5-Math.random()).slice(0,20);
render();
document.getElementById('submitBtn').style.display='block';
startTimer();
}
function render(){
let h='';
questions.forEach((q,i)=>{
h+=`<div class="q"><b>${i+1}. ${q.question}</b><br>`;
q.options.forEach(o=>h+=`<label><input type="radio" name="q${i}" value="${o}"> ${o}</label><br>`);
h+='</div>';
});
document.getElementById('quiz').innerHTML=h;
}
function startTimer(){
timer=setInterval(()=>{
duration--;
document.getElementById('timer').innerText='Time Left: '+Math.floor(duration/60)+':'+String(duration%60).padStart(2,'0');
if(duration<=0){clearInterval(timer);submitQuiz();}
},1000);
}
async function submitQuiz(){
let score=0;
questions.forEach((q,i)=>{
const a=document.querySelector(`input[name=q${i}]:checked`);
if(a && a.value===q.answer)score++;
});
const pct=Math.round(score/questions.length*100);
const status=pct>=50?'PASS':'FAIL';
await fetch(API_URL,{method:'POST',body:JSON.stringify({employee,score:pct,status,violations})});
alert('Assessment submitted. Status: '+status);
}
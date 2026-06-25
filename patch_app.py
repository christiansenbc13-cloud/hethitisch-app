import pathlib

new_js = """\
var actx=null;
function getACtx(){if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();return actx;}
function tone(f,s,d){var c=getACtx();c.resume();var o=c.createOscillator();var g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0.4,c.currentTime+s);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+s+d);o.start(c.currentTime+s);o.stop(c.currentTime+s+d+0.05);}
function playCorrect(){tone(523,0.00,0.10);tone(659,0.12,0.10);tone(784,0.24,0.20);}
function playWrong(){tone(294,0.00,0.15);tone(247,0.18,0.20);}

window._xp=0; window._streak=0; window._cardProgress={};
var mode="vocab", idx=0;

loadProgress();

function shuffle(a){return a.slice().sort(function(){return Math.random()-.5;});}

function updateHUD(){
document.getElementById("xp").textContent=window._xp;
document.getElementById("xp-fill").style.width=Math.min((window._xp%100),100)+"%";
document.getElementById("streak-count").textContent=window._streak;
}

function done(ok){
if(ok){window._xp+=10;window._streak++;playCorrect();}else{window._streak=0;playWrong();}
updateHUD();
saveProgress();
document.getElementById("next-btn").style.display="block";
}

function showExercise(){
var a=document.getElementById("exercise-area");
a.innerHTML="";
document.getElementById("next-btn").style.display="none";
if(mode==="vocab") renderVocab(a);
else if(mode==="cloze") renderCloze(a);
else if(mode==="order") renderOrder(a);
else if(mode==="grammar") renderGrammar(a);
}

document.getElementById("next-btn").onclick=function(){idx++;showExercise();};
document.querySelectorAll(".module-btn").forEach(function(btn){
btn.onclick=function(){
mode=btn.dataset.mode; idx=0;
document.querySelectorAll(".module-btn").forEach(function(b){b.classList.toggle("active",b===btn);});
showExercise();
};
});
window.onload=function(){ updateHUD(); showExercise(); };
"""

old = pathlib.Path('app.js').read_text(encoding='utf-8')
# Alles bis zum ersten renderVocab behalten wir, Rest kommt neu
split = old.find('// ── Vokabeln')
rest = old[split:] if split != -1 else old[old.find('function renderVocab'):]
pathlib.Path('app.js').write_text(new_js + rest, encoding='utf-8')
print('Fertig!')

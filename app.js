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
  if(ok){window._xp+=10;window._streak++;}else{window._streak=0;}
  updateHUD();
  saveProgress();
  document.getElementById("next-btn").style.display="block";
}

function showExercise(){
  var a=document.getElementById("exercise-area");
  a.innerHTML="";
  document.getElementById("next-btn").style.display="none";
  if(mode==="vocab")    renderVocab(a);
  else if(mode==="multi")   renderMulti(a);
  else if(mode==="cloze")   renderCloze(a);
  else if(mode==="order")   renderOrder(a);
  else if(mode==="grammar") renderGrammar(a);
}

window.onload=function(){
  updateHUD();
  showExercise();
  document.getElementById("next-btn").onclick=function(){idx++;showExercise();};
  document.querySelectorAll(".module-btn").forEach(function(btn){
    btn.onclick=function(){
      mode=btn.dataset.mode; idx=0;
      document.querySelectorAll(".module-btn").forEach(function(b){b.classList.toggle("active",b===btn);});
      showExercise();
    };
  });
};

// ── Karteikarten (Aufdecken) ──────────────────────────────────────────────────
function renderVocab(area){
  var card=VOCAB[idx%VOCAB.length];
  var cu=document.createElement("div");cu.className="vocab-cu";cu.textContent=card.cuneiform;area.appendChild(cu);
  var tr=document.createElement("div");tr.className="vocab-tr";tr.textContent=card.transliteration;area.appendChild(tr);
  var lm=document.createElement("div");lm.className="vocab-lemma";lm.textContent=card.lemma;area.appendChild(lm);
  var q=document.createElement("div");q.className="vocab-q";q.textContent="Was bedeutet dieses Wort?";area.appendChild(q);
  var revBtn=document.createElement("button");revBtn.className="reveal-btn";revBtn.textContent="Bedeutung aufdecken";
  area.appendChild(revBtn);
  var back=document.createElement("div");back.className="vocab-back";back.style.display="none";
  back.textContent=card.german;area.appendChild(back);
  var fb=document.createElement("div");fb.className="vocab-fb";fb.style.display="none";
  var btnOk=document.createElement("button");btnOk.className="rate-btn rate-ok";btnOk.textContent="\u2713 Gewusst";
  var btnNo=document.createElement("button");btnNo.className="rate-btn rate-no";btnNo.textContent="\u2717 Nicht gewusst";
  fb.appendChild(btnOk);fb.appendChild(btnNo);area.appendChild(fb);
  revBtn.onclick=function(){
    revBtn.style.display="none";
    back.style.display="block";
    fb.style.display="flex";
  };
  btnOk.onclick=function(){sm2(card,5);done(true); fb.querySelectorAll("button").forEach(function(b){b.onclick=null;});};
  btnNo.onclick=function(){sm2(card,1);done(false);fb.querySelectorAll("button").forEach(function(b){b.onclick=null;});};
}

// ── Multiple Choice ───────────────────────────────────────────────────────────
function renderMulti(area){
  var card=VOCAB[idx%VOCAB.length];
  var opts=shuffle([card].concat(shuffle(VOCAB.filter(function(v){return v!==card;})).slice(0,3)));
  var cu=document.createElement("div");cu.className="vocab-cu";cu.textContent=card.cuneiform;area.appendChild(cu);
  var tr=document.createElement("div");tr.className="vocab-tr";tr.textContent=card.transliteration;area.appendChild(tr);
  var lm=document.createElement("div");lm.className="vocab-lemma";lm.textContent=card.lemma;area.appendChild(lm);
  var q=document.createElement("div");q.className="vocab-q";q.textContent="Was bedeutet dieses Wort?";area.appendChild(q);
  var grid=document.createElement("div");grid.className="choices";area.appendChild(grid);
  opts.forEach(function(opt){
    var btn=document.createElement("button");btn.className="choice-btn";btn.textContent=opt.german;
    btn.onclick=function(){
      grid.querySelectorAll("button").forEach(function(b){b.onclick=null;});
      var ok=opt===card;
      btn.classList.add(ok?"correct":"wrong");
      if(!ok)grid.querySelectorAll("button").forEach(function(b){if(b.textContent===card.german)b.classList.add("correct");});
      sm2(card,ok?5:1);
      done(ok);
    };
    grid.appendChild(btn);
  });
}

// ── Grammatik ─────────────────────────────────────────────────────────────────
function renderGrammar(area){
  var card=GRAMMAR[idx%GRAMMAR.length];
  var badge=document.createElement("div");badge.className="gram-badge";badge.textContent="Endung";area.appendChild(badge);
  var form=document.createElement("div");form.className="gram-form";form.textContent=card.form;area.appendChild(form);
  var ex=document.createElement("p");ex.className="gram-example";
  ex.innerHTML="z.B. "+card.example_translit+" = \u201e"+card.example_german+"\u201c";area.appendChild(ex);
  var q=document.createElement("p");q.className="vocab-q";q.textContent="Welche grammatische Form ist das?";area.appendChild(q);
  var opts=shuffle(card.choices.slice());
  var grid=document.createElement("div");grid.className="choices";area.appendChild(grid);
  opts.forEach(function(choice){
    var btn=document.createElement("button");btn.className="choice-btn";btn.textContent=choice;
    btn.onclick=function(){
      grid.querySelectorAll("button").forEach(function(b){b.onclick=null;});
      var ok=choice===card.rule;
      btn.classList.add(ok?"correct":"wrong");
      if(!ok)grid.querySelectorAll("button").forEach(function(b){if(b.textContent===card.rule)b.classList.add("correct");});
      var fb=document.createElement("div");fb.className="ex-fb "+(ok?"correct":"wrong");
      fb.innerHTML=(ok?"\u2713 Richtig! ":"\u2717 Falsch. ")+"<em>"+card.form+"</em> = "+card.rule;
      area.appendChild(fb);
      done(ok);
    };
    grid.appendChild(btn);
  });
}

// ── Lückentext ────────────────────────────────────────────────────────────────
function renderCloze(area){
  var lesson=LESSONS[idx%LESSONS.length];
  var kws=lesson.key_words;
  var target=kws[Math.floor(Math.random()*kws.length)];
  var gapped=lesson.transliteration.replace(target.token,"___");
  var allKws=LESSONS.reduce(function(a,l){return a.concat(l.key_words);},[]);
  var dists=shuffle(allKws.filter(function(k){return k.token!==target.token;})).slice(0,3).map(function(k){return k.token;});
  var opts=shuffle([target.token].concat(dists));
  var meta=document.createElement("p");meta.className="ex-meta";meta.textContent=lesson.siglum+" \u00b7 Zeile "+lesson.line;area.appendChild(meta);
  var tr=document.createElement("div");tr.className="ex-tr";tr.innerHTML=gapped.replace("___","<span class=\"gap\">___</span>");area.appendChild(tr);
  var hint=document.createElement("p");hint.className="ex-hint";hint.textContent="\u00dcbersetzung: "+lesson.german;area.appendChild(hint);
  var q=document.createElement("p");q.className="ex-q";q.textContent="Welches Token fehlt?";area.appendChild(q);
  var grid=document.createElement("div");grid.className="ex-choices";area.appendChild(grid);
  opts.forEach(function(choice){
    var btn=document.createElement("button");btn.className="choice-btn";btn.textContent=choice;
    btn.onclick=function(){
      grid.querySelectorAll("button").forEach(function(b){b.onclick=null;});
      var ok=choice===target.token;
      btn.classList.add(ok?"correct":"wrong");
      if(!ok)grid.querySelectorAll("button").forEach(function(b){if(b.textContent===target.token)b.classList.add("correct");});
      var gap=tr.querySelector(".gap");if(gap){gap.textContent=target.token;gap.className="gap "+(ok?"ok":"err");}
      var fb=document.createElement("div");fb.className="ex-fb "+(ok?"correct":"wrong");
      fb.innerHTML=(ok?"\u2713 Richtig! ":"\u2717 Falsch. ")+"<em>"+target.token+"</em> = "+target.transliteration+" \u2192 \u201e"+target.german+"\u201c";
      area.appendChild(fb);
      done(ok);
    };
    grid.appendChild(btn);
  });
}

// ── Reihenfolge ───────────────────────────────────────────────────────────────
function renderOrder(area){
  var lesson=LESSONS[idx%LESSONS.length];
  var kws=lesson.key_words;
  var correct=kws.map(function(k){return k.german;});
  var chips=shuffle(correct.slice());
  var meta=document.createElement("p");meta.className="ex-meta";meta.textContent=lesson.siglum+" \u00b7 Zeile "+lesson.line;area.appendChild(meta);
  var tr=document.createElement("div");tr.className="ex-tr";tr.textContent=lesson.transliteration;area.appendChild(tr);
  var q=document.createElement("p");q.className="ex-q";q.textContent="Bringe die Bedeutungen in die richtige Reihenfolge:";area.appendChild(q);
  var dz=document.createElement("div");dz.className="order-dz";area.appendChild(dz);
  correct.forEach(function(_,i){var s=document.createElement("div");s.className="order-slot";s.textContent=(i+1)+". ???";dz.appendChild(s);});
  var cz=document.createElement("div");cz.className="order-cz";area.appendChild(cz);
  var placed=[];var next=0;
  chips.forEach(function(german){
    var chip=document.createElement("button");chip.className="order-chip";chip.textContent=german;
    chip.onclick=function(){
      if(next>=correct.length)return;
      placed[next]=german;
      dz.children[next].textContent=(next+1)+". "+german;
      dz.children[next].className="order-slot filled";
      chip.disabled=true;chip.classList.add("used");next++;
      if(next===correct.length){
        var ok=0;
        for(var i=0;i<correct.length;i++){if(placed[i]===correct[i])ok++;}
        var allOk=(ok===correct.length);
        var fb=document.createElement("div");fb.className="ex-fb "+(allOk?"correct":"wrong");
        fb.textContent=allOk?"\u2713 Perfekt!":ok+" von "+correct.length+" richtig.";
        area.appendChild(fb);
        sm2(lesson,allOk?5:2);
        done(allOk);
      }
    };
    cz.appendChild(chip);
  });
}

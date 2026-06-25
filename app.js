// --- KEILSCHRIFT-GENERATOR ---
const CUNEIFORM_MAP = {
  // Logogramme
  "KUR": "𒆳", "LÚ": "𒇽", "URU": "𒌷", "DINGIR": "𒀭", 
  "IM": "𒅎", "ANA": "𒀀𒈾", "MU": "𒈬", "KAM": "𒄰", 
  "UL": "𒌌", "BELI": "𒁁𒇷", "YA": "𒅀", "ARAD": "𒀴",
  "KU": "𒆪", "NU": "𒉡", "MUNUS": "𒊩", "DUMU": "𒌉",
  
  // Syllabogramme
  "pa": "𒉺", "i": "𒄿", "mi": "𒈪", "eš": "𒌍", "zi": "𒍣",
  "na": "𒈾", "am": "𒄠", "ma": "𒈠", "ši": "𒅆", "ú": "𒌑", 
  "uš": "𒍑", "an": "𒀭", "tu": "𒌅", "uḫ": "𒄴", "ša": "𒊭", 
  "aš": "𒀸", "be": "𒁁", "li": "𒇷", "ya": "𒅀", "u": "𒌋", 
  "at": "𒀜", "mu": "𒈬", "it": "𒀉", "wa": "𒉿", "me": "𒈨", 
  "ki": "𒆠", "iš": "𒅖", "ku": "𒆪", "te": "𒋼", "en": "𒂗", 
  "hi": "𒄭", "in": "𒅔", "kán": "간", "tar": "𒋻", "ek": "𒅅", 
  "ta": "𒋫", "ga": "𒂵", "az": "𒊍", "ak": "𒀝", "a": "𒀀", 
  "la": "𒆷", "aḫ": "𒄴", "ḫi": "𒄭", "pít": "𒁉", "ḫu": "𒄷",
  "ḫa": "𒄩", "šu": "𒋗", "ra": "𒊏", "tar": "𒋻", "ḫur": "𒄯",
  "ne": "𒉈", "pí": "𒁉", "ud": "𒌓", "e": "𒂊", "ri": "𒊑",
  "ḫar": "𒄯", "ar": "𒅈", "da": "𒁕", "lu": "𒇻", "šal": "шал",
  "up": "𒌒", "pu": "𒁍", "šak": "𒊕", "uk": "𒊌"
};

function translitToCuneiform(text) {
  if (!text) return "";
  let cleanText = text.replace(/\s*\(.*?\)/g, '');
  return cleanText.split(/([\s\-]+)/).map(token => {
    if (token === "-") return ""; 
    if (token.match(/\s+/)) return " "; 
    let sign = CUNEIFORM_MAP[token];
    if (sign) return sign;
    return "[" + token + "]";
  }).join("");
}

// --- SPIEL-STATUS & SOUNDS ---
window._xp=0; window._streak=0; window._cardProgress={};
var sndOk    = new Audio('richtig.mp3');
var sndWrong = new Audio('falsch.mp3');
function playSound(ok){ if(ok) sndOk.play(); else sndWrong.play(); }

function saveProgress(){
  localStorage.setItem("heth_xp",window._xp);
  localStorage.setItem("heth_streak",window._streak);
  localStorage.setItem("heth_srs",JSON.stringify(window._cardProgress));
}
function loadProgress(){
  window._xp=parseInt(localStorage.getItem("heth_xp")||"0");
  window._streak=parseInt(localStorage.getItem("heth_streak")||"0");
  try{window._cardProgress=JSON.parse(localStorage.getItem("heth_srs")||"{}");}
  catch(e){window._cardProgress={};}
}
loadProgress();

// --- IMPORTIERTE VOKABELN LADEN ---
var savedVocab = localStorage.getItem("heth_custom_vocab");
if (savedVocab) {
  try {
    var customVocab = JSON.parse(savedVocab);
    customVocab.forEach(function(cv) {
       // Füge sie nur hinzu, wenn sie nicht ohnehin in data.js stehen
       if(!VOCAB.some(function(v) { return v.transliteration === cv.transliteration; })) {
           VOCAB.push(cv);
       }
    });
  } catch(e) {
    console.error("Fehler beim Laden der importierten Vokabeln.");
  }
}

// --- LERN-ALGORITHMUS (Spaced Repetition) ---
function sm2(card,quality){
  var key=card.transliteration||card.form||"x";
  var c=window._cardProgress[key]||{rep:0,interval:1,ef:2.5,next:0};
  if(quality>=3){
    if(c.rep===0)c.interval=1;
    else if(c.rep===1)c.interval=6;
    else c.interval=Math.round(c.interval*c.ef);
    c.rep++;
  }else{c.rep=0;c.interval=1;}
  c.ef=Math.max(1.3,c.ef+0.1-(5-quality)*(0.08+(5-quality)*0.02));
  c.next=Date.now()+c.interval*86400000;
  window._cardProgress[key]=c;
  saveProgress();
}

function srsStatus(card){
  var key=card.transliteration||card.form||"x";
  var c=window._cardProgress[key];
  if(!c)return null;
  return{interval:c.interval,ef:c.ef.toFixed(1),
         daysLeft:Math.max(0,Math.round((c.next-Date.now())/86400000)),rep:c.rep};
}

function showSRSBar(area,card,baseOk){
  var bar=document.createElement("div");bar.className="srs-bar";
  var label=document.createElement("p");label.className="srs-label";
  label.textContent="Wie sicher warst du?";bar.appendChild(label);
  [{label:"😰 Schwer",q:baseOk?3:1,cls:"srs-btn srs-hard"},
   {label:"🙂 Gut",   q:baseOk?4:2,cls:"srs-btn srs-ok"},
   {label:"⚡ Sofort",q:baseOk?5:2,cls:"srs-btn srs-easy"}
  ].forEach(function(b){
    var btn=document.createElement("button");btn.className=b.cls;btn.textContent=b.label;
    btn.onclick=function(){
      sm2(card,b.q);
      bar.querySelectorAll("button").forEach(function(x){x.disabled=true;});
      btn.classList.add("srs-selected");
      var st=srsStatus(card);
      if(st){
        var info=document.createElement("p");info.className="srs-info";
        info.textContent="Wiederholung "+(st.daysLeft===0?"heute":"in "+st.daysLeft+" Tag(en)")+
          " · Intervall: "+st.interval+"d · EF: "+st.ef;
        bar.appendChild(info);
      }
      document.getElementById("next-btn").style.display="block";
    };
    bar.appendChild(btn);
  });
  area.appendChild(bar);
}

// --- HAUPTSTEUERUNG ---
var mode="vocab",idx=0;
function shuffle(a){return a.slice().sort(function(){return Math.random()-.5;});}
function updateHUD(){
  document.getElementById("xp").textContent=window._xp;
  document.getElementById("xp-fill").style.width=Math.min((window._xp%100),100)+"%";
  document.getElementById("streak-count").textContent=window._streak;
}
function done(ok,card,showSRS,area){
  playSound(ok);
  if(ok){window._xp+=10;window._streak++;}else{window._streak=0;}
  updateHUD();saveProgress();
  if(showSRS&&card&&area)showSRSBar(area,card,ok);
  else document.getElementById("next-btn").style.display="block";
}

function showExercise(){
  var a=document.getElementById("exercise-area");
  if(!a) return;
  a.innerHTML="";document.getElementById("next-btn").style.display="none";
  if(mode==="vocab")renderVocab(a);
  else if(mode==="grammar")renderGrammar(a);
  else if(mode==="cloze")renderCloze(a);
  else if(mode==="order")renderOrder(a);
}

document.getElementById("next-btn").onclick=function(){idx++;showExercise();};

document.querySelectorAll(".module-btn").forEach(function(btn){
  btn.onclick=function(){
    // Verhindert, dass die XML-Buttons die Ansicht löschen!
    if (btn.id === "xml-upload-btn" || btn.id === "xml-reset-btn") return;
    
    mode=btn.dataset.mode;idx=0;
    document.querySelectorAll(".module-btn").forEach(function(b){
      if (b.id !== "xml-upload-btn" && b.id !== "xml-reset-btn") {
        b.classList.toggle("active",b===btn);
      }
    });
    showExercise();
  };
});

// --- RENDER-FUNKTIONEN (Module) ---
function renderVocab(area){
  if(!VOCAB || VOCAB.length === 0) { area.innerHTML = "Keine Vokabeln vorhanden."; return; }
  var card=VOCAB[idx%VOCAB.length];
  var opts=shuffle([card].concat(shuffle(VOCAB.filter(function(v){return v!==card;})).slice(0,3)));
  
  var cu=document.createElement("div");cu.className="vocab-cu";
  cu.textContent=card.cuneiform || translitToCuneiform(card.transliteration);
  area.appendChild(cu);
  
  var tr=document.createElement("div");tr.className="vocab-tr";tr.textContent="["+card.transliteration+"]";area.appendChild(tr);
  if(card.wordclass){var wc=document.createElement("span");wc.className="srs-badge";wc.textContent=card.wordclass;area.appendChild(wc);}
  var st=srsStatus(card);
  if(st){var sb=document.createElement("span");sb.className="srs-badge";sb.textContent=st.daysLeft===0?"🔁 Fällig":"⏳ in "+st.daysLeft+"d";area.appendChild(sb);}
  var q=document.createElement("div");q.className="vocab-q";q.textContent="Was bedeutet dieses Wort?";area.appendChild(q);
  var grid=document.createElement("div");grid.className="choices";area.appendChild(grid);
  opts.forEach(function(opt){
    var btn=document.createElement("button");btn.className="choice-btn";btn.textContent=opt.german;
    btn.onclick=function(){
      grid.querySelectorAll("button").forEach(function(b){b.onclick=null;});
      var ok=opt===card;
      btn.classList.add(ok?"correct":"wrong");
      if(!ok)grid.querySelectorAll("button").forEach(function(b){if(b.textContent===card.german)b.classList.add("correct");});
      done(ok,card,true,area);
    };
    grid.appendChild(btn);
  });
}

function renderGrammar(area){
  if(!GRAMMAR || GRAMMAR.length === 0) { area.innerHTML = "Keine Grammatik vorhanden."; return; }
  var card=GRAMMAR[idx%GRAMMAR.length];
  var badge=document.createElement("div");badge.className="gram-badge";badge.textContent=card.topic||"Endung";area.appendChild(badge);
  var form=document.createElement("div");form.className="gram-form";form.textContent=card.form;area.appendChild(form);
  var ex=document.createElement("p");ex.className="gram-example";
  ex.innerHTML="z.B. <em>"+card.example_translit+"</em> = \u201e"+card.example_german+"\u201c";area.appendChild(ex);
  if(card.section){var ref=document.createElement("p");ref.className="gram-ref";ref.textContent="\u2192 Melchert GrHL "+card.section;area.appendChild(ref);}
  var st2=srsStatus(card);
  if(st2){var sb2=document.createElement("span");sb2.className="srs-badge";sb2.textContent=st2.daysLeft===0?"🔁 Fällig":"⏳ in "+st2.daysLeft+"d";area.appendChild(sb2);}
  var qEl=document.createElement("p");qEl.className="vocab-q";qEl.textContent="Welche grammatische Form ist das?";area.appendChild(qEl);
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
      fb.innerHTML=(ok?"✓ Richtig! ":"✗ Falsch. ")+"<strong>"+card.form+"</strong> = "+card.rule;
      area.appendChild(fb);
      done(ok,card,true,area);
    };
    grid.appendChild(btn);
  });
}

function renderCloze(area){
  if(!LESSONS || LESSONS.length === 0) { area.innerHTML = "Keine Lektionen vorhanden."; return; }
  var lesson=LESSONS[idx%LESSONS.length];
  var kws=lesson.key_words;
  if(!kws || kws.length === 0) { idx++; showExercise(); return; }
  var target=kws[Math.floor(Math.random()*kws.length)];
  var gapped=lesson.transliteration.replace(target.token,'<span class="gap">___</span>');
  var allKws=LESSONS.reduce(function(a,l){return a.concat(l.key_words||[]);},[]);
  var dists=shuffle(allKws.filter(function(k){return k.token!==target.token;})).slice(0,3).map(function(k){return k.token;});
  var opts=shuffle([target.token].concat(dists));
  var meta=document.createElement("p");meta.className="ex-meta";meta.textContent=lesson.siglum+" \u00b7 Zeile "+lesson.line;area.appendChild(meta);
  var trEl=document.createElement("div");trEl.className="ex-tr";trEl.innerHTML=gapped;area.appendChild(trEl);
  var hint=document.createElement("p");hint.className="ex-hint";hint.textContent="Übersetzung: "+lesson.german;area.appendChild(hint);
  var qEl=document.createElement("p");qEl.className="ex-q";qEl.textContent="Welches Token fehlt?";area.appendChild(qEl);
  var grid=document.createElement("div");grid.className="ex-choices";area.appendChild(grid);
  opts.forEach(function(choice){
    var btn=document.createElement("button");btn.className="choice-btn";btn.textContent=choice;
    btn.onclick=function(){
      grid.querySelectorAll("button").forEach(function(b){b.onclick=null;});
      var ok=choice===target.token;
      btn.classList.add(ok?"correct":"wrong");
      if(!ok)grid.querySelectorAll("button").forEach(function(b){if(b.textContent===target.token)b.classList.add("correct");});
      var gap=trEl.querySelector(".gap");
      if(gap){gap.textContent=target.token;gap.className="gap "+(ok?"ok":"err");}
      var fb=document.createElement("div");fb.className="ex-fb "+(ok?"correct":"wrong");
      fb.innerHTML=(ok?"✓ Richtig! ":"✗ Falsch. ")+"<strong>"+target.token+"</strong> = "+target.transliteration+" \u2192 \u201e"+target.german+"\u201c";
      area.appendChild(fb);
      done(ok,target,true,area);
    };
    grid.appendChild(btn);
  });
}

function renderOrder(area){
  if(!LESSONS || LESSONS.length === 0) { area.innerHTML = "Keine Lektionen vorhanden."; return; }
  var lesson=LESSONS[idx%LESSONS.length];
  var kws=lesson.key_words;
  if(!kws || kws.length === 0) { idx++; showExercise(); return; }
  var correct=kws.map(function(k){return k.german;});
  var chips=shuffle(correct.slice());
  var meta=document.createElement("p");meta.className="ex-meta";meta.textContent=lesson.siglum+" \u00b7 Zeile "+lesson.line;area.appendChild(meta);
  var trEl=document.createElement("div");trEl.className="ex-tr";trEl.textContent=lesson.transliteration;area.appendChild(trEl);
  var qEl=document.createElement("p");qEl.className="ex-q";qEl.textContent="Bringe die Bedeutungen in die richtige Reihenfolge:";area.appendChild(qEl);
  var dz=document.createElement("div");dz.className="order-dz";area.appendChild(dz);
  correct.forEach(function(_,i){
    var s=document.createElement("div");s.className="order-slot";
    s.textContent=(i+1)+". ???";dz.appendChild(s);
  });
  var cz=document.createElement("div");cz.className="order-cz";area.appendChild(cz);
  var placed=[],next=0;
  chips.forEach(function(german){
    var chip=document.createElement("button");chip.className="order-chip";chip.textContent=german;
    chip.onclick=function(){
      if(next>=correct.length)return;
      placed[next]=german;
      dz.children[next].textContent=(next+1)+". "+german;
      dz.children[next].className="order-slot filled";
      chip.disabled=true;chip.classList.add("used");next++;
      if(next===correct.length){
        var score=0;
        for(var i=0;i<correct.length;i++)if(placed[i]===correct[i])score++;
        var ok=score===correct.length;
        var fb=document.createElement("div");fb.className="ex-fb "+(ok?"correct":"wrong");
        fb.textContent=ok?"✓ Perfekte Reihenfolge!":"✗ "+score+"/"+correct.length+" richtig.";
        area.appendChild(fb);
        done(ok,kws[0],false,area);
        document.getElementById("next-btn").style.display="block";
      }
    };
    cz.appendChild(chip);
  });
}

// --- XML-UPLOAD & PARSER (SICHER & DAUERHAFT) ---
function createUploadButton() {
  var btnArea = document.createElement("div");
  btnArea.style.textAlign = "center";
  btnArea.style.marginTop = "30px";

  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "xml-upload";
  fileInput.accept = ".xml";
  fileInput.style.display = "none";

  var uploadBtn = document.createElement("button");
  uploadBtn.id = "xml-upload-btn";
  uploadBtn.className = "module-btn";
  uploadBtn.style.backgroundColor = "#4682b4"; // Blau, um ihn abzuheben
  uploadBtn.textContent = "📂 XML Vokabeln importieren";
  uploadBtn.onclick = function() { fileInput.click(); };

  var resetBtn = document.createElement("button");
  resetBtn.id = "xml-reset-btn";
  resetBtn.className = "module-btn";
  resetBtn.style.marginLeft = "10px";
  resetBtn.style.backgroundColor = "#8b0000"; // Dunkelrot
  resetBtn.textContent = "🗑️ Importierte löschen";
  resetBtn.onclick = function() { 
    if(confirm("Alle importierten Vokabeln löschen? Die Basis-Vokabeln bleiben erhalten.")) {
      localStorage.removeItem("heth_custom_vocab");
      location.reload(); 
    }
  };

  fileInput.addEventListener("change", function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(event) { parseXMLData(event.target.result); };
    reader.readAsText(file);
  });

  btnArea.appendChild(fileInput);
  btnArea.appendChild(uploadBtn);
  btnArea.appendChild(resetBtn);
  
  var container = document.querySelector(".app-container") || document.body;
  container.appendChild(btnArea);
}

function parseXMLData(xmlString) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
  var wordNodes = xmlDoc.getElementsByTagName("w"); 
  var addedCount = 0;
  var newVocab = [];
  
  for (var i = 0; i < wordNodes.length; i++) {
    var translit = wordNodes[i].textContent.trim();
    
    // Ignoriere leere oder defekte Strings
    if (translit && translit.length > 1 && !translit.includes("\n")) {
      var existsInBase = VOCAB.some(function(v) { return v.transliteration === translit; });
      var existsInNew = newVocab.some(function(v){ return v.transliteration === translit; });
      
      if (!existsInBase && !existsInNew) {
        newVocab.push({
          transliteration: translit,
          german: "??? (aus XML)", 
          wordclass: "XML Import"
        });
        addedCount++;
      }
    }
  }
  
  if (addedCount > 0) {
    // Füge neue Vokabeln dem aktuellen Array hinzu
    VOCAB = VOCAB.concat(newVocab);
    
    // Füge neue Vokabeln dem LocalStorage hinzu
    var existingCustom = [];
    var savedVocabStorage = localStorage.getItem("heth_custom_vocab");
    if(savedVocabStorage) { 
      try { existingCustom = JSON.parse(savedVocabStorage); } catch(e){} 
    }
    existingCustom = existingCustom.concat(newVocab);
    localStorage.setItem("heth_custom_vocab", JSON.stringify(existingCustom));
    
    alert(addedCount + " neue Vokabeln erfolgreich importiert! Sie sind nun dauerhaft gespeichert.");
    
    // Starte die Vokabel-Übung neu, um die neuen Wörter zu zeigen
    mode = "vocab"; 
    idx = 0;
    showExercise(); 
  } else {
    alert("Keine neuen Wörter im XML gefunden (oder sie existieren schon).");
  }
}

// --- START ---
window.onload = function() {
  updateHUD();
  showExercise();
  createUploadButton();
};
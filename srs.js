function sm2(card, q){
  if(!card.interval)    card.interval=1;
  if(!card.easeFactor)  card.easeFactor=2.5;
  if(!card.repetitions) card.repetitions=0;
  if(q>=3){
    if(card.repetitions===0)      card.interval=1;
    else if(card.repetitions===1) card.interval=6;
    else card.interval=Math.round(card.interval*card.easeFactor);
    card.repetitions++;
  } else { card.repetitions=0; card.interval=1; }
  card.easeFactor=Math.max(1.3, card.easeFactor+0.1-(5-q)*(0.08+(5-q)*0.02));
  card.nextDue = today() + card.interval;
  return card;
}

function today(){
  var d=new Date(); return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();
}

function isDue(card){
  return !card.nextDue || card.nextDue <= today();
}

function saveProgress(){
  var state={xp:window._xp, streak:window._streak,
             cardProgress:window._cardProgress,
             lastStudyDate:window._lastStudyDate,
             dailyRounds:window._dailyRounds,
             todayXP:window._todayXP};
  try{ localStorage.setItem("hethitisch_save", JSON.stringify(state)); }catch(e){}
}

function loadProgress(){
  try{
    var s=localStorage.getItem("hethitisch_save");
    if(s){
      var st=JSON.parse(s);
      window._xp            = st.xp||0;
      window._streak        = st.streak||0;
      window._cardProgress  = st.cardProgress||{};
      window._lastStudyDate = st.lastStudyDate||0;
      window._dailyRounds   = st.dailyRounds||0;
      window._todayXP       = st.todayXP||0;
      // Reset daily rounds if it's a new day
      if(window._lastStudyDate !== today()){
        window._dailyRounds=0;
        window._todayXP=0;
      }
    }
  }catch(e){}
}
function sm2(card,q){
  if(!card.interval)card.interval=1;
  if(!card.easeFactor)card.easeFactor=2.5;
  if(!card.repetitions)card.repetitions=0;
  if(q>=3){
    if(card.repetitions===0)card.interval=1;
    else if(card.repetitions===1)card.interval=6;
    else card.interval=Math.round(card.interval*card.easeFactor);
    card.repetitions++;
  } else { card.repetitions=0; card.interval=1; }
  card.easeFactor=Math.max(1.3,card.easeFactor+0.1-(5-q)*(0.08+(5-q)*0.02));
  return card;
}

function saveProgress(){
  var state={xp:window._xp,streak:window._streak,cardProgress:window._cardProgress};
  try{localStorage.setItem("hethitisch_save",JSON.stringify(state));}catch(e){}
}

function loadProgress(){
  try{
    var s=localStorage.getItem("hethitisch_save");
    if(s){
      var state=JSON.parse(s);
      window._xp=state.xp||0;
      window._streak=state.streak||0;
      window._cardProgress=state.cardProgress||{};
    }
  }catch(e){}
}
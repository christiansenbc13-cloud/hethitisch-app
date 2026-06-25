var VOCAB = [
  // --- GÖTTER & MENSCHEN ---
  {transliteration: "ši-ú-uš", german: "Gott", wordclass: "Subst. (c.)"},
  {transliteration: "an-tu-uḫ-ša-aš", german: "Mensch", wordclass: "Subst. (c.)"},
  {transliteration: "ḫa-aš-šu-uš", german: "König", wordclass: "Subst. (c.)"},
  {transliteration: "ḫa-aš-šu-uš-ša-ra-aš", german: "Königin", wordclass: "Subst. (c.)"},
  {transliteration: "at-ta-aš", german: "Vater", wordclass: "Subst. (c.)"},
  {transliteration: "an-na-aš", german: "Mutter", wordclass: "Subst. (c.)"},
  {transliteration: "DUMU-aš", german: "Sohn / Kind", wordclass: "Subst. (c.)"},
  {transliteration: "LÚ-iš", german: "Mann", wordclass: "Subst. (c.)"},
  {transliteration: "MUNUS-za", german: "Frau", wordclass: "Subst. (c.)"},
  
  // --- NATUR & WELT ---
  {transliteration: "wa-a-tar", german: "Wasser", wordclass: "Subst. (n.)"},
  {transliteration: "pa-a-aḫ-ḫur", german: "Feuer", wordclass: "Subst. (n.)"},
  {transliteration: "ne-pí-iš", german: "Himmel", wordclass: "Subst. (n.)"},
  {transliteration: "te-kán", german: "Erde", wordclass: "Subst. (n.)"},
  {transliteration: "ud-ne-e", german: "Land", wordclass: "Subst. (n.)"},
  {transliteration: "URU-ri-iš", german: "Stadt", wordclass: "Subst. (c.)"},
  {transliteration: "ḫar-ša-ar", german: "Kopf", wordclass: "Subst. (n.)"},
  {transliteration: "e-eš-ḫar", german: "Blut", wordclass: "Subst. (n.)"},

  // --- ADJEKTIVE ---
  {transliteration: "a-aš-šu-uš", german: "gut / lieb", wordclass: "Adj."},
  {transliteration: "i-da-a-lu-uš", german: "böse / schlecht", wordclass: "Adj."},
  {transliteration: "ḫar-ki-iš", german: "weiß / hell", wordclass: "Adj."},
  {transliteration: "da-an-ku-iš", german: "schwarz / dunkel", wordclass: "Adj."},
  {transliteration: "šal-li-iš", german: "groß", wordclass: "Adj."},
  {transliteration: "šu-up-pí-iš", german: "rein / heilig", wordclass: "Adj."},
  {transliteration: "te-pu-uš", german: "klein / wenig", wordclass: "Adj."},

  // --- HÄUFIGE VERBEN (mi-Konj.) ---
  {transliteration: "e-eš-zi", german: "er/sie/es ist", wordclass: "Verb (mi)"},
  {transliteration: "pa-i-mi", german: "ich gehe", wordclass: "Verb (mi)"},
  {transliteration: "u-wa-mi", german: "ich komme", wordclass: "Verb (mi)"},
  {transliteration: "a-ku-wa-an-zi", german: "sie trinken", wordclass: "Verb (mi)"},
  {transliteration: "e-da-an-zi", german: "sie essen", wordclass: "Verb (mi)"},
  {transliteration: "i-ya-mi", german: "ich mache / tue", wordclass: "Verb (mi)"},
  {transliteration: "ku-en-zi", german: "er schlägt / tötet", wordclass: "Verb (mi)"},

  // --- HÄUFIGE VERBEN (hi-Konj.) ---
  {transliteration: "da-a-i", german: "er/sie setzt, legt", wordclass: "Verb (hi)"},
  {transliteration: "me-ma-i", german: "er/sie spricht", wordclass: "Verb (hi)"},
  {transliteration: "da-a-aḫ-ḫi", german: "ich nehme", wordclass: "Verb (hi)"},
  {transliteration: "šak-ki", german: "er/sie weiß", wordclass: "Verb (hi)"},

  // --- PRONOMEN & PARTIKELN ---
  {transliteration: "am-mu-uk", german: "ich / mich / mir", wordclass: "Pron."},
  {transliteration: "tu-uk", german: "du / dich / dir", wordclass: "Pron."},
  {transliteration: "nu", german: "und / nun (Satzanfang)", wordclass: "Partikel"},
  {transliteration: "nam-ma", german: "dann / ferner / noch", wordclass: "Adverb"}
];


// --- GRAMMATIK MODULE ---
var GRAMMAR = [
  // --- KASUS: Commune (c.) ---
  {topic: "Kasus (c.)", form: "-aš / -anza", rule: "Nominativ Singular (c.)", example_translit: "antuhšaš", example_german: "der Mensch", choices: ["Nominativ Singular (c.)", "Akkusativ Singular (c.)", "Genitiv Singular", "Nominativ Plural (c.)"]},
  {topic: "Kasus (c.)", form: "-an", rule: "Akkusativ Singular (c.)", example_translit: "antuhšan", example_german: "den Menschen", choices: ["Akkusativ Singular (c.)", "Ablativ Singular", "Instrumental", "Genitiv Singular"]},
  {topic: "Kasus (c.)", form: "-e / -uš", rule: "Nominativ Plural (c.)", example_translit: "antuhšeš", example_german: "die Menschen", choices: ["Nominativ Plural (c.)", "Akkusativ Plural (c.)", "Genitiv Plural", "Dativ-Lokativ Pl."]},
  {topic: "Kasus (c.)", form: "-uš", rule: "Akkusativ Plural (c.)", example_translit: "antuhšuš", example_german: "die Menschen (Obj.)", choices: ["Akkusativ Plural (c.)", "Nominativ Plural (c.)", "Genitiv Plural", "Nominativ Singular (c.)"]},

  // --- KASUS: Neutrum (n.) ---
  {topic: "Kasus (n.)", form: "-an / -ar / ∅", rule: "Nom./Akk. Singular (n.)", example_translit: "wātar", example_german: "das Wasser", choices: ["Nom./Akk. Singular (n.)", "Genitiv Singular", "Dativ-Lokativ Sg.", "Ablativ Singular"]},
  {topic: "Kasus (n.)", form: "-a / -i", rule: "Nom./Akk. Plural (n.)", example_translit: "wīdār", example_german: "die Wasser", choices: ["Nom./Akk. Plural (n.)", "Nom./Akk. Singular (n.)", "Genitiv Plural", "Dativ-Lokativ Pl."]},

  // --- KASUS: Beide Geschlechter ---
  {topic: "Kasus", form: "-aš", rule: "Genitiv Singular", example_translit: "attas", example_german: "des Vaters", choices: ["Genitiv Singular", "Dativ-Lokativ Sg.", "Ablativ Singular", "Instrumental"]},
  {topic: "Kasus", form: "-an / -aš", rule: "Genitiv Plural", example_translit: "attaš", example_german: "der Väter", choices: ["Genitiv Plural", "Nominativ Plural (c.)", "Genitiv Singular", "Dativ-Lokativ Pl."]},
  {topic: "Kasus", form: "-i / -ya", rule: "Dativ-Lokativ Sg.", example_translit: "nepisi", example_german: "im Himmel", choices: ["Dativ-Lokativ Sg.", "Allativ Singular", "Instrumental", "Ablativ Singular"]},
  {topic: "Kasus", form: "-az / -za", rule: "Ablativ Singular", example_translit: "hinganaz", example_german: "durch die Seuche", choices: ["Ablativ Singular", "Instrumental", "Allativ Singular", "Dativ-Lokativ Sg."]},

  // --- VERBEN: mi-Konjugation ---
  {topic: "mi-Verb", form: "-mi", rule: "1. Sg. Präsens (mi)", example_translit: "paimi", example_german: "ich gehe", choices: ["1. Sg. Präsens (mi)", "2. Sg. Präsens (mi)", "3. Sg. Präsens (mi)", "1. Pl. Präsens (mi)"]},
  {topic: "mi-Verb", form: "-ši / -ti", rule: "2. Sg. Präsens (mi)", example_translit: "paiši", example_german: "du gehst", choices: ["2. Sg. Präsens (mi)", "1. Sg. Präsens (mi)", "2. Sg. Präsens (hi)", "2. Pl. Präsens (mi)"]},
  {topic: "mi-Verb", form: "-zi", rule: "3. Sg. Präsens (mi)", example_translit: "paizzi", example_german: "er geht", choices: ["3. Sg. Präsens (mi)", "1. Sg. Präsens (mi)", "3. Sg. Präsens (hi)", "3. Pl. Präsens (mi)"]},
  {topic: "mi-Verb", form: "-weni", rule: "1. Pl. Präsens (mi)", example_translit: "paiweni", example_german: "wir gehen", choices: ["1. Pl. Präsens (mi)", "2. Pl. Präsens (mi)", "3. Pl. Präsens (mi)", "1. Pl. Präsens (hi)"]},
  {topic: "mi-Verb", form: "-anzi", rule: "3. Pl. Präsens (mi)", example_translit: "paianzi", example_german: "sie gehen", choices: ["3. Pl. Präsens (mi)", "1. Pl. Präsens (mi)", "3. Pl. Präsens (hi)", "3. Pl. Präteritum (mi)"]},
  
  // --- VERBEN: hi-Konjugation ---
  {topic: "hi-Verb", form: "-ḫi / -aḫi", rule: "1. Sg. Präsens (hi)", example_translit: "šakkḫi", example_german: "ich weiß", choices: ["1. Sg. Präsens (hi)", "2. Sg. Präsens (hi)", "3. Sg. Präsens (hi)", "1. Sg. Präsens (mi)"]},
  {topic: "hi-Verb", form: "-ti", rule: "2. Sg. Präsens (hi)", example_translit: "šakkti", example_german: "du weißt", choices: ["2. Sg. Präsens (hi)", "1. Sg. Präsens (hi)", "2. Sg. Präsens (mi)", "3. Sg. Präsens (hi)"]},
  {topic: "hi-Verb", form: "-i / -ai", rule: "3. Sg. Präsens (hi)", example_translit: "šakki", example_german: "er weiß", choices: ["3. Sg. Präsens (hi)", "1. Sg. Präsens (hi)", "3. Sg. Präsens (mi)", "3. Pl. Präsens (hi)"]},
  
  // --- VERBEN: Präteritum ---
  {topic: "Präteritum", form: "-un", rule: "1. Sg. Präteritum (mi/hi)", example_translit: "paun", example_german: "ich ging", choices: ["1. Sg. Präteritum (mi/hi)", "3. Sg. Präteritum (mi)", "2. Sg. Präteritum (hi)", "1. Pl. Präteritum (mi/hi)"]},
  {topic: "Präteritum", form: "-t / -ta / -š", rule: "3. Sg. Präteritum (mi/hi)", example_translit: "pait", example_german: "er ging", choices: ["3. Sg. Präteritum (mi/hi)", "1. Sg. Präteritum (mi/hi)", "3. Pl. Präteritum (mi/hi)", "2. Sg. Präteritum (mi/hi)"]},
  {topic: "Präteritum", form: "-er / -ir", rule: "3. Pl. Präteritum (mi/hi)", example_translit: "paer", example_german: "sie gingen", choices: ["3. Pl. Präteritum (mi/hi)", "3. Sg. Präteritum (mi/hi)", "1. Pl. Präteritum (mi/hi)", "3. Pl. Präsens (mi)"]}
];


// --- NEUES MODUL: SÄTZE & LÜCKENTEXTE ---
var LESSONS = [
  {id:"01", siglum:"KUB 14.14", line:"1",
   transliteration:"IM URU Hatti BELI-YA uiyatmu Mursilīs ARAD-KUNU",
   german:"O Wettergott von Hatti, mein Herr – Muršili, euer Knecht, hat mich gesandt.",
   key_words:[
     {token:"BELI-YA", transliteration:"be-li-ya", german:"mein Herr"},
     {token:"uiyatmu", transliteration:"u-i-ya-at-mu", german:"er sandte mich"},
     {token:"ARAD-KUNU", transliteration:"ARAD-KU-NU", german:"euer Knecht"}
   ]},
  {id:"02", siglum:"KUB 14.14", line:"2",
   transliteration:"iit-wa ANA IM URU Hatti kissan memi",
   german:"Geh und sprich zum Wettergott von Hatti folgendermaßen:",
   key_words:[
     {token:"iit-wa", transliteration:"i-it-wa", german:"geh! (Imperativ)"},
     {token:"memi", transliteration:"me-mi", german:"sprich! (Imperativ)"},
     {token:"kissan", transliteration:"ki-iš-ša-an", german:"folgendermaßen"}
   ]},
  {id:"03", siglum:"KUB 14.14", line:"3",
   transliteration:"ki-i-ma kuit iyatten",
   german:"Was habt ihr denn getan?",
   key_words:[
     {token:"ki-i-ma", transliteration:"ki-i-ma", german:"dies / was denn"},
     {token:"kuit", transliteration:"ku-it", german:"was? (Interrogativ)"},
     {token:"iyatten", transliteration:"i-ya-at-te-en", german:"ihr habt getan"}
   ]},
  {id:"04", siglum:"KUB 14.14", line:"4",
   transliteration:"nu-wa-kan INA KUR URU Hatti hinkan tarnatten",
   german:"In das Land Hatti habt ihr die Seuche losgelassen.",
   key_words:[
     {token:"hinkan", transliteration:"hi-in-kán", german:"Seuche / Pest"},
     {token:"tarnatten", transliteration:"tar-na-at-te-en", german:"ihr habt losgelassen"},
     {token:"KUR", transliteration:"KUR", german:"Land"}
   ]},
  {id:"05", siglum:"KUB 14.14", line:"5",
   transliteration:"nu-wa KUR URU Hatti hinganaz mekki tamastat",
   german:"Das Land Hatti ist durch die Seuche sehr schwer bedrückt worden.",
   key_words:[
     {token:"mekki", transliteration:"me-ek-ki", german:"sehr / viel"},
     {token:"tamastat", transliteration:"ta-ma-aš-ta-at", german:"es wurde bedrückt"},
     {token:"hinganaz", transliteration:"hi-in-ga-na-az", german:"durch die Seuche"}
   ]},
  {id:"06", siglum:"Basis-Satz 1", line:"-",
   transliteration:"LÚ-iš MUNUS-za u-wa-an-zi",
   german:"Der Mann (und) die Frau kommen.",
   key_words:[
     {token:"LÚ-iš", transliteration:"LÚ-iš", german:"Der Mann"},
     {token:"MUNUS-za", transliteration:"MUNUS-za", german:"die Frau"},
     {token:"u-wa-an-zi", transliteration:"u-wa-an-zi", german:"kommen (sie kommen)"}
   ]},
  {id:"07", siglum:"Basis-Satz 2", line:"-",
   transliteration:"DUMU-aš wa-a-tar a-ku-wa-an-zi",
   german:"Das Kind trinkt Wasser.",
   key_words:[
     {token:"DUMU-aš", transliteration:"DUMU-aš", german:"Das Kind"},
     {token:"wa-a-tar", transliteration:"wa-a-tar", german:"Wasser"},
     {token:"a-ku-wa-an-zi", transliteration:"a-ku-wa-an-zi", german:"trinkt"}
   ]}
];
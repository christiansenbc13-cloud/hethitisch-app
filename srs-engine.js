class SRSEngine {
  constructor() {
    this.deck = [];
  }

  // Lade neue Karten mit Standard-SM2-Werten in das Deck
  addCard(item, type) {
    this.deck.push({
      ...item,
      type: type,          // 'vocab' oder 'grammar'
      repetition: 0,       // Anzahl der erfolgreichen Wiederholungen
      interval: 0,         // Intervall in Tagen
      efactor: 2.5,        // Leichtigeitsfaktor (Easiness Factor)
      nextReview: Date.now() // Nächstes Überprüfungsdatum (sofort fällig)
    });
  }

  // Lädt die generierte JSON in das SRS-System
  loadFromJson(jsonData) {
    jsonData.tischler_vocab.forEach(v => this.addCard(v, 'vocab'));
    jsonData.melchert_grammar.forEach(g => this.addCard(g, 'grammar'));
  }

  // Gibt alle aktuell fälligen Karten zurück
  getDueCards() {
    const now = Date.now();
    return this.deck.filter(card => card.nextReview <= now);
  }

  // Aktualisiert die SM2-Werte basierend auf der Nutzer-Antwort (Qualität 0-5)
  // 5 = Perfekt, 4 = Gut, 3 = Schwer, 2 = Falsch (erinnert), 1 = Falsch, 0 = Blackout
  reviewCard(cardIndex, quality) {
    let card = this.deck[cardIndex];

    if (quality >= 3) {
      if (card.repetition === 0) {
        card.interval = 1;
      } else if (card.repetition === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.efactor);
      }
      card.repetition++;
    } else {
      card.repetition = 0;
      card.interval = 1;
    }

    // Easiness Factor anpassen
    card.efactor = card.efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (card.efactor < 1.3) card.efactor = 1.3;

    // Nächstes Review-Datum setzen
    const ONE_DAY = 24 * 60 * 60 * 1000;
    card.nextReview = Date.now() + (card.interval * ONE_DAY);
  }
}

// Beispiel für die Einbindung in deine App:
// const srs = new SRSEngine();
// fetch('tischler_melchert_data.json')
//   .then(res => res.json())
//   .then(data => srs.loadFromJson(data));
// console.log("Fällige Karten:", srs.getDueCards());

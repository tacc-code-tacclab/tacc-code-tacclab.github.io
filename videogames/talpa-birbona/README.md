# Talpa Birbona

Un piccolo gioco originale nell'orto romagnolo. Dieci livelli, dieci colture, morso automatico e un contadino sempre più rapido. La versione web usa un atlante di personaggi illustrati; la versione Roblox ricostruisce gli stessi soggetti con grafica GUI interna, senza immagini o modelli esterni.

## Obiettivo e comandi

### Aggiornamento web mobile V2

Su telefono basta toccare una pianta in superficie oppure vicino alla sua radice: la talpa raggiunge il bersaglio automaticamente. Toccare la terra o trascinare cambia la direzione; **Ferma** interrompe subito il percorso. Le radici hanno bersagli più grandi e le frecce da tenere premute sono facoltative, con icone grafiche e aree di tocco da 54–62 px.

La modalità comoda viene attivata per schermi stretti o dispositivi con puntatore touch: il contadino dà un secondo di preavviso in più e il veleno si propaga più lentamente. La difficoltà cresce comunque nei dieci orti. Queste modifiche riguardano la versione web; il file Roblox V1 rimane disponibile.

La selezione e il menu di pressione prolungata sono bloccati sui comandi tramite `user-select`, la variante `-webkit-user-select`, `-webkit-touch-callout` e gestione dei gesti. [Riferimento MDN per Safari](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/-webkit-touch-callout), [Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).

### Regole

- Mangia le radici colorate di **tutte le piante** per completare un orto. La pianta appassisce, il suo passaggio verso la superficie si apre e ricevi i punti indicati.
- Il contadino cammina fino a una buca e avvisa prima di versare il veleno viola. Il veleno si propaga soltanto lungo i cunicoli collegati e poi si dissolve. Scava nella terra intatta per trovare una via di fuga.
- Hai tre cuori per orto. Il contatto con il veleno toglie un cuore, seguito da un breve periodo di protezione. I cuori si ricaricano nel livello successivo.
- Completi il gioco dopo l'orto 10. Un orto fallito si può riprovare; il punteggio torna a quello all'inizio del livello.
- Tastiera: frecce o WASD; Spazio per pausa. Web: anche Esc. Roblox: anche P o Start del gamepad.
- Mouse e touch: tocca un punto sotto terra per raggiungerlo, oppure trascina per cambiare destinazione. Le frecce su schermo funzionano tenendole premute.
- Roblox supporta anche levetta sinistra e D-pad. Partita individuale sul dispositivo di ogni giocatore, senza connessioni al server di gioco.

| Coltura | Punti |
|---|---:|
| Carota | 100 |
| Patate | 120 |
| Cavolo | 140 |
| Pero | 300 |
| Melo | 280 |
| Albicocco | 320 |
| Grano | 80 |
| Pomodori | 160 |
| Zucchini | 180 |
| Melanzane | 200 |

Bonus a fine orto: 100 punti per ogni cuore rimasto. Nessun conto alla rovescia e nessun acquisto. Il record web viene conservato soltanto in localStorage; quello Roblox dura la sessione.

## Avvio e Roblox

Il sito è statico: servire questa cartella con un server HTTP (per esempio `python -m http.server 8080`) e aprire `index.html`.

Aprire `roblox/Talpa_Birbona_Roblox_V1.rbxlx` in Roblox Studio, premere **Play**, poi **INIZIA A SCAVARE**. Fermare la prova e usare **File → Publish to Roblox As…** per creare una nuova esperienza.

Rigenerare il file Roblox dopo modifiche alle sorgenti:

```sh
python roblox/build_place.py
```

## Verifiche riproducibili

```sh
node --test tests/*.test.cjs
python tests/verify_lua.py
python roblox/build_place.py
```

I test controllano completamento dei dieci livelli, punteggi, movimento, limiti dello schermo, continuità dei cunicoli, propagazione e dissipazione del veleno, preavviso e ripartenza. `verify_lua.py` usa la libreria di sistema Lua 5.4; questi controlli e il round-trip XML **non equivalgono a una prova in Roblox Studio**.

## Asset

`assets/characters.png` è un atlante RGBA originale, 1448×1086, quattro colonne e tre righe. Non contiene personaggi di franchise esistenti. Documentazione artistica in `ART.md`. Le forme di scenario, radici e cunicoli sono disegnate dal codice. I brevi suoni web sono sintetizzati, attivabili dal pulsante Audio. I font web hanno fallback locali; non ci sono script di pubblicità, telemetria o servizi di pagamento.

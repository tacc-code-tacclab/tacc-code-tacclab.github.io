# Talpa Birbona

Un piccolo gioco originale nell'orto romagnolo. Dieci livelli, dieci colture, morso automatico, musica web e pericoli crescenti. La versione web usa un atlante di personaggi illustrati; Roblox V2 ricostruisce gli stessi soggetti con grafica GUI interna e condivide le regole aggiornate del veleno e delle formiche.

## Obiettivo e comandi

### Aggiornamento web mobile V2

Su telefono basta toccare una pianta in superficie oppure vicino alla sua radice: la talpa raggiunge il bersaglio automaticamente. Toccare la terra o trascinare cambia la direzione; **Ferma** interrompe subito il percorso. Le radici hanno bersagli più grandi e le frecce da tenere premute sono facoltative, con icone grafiche e aree di tocco da 54–62 px.

La modalità comoda viene attivata per schermi stretti o dispositivi con puntatore touch: conserva un piccolo margine aggiuntivo sui tempi senza eliminare la difficoltà crescente. Roblox V2 applica lo stesso piccolo margine quando rileva i comandi touch.

La selezione e il menu di pressione prolungata sono bloccati sui comandi tramite `user-select`, la variante `-webkit-user-select`, `-webkit-touch-callout` e gestione dei gesti. [Riferimento MDN per Safari](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/-webkit-touch-callout), [Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).

### Regole

- Mangia le radici colorate di **tutte le piante** per completare un orto. La pianta appassisce, il suo passaggio verso la superficie si apre e ricevi i punti indicati.
- Il contadino corre fino alle buche, concede un avviso molto breve prima di versare il veleno viola e riduce progressivamente le pause. Il veleno segue la gravità: la discesa resta rapida, mentre un tratto orizzontale richiede circa 1,75 volte il tempo base, una salita circa 3,2 volte e ogni cambio di direzione aggiunge un'ulteriore pausa. Dal livello 6 la talpa può superare il fronte del veleno su un tratto orizzontale: tunnel a zig-zag, curve e risalite sono quindi una vera strategia di fuga. Ogni chiazza sbiadisce e scompare dopo circa quattro secondi, ma resta letale al primo contatto.
- Dal secondo orto arrivano le formiche. Il loro numero e la loro velocità aumentano fino al livello 10; inseguono la talpa scavando vere gallerie. Se una galleria appena aperta tocca il veleno, ne diventa subito un nuovo fronte di propagazione. Dopo un contatto con la talpa, la formica viene respinta lontano.
- Hai tre cuori per orto contro le formiche: ogni loro contatto toglie un cuore ed è seguito da un breve periodo di protezione. Il veleno ignora invece i cuori ed è subito fatale. I cuori si ricaricano nel livello successivo.
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

Aprire `roblox/Talpa_Birbona_Roblox_V2.rbxlx` in Roblox Studio, premere **Play**, poi **INIZIA A SCAVARE**. Fermare la prova e usare **File → Publish to Roblox As…** per creare una nuova esperienza. L'icona pronta per Roblox è `roblox/assets/talpa-birbona-icon-512.png`; la miniatura è `roblox/assets/talpa-birbona-thumbnail-1920x1080.jpg`.

Per scaricare gioco e immagini in una volta usare `roblox/Talpa_Birbona_Roblox_Package_V2.zip`: contiene il file Roblox, le due immagini e la guida italiana. La musica resta disponibile separatamente in `assets/avventura-orto.mp3`, perché Roblox richiede di caricarla come asset audio dell'account.

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

I test controllano completamento dei dieci livelli, punteggi, movimento, limiti dello schermo, continuità dei cunicoli della talpa e delle formiche, infiltrazione del veleno nelle nuove gallerie, ordine delle velocità discesa–laterale–risalita, ritardo aggiunto dalle curve, vantaggio dello zig-zag dal livello 6, dissolvenza, progressione dei pericoli, morte istantanea da veleno, danni delle formiche e ripartenza. `verify_lua.py` usa la libreria di sistema Lua 5.4; questi controlli e il round-trip XML **non equivalgono a una prova in Roblox Studio**.

## Asset

`assets/characters.png` è un atlante RGBA originale, 1448×1086, quattro colonne e tre righe. Il client isola il soggetto principale delle caselle centrali per eliminare i frammenti che sconfinavano dalla riga superiore, sia nel gioco sia nella legenda. Non contiene personaggi di franchise esistenti. Documentazione artistica in `ART.md`. Le forme di scenario, radici, cunicoli e formiche Roblox sono disegnate dal codice. `assets/avventura-orto.mp3` è un mix strumentale ottimizzato per il web ricavato dagli stem forniti; Roblox richiede invece che l'audio venga caricato e moderato come asset dell'account prima di poter assegnare un `SoundId`. I font web hanno fallback locali; non ci sono script di pubblicità, telemetria o servizi di pagamento.

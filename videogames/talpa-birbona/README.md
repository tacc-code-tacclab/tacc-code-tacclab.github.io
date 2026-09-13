# Talpa Birbona

Un piccolo gioco originale nell'orto romagnolo, con dieci colture, morso automatico, musica ed effetti contestuali. Questa cartella conserva l'edizione web italiana da 10 orti e contiene anche Roblox V5 da 20 orti. Il seguito web separato in inglese, `../talpa-birbona-2/`, porta la campagna a 20 orti e assegna una zucca d'oro come premio finale.

## Obiettivo e comandi

### Aggiornamento web mobile V2

Su telefono basta toccare una pianta in superficie oppure vicino alla sua radice: la talpa raggiunge il bersaglio automaticamente. Toccare la terra o trascinare cambia la direzione; **Ferma** interrompe subito il percorso. Le radici hanno bersagli più grandi e le frecce da tenere premute sono facoltative, con icone grafiche e aree di tocco da 54–62 px.

La modalità comoda viene attivata per schermi stretti o dispositivi con puntatore touch: conserva un piccolo margine aggiuntivo sui tempi senza eliminare la difficoltà crescente. Roblox V5 applica lo stesso piccolo margine quando rileva i comandi touch.

La selezione e il menu di pressione prolungata sono bloccati sui comandi tramite `user-select`, la variante `-webkit-user-select`, `-webkit-touch-callout` e gestione dei gesti. [Riferimento MDN per Safari](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/-webkit-touch-callout), [Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).

### Regole

- Mangia le radici colorate di **tutte le piante** per completare un orto. La pianta appassisce, il suo passaggio verso la superficie si apre e ricevi i punti indicati.
- Il contadino corre fino alle buche, concede un avviso molto breve prima di versare il veleno viola e riduce progressivamente le pause. Il veleno segue la gravità: la discesa resta rapida, mentre un tratto orizzontale richiede circa 1,75 volte il tempo base, una salita circa 3,2 volte e ogni cambio di direzione aggiunge un'ulteriore pausa. Dal livello 6 la talpa può superare il fronte del veleno su un tratto orizzontale: tunnel a zig-zag, curve e risalite sono quindi una vera strategia di fuga. Ogni versamento sbiadisce e scompare completamente dopo 2,5 secondi, ma resta letale al primo contatto.
- Dal secondo orto arrivano le formiche. Il loro numero sale fino a cinque e la velocità continua ad aumentare dolcemente negli orti 11–20; inseguono la talpa scavando vere gallerie. Se una galleria appena aperta tocca il veleno, ne diventa subito un nuovo fronte di propagazione. Dopo un contatto con la talpa, la formica viene respinta lontano.
- Hai tre cuori per orto contro le formiche: ogni loro contatto toglie un cuore ed è seguito da un breve periodo di protezione. Il veleno ignora invece i cuori ed è subito fatale. I cuori si ricaricano nel livello successivo.
- L'edizione web italiana termina dopo l'orto 10. Naughty Mole 2 e Roblox V5 terminano dopo l'orto 20 con una zucca finale. Un orto fallito si può riprovare; il punteggio torna a quello all'inizio del livello.
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

Aprire `roblox/Talpa_Birbona_Roblox_V5.rbxlx` in Roblox Studio e premere **Play**. La V5 ha già la musica dell'account a volume basso, effetti distinti per frutti, formiche, veleno, morte e vittoria, 20 orti con difficoltà bilanciata e la zucca-premio finale. La grafica usa anche l'icona e la miniatura già caricate su Roblox. Ogni versamento di veleno scompare completamente dopo 2,5 secondi e tutti gli orti hanno una chiusura di livello protetta, incluso l'orto 9. Fermare la prova e usare **File → Publish to Roblox** per creare una nuova esperienza. L'icona pronta per Roblox è `roblox/assets/talpa-birbona-icon-512.png`; la miniatura è `roblox/assets/talpa-birbona-thumbnail-1920x1080.jpg`.

Per scaricare gioco e immagini in una volta usare `roblox/Talpa_Birbona_Roblox_Package_V5.zip`: contiene il file Roblox, le due immagini e la guida italiana. Gli ID dell'audio e delle illustrazioni Roblox sono già inseriti nel gioco.

Rigenerare il file Roblox dopo modifiche alle sorgenti:

```sh
python roblox/build_place.py
```

## Verifiche riproducibili

```sh
node --test tests/*.test.cjs
node --test ../talpa-birbona-2/tests/*.test.cjs
python tests/verify_lua.py
python roblox/build_place.py
```

I test controllano tutti i 20 orti di Naughty Mole 2 e Roblox V5: chiusura dopo l'ultima radice, punteggi, movimento, limiti dello schermo, continuità dei cunicoli della talpa e delle formiche, infiltrazione del veleno, ordine delle velocità discesa–laterale–risalita, vantaggio dello zig-zag dal livello 6, scomparsa totale in 2,5 secondi, progressione dolce negli orti 11–20, morte istantanea e ripartenza. `verify_lua.py` usa la libreria di sistema Lua 5.4; questi controlli e il round-trip XML **non equivalgono a una prova in Roblox Studio**.

## Asset

`assets/characters.png` è un atlante RGBA originale, 1448×1086, quattro colonne e tre righe. Il client isola il soggetto principale delle caselle centrali per eliminare i frammenti che sconfinavano dalla riga superiore, sia nel gioco sia nella legenda. Non contiene personaggi di franchise esistenti. Documentazione artistica in `ART.md`. Le forme di scenario, radici, cunicoli e formiche Roblox sono disegnate dal codice. `assets/avventura-orto.mp3` è un mix strumentale ottimizzato per il web ricavato dagli stem forniti; Roblox richiede invece che l'audio venga caricato e moderato come asset dell'account prima di poter assegnare un `SoundId`. I font web hanno fallback locali; non ci sono script di pubblicità, telemetria o servizi di pagamento.

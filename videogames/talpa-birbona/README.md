# Talpa Birbona

Un piccolo gioco originale nell'orto romagnolo. Dieci livelli, dieci colture, morso automatico e un contadino sempre più rapido. La versione web usa un atlante di personaggi illustrati; la versione Roblox ricostruisce gli stessi soggetti con grafica GUI interna, senza immagini o modelli esterni.

## Obiettivo e comandi

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
node --test tests/core.test.cjs
python tests/verify_lua.py
python roblox/build_place.py
```

I test controllano completamento dei dieci livelli, punteggi, movimento, limiti dello schermo, continuità dei cunicoli, propagazione e dissipazione del veleno, preavviso e ripartenza. `verify_lua.py` usa la libreria di sistema Lua 5.4; questi controlli e il round-trip XML **non equivalgono a una prova in Roblox Studio**.

## Asset

`assets/characters.png` è un atlante RGBA originale, 1448×1086, quattro colonne e tre righe. Non contiene personaggi di franchise esistenti. Documentazione artistica in `ART.md`. Le forme di scenario, radici e cunicoli sono disegnate dal codice. I brevi suoni web sono sintetizzati, attivabili dal pulsante Audio. I font web hanno fallback locali; non ci sono script di pubblicità, telemetria o servizi di pagamento.

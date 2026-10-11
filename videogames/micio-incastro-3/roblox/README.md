# Micio Incastro 3 · Roblox

Edizione **nativa Roblox**, separata dal gioco web. Non è una pagina web dentro Roblox.

## Aprire e pubblicare

1. Scarica **Micio_Incastro_3_Roblox.rbxlx** e aprilo con **Roblox Studio** sul PC.
2. Premi **Play**. Scegli **Sfida** (caduta automatica e tempo) oppure **Senza fretta**.
3. Ferma la prova. Usa **File → Publish to Roblox As…** e crea una **nuova esperienza**, così non sostituisci altri giochi.
4. Dal Creator Dashboard scegli i dispositivi supportati e la visibilità desiderata. Dopo la pubblicazione apri l’esperienza nell’app Roblox del telefono.

Il file contiene già tutti gli script e tutti gli scenari. Non richiede plugin, Rojo, HTTP, immagini da caricare, API key o acquisti. Il pacchetto ZIP include anche le sorgenti e questa guida. La creazione del file non pubblica automaticamente l’esperienza sull’account Roblox.

## Campo a tutto schermo

- Nessun contenitore a larghezza fissa, nessuna colonna laterale e nessuna cornice esterna.
- Lo sfondo copre l’intero schermo, anche dietro ai controlli. Un velo scuro del 62% mantiene leggibili gattini, sagome dorate e impronte verdi.
- Il reticolo occupa tutta la larghezza utile e l’altezza tra la piccola barra superiore e i pulsanti. Le dimensioni si adattano a ogni finestra; non si riduce tutta una grande pagina per farla entrare nel telefono.
- Sul telefono l’orientamento è verticale, adatto alla caduta dei gattini. Il layout si ricalcola anche nelle finestre orizzontali dell’emulatore.
- I comandi restano nell’area sicura, fuori dalle tacche del telefono e dai pulsanti obbligatori di Roblox. Questi elementi di sistema non vengono rimossi.
- Sei tasti sul bordo inferiore: sinistra, ruota, destra, posa, Fusa, armi. Quando arriva la zanzara il sesto tasto diventa **SPARA**, con mira assistita; le armi rimangono accessibili dal menu Pausa o con E. Nessun grande tasto copre i gattini che cadono. La piccola anteprima in alto a sinistra cambia gruppo. Gli avvisi brevi usano la barra superiore e non coprono la sagoma.

Le 18 destinazioni sono reinterpretate con **illustrazioni geometriche native** e gradienti: Venezia, Parigi, Barcellona, Londra, Agra, Grande Muraglia, Kyoto, Bangkok, New York, Chicago, Panama, Rio, Patagonia, Giza, Amboseli, Sydney, Fiordland, Antartide. Gli sfondi bitmap della versione web non sono incorporati: Roblox richiederebbe il caricamento e i relativi permessi degli asset. Qui le scene funzionano subito, senza tale passaggio. Solo lo scenario corrente è presente in memoria.

## Regole e comandi

Sono conservate le **36 sagome** del web, le stesse coordinate e le stesse regole. Per vincere devi coprire ogni casella dorata, comprese quelle interne. Le impronte rimangono conquistate anche dopo una combinazione. Unisci almeno sei gattini dello stesso colore per liberare spazio.

100 punti diventano 1 credito. Parti con sassi gratuiti; tra le tappe sblocchi freccette (6 crediti), lance (14), proiettili (26), laser (44). Le armi restano disponibili per tutto il viaggio e i colpi sono illimitati. Nessun Robux o pagamento. La zanzara ha 4–7 punti di resistenza e aggiunge macchie viola; colpirla libera le macchie, dà 100 punti e carica le Fusa. Le Fusa liberano due file quando la carica raggiunge 4/4.

**PC:** frecce o A/D, ↑/W ruota, Spazio posa, X spara, E cambia arma, 1–5 seleziona, C cambia gruppo, F Fusa, P pausa. **Touch:** trascina lateralmente, tocca per ruotare, scorri verso il basso o premi POSA. Per sparare tocca SPARA oppure la zanzara. **Gamepad:** D-pad, A posa, X spara, Y cambia arma, Start pausa.

La partita è individuale e gira sul dispositivo del giocatore. Il checkpoint consente di riprovare la tappa mantenendo le ricompense delle tappe precedenti **durante la sessione**; chiudere Roblox avvia un nuovo viaggio alla riapertura. Questa edizione non usa DataStore né classifiche condivise.

Musica a note e suoni usano i file integrati del client Roblox. Il ronzio è un effetto elettronico modulato, non una registrazione naturalistica. Audio disattivabile; si interrompe in pausa, nei menu, alla perdita del focus e a fine partita.

## Verifiche

Da questa cartella:

```sh
python tests/verify.py
python build_place.py
```

Il verificatore usa Lua 5.4 e Node. Controlla le 36 sagome, tutte le transizioni, caselle interne mancanti, crediti, armi, macchie, timer e checkpoint; confronta **650 stati dopo azioni** con il motore JavaScript originale; verifica il client mediante un mock delle API Roblox, compresi touch, annullamento del gesto, pausa, sparo e menu. Il layout viene misurato su sette dimensioni di schermo. La generazione verifica l’XML e l’inclusione esatta degli script.

**Limite della verifica:** questi controlli non equivalgono all’esecuzione in Roblox Studio o su un telefono reale. Prima di rendere pubblica l’esperienza, provarla con Play e con il Device Emulator di Studio, in particolare l’audio e l’area sicura del proprio dispositivo.

## Riferimenti API

- [ScreenGui e ScreenInsets](https://create.roblox.com/docs/reference/engine/classes/ScreenGui)
- [Contenitori e aree sicure](https://create.roblox.com/docs/ui/on-screen-containers)
- [Orientamento del PlayerGui](https://create.roblox.com/docs/reference/engine/classes/PlayerGui)
- [Pubblicare un’esperienza](https://create.roblox.com/docs/production/publishing/publish-experiences-and-places)

Sorgenti: `Core.lua` (regole), `Journey.lua` (campagna), `Layout.lua` (geometria), `Scenery.lua` (18 ambientazioni), `Micio3.client.lua` (interfaccia, input, audio). `Journey.lua` è derivato dal `journey.js` della versione web.

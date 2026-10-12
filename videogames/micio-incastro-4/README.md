# Micio Incastro 4 — un mondo dentro il gioco

Gioco web indipendente, in italiano, senza dipendenze, pubblicità o acquisti reali.
URL: https://tacc-code-tacclab.github.io/videogames/micio-incastro-4/

## Schermo e controlli

Il campo occupa l'intera finestra; il paesaggio oscurato è dentro `arena`, dietro alla griglia. Nessuna colonna laterale o cornice esterna. HUD e comandi compatti sono sovrapposti al campo; menu, armeria e passaporto compaiono solo in pausa. Le tessere si distribuiscono su tutta la larghezza mentre i visi mantengono le proporzioni. Supporto per safe area, entrambe le orientazioni e display HiDPI (massimo 2x).

- **Smartphone/tablet con puntatore primario touch:** trascina il gruppo dal vassoio superiore e rilascialo come anteprima. Tocca il gruppo sul campo per ruotarlo di 60°, oppure trascinalo ancora per riposizionarlo. Puoi anche toccare il gruppo nel vassoio per ruotarlo prima di trascinarlo. **✓ Posa** conferma solo una posizione valida: verde = entra, rosso = occupata o oltre il bordo. Fino alla conferma il campo e i crediti non cambiano. Nessuna gravità. Il timer non limita questa modalità; la zanzara attacca in tempo reale. ⇄ cambia gruppo una volta per turno. Si perde se né il gruppo attuale né quello scambiabile entrano in alcuna delle sei rotazioni.
- **PC con puntatore preciso:** caduta automatica, ← → sposta, ↑ ruota, ↓ scende, spazio posa; C cambia gruppo. La modalità facoltativa Senza fretta conserva le rotazioni ma aspetta la posa manuale.
- **Entrambi:** completa ogni casella della sagoma dorata. La vittoria richiede gatti realmente presenti in tutte le caselle obiettivo nello stesso momento. I gatti nella sagoma restano visibili e fermi: incastri, gravità e Fusa li proteggono. I gruppi di 6 gatti uguali liberano solo i gatti fuori dalla sagoma. F / Fusa libera le due file inferiori, risparmiando i gatti obiettivo. P pausa, E cambia arma, 1–5 seleziona un'arma sbloccata.

La rilevazione del dispositivo avviene all'apertura; il cambio di orientamento ridimensiona il campo senza cambiare le regole. Un salvataggio ripreso su un altro dispositivo adotta i suoi controlli.

## Zanzara e munizioni

Tocca/clicca la zanzara nella sua posizione reale. Un tocco a vuoto sulla griglia mentre vola spara e consuma una munizione. Il trascinamento, i tocchi per ruotare il gruppo selezionato e la conferma sono separati dai tiri e non consumano munizioni. Su PC sono disponibili anche X e SPARA con mira assistita. Nessun fuoco automatico. I colpi rispettano il tempo di ricarica dell'arma.

- 18 colpi iniziali, condivisi tra sassi, freccette, lance, proiettili e laser.
- 8 colpi aggiunti a ogni nuova tappa; massimo 99 in scorta.
- +8 colpi per 2 crediti, acquistabili durante la partita o nell'armeria fra le tappe.
- 100 punti = 1 credito; nuove armi acquistabili fra le tappe.
- A zero colpi non si può sparare. Incastri e obiettivi permettono ancora di guadagnare crediti.
- Zanzara più lenta: velocità base 0,55, in aumento fino a 0,90; 0,8 secondi di sosta ogni 3,2 secondi. Resta per 32 secondi se non viene scacciata, anche dopo aver lasciato le sue tre scariche di macchie. La permanenza prolungata non aggiunge ulteriori macchie. Movimento ridotto del sistema rispettato.

## Campagna e risorse

36 sagome complete, 18 destinazioni, difficoltà crescente. Musica procedurale ed effetti Web Audio, ronzio della zanzara. Colori pastello o fluorescenti. Salvataggio locale indipendente `micio4-trip-v1`, formato interno versione 4; preferenze `micio4-music` e `micio4-palette`. Le sconfitte e i ricaricamenti ripartono dall'inizio della tappa, ripristinando anche la scorta di munizioni.

Le immagini originali sono condivise **in sola lettura** con `../micio-incastro-3/backgrounds/`, per riutilizzare la cache ed evitare altri 5,7 MB di duplicati. Provenienza in quella cartella. Nessuna modifica alle versioni precedenti o al pacchetto Roblox della V3.

Schermo intero nativo richiesto al via quando il browser lo consente; la pagina resta comunque a tutta finestra se il browser mantiene le proprie barre. Su iPhone è possibile aggiungere il gioco alla schermata Home.

## Verifica

`node --test videogames/micio-incastro-4/tests/*.test.cjs`

Test del motore e harness degli eventi UI: entrambe le modalità, anteprima, rotazione, riposizionamento, conferma e cancellazione touch, munizioni e acquisti, colpi reali e mancati, pausa/audio, salvataggi, 36 vittorie ottenute con pose legali, conteggio delle caselle realmente piene e geometria a 7 dimensioni. La verifica offline non sostituisce una prova su un telefono fisico. Nessun motore browser disponibile nell'ambiente di sviluppo.

# Pubblicare Talpa Birbona su Roblox

## File pronti

- Gioco: `Talpa_Birbona_Roblox_V2.rbxlx`
- Icona esperienza: `assets/talpa-birbona-icon-512.png` (512×512)
- Miniatura descrittiva: `assets/talpa-birbona-thumbnail-1920x1080.jpg` (1920×1080, 16:9)
- Musica da caricare come asset audio Roblox: `../assets/avventura-orto.mp3` nel repository, oppure [scaricala dal sito](https://tacc-code-tacclab.github.io/videogames/talpa-birbona/assets/avventura-orto.mp3). Per mantenere leggero il pacchetto ZIP, l'audio è fornito separatamente.

## Titolo e descrizione consigliati

**Titolo:** Talpa Birbona

**Descrizione:**

Scava a zig-zag, divora tutte le radici e sfuggi al contadino! Il veleno è letale al primo contatto: corre in discesa, ma rallenta nei tratti orizzontali, in salita e a ogni curva. Dal secondo orto le formiche aprono nuovi tunnel e possono portare il veleno verso la talpa. Completa 10 orti, raccogli punti e conserva i tuoi tre cuori!

Comandi: frecce o WASD, levetta sinistra, D-pad oppure tocco. Spazio, P o Start mette in pausa.

## Pubblicazione del gioco

1. Aprire `Talpa_Birbona_Roblox_V2.rbxlx` in Roblox Studio.
2. Premere **Play** e verificare almeno il primo orto.
3. Fermare la prova e scegliere **File → Publish to Roblox As…**.
4. Creare l'esperienza **Talpa Birbona** come privata oppure sovrascrivere il suo luogo iniziale.
5. Nel Creator Dashboard aprire **Configure → Places**, selezionare il luogo iniziale e caricare l'icona e la miniatura indicate sopra.
6. Compilare il questionario su maturità e conformità prima di cambiare l'audience. Il file viene pubblicato privato per impostazione predefinita.

## Attivare la musica in Roblox

Roblox non incorpora MP3 o MIDI dentro un file `.rbxlx`: l'audio deve prima diventare un asset moderato dell'account.

1. Caricare `avventura-orto.mp3` dal Creator Dashboard come asset audio.
2. Copiare l'ID numerico dell'asset approvato.
3. In Studio aprire `StarterGui → TalpaBirbona → MusicSoundId` e incollare l'ID nel campo **Value**.
4. Ripubblicare il luogo. Comparirà anche il pulsante musicale `♪` nell'interfaccia.

## Testo alternativo consigliato

- Icona: “Talpa sorridente con fazzoletto rosso che fugge dal veleno viola in una galleria.”
- Miniatura: “Spaccato dell'orto con la talpa sottoterra, il contadino che versa veleno e due formiche che scavano.”

Icona e miniatura possono restare in moderazione per un breve periodo dopo il caricamento.

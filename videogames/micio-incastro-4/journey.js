(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.MicioJourney=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const WORLDS=[
    {name:'Venezia',country:'Italia',region:'Europa',asset:'italia',symbol:'◈',caption:'Canali, ponti e riflessi color miele.'},
    {name:'Parigi',country:'Francia',region:'Europa',asset:'francia',symbol:'✧',caption:'Una passeggiata luminosa lungo la Senna.'},
    {name:'Barcellona',country:'Spagna',region:'Europa',asset:'spagna',symbol:'✺',caption:'Mosaici, giardini e meraviglie di Gaudí.'},
    {name:'Londra',country:'Inghilterra',region:'Europa',asset:'inghilterra',symbol:'♜',caption:'Torri e ponti sulle acque del Tamigi.'},
    {name:'Agra',country:'India',region:'Asia',asset:'india',symbol:'❋',caption:'Il Taj Mahal si specchia nel suo giardino.'},
    {name:'La Grande Muraglia',country:'Cina',region:'Asia',asset:'cina',symbol:'⌁',caption:'Un sentiero che abbraccia le montagne.'},
    {name:'Kyoto',country:'Giappone',region:'Asia',asset:'giappone',symbol:'❀',caption:'Pagode e petali nel vento di primavera.'},
    {name:'Bangkok',country:'Thailandia',region:'Asia',asset:'thailandia',symbol:'✦',caption:'Templi dorati sulle rive del fiume.'},
    {name:'New York',country:'Stati Uniti',region:'America del Nord',asset:'new-york',symbol:'▥',caption:'Ponti, grattacieli e una città piena di luce.'},
    {name:'Chicago',country:'Stati Uniti',region:'America del Nord',asset:'chicago',symbol:'▦',caption:'Il fiume attraversa un giardino di torri.'},
    {name:'Città di Panama',country:'Panama',region:'America Centrale',asset:'panama',symbol:'≈',caption:'Case colorate e nuovi orizzonti sulla baia.'},
    {name:'Rio de Janeiro',country:'Brasile',region:'America del Sud',asset:'brasile',symbol:'☀',caption:'Montagne, spiagge e un tramonto tropicale.'},
    {name:'Patagonia',country:'Argentina',region:'America del Sud',asset:'argentina',symbol:'△',caption:'Picchi, ghiacciai e laghi color turchese.'},
    {name:'Giza',country:'Egitto',region:'Africa',asset:'egitto',symbol:'▲',caption:'Piramidi e oasi nella luce del deserto.'},
    {name:'Amboseli',country:'Kenya',region:'Africa',asset:'kenya',symbol:'♧',caption:'Acacie nella savana, sotto un cielo immenso.'},
    {name:'Sydney',country:'Australia',region:'Oceania',asset:'australia',symbol:'◒',caption:'Vele bianche e riflessi nel porto.'},
    {name:'Fiordland',country:'Nuova Zelanda',region:'Oceania',asset:'nuova-zelanda',symbol:'❧',caption:'Fiordi e foreste dalle mille sfumature di verde.'},
    {name:'L’ultimo orizzonte',country:'Antartide',region:'Antartide',asset:'antartide',symbol:'❄',caption:'Ghiaccio, pinguini e il silenzio delle stelle.'}
  ];
  // Filled silhouettes, never just an outline: every 1 must receive a kitten.
  // Sorting by area/height creates a gradual campaign, with denser shapes at the end.
  const designs=[
    ['Diamante',['010','111','111','010']],
    ['Barchetta',['010','010','11111','01110']],
    ['Cuoricino',['11011','11111','01110','00100']],
    ['Goccia',['00100','01110','01110','11111','01110']],
    ['Pesciolino',['000100','110110','111111','110110','000100']],
    ['Fungo',['01110','11111','11111','00100','00100']],
    ['Aquilone',['00100','01110','11111','01110','00100','00100']],
    ['Freccia',['00100','01110','11111','00100','00100','00100']],
    ['Tulipano',['10101','11111','01110','00100','00100','01100']],
    ['Corona',['10001','10101','11111','11111']],
    ['Casetta',['00100','01110','11111','11111','11111']],
    ['Foglia',['00010','00111','01111','11110','11100','01000']],
    ['Faro',['00100','01110','00100','01110','01110','11111']],
    ['Montagna',['0001000','0011100','0111110','1111111']],
    ['Fiore',['00100','01110','11111','01110','00100','00110','00100']],
    ['Gatto seduto',['10001','11011','11111','01110','01110','11111']],
    ['Cuore',['0110110','1111111','0111110','0011100','0001000']],
    ['Farfalla',['1100011','1110111','0111110','0111110','1100011']],
    ['Razza',['0001000','0011100','0111110','1111111','0111110','0001000']],
    ['Albero',['0001000','0011100','0111110','0011100','0111110','1111111','0001000']],
    ['Cactus',['01010','11011','11011','11111','01110','01110','01110']],
    ['Tartaruga',['0011100','0111110','1111111','0111110','1100011']],
    ['Pagoda',['0001000','0011100','0111110','0011100','0111110','1111111','0011100']],
    ['Pinguino',['01110','11111','11111','11111','11111','01110','11011']],
    ['Balena',['0000110','0011111','1111111','1111111','0111110']],
    ['Farfalla grande',['1100011','1110111','1111111','0111110','1110111','1100011']],
    ['Razzo',['00100','01110','11111','11111','11111','11111','11011','01010']],
    ['Castello',['1001001','1101011','1111111','0111110','0111110','0111110']],
    ['Cristallo',['0011100','0111110','1111111','1111111','0111110','0011100','0001000']],
    ['Stella',['0001000','0001000','1111111','0111110','0011100','0111110','1100011']],
    ['Tempio',['0001000','0011100','0111110','1111111','0111110','0111110','1111111']],
    ['Gatto viaggiatore',['1100011','1110111','1111111','0111110','0111110','0111110','0111110']],
    ['Globo',['0011100','0111110','1111111','1111111','1111111','0111110','0011100']],
    ['Conchiglia',['0001000','0011100','0111110','1111111','1111111','1111111','0111110','0011100']],
    ['Grande cuore',['0110110','1111111','1111111','1111111','0111110','0111110','0011100']],
    ['Il mondo dei mici',['1100011','1110111','1111111','1111111','1111111','0111110','0111110','0011100']]
  ];
  function cellsFromRows(rows){const width=Math.max(...rows.map(r=>r.length)),left=Math.floor((9-width)/2);return rows.flatMap((row,i)=>[...row].flatMap((v,x)=>v==='1'?[{x:x+left+Math.floor((width-row.length)/2),y:12-rows.length+i}]:[]));}
  const sorted=designs.map(([label,rows])=>({label,rows,cells:cellsFromRows(rows)})).sort((a,b)=>a.cells.length-b.cells.length||a.rows.length-b.rows.length);
  const MISSIONS=sorted.map((d,stage)=>({world:Math.floor(stage/2),kind:'figure',label:d.label,targets:d.cells,title:d.label,duration:210000+Math.floor(stage/6)*15000}));
  return {WORLDS,MISSIONS};
});

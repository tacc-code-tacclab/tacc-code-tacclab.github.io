(() => {
  "use strict";

  const canvas = document.querySelector("#game");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  ctx.imageSmoothingEnabled = false;
  const W = 320;
  const H = 180;
  const FLOOR = 151;
  const C = { ink: "#090607", deep: "#760a12", dark: "#a4161f", field: "#e86455", paper: "#f2c0ad", white: "#fff4ec" };
  const P = (x, y, w, h = H - y, extra = {}) => ({ x, y, w, h, ...extra });
  const S = (x, w, extra = {}) => ({ type: "spike", x, y: FLOOR - 6, w, h: 6, ...extra });
  const saw = (x, y, r = 7, extra = {}) => ({ type: "saw", x, y, r, ...extra });
  const drop = (x, y, w, h, trigger, extra = {}) => ({ type: "drop", x, y, w, h, trigger, ...extra });
  const enemy = (x, y, min, max, speed, extra = {}) => ({ type: "enemy", x, y, w: 7, h: 11, min, max, speed, ...extra });
  const goal = (x = 303, y = 135) => ({ x, y, w: 10, h: 16 });

  const LEVELS = [
    { place: "TROY", title: "THE WOODEN HORSE", story: "LEAVE THE BURNING CITY.", scene: "troy", spawn: [17, 29], goal: goal(), platforms: [P(0,FLOOR,91),P(108,FLOOR,80),P(206,FLOOR,114)], hazards: [S(66,12,{hidden:true,trigger:49}),drop(153,31,12,12,126)] },
    { place: "ISMARUS", title: "BEFORE DAWN", story: "THE CICONES RETURN.", scene: "walls", spawn: [15,27], goal: goal(), platforms: [P(0,FLOOR,70),P(82,138,54),P(151,FLOOR,58),P(222,141,98)], hazards: [enemy(101,127,88,124,21),S(181,12,{hidden:true,trigger:165}),drop(250,25,13,13,226)] },
    { place: "LOTUS SHORE", title: "DO NOT TASTE IT", story: "MEMORY IS THE FIRST TRAP.", scene: "lotus", spawn: [15,27], goal: goal(), platforms: [P(0,FLOOR,101),P(115,FLOOR,94),P(224,FLOOR,96)], hazards: [S(77,10,{hidden:true,trigger:54}),S(161,15),enemy(241,140,233,277,15,{kind:"lotus"})], reverse:[119,205] },
    { place: "CYCLOPS CAVE", title: "MY NAME IS NOBODY", story: "MOVE WHEN THE EYE CLOSES.", scene: "cave", spawn: [14,26], goal: goal(), platforms: [P(0,FLOOR,61),P(76,137,43,8),P(135,121,43,8),P(194,137,42,8),P(252,FLOOR,68)], hazards: [saw(222,130,7,{min:194,max:232,speed:24}),drop(158,45,12,12,139),enemy(269,140,262,289,12,{kind:"cyclops",w:10,h:18,y:133})] },
    { place: "AEOLIA", title: "THE OPENED BAG", story: "THE WIND CHANGES ITS MIND.", scene: "wind", spawn: [14,26], goal: goal(), platforms: [P(0,FLOOR,55),P(70,137,42,8),P(129,119,42,8),P(189,137,42,8),P(249,FLOOR,71)], hazards: [S(94,10),S(211,10,{hidden:true,trigger:194})], wind:[58,245] },
    { place: "TELEPYLOS", title: "HARBOUR OF GIANTS", story: "STONE FALLS FASTER THAN PRIDE.", scene: "walls", spawn: [14,26], goal: goal(), platforms: [P(0,FLOOR,320)], hazards: [drop(86,21,15,15,56),drop(167,18,17,17,137,{delay:.18}),drop(248,21,15,15,218),S(129,11,{hidden:true,trigger:111}),S(282,11,{hidden:true,trigger:262})] },
    { place: "AEAEA", title: "CIRCE'S TABLE", story: "THE FEAST REMOVES THE FLOOR.", scene: "palace", spawn: [14,26], goal: goal(), platforms: [P(0,FLOOR,72),P(84,139,47,41,{vanish:true,trigger:115}),P(145,126,47,54),P(206,139,43,41,{fall:true,trigger:225,delay:.25}),P(263,FLOOR,57)], hazards: [enemy(160,115,151,181,16,{kind:"boar"}),S(180,10)] },
    { place: "THE UNDERWORLD", title: "SPEAK WITH THE DEAD", story: "SHADOWS WALK IN RHYTHM.", scene: "underworld", spawn: [14,26], goal: goal(), platforms: [P(0,FLOOR,61),P(75,138,41,42),P(130,124,39,56),P(184,138,43,42,{fall:true,trigger:208,delay:.34}),P(243,FLOOR,77)], hazards: [enemy(87,127,80,108,18,{kind:"shade"}),enemy(144,113,136,160,23,{kind:"shade"}),S(205,12,{hidden:true,trigger:190})] },
    { place: "THE SIRENS", title: "BOUND TO THE MAST", story: "THE SONG REVERSES EVERY STEP.", scene: "sea", spawn: [14,26], goal: goal(), platforms: [P(0,FLOOR,92),P(108,FLOOR,102),P(226,FLOOR,94)], hazards: [S(137,12),S(184,12,{hidden:true,trigger:163}),saw(254,143,7,{min:237,max:286,speed:25})], reverse:[102,220] },
    { place: "THE STRAIT", title: "SCYLLA AND CHARYBDIS", story: "THERE IS NO HARMLESS ROUTE.", scene: "sea", spawn: [14,26], goal: goal(), platforms: [P(0,FLOOR,52),P(67,138,39,8),P(121,122,39,8),P(176,138,39,8),P(231,FLOOR,89)], hazards: [saw(95,129,7,{min:74,max:101,speed:17}),saw(204,129,7,{min:181,max:208,speed:21}),drop(144,34,12,12,125)] },
    { place: "THRINACIA", title: "THE FORBIDDEN HERD", story: "THE SUN SEES EVERYTHING.", scene: "sun", spawn: [14,26], goal: goal(), platforms: [P(0,FLOOR,320)], hazards: [enemy(77,140,60,105,14,{kind:"cattle",w:11}),S(126,14,{hidden:true,trigger:105}),enemy(190,140,175,218,18,{kind:"cattle",w:11}),S(250,14,{hidden:true,trigger:232}),drop(289,23,6,31,270,{kind:"bolt"})] },
    { place: "OGYGIA", title: "SEVEN YEARS STILL", story: "IMMORTALITY IS ANOTHER CELL.", scene: "island", spawn: [14,26], goal: goal(), platforms: [P(0,FLOOR,64),P(78,138,41,42,{vanish:true,trigger:104}),P(134,123,39,57,{fall:true,trigger:151,delay:.3}),P(188,138,41,42,{vanish:true,trigger:214}),P(244,FLOOR,76)], hazards: [S(154,10),enemy(266,140,256,288,19,{kind:"wave"})] },
    { place: "SCHERIA", title: "THE LAST CROSSING", story: "LET THE DECK CARRY YOU.", scene: "sea", spawn: [14,26], goal: goal(), platforms: [P(0,FLOOR,57),P(73,137,42,8,{move:true,min:68,max:100,speed:14}),P(137,120,40,8,{moveY:true,min:113,max:137,speed:12}),P(201,137,42,8,{move:true,min:194,max:226,speed:17}),P(260,FLOOR,60)], hazards: [S(221,10)] },
    { place: "ITHACA", title: "THE BOW OF ODYSSEUS", story: "HOME MUST BE WON ONCE MORE.", scene: "ithaca", spawn: [14,26], goal: goal(300,126), platforms: [P(0,FLOOR,80),P(94,138,46,42),P(154,125,46,55),P(214,138,42,42),P(270,FLOOR,50)], hazards: [enemy(105,127,100,128,20,{kind:"suitor"}),enemy(165,114,160,188,23,{kind:"suitor"}),enemy(226,127,220,245,26,{kind:"suitor"}),S(69,10,{hidden:true,trigger:51})], final:true },
  ];

  const ui = {
    menu: document.querySelector("#menu"), pause: document.querySelector("#pause"), ending: document.querySelector("#ending"),
    endingText: document.querySelector("#endingText"), resume: document.querySelector("#resumeButton"), again: document.querySelector("#againButton"),
    restart: document.querySelector("#restartButton"), mute: document.querySelector("#muteButton"), touchP2: document.querySelector("#touchP2"),
    chapter: document.querySelector("#chapterStatus"), title: document.querySelector("#chapterTitle"), score: document.querySelector("#scoreStatus"),
  };

  const state = {
    running: false, paused: false, muted: false, mode: 1, levelIndex: 0, level: null, players: [],
    keys: [{left:false,right:false,jump:false},{left:false,right:false,jump:false}],
    falls: 0, score: [0,0], last: performance.now(), token: 0, start: 0, flash: 0, winner: -1, audio: null,
    intro: 0, musicTimer: 0, musicStep: 0, footstep: [0,0],
  };

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const hit = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  const px = n => Math.round(n);

  function cloneLevel(index) {
    const level = JSON.parse(JSON.stringify(LEVELS[index]));
    level.platforms.forEach((p,i) => { p.id=i; p.alive=true; p.timer=0; p.vy=0; p.dir=1; p.baseX=p.x; p.baseY=p.y; });
    level.hazards.forEach(h => { h.active=!h.hidden && h.trigger == null; h.timer=0; h.vy=0; h.dir=1; h.baseX=h.x; h.baseY=h.y; });
    return level;
  }

  function makePlayer(id) {
    return { id, x: state.level.spawn[id] ?? 15, y: FLOOR-11, w:7, h:11, vx:0, vy:0, ground:false, coyote:0, jumpBuffer:0, alive:true, respawn:0, facing:1, step:0 };
  }

  function loadLevel(index) {
    state.token += 1;
    state.levelIndex = clamp(index,0,LEVELS.length-1);
    state.level = cloneLevel(state.levelIndex);
    state.players = [makePlayer(0)];
    if (state.mode === 2) state.players.push(makePlayer(1));
    state.winner = -1;
    state.flash = 0;
    state.intro = 1.25;
    state.keys.forEach(k => { k.left=false; k.right=false; k.jump=false; });
    const l = state.level;
    ui.chapter.textContent = `${String(state.levelIndex+1).padStart(2,"0")} / 14 · ${l.place}`;
    ui.title.textContent = l.title;
    updateScore();
    tone("chapter");
  }

  function startGame(mode) {
    state.mode = mode;
    document.body.dataset.mode = String(mode);
    state.running = true;
    state.paused = false;
    state.levelIndex = 0;
    state.falls = 0;
    state.score = [0,0];
    state.start = performance.now();
    ui.menu.hidden = true;
    ui.pause.hidden = true;
    ui.ending.hidden = true;
    ui.touchP2.hidden = mode !== 2;
    enableAudio();
    startMusic();
    loadLevel(0);
    canvas.focus({preventScroll:true});
  }

  function updateScore() {
    ui.score.textContent = state.mode === 1
      ? `FALLS ${String(state.falls).padStart(2,"0")}`
      : `P1 ${state.score[0]} : ${state.score[1]} P2`;
  }

  function retry(count = false) {
    if (!state.running) return;
    if (count && state.mode === 1) state.falls += 1;
    loadLevel(state.levelIndex);
  }

  function killPlayer(player) {
    if (!player.alive || state.winner >= 0) return;
    player.alive = false;
    player.respawn = .34;
    state.flash = .11;
    if (state.mode === 1) {
      state.falls += 1;
      updateScore();
      tone("death");
      const token = state.token;
      window.setTimeout(() => { if (state.token === token) loadLevel(state.levelIndex); }, 190);
    } else {
      tone("death");
    }
  }

  function finish(player) {
    if (state.winner >= 0) return;
    state.winner = player.id;
    if (state.mode === 2) state.score[player.id] += 1;
    updateScore();
    tone(state.level.final ? "home" : "win");
    const token = state.token;
    window.setTimeout(() => {
      if (token !== state.token) return;
      if (state.level.final) endGame(); else loadLevel(state.levelIndex+1);
    }, state.level.final ? 760 : 420);
  }

  function endGame() {
    state.running = false;
    const seconds = Math.max(1,Math.round((performance.now()-state.start)/1000));
    if (state.mode === 1) ui.endingText.textContent = `14 TRIALS · ${state.falls} FALLS · ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`;
    else {
      const result = state.score[0] === state.score[1] ? "THE VOYAGE ENDS IN A DRAW" : `${state.score[0] > state.score[1] ? "ODYSSEUS" : "ATHENA"} WINS THE VOYAGE`;
      ui.endingText.textContent = `${result} · ${state.score[0]}:${state.score[1]}`;
    }
    ui.ending.hidden = false;
  }

  function togglePause(force) {
    if (!state.running || state.winner >= 0) return;
    state.paused = typeof force === "boolean" ? force : !state.paused;
    ui.pause.hidden = !state.paused;
    if (!state.paused) { state.last=performance.now(); canvas.focus({preventScroll:true}); }
  }

  function enableAudio() {
    if (!state.audio) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) state.audio = new AC();
    }
    state.audio?.resume?.();
  }

  const MUSIC = {
    land: [110,0,147,0,131,0,98,0,110,147,165,0,131,0,98,0],
    sea: [147,0,165,196,0,165,147,0,131,0,147,165,0,131,110,0],
    dark: [82,0,82,98,73,0,82,0,65,0,73,82,0,61,0,0],
    home: [131,165,196,262,220,196,165,0,147,175,220,294,262,220,196,0],
  };

  function musicFamily() {
    if (state.levelIndex === LEVELS.length - 1) return MUSIC.home;
    if ([7,9].includes(state.levelIndex)) return MUSIC.dark;
    if ([4,8,9,12].includes(state.levelIndex)) return MUSIC.sea;
    return MUSIC.land;
  }

  function startMusic() {
    if (state.musicTimer) return;
    state.musicTimer = window.setInterval(() => {
      if (!state.running || state.paused || state.muted || !state.audio) return;
      const melody = musicFamily();
      const note = melody[state.musicStep % melody.length];
      if (note) {
        beep(note, .105, note, .006, state.musicStep % 4 === 0 ? "triangle" : "square");
        if (state.musicStep % 4 === 0) beep(note / 2, .15, note / 2, .004, "square");
      }
      state.musicStep += 1;
    }, 155);
  }

  function beep(freq,duration=.06,end=freq,volume=.027,type="square") {
    if (state.muted || !state.audio) return;
    const now=state.audio.currentTime, osc=state.audio.createOscillator(), gain=state.audio.createGain();
    osc.type=type; osc.frequency.setValueAtTime(freq,now); osc.frequency.linearRampToValueAtTime(end,now+duration);
    gain.gain.setValueAtTime(volume,now); gain.gain.setValueAtTime(volume,now+duration*.72); gain.gain.linearRampToValueAtTime(.0001,now+duration);
    osc.connect(gain).connect(state.audio.destination); osc.start(now); osc.stop(now+duration+.01);
  }

  function tone(name) {
    if (name==="jump") { beep(165,.035,220,.018); setTimeout(()=>beep(247,.045,330,.015),28); }
    if (name==="step") beep(58,.025,48,.008,"square");
    if (name==="trap") { beep(92,.04,55,.024); setTimeout(()=>beep(46,.055,36,.018),35); }
    if (name==="death") { beep(139,.07,70,.032); setTimeout(()=>beep(62,.12,28,.028,"sawtooth"),55); }
    if (name==="chapter") { beep(110,.05,110,.018); setTimeout(()=>beep(165,.05,165,.018),55); }
    if (name==="win") { beep(220,.06,260,.024); setTimeout(()=>beep(330,.08,390,.024),65); }
    if (name==="home") [165,220,330,440].forEach((n,i)=>setTimeout(()=>beep(n,.12,n,.025),i*80));
  }

  function activePlatforms() { return state.level.platforms.filter(p=>p.alive); }

  function updatePlatforms(dt) {
    const lead = Math.max(...state.players.filter(p=>p.alive).map(p=>p.x),0);
    state.level.platforms.forEach(p => {
      p.prevX=p.x; p.prevY=p.y;
      if ((p.vanish || p.fall) && lead >= p.trigger) p.timer += dt;
      if (p.vanish && p.timer > .22) p.alive=false;
      if (p.fall && p.timer > (p.delay||.25)) { p.vy += 120*dt; p.y += p.vy*dt; if(p.y>H) p.alive=false; }
      if (p.move) { p.x += p.speed*p.dir*dt; if(p.x<p.min||p.x>p.max){ p.x=clamp(p.x,p.min,p.max); p.dir*=-1; } }
      if (p.moveY) { p.y += p.speed*p.dir*dt; if(p.y<p.min||p.y>p.max){ p.y=clamp(p.y,p.min,p.max); p.dir*=-1; } }
    });
  }

  function updatePlayer(player,dt) {
    if (!player.alive) {
      if (state.mode===2) { player.respawn -= dt; if(player.respawn<=0){ const fresh=makePlayer(player.id); Object.assign(player,fresh); } }
      return;
    }
    const keys=state.keys[player.id];
    let left=keys.left, right=keys.right;
    if (state.level.reverse && player.x>state.level.reverse[0] && player.x<state.level.reverse[1]) [left,right]=[right,left];
    const direction=(right?1:0)-(left?1:0);
    const wind=state.level.wind && player.x>state.level.wind[0] && player.x<state.level.wind[1] ? (Math.sin(performance.now()/420)>0 ? 32 : -25) : 0;
    player.vx += (direction*76-player.vx)*Math.min(1,dt*18);
    player.vx += wind*dt;
    if(direction) player.facing=direction;
    player.coyote=player.ground?.11:Math.max(0,player.coyote-dt);
    player.jumpBuffer=keys.jump?Math.max(player.jumpBuffer,.1):Math.max(0,player.jumpBuffer-dt);
    if(player.jumpBuffer>0&&player.coyote>0){ player.vy=-151; player.ground=false; player.coyote=0; player.jumpBuffer=0; keys.jump=false; tone("jump"); }
    player.vy += 430*dt;
    if(!keys.jump&&player.vy<-35) player.vy += 240*dt;
    player.vy=Math.min(player.vy,230);

    player.x += player.vx*dt;
    for(const p of activePlatforms()) if(hit(player,p)){ if(player.vx>0)player.x=p.x-player.w; else if(player.vx<0)player.x=p.x+p.w; player.vx=0; }
    player.x=clamp(player.x,0,W-player.w);

    const oldBottom=player.y+player.h;
    player.y += player.vy*dt;
    player.ground=false;
    if(player.vy>=0){
      let land=null;
      for(const p of activePlatforms()) if(player.x+player.w>p.x+1&&player.x<p.x+p.w-1&&oldBottom<=p.y+2&&player.y+player.h>=p.y&&(!land||p.y<land.y))land=p;
      if(land){ player.y=land.y-player.h; player.vy=0; player.ground=true; if(land.move) player.x+=land.x-land.prevX; if(land.moveY)player.y+=land.y-land.prevY; }
    } else {
      for(const p of activePlatforms()) if(hit(player,p)){ player.y=p.y+p.h; player.vy=0; break; }
    }
    player.step += Math.abs(player.vx)*dt;
    state.footstep[player.id] -= dt;
    if (player.ground && direction && state.footstep[player.id] <= 0) {
      tone("step");
      state.footstep[player.id] = .19;
    }
    if(player.y>H+10)killPlayer(player);
  }

  function hazardBox(h) {
    if(h.type==="saw")return{x:h.x-h.r,y:h.y-h.r,w:h.r*2,h:h.r*2};
    return h;
  }

  function updateHazards(dt) {
    const lead=Math.max(...state.players.filter(p=>p.alive).map(p=>p.x),0);
    for(const h of state.level.hazards){
      if(h.trigger!=null&&lead>=h.trigger&&!h.active){h.active=true;tone("trap");}
      if(h.type==="drop"&&h.active){h.timer+=dt;if(h.timer>(h.delay||.04)){h.vy+=330*dt;h.y+=h.vy*dt;}}
      if((h.type==="saw"||h.type==="enemy")&&h.min!=null){h.x+=h.speed*h.dir*dt;if(h.x<h.min||h.x>h.max){h.x=clamp(h.x,h.min,h.max);h.dir*=-1;}}
      if(h.type==="spike"&&!h.active)continue;
      for(const p of state.players)if(p.alive&&hit(p,hazardBox(h)))killPlayer(p);
    }
  }

  function update(dt) {
    if(!state.running||state.paused||state.winner>=0)return;
    updatePlatforms(dt);
    state.players.forEach(p=>updatePlayer(p,dt));
    updateHazards(dt);
    state.players.forEach(p=>{if(p.alive&&hit(p,state.level.goal))finish(p);});
    state.flash=Math.max(0,state.flash-dt);
    state.intro=Math.max(0,state.intro-dt);
  }

  function rect(x,y,w,h,color=C.ink){ctx.fillStyle=color;ctx.fillRect(px(x),px(y),px(w),px(h));}

  function drawHorse(x,y) {
    rect(x,y+12,47,22,C.ink); rect(x+35,y+3,13,18,C.ink); rect(x+42,y,8,7,C.ink);
    rect(x+5,y+34,6,13,C.ink); rect(x+31,y+34,6,13,C.ink); rect(x-7,y+9,12,5,C.ink);
    rect(x-10,y+3,5,8,C.ink); rect(x-13,y,4,5,C.ink);
    rect(x+8,y+17,23,6,C.field); rect(x+11,y+13,4,4,C.field);
    for(const wx of [x+7,x+36]){rect(wx,y+40,11,11,C.deep);rect(wx+3,y+43,5,5,C.paper);}
  }

  function drawShip(x,y,scale=1) {
    const q=n=>n*scale;
    rect(x,y,q(53),q(5),C.ink); rect(x+q(5),y+q(5),q(42),q(7),C.ink);
    rect(x+q(12),y+q(12),q(27),q(3),C.ink); rect(x+q(27),y-q(34),q(3),q(34),C.ink);
    rect(x+q(30),y-q(31),q(20),q(3),C.ink); rect(x+q(30),y-q(28),q(16),q(20),C.paper);
    rect(x+q(30),y-q(28),q(3),q(20),C.ink); rect(x+q(7),y-q(5),q(3),q(5),C.ink);
  }

  function drawCyclops(x,y) {
    const blink=Math.floor(performance.now()/650)%5===0;
    rect(x+5,y,19,8,C.ink);rect(x+2,y+8,25,27,C.ink);rect(x,y+16,5,26,C.ink);rect(x+24,y+16,5,26,C.ink);
    rect(x+6,y+35,7,19,C.ink);rect(x+17,y+35,7,19,C.ink);
    rect(x+8,y+11,13,blink?2:7,C.paper);if(!blink){rect(x+13,y+12,4,5,C.deep);rect(x+14,y+13,2,3,C.ink);}
    rect(x+9,y+25,12,3,C.field);rect(x+11,y+28,2,3,C.paper);rect(x+17,y+28,2,3,C.paper);
    rect(x-3,y+38,35,4,C.dark);
  }

  function drawCirce(x,y) {
    rect(x+5,y,9,7,C.ink);rect(x+3,y+7,13,17,C.ink);rect(x+1,y+24,6,12,C.ink);rect(x+12,y+24,6,12,C.ink);
    rect(x+14,y+2,4,4,C.paper);rect(x+17,y-9,2,29,C.ink);rect(x+15,y-11,6,3,C.ink);
    rect(x-20,y+27,19,7,C.ink);rect(x-17,y+23,13,4,C.ink);rect(x-14,y+20,7,3,C.paper);
    const steam=Math.floor(performance.now()/180)%4;rect(x-14+steam,y+15,2,4,C.paper);rect(x-10-steam,y+11,2,4,C.paper);
  }

  function drawScylla(x,y) {
    const sway=Math.floor(performance.now()/220)%3-1;
    rect(x+13,y+28,19,35,C.ink);rect(x+8,y+58,31,7,C.ink);
    for(let i=0;i<3;i++){const nx=x+i*12+sway*(i-1);rect(nx+12,y+i*4,5,34-i*3,C.ink);rect(nx+8,y+i*4,13,8,C.ink);rect(nx+9,y+i*10+7,3,3,C.paper);rect(nx+17,y+i*10+7,3,3,C.paper);}
    rect(x+2,y+63,5,19,C.ink);rect(x+42,y+63,5,20,C.ink);
  }

  function drawOlive(x,y) {
    rect(x+13,y+18,6,39,C.ink);rect(x+4,y+9,10,12,C.deep);rect(x+17,y+5,13,16,C.deep);rect(x+27,y+14,10,12,C.deep);
    rect(x,y+17,11,9,C.deep);rect(x+7,y+5,4,4,C.paper);rect(x+23,y+10,4,4,C.paper);rect(x+31,y+18,3,3,C.paper);
  }

  function drawSceneStory() {
    const n=state.levelIndex, wave=Math.floor(performance.now()/160)%8;
    if(n===0){drawHorse(212,85);rect(14,113,3,16,C.paper);rect(11,110,9,5,C.paper);}
    if(n===1){rect(244,79,4,45,C.ink);rect(248,79,18,10,C.paper);rect(275,103,17,21,C.ink);rect(280,95,7,8,C.ink);}
    if(n===2)for(let x=35;x<295;x+=51){rect(x,118,3,19,C.ink);rect(x-5,113,13,7,C.paper);rect(x-2,110,7,13,C.deep);}
    if(n===3)drawCyclops(271,76);
    if(n===4){rect(246,86,42,43,C.deep);rect(252,77,30,9,C.ink);rect(264,100,12,22,C.field);rect(274,117,11,9,C.paper);rect(278,112,3,5,C.ink);}
    if(n===5){for(const x of [211,249,285]){rect(x,73,14,18,C.ink);rect(x-3,91,20,35,C.ink);rect(x-7,98,5,27,C.ink);rect(x+17,98,5,27,C.ink);}}
    if(n===6)drawCirce(274,93);
    if(n===7){for(const x of [40,217,278]){rect(x,105,12,12,C.ink);rect(x+2,109,2,2,C.paper);rect(x+8,109,2,2,C.paper);rect(x+4,115,4,2,C.paper);rect(x+3,117,6,12,C.deep);}}
    if(n===8){drawShip(19,133,.85);rect(174,104,24,26,C.ink);rect(180,96,12,9,C.ink);rect(181,108,3,3,C.paper);rect(191,108,3,3,C.paper);for(let x=125;x<215;x+=17)rect(x,73+(x%5)*3+wave/2,3,3,C.paper);}
    if(n===9){drawShip(78,133,.9);drawScylla(242,63);for(let x=0;x<320;x+=24)rect(x+wave,141+(x%3),13,3,C.ink);}
    if(n===10){for(const x of [42,230]){rect(x,125,16,9,C.ink);rect(x+13,119,8,8,C.ink);rect(x+2,134,3,8,C.ink);rect(x+12,134,3,8,C.ink);rect(x+18,116,2,4,C.paper);}}
    if(n===11){rect(257,91,5,42,C.ink);for(let i=0;i<5;i++){rect(235+i*8,82+i%2*5,14,5,C.deep);}rect(272,98,17,25,C.ink);rect(277,90,7,8,C.ink);}
    if(n===12){drawShip(230,131,1);rect(23,91,31,35,C.deep);rect(29,82,19,9,C.ink);}
    if(n===13){drawOlive(260,78);rect(20,118,38,3,C.ink);rect(21,112,3,9,C.ink);rect(54,112,3,9,C.ink);rect(31,109,15,3,C.paper);}
  }

  function drawScene() {
    rect(0,0,W,H,C.field);
    const s=state.level.scene;
    ctx.globalAlpha=.38;
    if(s==="troy"||s==="walls"){for(let x=12;x<320;x+=64){rect(x,72,28,79,C.deep);rect(x-3,67,34,6,C.deep);} if(s==="troy")for(let x=42;x<300;x+=71){rect(x,118,3,10,C.paper);rect(x-2,121,7,3,C.paper);}}
    if(s==="cave"){for(let x=0;x<320;x+=28){rect(x,23+(x%19),19,22,C.deep);rect(x,119-(x%17),23,32,C.deep);} rect(265,56,24,34,C.dark);}
    if(s==="lotus"||s==="island"){for(let x=34;x<320;x+=48){rect(x,124,2,27,C.deep);rect(x-4,119,10,5,C.deep);}}
    if(s==="wind"){for(let y=65;y<130;y+=22)for(let x=40+(y%3)*12;x<285;x+=67){rect(x,y,26,2,C.deep);rect(x+22,y-3,2,3,C.deep);}}
    if(s==="palace"||s==="ithaca"){rect(34,51,252,6,C.deep);for(let x=48;x<290;x+=48){rect(x,57,8,77,C.deep);rect(x-3,56,14,4,C.deep);}}
    if(s==="underworld"){for(let i=0;i<27;i++)rect((i*47)%316,26+(i*29)%101,2,2,C.paper);rect(0,111,320,4,C.deep);}
    if(s==="sea"){const drift=Math.floor(performance.now()/120)%18;for(let y=112;y<149;y+=9)for(let x=-23;x<320;x+=18){rect(x+(y%2)*4+drift,y,9,2,C.deep);}}
    if(s==="sun"){rect(249,31,25,25,C.paper);for(let i=0;i<8;i++){const a=i*Math.PI/4;rect(261+Math.cos(a)*20,43+Math.sin(a)*20,3,3,C.paper);}}
    ctx.globalAlpha=1;
    drawSceneStory();
  }

  function drawPlatforms() {
    for(const p of state.level.platforms){if(!p.alive)continue;rect(p.x,p.y,p.w,p.h,C.deep);rect(p.x,p.y,p.w,3,C.dark);if((p.vanish||p.fall)&&p.timer>0)for(let x=p.x+4;x<p.x+p.w;x+=9)rect(x,p.y+5,3,2,C.field);}
  }

  function drawGoal() {
    const g=state.level.goal;
    rect(g.x,g.y,g.w,g.h,C.paper);rect(g.x+2,g.y+3,g.w-4,g.h-3,C.deep);rect(g.x+7,g.y+8,1,1,C.paper);
    if(state.level.final){rect(g.x-3,g.y-4,g.w+6,3,C.paper);rect(g.x-1,g.y-8,g.w+2,4,C.paper);}
  }

  function drawHazards() {
    for(const h of state.level.hazards){
      if(h.type==="spike"){if(!h.active)continue;const count=Math.max(1,Math.floor(h.w/4));for(let i=0;i<count;i++){const x=px(h.x+i*h.w/count);rect(x,h.y+4,3,2,C.ink);rect(x+1,h.y+2,1,2,C.ink);}}
      if(h.type==="drop"&&h.active){rect(h.x,h.y,h.w,h.h,C.ink);if(h.kind!=="bolt")rect(h.x+3,h.y+3,3,3,C.field);}
      if(h.type==="saw"){const x=px(h.x),y=px(h.y),r=h.r;rect(x-r+2,y-r,r*2-4,r*2,C.ink);rect(x-r,y-r+2,r*2,r*2-4,C.ink);rect(x-2,y-2,4,4,C.field);for(let i=0;i<8;i++){const a=i*Math.PI/4;rect(x+Math.cos(a)*(r+1)-1,y+Math.sin(a)*(r+1)-1,2,2,C.ink);}}
      if(h.type==="enemy"){rect(h.x+1,h.y,h.w-2,4,C.ink);rect(h.x,h.y+4,h.w,h.h-6,C.ink);rect(h.x,h.y+h.h-2,2,2,C.ink);rect(h.x+h.w-2,h.y+h.h-2,2,2,C.ink);if(h.kind==="cyclops")rect(h.x+4,h.y+4,2,2,C.field);}
    }
  }

  function drawPlayer(p) {
    if(!p.alive)return;
    const x=px(p.x),y=px(p.y),walk=Math.floor(p.step/4)%2;
    rect(x+1,y,5,4,C.ink);rect(x,y+4,7,5,C.ink);
    rect(x+(walk?0:1),y+9,2,2,C.ink);rect(x+(walk?5:4),y+9,2,2,C.ink);
    if(p.id===0){rect(x+1,y-2,5,2,C.ink);rect(x+5,y-3,2,1,C.ink);} else {rect(x,y-2,7,1,C.ink);rect(x+3,y-4,1,2,C.ink);rect(x+4,y+1,1,1,C.field);}
  }

  function drawHud() {
    ctx.font="bold 6px monospace";ctx.textBaseline="top";ctx.fillStyle=C.ink;
    ctx.fillText(`${String(state.levelIndex+1).padStart(2,"0")} ${state.level.place}`,8,8);
    ctx.textAlign="right";ctx.fillText(state.mode===1?`× ${String(state.falls).padStart(2,"0")}`:`${state.score[0]} : ${state.score[1]}`,312,8);ctx.textAlign="left";
    const boxes=14;for(let i=0;i<boxes;i++){ctx.strokeStyle=i<=state.levelIndex?C.deep:C.dark;ctx.lineWidth=1;ctx.strokeRect(119+i*6,8,4,4);if(i<state.levelIndex)rect(120+i*6,9,2,2,C.deep);}
    ctx.fillStyle=C.deep;ctx.fillText(state.level.story,8,20);
    if(state.level.reverse){ctx.fillText("THE SONG REVERSES YOU",119,30);}
    if(state.intro>0&&state.winner<0){
      ctx.globalAlpha=clamp(state.intro*1.4,0,1);
      rect(77,72,166,34,C.ink);rect(80,75,160,28,C.paper);
      ctx.fillStyle=C.ink;ctx.textAlign="center";ctx.font="bold 6px monospace";ctx.fillText(state.level.place,160,80);
      ctx.font="bold 9px monospace";ctx.fillText(state.level.title,160,91);ctx.textAlign="left";ctx.globalAlpha=1;
    }
    if(state.winner>=0){ctx.fillStyle=C.paper;rect(106,75,108,25,C.ink);ctx.fillStyle=C.paper;ctx.textAlign="center";ctx.font="bold 8px monospace";ctx.fillText(state.mode===1?"PASSAGE OPEN":`P${state.winner+1} TAKES THE ROOM`,160,84);ctx.textAlign="left";}
    if(state.flash>0){ctx.globalAlpha=.6;rect(0,0,W,H,C.paper);ctx.globalAlpha=1;}
  }

  function draw() {
    if(!state.level)return;
    drawScene();drawPlatforms();drawGoal();drawHazards();state.players.forEach(drawPlayer);drawHud();
  }

  function frame(now) {
    const dt=Math.min(.032,Math.max(0,(now-state.last)/1000));state.last=now;
    const steps=Math.max(1,Math.ceil(dt/.01));for(let i=0;i<steps;i++)update(dt/steps);
    draw();requestAnimationFrame(frame);
  }

  function setKey(player,key,value) {
    if(!state.keys[player])return;
    state.keys[player][key]=value;
    if(value)enableAudio();
  }

  document.addEventListener("keydown",e=>{
    const map={KeyA:[0,"left"],KeyD:[0,"right"],KeyW:[0,"jump"],ArrowLeft:[state.mode===1?0:1,"left"],ArrowRight:[state.mode===1?0:1,"right"],ArrowUp:[state.mode===1?0:1,"jump"]};
    if(map[e.code]){e.preventDefault();setKey(...map[e.code],true);} if(e.code==="KeyR")retry(false); if(e.code==="Escape")togglePause();
  });
  document.addEventListener("keyup",e=>{
    const map={KeyA:[0,"left"],KeyD:[0,"right"],KeyW:[0,"jump"],ArrowLeft:[state.mode===1?0:1,"left"],ArrowRight:[state.mode===1?0:1,"right"],ArrowUp:[state.mode===1?0:1,"jump"]};
    if(map[e.code]){e.preventDefault();setKey(...map[e.code],false);}
  });

  document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>startGame(Number(b.dataset.mode))));
  document.querySelectorAll(".touch [data-player]").forEach(b=>{
    const player=Number(b.dataset.player),key=b.dataset.key;
    const down=e=>{
      e.preventDefault();
      if(e.pointerType==="mouse"&&key!=="jump"){
        setKey(player,key,!state.keys[player][key]);
        setKey(player,key==="left"?"right":"left",false);
      }else{
        b.setPointerCapture?.(e.pointerId);
        setKey(player,key,true);
      }
    };
    const up=e=>{
      e.preventDefault();
      if(e.pointerType!=="mouse"||key==="jump")setKey(player,key,false);
    };
    b.addEventListener("pointerdown",down);b.addEventListener("pointerup",up);b.addEventListener("pointercancel",up);
  });
  ui.restart.addEventListener("click",()=>retry(false));
  ui.resume.addEventListener("click",()=>togglePause(false));
  ui.again.addEventListener("click",()=>{ui.ending.hidden=true;startGame(state.mode);});
  ui.mute.addEventListener("click",()=>{state.muted=!state.muted;ui.mute.textContent=`SOUND: ${state.muted?"OFF":"ON"}`;ui.mute.setAttribute("aria-pressed",String(state.muted));if(!state.muted){enableAudio();beep(220,.05,260);}});
  window.addEventListener("blur",()=>{if(state.running&&!state.paused)togglePause(true);});

  state.level=cloneLevel(0);state.players=[makePlayer(0)];draw();requestAnimationFrame(frame);
})();

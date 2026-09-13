const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');

test('the sequel is a separate English page with a twenty-garden HUD',()=>{
  const html=read('index.html');
  assert.match(html,/<html lang="en">/);
  assert.match(html,/<title>Naughty Mole 2/);
  assert.match(html,/id="level">01 <small>\/ 20<\/small>/);
  assert.match(html,/20 gardens · directional poison/);
  assert.match(read('game.js'),/naughty-mole-2-best/);
});

test('garden 20 reveals the animated golden pumpkin reward',()=>{
  const html=read('index.html'),game=read('game.js'),style=read('style.css');
  assert.match(html,/id="pumpkin-prize"/);
  assert.match(game,/classList\.toggle\('complete',completed\)/);
  assert.match(game,/ALL TWENTY GARDENS CLEARED/);
  assert.match(game,/Golden pumpkin!/);
  assert.match(style,/\.menu-card\.complete \.pumpkin-prize\{display:block\}/);
  assert.match(style,/@keyframes pumpkin-bob/);
});

// Test-page-only layout fixture. Production game.js never loads this file.
(() => {
  const $ = id => document.getElementById(id);
  $('loading').hidden = true;
  $('title-screen').hidden = true;
  $('title-screen').classList.remove('is-visible');
  $('hud').hidden = false;
  $('touch-controls').hidden = false;
  $('objective-text').textContent = '1 · FIND GOLD';
  $('wave-text').textContent = 'HAUNTED HOUSE · VERDIGRIS · SECTOR 0:0';
  $('boss-name').textContent = 'GOLDEN SHOT READY · 84m ↗';
  $('health-text').textContent = '100';
  $('ammo-text').textContent = '32';
  $('render-host').style.background = 'radial-gradient(ellipse at 50% 60%, #35624b, #132721 65%, #091710)';
  const world = new BertrandaWorld.World(THREE, new THREE.Scene());
  world.setSchema(1, { accent: 0x67ff9a });
  const player = { x: 34, z: 34, yaw: -Math.PI / 2 };
  const gold = BertrandaExpedition.chooseBulletSite(world, player);
  const boss = { x: 66, z: 30, alive: true };
  const map = new BertrandaExpedition.ScoutMap($('map-canvas'));
  let open = true, time = 0;
  function draw() {
    const touch = innerWidth < 1100;
    document.body.dataset.touch = String(touch);
    $('touch-controls').hidden = !touch || innerWidth < innerHeight;
    $('map-details').hidden = !open;
    $('scout-map').classList.toggle('expanded', open);
    $('map-toggle').setAttribute('aria-expanded', String(open));
    map.update(world, player, gold, boss, [], time += 1, open, true);
    $('map-status').textContent = 'GOLD → ' + Math.ceil(map.distance) + 'm';
    const waypoint = BertrandaExpedition.routeWaypoint(world, map.route, player, gold);
    $('gold-guide').hidden = !waypoint;
    if (waypoint) $('gold-guide-arrow').style.transform = 'rotate(' + (-BertrandaExpedition.bearingAngle(player, waypoint, player.yaw) * 180 / Math.PI) + 'deg)';
    $('gold-guide-distance').textContent = Math.ceil(map.distance) + 'm';
    $('subtitle').textContent = 'Only the GOLDEN BULLET can kill Bertranda. Follow the gold route on the MAP.';
    $('subtitle').classList.add('visible');
    $('rotate-screen').hidden = innerWidth >= innerHeight;
  }
  $('map-toggle').addEventListener('click', () => { open = !open; draw(); });
  window.addEventListener('resize', draw);
  draw();
})();

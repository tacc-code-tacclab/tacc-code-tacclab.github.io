const test = require('node:test');
const assert = require('node:assert/strict');
const THREE = require('../../lovecraft/three.min.js');
const { World, generateChunk, KINDS, SIZE } = require('../world.js');
const cycle = { accent: 0x67ff9a };

test('five environments generate distinct, deterministic geometry layouts', () => {
  const patterns = new Set();
  for (let schema = 1; schema <= 5; schema++) {
    const a = generateChunk(schema, 0, 0);
    assert.equal(a.kind, KINDS[schema - 1]);
    assert.deepEqual(a.cells, generateChunk(schema, 0, 0).cells);
    assert.notDeepEqual(a.cells, generateChunk(schema, 3, -2).cells);
    assert.notDeepEqual(a.cells, generateChunk(schema + 5, 0, 0).cells);
    patterns.add(Buffer.from(a.cells).toString('hex'));
    assert.ok(a.cells.some(c => c !== 0));
  }
  assert.equal(patterns.size, 5);
});

test('every walkable cell connects to the exits, across negative and distant chunks', () => {
  for (let schema = 1; schema <= 30; schema++) {
    for (const [cx, cz] of [[0, 0], [-1, -1], [4, -7], [100000, -100000]]) {
      const { cells } = generateChunk(schema, cx, cz);
      const seen = new Set([136]), queue = [136];
      for (let head = 0; head < queue.length; head++) {
        const at = queue[head], x = at % 16, z = Math.floor(at / 16);
        for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, nz = z + dz, to = nz * 16 + nx;
          if (nx < 0 || nz < 0 || nx >= 16 || nz >= 16 || seen.has(to) || cells[to]) continue;
          seen.add(to); queue.push(to);
        }
      }
      assert.equal(seen.size, cells.filter(c => c === 0).length, `${schema}/${cx}/${cz}`);
      for (let lane = 7; lane <= 9; lane++) {
        assert.equal(cells[lane], 0); assert.equal(cells[240 + lane], 0);
        assert.equal(cells[lane * 16], 0); assert.equal(cells[lane * 16 + 15], 0);
      }
    }
  }
});

test('streaming thousands of metres retains at most nine render chunks and 32 data chunks', () => {
  const scene = new THREE.Scene(), world = new World(THREE, scene, { touch: true });
  world.setSchema(2, cycle);
  for (let sector = -20; sector <= 20; sector++) {
    const x = sector * SIZE + 34, z = sector * SIZE + 34;
    world.update(x, z, true);
    assert.equal(world.chunks.size, 9);
    assert.equal(scene.children.length, 9);
    assert.ok(world.cache.size <= 32);
    assert.ok(world.free(x, z));
    assert.ok(world.free(sector * SIZE, z), 'no invisible boundary at a shared portal');
  }
  world.clear(); assert.equal(scene.children.length, 0);
});

test('outdoor realms have open skies, distinct landmarks and a bounded draw-call budget', () => {
  const scene = new THREE.Scene(), world = new World(THREE, scene, { touch: true });
  for (let schema = 1; schema <= 5; schema++) {
    world.setSchema(schema, cycle); world.update(34, 34, true);
    let meshes = 0, points = 0, ceiling = false;
    const matrix = new THREE.Matrix4(), p = new THREE.Vector3(), q = new THREE.Quaternion(), scale = new THREE.Vector3();
    scene.traverse(o => {
      if (o.isPointLight) points++;
      if (!o.isInstancedMesh) return;
      meshes++;
      for (let i = 0; i < o.count; i++) {
        o.getMatrixAt(i, matrix); matrix.decompose(p, q, scale);
        if (scale.x === SIZE && scale.z === SIZE && p.y > 4) ceiling = true;
      }
    });
    assert.equal(ceiling, schema === 1 || schema === 4);
    assert.ok(meshes < 180, 'instanced environment geometry stays bounded');
    assert.equal(points, 0, 'no per-tree/prop dynamic lights');
  }
});

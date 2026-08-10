import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const researchDir = dirname(fileURLToPath(import.meta.url));
const gameDir = resolve(researchDir, "..");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const read = (path) => readFile(join(gameDir, path));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const precommitBytes = await read("precommitment-v2.json");
const manifestBytes = await read("asset-manifest-v2.json");
const precommit = JSON.parse(precommitBytes.toString("utf8"));
const manifest = JSON.parse(manifestBytes.toString("utf8"));

assert(sha256(manifestBytes) === precommit.asset_manifest_hash, "asset-manifest hash mismatch");
assert(Array.isArray(manifest.symbols) && manifest.symbols.length === 6, "expected six symbols");
for (const symbol of manifest.symbols) {
  const bytes = await read(symbol.path);
  assert(sha256(bytes) === symbol.sha256, `symbol hash mismatch: ${symbol.id}`);
}

const rootPayload = precommit.deck_commitments
  .map(({ deck_no, commitment }) => `${deck_no}:${commitment}`)
  .join("\n");
assert(sha256(rootPayload) === precommit.bank_root, "bank root mismatch");
assert(precommit.deck_commitments.length === precommit.deck_count, "deck count mismatch");

console.log(`OK assets: ${manifest.symbols.length}`);
console.log(`OK decks: ${precommit.deck_count}`);
console.log(`OK bank root: ${precommit.bank_root}`);

if (process.argv[2]) {
  const session = JSON.parse(await readFile(resolve(process.argv[2]), "utf8"));
  const reveal = session.reveal;
  assert(reveal && Array.isArray(reveal.target_deck) && reveal.target_deck.length === 180, "completed session has no 180-symbol reveal");
  const entry = precommit.deck_commitments.find((item) => item.deck_no === session.deck_no);
  assert(entry && entry.commitment === session.deck_commitment, "session commitment is not in the public bank");
  assert(session.bank_id === precommit.bank_id, "session bank id mismatch");
  const payload = [
    "mind-jackpot-deck-2.0",
    session.bank_id,
    String(session.deck_no),
    reveal.deck_salt,
    reveal.target_deck.join(","),
    session.asset_manifest_hash,
  ].join("::");
  assert(sha256(payload) === session.deck_commitment, "completed deck commitment mismatch");
  for (const round of session.rounds) {
    const expected = reveal.target_deck.slice((round.round_index - 1) * 3, round.round_index * 3);
    assert(expected.join(",") === round.target.join(","), `round ${round.round_index} target mismatch`);
  }
  console.log(`OK completed session: ${session.public_id}`);
  console.log(`OK revealed rounds: ${session.rounds.length}`);
}

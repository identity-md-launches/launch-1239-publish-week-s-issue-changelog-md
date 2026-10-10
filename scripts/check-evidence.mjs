import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Issue 001's reporting trail. Later editions can add independent checks without changing old data.
const read = file => JSON.parse(readFileSync(file, 'utf8'));
const issue = read('issues/001.json');
const proof = read('artifacts/001-counts.json');
const stories = read('artifacts/001-story-evidence.json');
const { startInclusive: start, endExclusive: end, previousStartInclusive: previous } = proof.week;
const within = (time, a = start, b = end) => time && new Date(time) >= new Date(a) && new Date(time) < new Date(b);
const completed = (a, b) => proof.jobs.rows.filter(row => row.state === 'completed' && within(row.updatedAt, a, b)).length;
const current = completed(start, end);
const before = completed(previous, start);
assert.equal(current, issue.numbers.accepted);
assert.equal(before, 2861);
assert.equal(Math.min(100, Math.round(50 * current / before)), issue.meter.level);
assert.equal(Math.round(100 * (current / before - 1)), 58);
assert.equal(proof.oracle.rows.filter(row => row.status === 'attested' && within(row.attestedAt)).length, issue.numbers.answers);
const launches = proof.launches.rows.filter(row => row.status === 'live' && within(row.createdAt));
assert.equal(launches.length, issue.numbers.launches);
assert(launches.every(row => within(row.updatedAt)), 'A launch was updated after the covered week');
assert.equal(proof.health.connectedDaemons, issue.numbers.online);
const leaders = [...proof.seats.rows].sort((a, b) => b.accepted - a.accepted || Number(a.tokenId) - Number(b.tokenId)).slice(0, 3).map(row => ({ seat: Number(row.tokenId), jobs: row.accepted }));
assert.deepEqual(leaders, issue.leaders);
for (const collection of [proof.jobs, proof.oracle]) {
  assert.equal(new Set(collection.rows.map(row => row.id)).size, collection.rows.length, 'Duplicate records in count trail');
  assert(collection.pages.at(-1).count < 500, 'Pagination must end on a partial/empty page');
  assert.equal(collection.pages.reduce((total, page) => total + page.count, 0), collection.rows.length, 'Pagination count mismatch');
}
assert(stories.publications.every(record => within(record.publishedAt)), 'A story was published outside the week');
for (const answer of stories.answers) {
  assert.equal(answer.status, 'attested');
  assert(within(answer.attestedAt));
  assert(answer.agreed >= answer.quorum);
  assert.match(answer.answerEncoded, /^0x[0-9a-f]{64}$/i);
  const bytes = Buffer.from(answer.answerEncoded.slice(2), 'hex');
  const decoded = answer.answerType === 'bytes32' ? bytes.toString('utf8').replace(/\0+$/, '') : BigInt(answer.answerEncoded) !== 0n;
  assert.equal(decoded, answer.decodedAnswer);
  if (answer.answerType === 'bytes32') assert.equal(Buffer.from(decoded).toString('hex').padEnd(64, '0'), answer.answerEncoded.slice(2), 'Unexpected text padding');
  assert(issue.answers.some(item => item.source === answer.source));
}
assert.equal(new Date(start).getUTCDay(), 1);
assert.equal(new Date(end).getUTCDay(), 1);
assert.equal((new Date(end) - new Date(start)) / 86400000, 7);
assert.equal(issue.date, end.slice(0, 10));
console.log(`Evidence check passed: ${current} completed jobs, ${launches.length} launches, ${issue.numbers.answers} answers; complete paginated counts, top seats and dated story/answer evidence.`);

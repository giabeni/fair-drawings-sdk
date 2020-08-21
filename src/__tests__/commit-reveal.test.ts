import CommitRevealService from '../index';
import { RawCommit } from '../commit-reveal/interfaces/raw-commit.interface';
import { HashOptions } from '../commit-reveal/enums/hash-options.enum';

const rawCommit: RawCommit = {
  data: '7',
  nonce: '1234567890',
  userId: 'giovanni',
  metadata: {
    draw: 'D1',
  },
};

const commit = CommitRevealService.createCommit(rawCommit, HashOptions.SHA_256);

const correctReveal = CommitRevealService.createReveal(rawCommit);

const incorrectDataReveal = CommitRevealService.createReveal({
  data: '10',
  nonce: '1234567890',
  userId: 'giovanni',
  metadata: {
    draw: 'D1',
  },
});

const incorrectNonceReveal = CommitRevealService.createReveal({
  data: '7',
  nonce: '0987654321',
  userId: 'giovanni',
  metadata: {
    draw: 'D1',
  },
});

const incorrectTokenReveal = CommitRevealService.createReveal({
  data: '7',
  nonce: '1234567890',
  userId: 'joao',
  metadata: {
    draw: 'D1',
  },
});

const incorrectMetadataReveal = CommitRevealService.createReveal({
  data: '7',
  nonce: '1234567890',
  userId: 'giovanni',
  metadata: {
    draw: 'D2',
  },
});

function checkCommitFormat() {
  return CommitRevealService.checkCommitFormat(commit);
}

test('Create commit', () => {
  expect(
    JSON.stringify({
      digest: commit.digest,
      hashFunction: 256,
      userId: 'giovanni',
    }),
  ).toBe(
    JSON.stringify({
      digest: '6dedee6752ad46b9fe70fddb7bb8600578455d32febd81e3996780029aad7b33',
      hashFunction: 256,
      userId: 'giovanni',
    }),
  );
});

test('Checking commit format', () => {
  expect(checkCommitFormat()).toBe(true);
});

test('Validating correct reveal', () => {
  expect(CommitRevealService.validateReveal(correctReveal, commit)).toBe(true);
});

test('Validating incorrect data reveal', () => {
  expect(CommitRevealService.validateReveal(incorrectDataReveal, commit)).toBe(false);
});

test('Validating incorrect nonce reveal', () => {
  expect(CommitRevealService.validateReveal(incorrectNonceReveal, commit)).toBe(false);
});

test('Validating incorrect token reveal', () => {
  expect(CommitRevealService.validateReveal(incorrectTokenReveal, commit)).toBe(false);
});

test('Validating incorrect metadata reveal', () => {
  expect(CommitRevealService.validateReveal(incorrectMetadataReveal, commit)).toBe(false);
});

test('Getting different random nonces', () => {
  expect(CommitRevealService.getRandomNonce() !== CommitRevealService.getRandomNonce()).toBe(true);
});

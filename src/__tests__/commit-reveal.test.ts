import CommitRevealService from '../index';
import { RawCommit } from '../commit-reveal/interfaces/raw-commit.interface';
import { HashOptions } from '../commit-reveal/enums/hash-options.enum';

const rawCommit: RawCommit = {
  data: '7',
  nonce: '1234567890',
  userToken: 'giovanni',
};

const commit = CommitRevealService.createCommit(rawCommit, HashOptions.SHA_256);

const correctReveal = CommitRevealService.createReveal(rawCommit);

const incorrectDataReveal = CommitRevealService.createReveal({
  data: '10',
  nonce: '1234567890',
  userToken: 'giovanni',
});

const incorrectNonceReveal = CommitRevealService.createReveal({
  data: '7',
  nonce: '0987654321',
  userToken: 'giovanni',
});

const incorrectTokenReveal = CommitRevealService.createReveal({
  data: '7',
  nonce: '1234567890',
  userToken: 'joao',
});


function checkCommitFormat() {
  return CommitRevealService.checkCommitFormat(commit);
}

test('Create commit', () => {
  expect(JSON.stringify({
    digest: commit.digest,
    hashFunction: 256,
    userToken: 'giovanni',
  }))
  .toBe(JSON.stringify({
    digest: '25461cdcb296f0320f82a265d7b80d50142c492415d32ab70080c79a98cb628d',
    hashFunction: 256,
    userToken: 'giovanni',
  }));
});


test('Checking commit format', () => {
  expect(checkCommitFormat()).toBe(true);
});

test('Validating correct reveal', () => {
  expect(
    CommitRevealService.validateReveal(correctReveal, commit)
  ).toBe(true);
});

test('Validating incorrect data reveal', () => {
  expect(
    CommitRevealService.validateReveal(incorrectDataReveal, commit)
  ).toBe(false);
});

test('Validating incorrect nonce reveal', () => {
  expect(
    CommitRevealService.validateReveal(incorrectNonceReveal, commit)
  ).toBe(false);
});

test('Validating incorrect token reveal', () => {
  expect(
    CommitRevealService.validateReveal(incorrectTokenReveal, commit)
  ).toBe(false);
});

test('Getting different random nonces', () => {
  expect(
    CommitRevealService.getRandomNonce() !== CommitRevealService.getRandomNonce()
  ).toBe(true);
});
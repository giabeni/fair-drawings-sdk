import { RawCommit } from "./interfaces/raw-commit.interface";
import { HashOptions } from "./enums/hash-options.enum";
import * as Sha256 from "js-sha256";
import * as Sha512 from "js-sha512";
import { Commit } from './interfaces/commit.interface';
import { Reveal } from "./interfaces/reveal.interface";

/**
 * Static class to handle commits and reveals
 */
export class CommitRevealService {

  static createCommit(raw: RawCommit, hashFunction: HashOptions = HashOptions.SHA_256): Commit {
    return {
      digest: CommitRevealService.encrypt(raw.data, raw.nonce, hashFunction),
      timestamp: (new Date()).getTime(), 
      hashFunction,
      userToken: raw.userToken,
    };
  }

  static createReveal(reveal: RawCommit): Reveal {
    return {
      ...reveal,
      timestamp: (new Date()).getTime(), 
    }
  }

  static validateReveal(reveal: Reveal, commit: Commit) {
    return CommitRevealService.encrypt(reveal.data, reveal.nonce, commit.hashFunction) === commit.digest && reveal.userToken === commit.userToken;
  }

  static checkCommitFormat(commit: Commit) {
    return !!commit.digest && !!commit.hashFunction && commit.digest.length === CommitRevealService.getHashDigestLength(commit.hashFunction);
  }

  static getRandomNonce() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private static encrypt(data: string, nonce: string, hashFunction = HashOptions.SHA_256) {
    return CommitRevealService.hash(data + '_' + nonce, hashFunction);
  }

  private static hash(data: string, hashFunction = HashOptions.SHA_256) {
    switch (hashFunction) {
      case HashOptions.SHA_256:
        return Sha256.sha256(data);

      case HashOptions.SHA_224:
        return Sha256.sha224(data);

      case HashOptions.SHA_384:
        return Sha512.sha384(data);
      
      case HashOptions.SHA_512:
        return Sha512.sha512(data);
    
      default:
        throw new Error('Hash function not supported.');
    }
  }

  private static getHashDigestLength(hashFunction = HashOptions.SHA_256) {
    switch (hashFunction) {
      case HashOptions.SHA_256:
        return 256/4;

      case HashOptions.SHA_224:
        return 224/4;

      case HashOptions.SHA_384:
        return 384/4;
      
      case HashOptions.SHA_512:
        return 512/4;
    
      default:
        throw new Error('Hash function not supported.');
    }
  }
}
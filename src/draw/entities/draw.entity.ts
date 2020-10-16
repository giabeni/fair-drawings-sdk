import { Stakeholder } from './stakeholder.entity';
import { DrawStatus } from '../enums/draw-status.enum';
import { DrawData } from '../interfaces/draw-data.interface';
import { SecurityService } from '../../security/security.service';
import { Commit } from '../../commit-reveal/interfaces/commit.interface';
import { Reveal } from '../../commit-reveal/interfaces/reveal.interface';
import { Candidate } from './candidate.entity';
import { SignedCommit } from '../../commit-reveal/interfaces/signed-commit.interface';
import { CommitRevealService } from '../../commit-reveal/commit-reveal.service';
import { v4 as uuidv4 } from 'uuid';
import { DrawEventType } from '../enums/draw-event-type.enum';
import { SignedReveal } from '../../commit-reveal/interfaces/signed-reveal.interface';

export class Draw<D = DrawData> {
  /**
   * Unique identifier of a draw
   */
  public readonly uuid?: string;

  /**
   * Additional information related to the draw.
   * Using the D generic type (default is any);
   */
  public readonly data?: D;

  /**
   * The number of candidates required to automatically start the draw.
   */
  private _spots: number = 4;

  /**
   * Current phase of draw.
   */
  private _status?: DrawStatus;

  /**
   * The candidate that was drawn
   */
  private _winner?: Candidate;

  /**
   * List of participants that can contribute to the draw.
   * Not all of them must be elegible to be drawn.
   */
  public readonly stakeholders: Stakeholder[] = [];

  /**
   * List of all commits registered in the draw
   */
  public readonly commits: Commit[] = [];

  /**
   * List of all reveals registered in the draw
   */
  public readonly reveals: (Reveal & { valid?: boolean })[] = [];

  /**
   * Get only the elegible stakeholders.
   */
  public get candidates() {
    return this.stakeholders
      ?.filter((stakeholder) => stakeholder.eligible)
      .map((stakeholder) => new Candidate(stakeholder));
  }

  /**
   * Returns the current status of the draw
   */
  public get status() {
    return this._status;
  }

  /**
   * Returns the number of spots in the draw
   */
  public get spots() {
    return this._spots;
  }

  /**
   * @returns the winner of the Draw or undefined in case it is not finished yet
   */
  public get winner() {
    return this._winner;
  }

  constructor(spotCount: number = 4, stakeholders: Stakeholder[] = [], data?: D) {
    this._spots = spotCount;
    this._status = DrawStatus.PENDING;
    this.stakeholders = stakeholders.map((s) => new Stakeholder(s)); // asures all stakeholders are initiated
    this.data = data;
    this.uuid = uuidv4();
  }

  /**
   * Fires auto update of the draw status.
   * @returns true if status has changed and false if not.
   */
  public updateStatus() {
    const previousStatus = this._status;
    if (this.spots > 0 && this.candidates.length < this.spots) {
      this._status = DrawStatus.PENDING;
    } else if (this.spots === this.candidates.length) {
      this._status = DrawStatus.COMMIT;
    } else if (this.commits.length === this.candidates.length) {
      this._status = DrawStatus.REVEAL;
    } else if (this.reveals.length === this.candidates.length) {
      this.computeWinner();
    }

    return previousStatus !== this._status;
  }

  /**
   * Register a new stakeholder in the Draw.
   * If stakeholder is already added, then, updates its information.
   * @param stakeholder the Stakeholder instance.
   * @param elegible wether force stakeholder's elegibility in the draw
   */
  public addStakeholder(stakeholder: Stakeholder, eligible?: boolean) {
    if (this.status !== DrawStatus.PENDING) {
      throw new Error('FORBIDDEN_DRAW_STATUS');
    }

    const existentStakeholder = this.stakeholders.find((stkholder) => stkholder.id === stakeholder.id);

    stakeholder.eligible = !!eligible;

    if (existentStakeholder) {
      Object.assign(existentStakeholder, stakeholder);
    } else {
      this.stakeholders.push(stakeholder);
    }
  }

  /**
   * Register new stakeholders in the Draw.
   * @param stakeholders the Stakeholder array instance.
   * @param elegible wether force stakeholder's elegibility in the draw
   */
  public addStakeholders(stakeholders: Stakeholder[], eligible?: boolean) {
    if (this.status !== DrawStatus.PENDING) {
      throw new Error('FORBIDDEN_DRAW_STATUS');
    }

    for (const stakeholder of stakeholders) {
      this.addStakeholder(stakeholder, eligible);
    }
  }

  /**
   * Removes a stakeholder from the Draw.
   * @param stakeholder the Stakeholder instance.
   */
  public removeStakeholder(stakeholder: Stakeholder | string) {
    let foundIndex: number;

    if (typeof stakeholder === 'string') {
      foundIndex = this.stakeholders.findIndex((stkholder) => stkholder.id === stakeholder);
    } else {
      foundIndex = this.stakeholders.findIndex((stkholder) => stkholder.id === stakeholder.id);
    }

    if (foundIndex === -1) {
      throw new Error('ERR_REMOVE_STKHOLDER: Id not found at stakeholders list');
    }

    return this.stakeholders.splice(foundIndex, 1);
  }

  /**
   * Checks if user is a eligible candidate of the draw
   * @param userId the id of the candidate
   */
  public isCandidate(userId: string) {
    return !!this.candidates.find((drawCandidate) => drawCandidate.id === userId);
  }

  /**
   * Gets the eligible candidate with de userId or undefined
   * @param userId the id of the candidate
   */
  public getCandidateByUserId(userId: string) {
    return this.candidates.find((drawCandidate) => drawCandidate.id === userId);
  }

  /**
   * Gets the commit sent previously with the same userId of candidate.id
   * @param candidate the instance of the candidate
   */
  public getCommitByCandidate(candidate: Candidate) {
    return this.commits.find((commit) => commit.userId === candidate.id);
  }

  /**
   * Gets the reveal sent previously with the same userId of candidate.id
   * @param candidate the instance of the candidate
   */
  public getRevealByCandidate(candidate: Candidate) {
    return this.reveals.find((reveal) => reveal.userId === candidate.id);
  }

  /**
   * Checks the format, the sender and the signature of a commit
   * @param signedCommit the commit with the sender signature
   */
  public checkCommit(signedCommit: SignedCommit) {
    // check commit format
    if (!CommitRevealService.checkCommitFormat(signedCommit.commit)) {
      /** @TODO post WRONG_COMMIT_FORMAT */
      return DrawEventType.WRONG_COMMIT_FORMAT;
    }

    // check if candidate is subscribed to the draw
    const candidate = this.getCandidateByUserId(signedCommit.commit.userId);
    if (!candidate) {
      /** @TODO post FORBIDDEN_COMMIT_USER_ID */
      return DrawEventType.FORBIDDEN_COMMIT_USER_ID;
    }

    // checks signature of commit
    if (!candidate.publicKey) {
      /** @TODO post UNAUTHORIZED_COMMIT_SIGNATURE */
      return DrawEventType.UNAUTHORIZED_COMMIT_SIGNATURE;
    }

    const isSignatureValid = SecurityService.verifySignature(
      Buffer.from(signedCommit.commit),
      candidate.publicKey,
      signedCommit.signature,
    );

    if (!isSignatureValid) {
      /** @TODO post UNAUTHORIZED_COMMIT_SIGNATURE */
      return DrawEventType.UNAUTHORIZED_COMMIT_SIGNATURE;
    }

    return true;
  }

  /**
   * Checks the sender and the signature of a reveal
   * @param signedReveal the reveal with the sender signature
   */
  public checkReveal(signedReveal: SignedReveal) {
    // check if candidate is subscribed to the draw
    const candidate = this.getCandidateByUserId(signedReveal.reveal.userId);
    if (!candidate || !candidate.eligible) {
      /** @TODO post FORBIDDEN_REVEAL_USER_ID */
      return DrawEventType.FORBIDDEN_REVEAL_USER_ID;
    }

    // checks signature of reveal
    if (!candidate.publicKey) {
      /** @TODO post UNAUTHORIZED_REVEAL_SIGNATURE */
      return DrawEventType.UNAUTHORIZED_REVEAL_SIGNATURE;
    }

    const isSignatureValid = SecurityService.verifySignature(
      Buffer.from(signedReveal.reveal),
      candidate.publicKey,
      signedReveal.signature,
    );

    if (!isSignatureValid) {
      /** @TODO post UNAUTHORIZED_REVEAL_SIGNATURE */
      return DrawEventType.UNAUTHORIZED_REVEAL_SIGNATURE;
    }

    // Gets commit sent by candidate
    const commit = this.getCommitByCandidate(candidate);
    if (!commit) {
      /** @TODO handle unpredicted errors */
      return DrawEventType.FORBIDDEN_REVEAL_USER_ID;
    }

    const isRevealMatchingCommit = CommitRevealService.validateReveal(signedReveal.reveal, commit);
    if (!isRevealMatchingCommit) {
      /** @TODO post INVALID_REVEAL_MASK */
      /** @TODO set status to INVALIDATED */
      return DrawEventType.INVALID_REVEAL_MASK;
    }

    return true;
  }

  /**
   * Saves a new commit to the draw proccess
   * @param signedCommit the encrypted commit object
   */
  public registerCommit(signedCommit: SignedCommit) {
    if (this.status !== DrawStatus.COMMIT) {
      throw new Error('FORBIDDEN_DRAW_STATUS');
    }

    const commitIsValid = this.checkCommit(signedCommit);

    if (commitIsValid !== true) {
      throw new Error(commitIsValid);
    }

    this.commits.push(signedCommit.commit);
  }

  /**
   * Saves a new reveal to the draw proccess
   * @param signedReveal the encrypted reveal object
   */
  public registerReveal(signedReveal: SignedReveal) {
    if (this.status !== DrawStatus.REVEAL) {
      throw new Error('FORBIDDEN_DRAW_STATUS');
    }

    const revealCheck = this.checkReveal(signedReveal);

    if (revealCheck !== true && revealCheck !== DrawEventType.INVALID_REVEAL_MASK) {
      throw new Error(revealCheck);
    }

    this.reveals.push({ ...signedReveal.reveal, valid: revealCheck === true });
  }

  private computeWinner() {
    if (this.status !== DrawStatus.REVEAL || this.candidates.length <= 0) {
      throw new Error('FORBIDDEN_DRAW_STATUS');
    }

    // checks if all reveals are valid
    const areAllRevealsValid = !this.reveals.find((reveal) => !reveal.valid);
    if (!areAllRevealsValid) {
      /** @TODO post INVALID_REVEAL_MASK */
      /** @TODO set status to INVALIDATED */
      return DrawEventType.INVALID_REVEAL_MASK;
    }

    // share values vector
    const values = this.reveals.map((reveal) => {
      const share = Number(reveal.data);
      if (isNaN(share)) {
        throw new Error('INVALID_REVEAL_DATA');
      } else {
        return share;
      }
    });

    // summatory of all values
    const sum = values.reduce((acc, value) => acc + value, 0);

    // winner index being the rest of the division betwwen sum and number of candidates
    const winnerIndex = sum % this.candidates.length;

    // avoiding out of range index
    if (this.candidates[winnerIndex]) {
      this._winner = this.candidates[winnerIndex];
      this._status = DrawStatus.FINISHED;
      return this._winner;
    } else {
      throw new Error('WINNER_INDEX_OUT_OF_RANGE');
    }
  }
}

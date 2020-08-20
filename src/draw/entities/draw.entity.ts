import { Stakeholder } from './stakeholder.entity';
import { DrawStatus } from '../enums/draw-status.enum';
import { DrawData } from '../interfaces/draw-data.interface';
import { SecurityService } from '../../security/security.service';
import { Commit } from '../../commit-reveal/interfaces/commit.interface';

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
  public candidatesCount = 4;

  /**
   * List of participants that can contribute to the draw.
   * Not all of them must be elegible to be drawn.
   */
  public readonly stakeholders: Stakeholder[];

  /**
   * List of all commits registered in the draw
   */
  public readonly commits: Commit[] = [];

  /**
   * Current phase of draw.
   */
  public readonly status?: DrawStatus;

  /**
   * Get only the elegible stakeholders.
   */
  public get candidates() {
    return this.stakeholders?.filter((stakeholder) => stakeholder.eligible);
  }

  constructor(stakeholders: Stakeholder[] = [], data?: D) {
    this.stakeholders = stakeholders.map((s) => new Stakeholder(s)); // asures all stakeholders are initiated
    this.data = data;
    this.uuid = SecurityService.getRandomString();
    this.status = DrawStatus.PENDING;
  }

  /**
   * Register a new stakeholder in the Draw.
   * If stakeholder is already added, then, updates its information.
   * @param stakeholder the Stakeholder instance.
   * @param elegible wether force stakeholder's elegibility in the draw
   */
  public addStakeholder(stakeholder: Stakeholder, eligible?: boolean) {
    const existentStakeholder = this.stakeholders.find((stkholder) => stkholder.id === stakeholder.id);
    if (eligible !== undefined && eligible !== null) {
      stakeholder.eligible = eligible;
    }
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
   * Saves a new commit to the draw proccess
   * @param commit the encrypted commit object
   */
  public registerCommit(commit: Commit) {
    this.registerCommit(commit);
  }
}

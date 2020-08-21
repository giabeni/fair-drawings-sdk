import { DrawEventType } from '../enums/draw-event-type.enum';
import { Draw } from '../entities/draw.entity';
import { Stakeholder } from '../entities/stakeholder.entity';
import { Commit } from '../../commit-reveal/interfaces/commit.interface';
import { Reveal } from '../../../lib/commit-reveal/interfaces/reveal.interface';
import { DrawStatus } from '../enums/draw-status.enum';
import { Candidate } from '../entities/candidate.entity';
import { SignedCommit } from '../../commit-reveal/interfaces/signed-commit.interface';
import { SignedReveal } from '../../commit-reveal/interfaces/signed-reveal.interface';

export type DrawEvent =
  | {
      timestamp: number;
      type: DrawEventType.DRAW_CREATED;
      data: Draw;
    }
  | {
      timestamp: number;
      type: DrawEventType.DRAW_DELETED;
      data: Draw;
    }
  | {
      timestamp: number;
      type: DrawEventType.STAKEHOLDER_SUBSCRIBED;
      data: Stakeholder;
    }
  | {
      timestamp: number;
      type: DrawEventType.STAKEHOLDER_UNSUBSCRIBED;
      data: Stakeholder;
    }
  | {
      timestamp: number;
      type: DrawEventType.CANDIDATE_SUBSCRIBED;
      data: Candidate;
    }
  | {
      timestamp: number;
      type: DrawEventType.CANDIDATE_UNSUBSCRIBED;
      data: Candidate;
    }
  | {
      timestamp: number;
      type: DrawEventType.COMMIT_RECEIVED;
      data: SignedCommit;
    }
  | {
      timestamp: number;
      type: DrawEventType.REVEAL_RECEIVED;
      data: SignedReveal;
    }
  | {
      timestamp: number;
      type: DrawEventType.ALL_COMMITS_RECEIVED;
      data: Commit[];
    }
  | {
      timestamp: number;
      type: DrawEventType.ALL_REVEALS_RECEIVED;
      data: Reveal[];
    }
  | {
      timestamp: number;
      type: DrawEventType.STATUS_CHANGED;
      data: DrawStatus;
    }
  | {
      timestamp: number;
      type: DrawEventType.WRONG_COMMIT_FORMAT;
      data: Commit;
    }
  | {
      timestamp: number;
      type: DrawEventType.WRONG_REVEAL_FORMAT;
      data: Reveal;
    }
  | {
      timestamp: number;
      type: DrawEventType.INVALID_REVEAL_MASK;
      data: Reveal;
    }
  | {
      timestamp: number;
      type: DrawEventType.FORBIDDEN_COMMIT_USER_ID;
      data: Commit;
    }
  | {
      timestamp: number;
      type: DrawEventType.FORBIDDEN_REVEAL_USER_ID;
      data: Reveal;
    }
  | {
      timestamp: number;
      type: DrawEventType.UNAUTHORIZED_COMMIT_SIGNATURE;
      data: SignedCommit;
    }
  | {
      timestamp: number;
      type: DrawEventType.UNAUTHORIZED_REVEAL_SIGNATURE;
      data: SignedReveal;
    };

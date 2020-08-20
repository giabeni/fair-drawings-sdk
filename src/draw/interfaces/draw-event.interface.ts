import { DrawEventType } from '../enums/draw-event-type.enum';
import { Draw } from '../entities/draw.entity';
import { Stakeholder } from '../entities/stakeholder.entity';
import { Commit } from '../../commit-reveal/interfaces/commit.interface';
import { Reveal } from '../../../lib/commit-reveal/interfaces/reveal.interface';
import { DrawStatus } from '../enums/draw-status.enum';

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
      type: DrawEventType.COMMIT_SENT;
      data: Commit;
    }
  | {
      timestamp: number;
      type: DrawEventType.REVEAL_SENT;
      data: Reveal;
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
      type: DrawEventType.UNAUTHORIZED_COMMIT_SIGNATURE;
      data: Commit;
    }
  | {
      timestamp: number;
      type: DrawEventType.UNAUTHORIZED_REVEAL_SIGNATURE;
      data: Reveal;
    };

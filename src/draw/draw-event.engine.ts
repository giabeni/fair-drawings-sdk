import { DrawEvent } from './interfaces/draw-event.interface';
import { Draw } from './entities/draw.entity';
import { DrawEventType } from './enums/draw-event-type.enum';
import { Stakeholder } from './entities/stakeholder.entity';
import { Candidate } from './entities/candidate.entity';
import { SignedCommit } from '../commit-reveal/interfaces/signed-commit.interface';
import { CommitRevealService } from '../commit-reveal/commit-reveal.service';
import { SecurityService } from '../security/security.service';

/**
 * Class to handle events in a draw.
 * @param event the draw event to handle
 * @param draw the draw instance to update
 */
export class DrawEventEngine {
  public static handleEvent(event: DrawEvent, draw: Draw) {
    switch (event.type) {
      // new candidate subscribed to the draw
      case DrawEventType.CANDIDATE_SUBSCRIBED:
        this.onCandidateSubscribed(event.data, draw);
        break;

      // candidate unsubscribed of the draw
      case DrawEventType.CANDIDATE_UNSUBSCRIBED:
        this.onCandidateUnsubscribed(event.data, draw);
        break;

      // candidate send a commit
      case DrawEventType.COMMIT_RECEIVED:
        this.onCommitReceived(event.data, draw);
        break;

      default:
        break;
    }

    // updates the status in the instace of the draw 
    draw.updateStatus();
  }

  private static onCandidateSubscribed(candidate: Candidate, draw: Draw) {
    draw.addStakeholder(new Candidate(candidate), true);
  }

  private static onCandidateUnsubscribed(candidate: Candidate, draw: Draw) {
    draw.removeStakeholder(new Candidate(candidate));
  }

  private static onCommitReceived(signedCommit: SignedCommit, draw: Draw) {
    try {
      draw.registerCommit(signedCommit);
    } catch (commitError) {
      /** @TODO post error to stream */
    }
  }
}

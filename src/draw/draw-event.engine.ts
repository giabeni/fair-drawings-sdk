import { DrawEvent } from './interfaces/draw-event.interface';
import { Draw } from './entities/draw.entity';
import { DrawEventType } from './enums/draw-event-type.enum';
import { Stakeholder } from './entities/stakeholder.entity';

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
        draw.addStakeholder(new Stakeholder(event.data), true)
        break;
      
      // candidate unsubscribed of the draw
      case DrawEventType.CANDIDATE_UNSUBSCRIBED:
        draw.removeStakeholder(new Stakeholder(event.data))
        break;
  
      // candidate send a commit
      case DrawEventType.COMMIT_SENT:
        break;
    
      default:
        break;
    }
  }
  
}

import { DrawData } from './interfaces/draw-data.interface';
import { Stakeholder } from './entities/stakeholder.entity';
import { Draw } from './entities/draw.entity';
import { DrawEvent } from './interfaces/draw-event.interface';
import { Observable } from 'rxjs';
import { Commit } from '../commit-reveal/interfaces/commit.interface';
import * as crypto from 'crypto';
import { Reveal } from '../commit-reveal/interfaces/reveal.interface';
import { RawCommit } from '../../lib/commit-reveal/interfaces/raw-commit.interface';
/**
 * Static class to handle actions for Draws
 */
export class DrawService<D = DrawData> {

  public static createDraw(drawData: DrawData, stakeholders?: Stakeholder[]): Draw {
    /** @TODO send creation message */
    return new Draw(stakeholders, drawData);
  }

  public static getDraws(page = 1, perPage = 25): Draw[] {
    /** @TODO retrieve all draws */

    return [new Draw()];  
  }

  public static getDraw(uuid: string): Draw {
    /** @TODO retrieve specific draw */

    return new Draw();  
  }

  public static watchDraw(draw: Draw): Observable<DrawEvent> {
    /** @TODO watch draw */
    return Observable.create((subject: any) => {
      subject.next({} as DrawEvent);
    })
  }

  public static subscribeToDraw(draw: Draw, stakeholder: Stakeholder): Observable<DrawEvent> {
    /** @TODO subscribe to draw */
    draw.addStakeholder(stakeholder, true);
    return Observable.create((subject: any) => {
      subject.next({} as DrawEvent);
    })
  }

  public static sendSignedCommit(commit: RawCommit, privateKey: crypto.KeyObject) {
    /** @TODO sign and send commit */
  }

  public static sendSignedReveal(reveal: Reveal, privateKey: crypto.KeyObject) {
    /** @TODO sign and send commit */
  }
}
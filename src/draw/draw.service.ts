import { DrawData } from './interfaces/draw-data.interface';
import { Stakeholder } from './entities/stakeholder.entity';
import { Draw } from './entities/draw.entity';
import { DrawEvent } from './interfaces/draw-event.interface';
import { Observable } from 'rxjs';
import { Commit } from '../commit-reveal/interfaces/commit.interface';
import * as crypto from 'crypto';
import { Reveal } from '../commit-reveal/interfaces/reveal.interface';
import { RawCommit } from '../commit-reveal/interfaces/raw-commit.interface';
import { Communicator } from './communicators/communicator.service';
import { PaginationResponse } from './interfaces/pagination-response.inteface';
import { DrawEventType } from './enums/draw-event-type.enum';
import { DrawEventEngine } from './draw-event.engine';
/**
 * Static class to handle actions for Draws
 */
export class DrawService<D = DrawData> {
  private static _communicator: Communicator;

  public static setCommunicator(communicator: Communicator) {
    this._communicator = communicator;
  }

  public static async createDraw(params: {
    drawData: any;
    spotCount: number;
    stakeholders: Stakeholder[];
  }): Promise<Draw> {
    return await this._communicator.createDraw(params.spotCount, params.stakeholders, params.drawData);
  }

  public static async getDraws(page = 1, perPage = 25): Promise<PaginationResponse<Draw>> {
    const list = await DrawService._communicator.getDrawsList(page, perPage).catch((error) => {
      throw new Error(error);
    });

    return list;
  }

  public static async getDraw(uuid: string): Promise<Draw> {
    /** @TODO retrieve specific draw */

    return new Draw();
  }

  public static async watchDraw(uuid: string, drawInstance: Draw): Promise<Observable<Draw>> {
    try {
      // gets the initial static state of the draw
      drawInstance = await this.getDraw(uuid);

      // start listening to the draw
      const drawStream = await DrawService._communicator.listen(uuid);

      return new Observable((subject: any) => {
        // event engine to handle updates in the draw
        drawStream.subscribe((event) => {
          if (event) {
            DrawEventEngine.handleEvent(event, drawInstance);

            // sends the updated draw to the client
            subject.next(drawInstance);
          }
        });
      });
    } catch (error) {
      throw error;
    }
  }

  public static subscribeToDraw(draw: Draw, stakeholder: Stakeholder): Observable<DrawEvent> {
    /** @TODO subscribe to draw */
    draw.addStakeholder(stakeholder, true);
    return new Observable((subject: any) => {
      subject.next({} as DrawEvent);
    });
  }

  public static sendSignedCommit(commit: RawCommit, privateKey: crypto.KeyObject) {
    /** @TODO sign and send commit */
  }

  public static sendSignedReveal(reveal: Reveal, privateKey: crypto.KeyObject) {
    /** @TODO sign and send commit */
  }
}

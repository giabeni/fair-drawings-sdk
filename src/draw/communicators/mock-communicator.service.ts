import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Draw } from '../entities/draw.entity';
import { Stakeholder } from '../entities/stakeholder.entity';
import { DrawEventType } from '../enums/draw-event-type.enum';
import { DrawData } from '../interfaces/draw-data.interface';
import { DrawEvent } from '../interfaces/draw-event.interface';
import { Communicator } from './communicator.service';

export type DrawRecord = Draw & { channel: BehaviorSubject<DrawEvent | undefined> };

export class MockCommunicator extends Communicator<undefined, BehaviorSubject<DrawEvent[]>> {
  private drawsList$: BehaviorSubject<DrawRecord[]>;
  private eventStream$: BehaviorSubject<DrawEvent[]>;

  constructor() {
    super();
    this.drawsList$ = new BehaviorSubject<DrawRecord[]>([]);
    this.eventStream$ = new BehaviorSubject<DrawEvent[]>([]);
  }

  async openConnection() {
    return this.eventStream$;
  }

  async closeConnection(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async getDrawsList(page: number, perPage: number) {
    return {
      items: this.drawsList$.getValue(),
      page: 1,
      pageCount: 1,
      totalCount: this.drawsList$.getValue().length,
    };
  }

  async createDraw(spotCount: number, stakeholders: Stakeholder[], drawData: DrawData | any) {
    const draw = new Draw(spotCount, stakeholders, drawData);

    const drawRecord = {
      ...draw,
      channel: new BehaviorSubject<DrawEvent | undefined>(undefined),
    } as DrawRecord;

    this.drawsList$.next([...this.drawsList, drawRecord]);

    await this.broadcast({
      timestamp: new Date().getTime(),
      type: DrawEventType.DRAW_CREATED,
      data: draw,
    });

    return draw;
  }

  async broadcast(event: DrawEvent) {
    this.eventStream$.next([...this.eventsHistory, event]);
    return true;
  }

  async listen(uuid: string) {
    const drawRecord = this.drawsList.find((draw) => draw.uuid === uuid);

    if (!drawRecord) {
      throw new Error('Draw uuid not found');
    }

    return drawRecord.channel;
  }

  async post(event: DrawEvent, uuid: string) {
    const drawRecord = this.drawsList.find((draw) => draw.uuid === uuid);

    if (!drawRecord) {
      throw new Error('Draw uuid not found');
    }

    drawRecord.channel.next(event);

    return true;
  }

  private get drawsList() {
    return this.drawsList$.getValue();
  }

  private get eventsHistory() {
    return this.eventStream$.getValue();
  }
}

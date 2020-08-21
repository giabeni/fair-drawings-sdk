import { DrawService } from '../draw/draw.service';
import { Communicator } from '../draw/communicators/communicator.service';
import { Draw } from '../draw/entities/draw.entity';
import { Observable } from 'rxjs';
import { Stakeholder } from '../draw/entities/stakeholder.entity';

export class MockClient {
  public me = new Stakeholder<object>({
    id: 'test',
    profile: { name: 'Alice' },
  });

  constructor(private drawSrvc: DrawService, private draw: Draw, private currentDrawStream: Observable<Draw>) {
    const communicator = undefined;
    this.drawSrvc = new DrawService(communicator as any);
  }

  async enterDrawPage() {
    this.currentDrawStream = await this.drawSrvc.watchDraw('UUID', this.draw);
  }

  async subscribeToDraw() {}
}

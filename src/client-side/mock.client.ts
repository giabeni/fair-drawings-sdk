import { DrawService } from '../draw/draw.service';
import { Communicator } from '../draw/communicators/communicator.service';
import { Draw } from '../draw/entities/draw.entity';
import { Observable } from 'rxjs';
import { Stakeholder } from '../draw/entities/stakeholder.entity';
import { MockCommunicator } from '../draw/communicators/mock-communicator.service';
import { SecurityService } from '../security/security.service';
import * as crypto from 'crypto';

export class MockClient {
  public profile: { name: string; document?: string };

  private _keys: crypto.KeyPairKeyObjectResult;

  constructor(name: string, document: string) {
    this.profile = { name, document };
    this._keys = SecurityService.generateKeyPair();
    this.initConnection();
  }

  async initConnection() {
    DrawService.setCommunicator(new MockCommunicator());
  }

  async getDrawsList() {
    return DrawService.getDraws();
  }

  async createDrawA() {
    return DrawService.createDraw({
      drawData: { name: 'Draw Test A', description: 'Draw to test creation of draws.' },
      spotCount: 4,
      stakeholders: [this.stakeholder],
    });
  }

  async subscribeToDraw() {}

  public get stakeholder() {
    return new Stakeholder({
      profile: this.profile,
      id: this.profile.document,
      publicKey: this._keys.publicKey,
    });
  }
}

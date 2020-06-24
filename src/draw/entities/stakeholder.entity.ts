import * as crypto from 'crypto';

export class Stakeholder<P = object> {
  /**
   * Identifier of the party in the draw.
   */
  id?: string;

  /**
   * Stakeholder profile data.
   */
  profile?: P;

  /**
   * Wether the stakeholder is a eligible candidate.
   */
  eligible?: boolean;

  /**
   * Public key for assimetric encryption 
   */
  publicKey?: crypto.KeyObject;

  constructor(stakeholder?: Stakeholder) {
    if (stakeholder) {
      Object.assign(this, stakeholder);
    }
  }
}
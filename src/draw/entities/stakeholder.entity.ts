
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
}
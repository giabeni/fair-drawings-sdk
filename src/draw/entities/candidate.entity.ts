import { Stakeholder } from "./stakeholder.entity";

export class Candidate<P = object> extends Stakeholder<P> {

  /**
   * List of all positions of the candidates set that are ocuppied by the candidate.
   * Examples:
   * Uniform distribuition - in a draw with candidates [c0, c1], c0.indexes = [0] and c1.indexes = [1]
   * Not-uniform distribuition - in a draw with candidates [c0, c0, c1], c0.indexes = [0, 1] and c1.indexes = [2]
   */
  public readonly indexes?: number[];

}
import { Stakeholder } from '../entities/stakeholder.entity';
import { Commit } from '../../commit-reveal/interfaces/commit.interface';
import { Reveal } from '../../../lib/commit-reveal/interfaces/reveal.interface';
import { SignedCommit } from '../../commit-reveal/interfaces/signed-commit.interface';
import { SignedReveal } from '../../commit-reveal/interfaces/signed-reveal.interface';

/**
 * A structured tree of all important information of a draw
 */
export interface DrawCandidateSummary {
  stakeholder?: Stakeholder;
  signedCommit?: SignedCommit;
  signedReveal?: SignedReveal;
  status: 'ABSENT' | 'PENDING_COMMIT' | 'PENDING_REVEAL' | 'REVEAL_SENT';
  winner?: boolean;
}


/**
 * Object that represents a commit BEFORE it is encrypted
 */
export interface RawCommit {
  /**
   * The raw data that will be encripted before the commit
   */
  data: string;

  /**
   * The nonce value to salt the hash function
   */
  nonce: string;

  /**
   * User authentication token
   */
  userToken?: string;
}

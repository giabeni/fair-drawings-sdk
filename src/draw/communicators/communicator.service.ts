
/**
 * Abstract class to handle sending and recieving of DrawEvents through all stakeholders.
 * Its children can implement the messages exchange using different technologies, provided that the methods are correclty strucutred.
 */
export abstract class Communicator {

  /**
   * Starts the communications: handshakes, connectivity tests, peer recogintion...
   * @param params any settings used to start de communication
   * @returns C as connection object, containing any relevant information about the communication
   */
  abstract openConnection<P = any, C = any>(params?: P): C;

}
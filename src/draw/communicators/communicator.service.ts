import { PaginationResponse } from '../interfaces/pagination-response.inteface';
import { Draw } from '../entities/draw.entity';
import { DrawEvent } from '../interfaces/draw-event.interface';
import { Observable } from 'rxjs';

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
  abstract async openConnection<P = any, C = any>(params?: P): Promise<C>;

  /**
   * Retrieves a subset of all available draws in the current communication.
   * @param page the subset index of the total draws
   * @param perPage the maximum length of the subset
   */
  abstract async getDrawsList(page: number, perPage: number): Promise<PaginationResponse<Draw>>;

  /**
   * Alerts all active users in the connection.
   * @param event the event to alert all users present in the connection
   */
  abstract async broadcast(event: DrawEvent): Promise<boolean>;

  /**
   * Sends a update for a specific draw.
   * @param event the event to inform the users listening to a specif draw
   * @param uuid the unique identifier of the draw
   */
  abstract async post(event: DrawEvent, uuid: string): Promise<boolean>;

  /**
   * Receives the updates that happens in a specific draw.
   * @param uuid the unique identifier of the draw
   */
  abstract async listen(uuid: string): Promise<Observable<DrawEvent>>;
}

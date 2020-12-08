export interface DrawAcksSummary {
  ALL_JOINED: { [userId: string]: boolean };
  ALL_COMMITED: { [userId: string]: boolean };
  ALL_REVEALED: { [userId: string]: boolean };
  FINISHED: { [userId: string]: boolean };
}

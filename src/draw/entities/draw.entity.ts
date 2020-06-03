import { Stakeholder } from "./stakeholder.entity";
import { DrawStatus } from "../enums/draw-status.enum";

export class Draw<D = any> {

    /**
     * Unique identifier of a draw
     */
    uuid?: string;

    /**
     * Additional information related to the draw.
     * Using the D generic type (default is any);
     */
    data?: D;

    /**
     * List of participants that can contribute to the draw.
     * Not all of them must be elegible to be drawn.
     */
    stakeholders?: Stakeholder[];

    /**
     * Current phase of draw.
     */
    status?: DrawStatus;
}
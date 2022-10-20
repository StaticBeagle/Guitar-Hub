import { GuitarStyle } from "./guitar-style";

export class GuitarStyleDeleted {
    public static Type = 'Domain.GuitarStyleDeleted.Deleted' as const;
    type = GuitarStyleDeleted.Type;
    style: GuitarStyle;
    deleted: Date | string;

    constructor(style: GuitarStyle, deleted: Date | string) { 
        this.style = style;
        this.deleted = deleted;
    }
}
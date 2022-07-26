import {Fret} from './fret';

export class FretDeleted {
    public static Type = 'Domain.Fret.Deleted' as const;
    type = FretDeleted.Type;
    fret: Fret;
    deleted: Date | string;

    constructor(fret: Fret, deleted: Date | string) { 
        this.fret = fret;
        this.deleted = deleted;
    }
}
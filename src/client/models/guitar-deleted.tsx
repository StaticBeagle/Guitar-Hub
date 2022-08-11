import {Guitar} from './guitar';

export class GuitarDeleted {
    public static Type = 'Domain.Guitar.Deleted' as const;
    type = GuitarDeleted.Type;
    guitar: Guitar;
    deleted: Date | string;

    constructor(guitar: Guitar, deleted: Date | string) { 
        this.guitar = guitar;
        this.deleted = deleted;
    }
}
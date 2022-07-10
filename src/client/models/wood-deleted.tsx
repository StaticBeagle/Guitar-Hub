import {Wood} from './wood';

export class WoodDeleted {
    public static Type = 'Domain.Wood.Deleted' as const;
    type = WoodDeleted.Type;
    wood: Wood;
    deleted: Date | string;

    constructor(wood: Wood, deleted: Date | string) { 
        this.wood = wood;
        this.deleted = deleted;
    }
}
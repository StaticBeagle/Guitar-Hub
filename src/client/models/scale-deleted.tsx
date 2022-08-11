import {Scale} from './scale';

export class ScaleDeleted {
    public static Type = 'Domain.Scale.Deleted' as const;
    type = ScaleDeleted.Type;
    scale: Scale;
    deleted: Date | string;

    constructor(scale: Scale, deleted: Date | string) { 
        this.scale = scale;
        this.deleted = deleted;
    }
}
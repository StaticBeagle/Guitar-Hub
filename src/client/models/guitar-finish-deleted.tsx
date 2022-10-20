import { GuitarFinish } from "./guitar-finish";

export class GuitarFinishDeleted {
    public static Type = 'Domain.GuitarFinish.Deleted' as const;
    type = GuitarFinishDeleted.Type;
    finish: GuitarFinish;
    deleted: Date | string;

    constructor(finish: GuitarFinish, deleted: Date | string) { 
        this.finish = finish;
        this.deleted = deleted;
    }
}
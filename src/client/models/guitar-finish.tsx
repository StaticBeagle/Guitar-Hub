import { Jinaga as j } from "jinaga";
import {Domain} from './domain';
import { GuitarFinishDeleted } from "./guitar-finish-deleted";

export class GuitarFinish {
    public static Type = "Domain.GuitarFinish" as const;
    type = GuitarFinish.Type;
    finish: string;
    created: Date | string;
    domain: Domain;

    constructor(finish: string, created: Date | string, domain: Domain) { 
        this.finish = finish;
        this.created = created;
        this.domain = domain;
    }

    static getAllAvailableGuitarFinishes(domain: Domain) {
        return j.match<GuitarFinish>({
            type: GuitarFinish.Type,
            domain
        }).suchThat(j.not(GuitarFinish.isDeleted));
    }

    static isDeleted(finish: GuitarFinish) {
        return j.exists({
            type: GuitarFinishDeleted.Type,
            finish: finish
        });
    }
}
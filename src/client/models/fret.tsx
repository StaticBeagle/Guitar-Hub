import { Jinaga as j } from "jinaga";
import {Domain} from './domain';
import { FretDeleted } from "./fret-deleted";

export class Fret {
    public static Type = "Domain.Fret" as const;
    type = Fret.Type;
    fret: string;
    created: Date | string;
    domain: Domain;

    constructor(fret: string, created: Date | string, domain: Domain) { 
        this.fret = fret
        this.created = created;
        this.domain = domain;
    }

    static getAllAvailableFrets(domain: Domain) {
        return j.match<Fret>({
            type: Fret.Type,
            domain
        }).suchThat(j.not(Fret.isDeleted))
    }

    static isDeleted(fret: Fret) {
        return j.exists({
            type: FretDeleted.Type,
            fret: fret
        });
    }
}
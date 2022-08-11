import { Jinaga as j } from "jinaga";
import {Domain} from './domain';
import { GuitarDeleted } from "./guitar-deleted";

export class Guitar {
    public static Type = "Domain.Guitar" as const;
    type = Guitar.Type;
    bodyWood: string
    created: Date | string;
    domain: Domain;

    constructor(bodyWood: string, created: Date | string, domain: Domain) { 
        this.bodyWood = bodyWood
        this.created = created;
        this.domain = domain;
    }

    // static getAllAvailableFrets(domain: Domain) {
    //     return j.match<Fret>({
    //         type: Fret.Type,
    //         domain
    //     }).suchThat(j.not(Fret.isDeleted))
    // }

    // static isDeleted(fret: Fret) {
    //     return j.exists({
    //         type: FretDeleted.Type,
    //         fret: fret
    //     });
    // }
}
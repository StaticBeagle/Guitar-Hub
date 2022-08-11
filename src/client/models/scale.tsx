import { Jinaga as j } from "jinaga";
import {Domain} from './domain';
import { ScaleDeleted } from "./scale-deleted";

export class Scale {
    public static Type = "Domain.Scale" as const;
    type = Scale.Type;
    scale: string;
    created: Date | string;
    domain: Domain;

    constructor(scale: string, created: Date | string, domain: Domain) { 
        this.scale = scale;
        this.created = created;
        this.domain = domain;
    }

    static getAllAvailableScales(domain: Domain) {
        return j.match<Scale>({
            type: Scale.Type,
            domain
        }).suchThat(j.not(Scale.isDeleted))
    }

    static isDeleted(scale: Scale) {
        return j.exists({
            type: ScaleDeleted.Type,
            scale: scale
        });
    }
}
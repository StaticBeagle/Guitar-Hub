import { Jinaga as j } from "jinaga";
import {Domain} from './domain';
import { GuitarStyleDeleted } from "./guitar-style-deleted";

export class GuitarStyle {
    public static Type = "Domain.GuitarStyle" as const;
    type = GuitarStyle.Type;
    style: string;
    created: Date | string;
    domain: Domain;

    constructor(style: string, created: Date | string, domain: Domain) { 
        this.style = style;
        this.created = created;
        this.domain = domain;
    }

    static getAllAvailableGuitarStyles(domain: Domain) {
        return j.match<GuitarStyle>({
            type: GuitarStyle.Type,
            domain
        }).suchThat(j.not(GuitarStyle.isDeleted));
    }

    static isDeleted(style: GuitarStyle) {
        return j.exists({
            type: GuitarStyleDeleted.Type,
            style: style
        });
    }
}
import { Jinaga as j } from "jinaga";
import {Domain} from './domain';
import {RadiusDeleted} from './radius-deleted';

export class Radius {
    public static Type = "Domain.Radius" as const;
    type = Radius.Type;
    radius: string;
    created: Date | string;
    domain: Domain;

    constructor(radius: string, created: Date | string, domain: Domain) { 
        this.radius = radius;
        this.created = created;
        this.domain = domain;
    }

    static getAllAvailableRadii(domain: Domain) {
        return j.match<Radius>({
            type: Radius.Type,
            domain
        }).suchThat(j.not(Radius.isDeleted));
    }

    static isDeleted(radius: Radius) {
        return j.exists({
            type: RadiusDeleted.Type,
            radius: radius
        });
    }
}
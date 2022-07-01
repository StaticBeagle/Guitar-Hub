import { ensure, Jinaga as j } from "jinaga";
import { Specification } from 'jinaga/dist/types/query/query-parser';
import {Domain} from './domain';

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
        return j.match({
            type: Radius.Type,
            domain
        })
    }

    // static userExists(u: GuitarHubUser) {
    //     return j.exists<GuitarHubUser>({
    //         type: GuitarHubUser.Type
    //     })
    // }
}
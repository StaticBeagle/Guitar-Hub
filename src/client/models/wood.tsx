import { Jinaga as j } from "jinaga";
import {Domain} from './domain';
import { WoodDeleted } from "./wood-deleted";

export class Wood {
    public static Type = "Domain.Wood" as const;
    type = Wood.Type;
    wood: string;
    created: Date | string;
    domain: Domain;
    isNeckWood: boolean;
    isBodyWood: boolean;
    isLaminatedTopWood: boolean;
    isFretboardWood: boolean;

    constructor(wood: string, isNeckWood: boolean, isBodyWood: boolean, isLaminatedTopWood: boolean, isFretboardWood: boolean, created: Date | string, domain: Domain) { 
        this.wood = wood;
        this.created = created;
        this.domain = domain;
        this.isNeckWood = isNeckWood;
        this.isBodyWood = isBodyWood;
        this.isLaminatedTopWood = isLaminatedTopWood;
        this.isFretboardWood = isFretboardWood;
    }

    static getAllAvailableWoods(domain: Domain) {
        return j.match<Wood>({
            type: Wood.Type,
            domain
        }).suchThat(j.not(Wood.isDeleted))
    }

    static isDeleted(wood: Wood) {
        return j.exists({
            type: WoodDeleted.Type,
            wood: wood
        });
    }
}
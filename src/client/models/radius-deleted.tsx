import { ensure, Jinaga as j } from "jinaga";
import { Specification } from 'jinaga/dist/types/query/query-parser';
import {Domain} from './domain';
import {Radius} from './radius';

export class RadiusDeleted {
    public static Type = 'Domain.Radius.Deleted' as const;
    type = RadiusDeleted.Type;
    radius: Radius;
    deleted: Date | string;

    constructor(radius: Radius, deleted: Date | string) { 
        this.radius = radius;
        this.deleted = deleted;
    }
}
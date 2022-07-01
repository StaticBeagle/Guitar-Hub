import { ensure, Jinaga as j } from "jinaga";
import { Specification } from 'jinaga/dist/types/query/query-parser';

export class Domain {
    public static Type = "Domain" as const;
    type = Domain.Type;
    host: string;

    private static _instance: Domain;

    private constructor() {
        this.host = "http://localhost:8080/"
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
}
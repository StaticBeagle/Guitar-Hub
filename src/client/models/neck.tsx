import { ensure, Jinaga as j } from "jinaga";
import { Specification } from 'jinaga/dist/types/query/query-parser';

export class Neck {
    public static Type = "Guitar.Neck" as const;
    type = Neck.Type;
    radius: string;

    constructor(radius: string) { 
        this.radius = radius;
    }

    // static userExists(u: GuitarHubUser) {
    //     return j.exists<GuitarHubUser>({
    //         type: GuitarHubUser.Type
    //     })
    // }
}
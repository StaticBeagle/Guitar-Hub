import { ensure, Jinaga as j } from "jinaga";
import { Specification } from 'jinaga/dist/types/query/query-parser';

export class GuitarHubUser {
    public static Type = "GuitarHubUser.User" as const;
    type = GuitarHubUser.Type;
    userName: string;

    constructor(userName: string) { 
        this.userName = userName;
    }

    static userExists(u: GuitarHubUser) {
        return j.exists<GuitarHubUser>({
            type: GuitarHubUser.Type
        })
    }
}

export class UserName {
    public static Type = "GuitarHub.User.Name" as const;
    public type = UserName.Type;

    constructor (
        public prior: Array<UserName>,
        public from: GuitarHubUser,
        public value: string
    ) { }

    // static namesForUser(u: User) {
    //     return j.match<UserName>({
    //         type: UserName.Type,
    //         from: u
    //     }).suchThat(UserName.nameIsCurrent);
    // }

    // static nameIsCurrent(n: UserName) {
    //     return j.notExists(<UserName>{
    //         type: UserName.Type,
    //         prior: [n]
    //     });
    // }

    // static user(n: UserName) {
    //     ensure(n).has('from', User);
    //     return j.match(n.from);
    // }
}

export function userForFact(r: any): Specification<GuitarHubUser> {
    ensure(r).has("from", GuitarHubUser);
    r.from.type = "GuitarHubUser.User";
    return j.match(r.from);
}
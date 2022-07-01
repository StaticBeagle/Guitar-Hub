import React from 'react';
import { j } from "../jinaga-config";

export class NeckRadius {
    public static Type = "Neck.NeckRadius" as const;
    type = NeckRadius.Type;
    radius: string;

    constructor(radius: string) { 
        this.radius = radius;
    }

    static allAvailableRadii(r: NeckRadius) {
        return j.match<NeckRadius>({
            type: NeckRadius.Type,
            radius: r.radius
        })
    }
}

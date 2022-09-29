import { Jinaga as j } from "jinaga";
import {Domain} from './domain';
import { PickupConfigurationDeleted } from "./pickup-configuration-deleted";

export class PickupConfiguration {
    public static Type = "Domain.PickupConfigurations" as const;
    type = PickupConfiguration.Type;
    configuration: string;
    created: Date | string;
    domain: Domain;

    constructor(configuration: string, created: Date | string, domain: Domain) { 
        this.configuration = configuration;
        this.created = created;
        this.domain = domain;
    }

    static getAllAvailablePickupConfigurations(domain: Domain) {
        return j.match<PickupConfiguration>({
            type: PickupConfiguration.Type,
            domain
        }).suchThat(j.not(PickupConfiguration.isDeleted));
    }

    static isDeleted(configuration: PickupConfiguration) {
        return j.exists({
            type: PickupConfigurationDeleted.Type,
            configuration: configuration
        });
    }
}
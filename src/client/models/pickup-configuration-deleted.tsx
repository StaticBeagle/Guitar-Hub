import { PickupConfiguration } from "./pickup-configuration";

export class PickupConfigurationDeleted {
    public static Type = 'Domain.PickupConfiguration.Deleted' as const;
    type = PickupConfigurationDeleted.Type;
    configuration: PickupConfiguration;
    deleted: Date | string;

    constructor(configuration: PickupConfiguration, deleted: Date | string) { 
        this.configuration = configuration;
        this.deleted = deleted;
    }
}
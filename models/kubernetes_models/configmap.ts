import type { V1ConfigMap } from "@kubernetes/client-node";
import type { Compilable } from "../compilable";
import { map, z } from "zod";
import { mapRecord } from "../utils";

export const ConfigMapConfig = z.object({
    name: z.string().min(1),
    data: z.record(z.string()).optional(),
});

export type ConfigMapConfig = z.input<typeof ConfigMapConfig>;

export class ConfigMap implements Compilable<V1ConfigMap> {
    config: ConfigMapConfig;

    constructor(config: ConfigMapConfig) {
        this.config = ConfigMapConfig.parse(config);
    }

    compile() {
        return {
            apiVersion: "v1",
            kind: "ConfigMap",
            metadata: {
                name: this.config.name,
            },
            data: this.config.data,
        };
    }
    
    static recordConstuctor(config: Record<string, ConfigMapConfig>): Record<string, ConfigMap> {
        return mapRecord(config, (config) => new ConfigMap(config));
    }
}

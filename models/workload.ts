import { z } from "zod";
import { type WorkloadCollectable, WorkloadCollectionConfig } from "./collectable";
import { ConfigMap } from "./kubernetes_models/configmap";
import { Deployment } from "./kubernetes_models/deployment";

export const WorkloadConfig = z.object({
    name: z.string().min(1),
    config: WorkloadCollectionConfig,
});

type WorkloadConfig = z.input<typeof WorkloadConfig>;


export class Workload implements WorkloadCollectable{
    config: WorkloadConfig;

    constructor(config: WorkloadConfig) {
        this.config = config;
    }

    collect() {
        return {
            deployments: this.config.config.deployments.map((config) => new Deployment(config)),
            configmaps: this.config.config.configmaps.map((config) => new ConfigMap(config)),
        }
    }

}
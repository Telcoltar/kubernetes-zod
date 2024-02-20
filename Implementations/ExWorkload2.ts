import { z } from "zod";
import type { ConfigMapConfig } from "../models/kubernetes_models/configmap";
import type { DeploymentConfig } from "../models/kubernetes_models/deployment";
import { createWorkload } from "../models/workload_templay";

export const ExWorkload2Config = z.object({
    featToggle2: z.boolean(),
});

type ExWorkload2Config = z.infer<typeof ExWorkload2Config>;

const dConfig = (config: ExWorkload2Config): DeploymentConfig[] => {
    return[{
        name: "ex-workload-2",
        container: {
            main: {
                name: "main",
                registry: "nexus.de:8080",
                repository: "nginx",
            },
        },
    }]
};

const cConfig = (config: ExWorkload2Config): ConfigMapConfig[] => {
    return [{
        name: "ex-workload-2",
        data: {
            featToggle2: config.featToggle2.toString(),
        },
    }];
};

export const ExWorkload2 = createWorkload({
    name: "ExWorkload2",
    deploymentConfig: dConfig,
    configmapConfig: cConfig,
}, ExWorkload2Config);
    
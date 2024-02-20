import { z } from "zod";
import type { ConfigMapConfig } from "../models/kubernetes_models/configmap";
import type { DeploymentConfig } from "../models/kubernetes_models/deployment";
import { createWorkload } from "../models/workload_templay";

export const ExWorkload3Config = z.object({
    featToggle3: z.boolean(),
});

type ExWorkload3Config = z.infer<typeof ExWorkload3Config>;

const dConfig = (config: ExWorkload3Config): DeploymentConfig[] => {
    return[{
        name: "ex-workload-3",
        container: {
            main: {
                name: "main",
                registry: "nexus.de:8080",
                repository: "nginx",
            },
        },
    }]
};

const cConfig = (config: ExWorkload3Config): ConfigMapConfig[] => {
    return [{
        name: "ex-workload-3",
        data: {
            featToggle1: config.featToggle3.toString(),
        },
    }];
};

export const ExWorkload3 = createWorkload({
    name: "ExWorkload3",
    deploymentConfig: dConfig,
    configmapConfig: cConfig,
}, ExWorkload3Config);
    
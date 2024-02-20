import { z } from "zod";
import type { ConfigMapConfig } from "../models/kubernetes_models/configmap";
import type { DeploymentConfig } from "../models/kubernetes_models/deployment";
import { createWorkload } from "../models/workload_templay";

export const ExWorkload1Config = z.object({
    featToggle1: z.boolean(),
});

type ExWorkload1Config = z.infer<typeof ExWorkload1Config>;

const dConfig = (config: ExWorkload1Config): DeploymentConfig[] => {
    return[{
        name: "ex-workload-1",
        container: {
            main: {
                name: "main",
                registry: "nexus.de:8080",
                repository: "nginx",
            },
        },
    }]
};

const cConfig = (config: ExWorkload1Config): ConfigMapConfig[] => {
    return [{
        name: "ex-workload-1",
        data: {
            featToggle1: config.featToggle1.toString(),
        },
    }];
};

export const ExWorkload1 = createWorkload({
    name: "ExWorkload1",
    deploymentConfig: dConfig,
    configmapConfig: cConfig,
}, ExWorkload1Config);
    
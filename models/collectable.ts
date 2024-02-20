import { z } from "zod";
import { ConfigMap, ConfigMapConfig } from "./kubernetes_models/configmap";
import { Deployment, DeploymentConfig } from "./kubernetes_models/deployment";
import type { Namespace } from "./kubernetes_models/namespace";

export type WorkloadCollection = {
    deployments: Deployment[];
    configmaps: ConfigMap[];
}

export type EnvCollection = WorkloadCollection & {
    namespace: Namespace[]
}

export const WorkloadCollectionConfig = z.object({
    deployments: DeploymentConfig.array(),
    configmaps: ConfigMapConfig.array(),
});

export type WorkloadCollectionConfig = z.infer<typeof WorkloadCollectionConfig>;

export type WorkloadCollectable = {
    collect(): WorkloadCollection;
}
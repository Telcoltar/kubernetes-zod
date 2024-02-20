import { z } from "zod";
import { DeploymentConfig } from "./kubernetes_models/deployment";
import { ConfigMapConfig } from "./kubernetes_models/configmap";
import { Workload } from "./workload";

/* export type WorkloadTemplateConfig<S, T extends z.ZodTypeAny> = {
    name: string
    schema: T
    deploymentConfig: (config: S) => DeploymentConfig[]
    configmapConfig: (config: S) => ConfigMapConfig[]
} */

export const WorkloadTemplateConfigFunction = <S extends z.ZodTypeAny>(schema: S) => {
    return z.object({
        name: z.string(),
        deploymentConfig: z.function().args(schema).returns(DeploymentConfig.array()),
        configmapConfig: z.function().args(schema).returns(ConfigMapConfig.array()),
    });
}

type TemplateConfigType<T extends z.ZodTypeAny> = ReturnType<typeof WorkloadTemplateConfigFunction<T>>;

type WorkloadTemplateConfig<T extends z.ZodTypeAny> = z.input<TemplateConfigType<T>>;

export const createWorkload = <T extends z.ZodTypeAny>(config: WorkloadTemplateConfig<T>, schema: T) => {
    const validatedConfig = WorkloadTemplateConfigFunction(schema).parse(config);
    return (workloadConfig: z.input<typeof schema>) => {
        const workloadConfigParsed = schema.parse(workloadConfig);
        return new Workload({
            name: config.name,
            config: {
                deployments: validatedConfig.deploymentConfig(workloadConfigParsed),
                configmaps: validatedConfig.configmapConfig(workloadConfigParsed),
            },
        });
    }
}
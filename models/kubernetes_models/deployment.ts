import { z } from "zod";
import { Container, ContainerConfig } from "./container";
import { compileRecordToArray, type Compilable } from "../compilable";
import type { V1Container, V1Deployment } from "@kubernetes/client-node";
import { mapRecord } from "../utils";

export const DeploymentConfig = z.object({
    name: z.string().min(1),
    container: z.record(ContainerConfig),
});

export type DeploymentConfig = z.input<typeof DeploymentConfig>;


export class Deployment implements Compilable<V1Deployment> {
    config: DeploymentConfig;

    constructor(config: DeploymentConfig) {
        this.config = DeploymentConfig.parse(config);
    }

    compile() {
        return {
            apiVersion: "apps/v1",
            kind: "Deployment",
            metadata: {
                name: this.config.name,
            },
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: {
                        app: this.config.name,
                    },
                },
                template: {
                    metadata: {
                        labels: {
                            app: this.config.name,
                        },
                    },
                    spec: {
                        containers: compileRecordToArray<Container, V1Container>(Container.recordConstuctor(this.config.container)),
                    },
                },
            },
        };
    }

    static recordConstuctor(config: Record<string, DeploymentConfig>): Record<string, Deployment> {
        return mapRecord(config, (config) => new Deployment(config));
    }
}
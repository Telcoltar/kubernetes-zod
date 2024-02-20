import { z } from "zod";
import type { Compilable } from "../compilable";
import type { V1Container } from "@kubernetes/client-node";
import { mapRecord } from "../utils";

export const ContainerConfig = z.object({
    name: z.string().min(1).describe("The name of the container"),
    registry: z.literal("nexus.de:8080").describe("The registry of the container"),
    repository: z.string().min(1).describe("The repository of the container"),
    tag: z.string().min(1).default("latest").describe("The tag of the container"),
});

export type ContainerConfig = z.input<typeof ContainerConfig>;

export class Container implements Compilable<V1Container> {
    config: ContainerConfig;
    constructor(config: ContainerConfig){
        this.config = ContainerConfig.parse(config);
    }

    compile() {
        return {
            name: this.config.name,
            image: this.config.registry + "/" + this.config.repository + ":" + this.config.tag,
        };
    }

    static recordConstuctor(config: Record<string, ContainerConfig>): Record<string, Container> {
        return mapRecord(config, (config) => new Container(config));
    }
}


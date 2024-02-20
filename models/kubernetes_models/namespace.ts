import { z } from "zod";
import type { Compilable } from "../compilable";
import type { V1Namespace } from "@kubernetes/client-node";

export const NamespaceConfig = z.object({
    name: z.string().min(1),
});

type NamespaceConfig = z.input<typeof NamespaceConfig>;

export class Namespace implements Compilable<V1Namespace>{
    config: NamespaceConfig;

    constructor(config: NamespaceConfig) {
        this.config = NamespaceConfig.parse(config);
    }

    compile() {
        return {
            apiVersion: "v1",
            kind: "Namespace",
            metadata: {
                name: this.config.name,
            },
        };
    }
}
import { z } from "zod";
import { PodSpec } from "./podspec";

export const Deployment = z.object({
    apiVersion: z.literal("apps/v1").default("apps/v1"),
    kind: z.literal("Deployment").default("Deployment"),
    metadata: z.object({
        name: z.string(),
        labels: z.record(z.string()).optional(),
    }),
    spec: z.object({
        replicas: z.number().int().positive().optional(),
        selector: z.object({ matchLabels: z.record(z.string()) }),
        template: z.object({
            metadata: z.object({ labels: z.record(z.string()) }),
            spec: PodSpec,
        }),
    }),
});
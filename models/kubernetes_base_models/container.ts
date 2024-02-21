import { z } from "zod";
import { VolumeMount } from "./volumeMount";

export const Container = z.object({
    name: z.string(),
    image: z.string(),
    ports: z.array(z.object({ containerPort: z.number() })).optional(),
    resources: z.object({
        requests: z.object({ cpu: z.string(), memory: z.string() }),
        limits: z.object({ cpu: z.string(), memory: z.string() }),
    }),
    volumeMounts: VolumeMount.array().optional(),
});
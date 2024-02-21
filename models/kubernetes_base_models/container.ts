import { z } from "zod";
import { VolumeMount } from "./volumeMount";

const env = z.object({
    name: z.string(),
    value: z.string()
});

const secretEnv = z.object({
    name: z.string(),
    secret: z.object({
        secretName: z.string(),
        key: z.string(),
    })
}).transform(env => {
    return {
        name: env.name,
        valueFrom: {
            secretKeyRef: {
                name: env.secret.secretName,
                key: env.secret.key,
            }
        }
    }
});

const probe = z.object({
    exec: z.object({
        command: z.string().array().optional(),
    }).optional(),
    initialDelaySeconds: z.number().optional(),
    periodSeconds: z.number().optional(),
    timeoutSeconds: z.number().optional(),
    successThreshold: z.number().optional(),
    failureThreshold: z.number().optional(),
});

export const Container = z.object({
    name: z.string(),
    image: z.string(),
    ports: z.array(z.object({ containerPort: z.number() })).optional(),
    resources: z.object({
        requests: z.object({ cpu: z.string(), memory: z.string() }),
        limits: z.object({ cpu: z.string(), memory: z.string() }),
    }),
    readinessProbe: probe.optional(),
    livenessProbe: probe.optional(),
    volumeMounts: VolumeMount.array().optional(),
    envs: z.union([env, secretEnv]).array().optional(),
});
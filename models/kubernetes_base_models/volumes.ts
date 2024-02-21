import { z } from "zod";

const emptyDir = z.object({
    emptyDir: z.object({}),
});

const configMap = z.object({
    configMap: z.object({ name: z.string() }),
});

const secret = z.object({
    secret: z.object({ secretName: z.string() }),
});

const name = z.string().min(1);

export const Volume = z.union([emptyDir, configMap, secret]).and(z.object({ name }));
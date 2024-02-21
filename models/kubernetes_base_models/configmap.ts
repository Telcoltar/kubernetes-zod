import { z } from "zod";

import * as fs from "fs";

export const ConfigMap = z.object({
    apiVersion: z.literal("v1").default("v1"),
    kind: z.literal("ConfigMap").default("ConfigMap"),
    metadata: z.object({
        name: z.string(),
        labels: z.record(z.string()).optional(),
    }),
    data: z.record(z.string()).optional(),
});

export const SimpleConfigMap = z.object({
    name: z.string(),
    data: z.record(z.string()).optional(),
    filesToAdd: z.object({
        key: z.string().min(1),
        path: z.string().min(1),
    }).array().optional(),
}).
refine(configMap => {
    if (!configMap.data && !configMap.filesToAdd) {
        return false
    }
    return true
}, {message: "Either data or filesToAdd must be provided"}).
refine(configMap => {
    if (configMap.filesToAdd) {
        configMap.filesToAdd.forEach(file => {
            if (!fs.existsSync(file.path)) {
                return false
            }
        })
    }
    return true
}, {message: "Files to add must exist"}).
transform(configMap => {
    let data = configMap.data ?? {};
    if (configMap.filesToAdd) {
        configMap.filesToAdd.forEach(file => {
            data[file.key] = fs.readFileSync(file.path, "utf8");
        })
    }
    const c: z.input<typeof ConfigMap> = {
        metadata: { name: configMap.name, labels: {app: configMap.name}},
        data: data,
    }
    return ConfigMap.parse(c);
});
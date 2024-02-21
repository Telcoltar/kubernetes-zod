import { z } from "zod";

export const VolumeMount = z.object({
    name: z.string(),
    mountPath: z.string(),
    readOnly: z.boolean().optional(),
});
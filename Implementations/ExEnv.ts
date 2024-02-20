import { z } from "zod";
import { Env } from "../models/env";
import { BaseModul } from "./BaseModul";
import { ExtModul } from "./ExtModul";

export const ExEnvConfig = z.object({
    name: z.string().min(1),
    featToggle1: z.boolean(),
    featToggle2: z.boolean(),
    featToggle3: z.boolean(),
});


export const ExEnv = (config: z.input<typeof ExEnvConfig>) => {
    return new Env({
        name: config.name,
        modules: [BaseModul({
            featToggle1: config.featToggle1,
            featToggle2: config.featToggle2,
        }), ExtModul({
            featToggle3: config.featToggle3,
        })]

    });
}
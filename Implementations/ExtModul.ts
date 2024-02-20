import { z } from "zod";
import { Modul } from "../models/module";
import { ExWorkload3 } from "./ExWorkload3";

export const ExtModulConfig = z.object({
    featToggle3: z.boolean(),
})

type ExtModulConfig = z.input<typeof ExtModulConfig>;

export const ExtModul = (config: ExtModulConfig) => {
    const parsedConfig = ExtModulConfig.parse(config);
    return new Modul({
        name: "ExtModul",
        workloads: [ExWorkload3(parsedConfig)]
    });
}
import { z } from "zod";
import { Modul } from "../models/module";
import { ExWorkload1 } from "./ExWorkload1";
import { ExWorkload2 } from "./ExWorkload2";

export const BaseModulConfig = z.object({
    featToggle1: z.boolean(),
    featToggle2: z.boolean(),
})

type BaseModulConfig = z.input<typeof BaseModulConfig>;

export const BaseModul = (config: BaseModulConfig) => {
    const parsedConfig = BaseModulConfig.parse(config);
    return new Modul({
        name: "BaseModul",
        workloads: [ExWorkload1(parsedConfig), ExWorkload2(parsedConfig)]
});
}

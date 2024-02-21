import { z } from "zod";
import { SimpleConfigMap } from "./configmap";
import { SimpleDeployment } from "./simpleDeployment";

export const Workload = z.object({
    deployment: SimpleDeployment.array().min(1),
    configMaps: SimpleConfigMap.array().optional(),
});
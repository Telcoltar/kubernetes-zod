import { z } from "zod";
import { Container } from "./container";
import { Volume } from "./volumes";

export const PodSpec = z.object({
    containers: Container.array(),
    initContainers: Container.array().optional(),
    volumes: Volume.array().optional(),
}).refine(podSpec => {
    if (podSpec.containers.length === 0) {
        return "PodSpec must have at least one container";
    }
    // check if volumeMounts are valid
    const volumeNames = podSpec.volumes?.map(v => v.name) ?? [];
    for (const container of podSpec.containers) {
        if (container.volumeMounts) {
            for (const volumeMount of container.volumeMounts) {
                if (!volumeNames.includes(volumeMount.name)) {
                    return `VolumeMount ${volumeMount.name} is not defined in PodSpec volumes`;
                }
            }
        }
    }
    return true;
});
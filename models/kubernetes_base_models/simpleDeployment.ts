import { z } from "zod";
import { Container } from "./container";
import type { PodSpec } from "./podspec";
import { VolumeMount } from "./volumeMount";
import { ConfigMap, SimpleConfigMap } from "./configmap";
import type { Volume } from "./volumes";

const containerMount = z.object({
    containerName: z.string(),
    mountPath: z.string().min(1),
    readOnly: z.boolean().optional(),
})

const transformMount = (name: string, mount: z.infer<typeof containerMount>) => {
    return {
        containerName: mount.containerName,
        mount: {
            name: name,
            mountPath: mount.mountPath,
            readOnly: mount.readOnly,
        }
    }
}

const emptyDirVolume = z.object({
    name: z.string().min(1),
    mounts: containerMount.array(),
}).transform(volume => {
    return {
        volume: {
            name: volume.name,
            emptyDir: {},
        },
        mounts: volume.mounts.map(mount => transformMount(volume.name, mount)),
    }
})

const configMapVolume = z.object({
    configMap: SimpleConfigMap,
    mounts: containerMount.array(),
}).transform(volume => {
    return {
        volume: {
            name: volume.configMap.metadata.name,
            configMap: { name: volume.configMap.metadata.name },
        },
        mounts: volume.mounts.map(mount => transformMount(volume.configMap.metadata.name, mount)),
    }
});

export const SimpleDeployment = z.object({
    name: z.string().min(1),
    replicas: z.number().int().positive().optional(),
    containers: Container.omit({volumeMounts: true}).array(),
    initContainers: Container.omit({volumeMounts: true}).array().optional(),
    emptyDirVolumes: emptyDirVolume.array().optional(),
    configMapVolumes: configMapVolume.array().optional(),
}).transform(deployment => {
    let volumes: z.input<typeof Volume>[] = []
    deployment.emptyDirVolumes?.forEach(volume => {
        volumes.push(volume.volume);
    });
    deployment.configMapVolumes?.forEach(volume => {
        volumes.push(volume.volume);
    });
    let mounts: ReturnType<typeof transformMount>[] = [];
    deployment.emptyDirVolumes?.forEach(volume => {
        mounts.push(...volume.mounts);
    });
    deployment.configMapVolumes?.forEach(volume => {
        mounts.push(...volume.mounts);
    });
    return {
        name: deployment.name,
        replicas: deployment.replicas,
        containers: deployment.containers,
        initContainers: deployment.initContainers,
        volumes: volumes.length > 0 ? volumes : undefined,
        mounts: mounts.length > 0 ? mounts : undefined,
    }
}).refine(deployment => {
    // check if container names from Volumes are in containers
    const containerNames = deployment.containers.map(c => c.name);
    if (deployment.initContainers) {
        containerNames.push(...deployment.initContainers.map(c => c.name));
    }
    deployment.mounts?.forEach(mount => {
        if (!containerNames.includes(mount.containerName)) {
            return false
        }
    });
    return true;
}).transform(deployment => {
    let containerMap = new Map<string, z.infer<typeof Container>>();
    deployment.containers.forEach(c => containerMap.set(c.name, c));
    deployment.initContainers?.forEach(c => containerMap.set(c.name, c));
    // add volumeMounts to containers
    deployment.mounts?.forEach(mount => {
        let container = containerMap.get(mount.containerName);
        if (container) {
            if (!container.volumeMounts) {
                container.volumeMounts = [];
            }
            container.volumeMounts.push(mount.mount);
        }
    });
    let podSpec: z.infer<typeof PodSpec> = {
        containers: deployment.containers,
        initContainers: deployment.initContainers,
        volumes: deployment.volumes,
    };
    let deploymentInput = {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: { name: deployment.name, labels: {app: deployment.name} },
        spec: {
            replicas: deployment.replicas,
            selector: { matchLabels: {app: deployment.name} },
            template: {
                metadata: { labels: {app: deployment.name} },
                spec: podSpec,
            },
        },
    };
    return deploymentInput;
})
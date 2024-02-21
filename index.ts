import type { z } from "zod";
import { SimpleDeployment } from "./models/kubernetes_base_models/simpleDeployment";
import * as fs from "fs";
import YAML from 'yaml'
import { Workload } from "./models/kubernetes_base_models/workload";
import type { SimpleConfigMap } from "./models/kubernetes_base_models/configmap";


let c: z.input<typeof SimpleConfigMap> = {
    name: "testConfigmap",
    data: {
        "test": "test",
    },
};

let d: z.input<typeof SimpleDeployment> = {
    name: "test",
    replicas: 2,
    containers: [
        {
            name: "test",
            image: "test",
            ports: [{ containerPort: 80 }],
            resources: {
                requests: { cpu: "100m", memory: "100Mi" },
                limits: { cpu: "200m", memory: "200Mi" },
            },
            envs: [
                { name: "test", value: "test" },
                { name: "test", secret: { secretName: "test", key: "test" } },
            ]
        },
    ],
    initContainers: [
        {
            name: "testinit",
            image: "testinit",
            resources: {
                requests: { cpu: "100m", memory: "100Mi" },
                limits: { cpu: "200m", memory: "200Mi" },
            },
        },
    ],
    emptyDirVolumes: [
        {
            name: "test",
            mounts: [
                {
                    containerName: "test",
                    mountPath: "/test",
                    readOnly: true,
                },
                {
                    containerName: "testinit",
                    mountPath: "/testinit",
                    readOnly: true,
                }
            ],
        },
    ],
    configMapVolumes: [
        {
            configMap: c,
            mounts: [
                {
                    containerName: "test",
                    mountPath: "/test",
                    readOnly: true,
                },
                {
                    containerName: "testinit",
                    mountPath: "/testinit",
                    readOnly: true,
                }
            ],
        },
    ],
};

let w: z.input<typeof Workload> = {
    deployment: [d],
    configMaps: [c],
};

let parsed = Workload.parse(w);
Object.entries(parsed).forEach(([kind, value]) => {
    value.forEach(runtimeObj => {
        fs.writeFileSync(`./output/${runtimeObj.metadata.name}_${kind}.yaml`, YAML.stringify(runtimeObj));
    })
})
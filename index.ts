import { V1Deployment } from "@kubernetes/client-node";
import { BaseModul } from "./Implementations/BaseModul";
import { compileRecordToArray } from "./models/compilable";
import { Deployment } from "./models/kubernetes_models/deployment";
import * as fs from "fs";
import * as yaml from "js-yaml"
import { zodToJsonSchema } from "zod-to-json-schema";
import { WorkloadConfig } from "./models/workload";
import { ExEnv } from "./Implementations/ExEnv";
import { z } from "zod";

let HelloWorldEnv = ExEnv({
    name: "hello-world",
    featToggle1: true,
    featToggle2: false,
    featToggle3: true,
})

let HelloWorldCompiled = HelloWorldEnv.compile();

Object.entries(HelloWorldCompiled).forEach(([key, value]) => {
    value.map((item) => {
        fs.writeFileSync(`./output/${key}_${item.metadata.name}.yaml`, yaml.dump(item))
    })
})

let test = z.object({
    name: z.string(),
    volumes: z.union([
        z.object({
            emptyDir: z.object({})
        }).strict(),
        z.object({
            secret: z.object({
                secretName: z.string()
            })
        }).strict()
    ])
})

let testSchema = zodToJsonSchema(test)
fs.writeFileSync("./output/test.json", JSON.stringify(testSchema, null, 2))

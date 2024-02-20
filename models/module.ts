import type { WorkloadCollectable } from "./collectable"
import type { Workload } from "./workload"

type ModuleConfig = {
    name: string
    workloads: Workload[]
}

export class Modul implements WorkloadCollectable {
    config: ModuleConfig

    constructor(config: ModuleConfig) {
        this.config = config
    }

    collect() {
        let collections = this.config.workloads.map((workload) => workload.collect())
        let flattened = collections.reduce((acc, val) => {
            return {
                deployments: acc.deployments.concat(val.deployments),
                configmaps: acc.configmaps.concat(val.configmaps)
            }
        })
        return flattened
    }
}
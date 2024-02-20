import type { EnvCollection } from "./collectable"
import type { Compilable } from "./compilable"
import { Namespace } from "./kubernetes_models/namespace"
import type { Modul } from "./module"

type EnvConfig = {
    name: string
    modules: Modul[]
}

export class Env {
    config: EnvConfig

    constructor(config: EnvConfig) {
        this.config = config
    }

    collect(): EnvCollection {
        let collections = this.config.modules.map((module) => module.collect())
        let flattened = collections.reduce((acc, val) => {
            return {
                deployments: acc.deployments.concat(val.deployments),
                configmaps: acc.configmaps.concat(val.configmaps)
            }
        })
        let namespace = new Namespace({name: this.config.name})
        return {
            namespace: [namespace],
            ...flattened,
        }
    }

    compile() {
        let collection = this.collect()
        return {
            namespace: collection.namespace.map((namespace) => namespace.compile()),
            deployments: collection.deployments.map((deployment) => deployment.compile()),
            configmaps: collection.configmaps.map((configmap) => configmap.compile())
        }
    }

}
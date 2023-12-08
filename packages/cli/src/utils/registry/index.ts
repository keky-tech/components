import path from "path"
import { Config } from "@/src/utils/get-config"
import {
  registryBaseColorSchema,
  registryIndexSchema,
  registryItemWithContentSchema,
  registryWithContentSchema,
  stylesSchema,
} from "@/src/utils/registry/schema"
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"
import * as z from "zod"

const shadcnUrl = "https://ui.shadcn.com"
const baseUrl = process.env.COMPONENTS_REGISTRY_URL ?? "https://ui.shadcn.com"
const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

export async function getRegistryIndex() {
  try {
    const {shadcn: [shadcnResult], picasso: [picassoResult]} = await fetchRegistry(["index.json"]) as {shadcn: unknown[], picasso: unknown[]}

    return {
      shadcn: registryIndexSchema.parse(shadcnResult),
      picasso: registryIndexSchema.parse(picassoResult)
    }
  } catch (error) {
    throw new Error(`Failed to fetch components from registry.`)
  }
}

export async function getRegistryBaseColors() {
  return [
    {
      name: "slate",
      label: "Slate",
    },
    {
      name: "gray",
      label: "Gray",
    },
    {
      name: "zinc",
      label: "Zinc",
    },
    {
      name: "neutral",
      label: "Neutral",
    },
    {
      name: "stone",
      label: "Stone",
    },
  ]
}

export async function getRegistryBaseColor(baseColor: string) {
  try {
    const [result] = await fetchRegistry([`colors/${baseColor}.json`], undefined, false) as unknown[]

    return registryBaseColorSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch base color from registry.`)
  }
}

export async function resolveTree(
  index: z.infer<typeof registryIndexSchema>,
  names: string[]
) {
  const tree: z.infer<typeof registryIndexSchema> = []

  for (const name of names) {
    const entry = index.find((entry) => entry.name === name)

    if (!entry) {
      continue
    }

    tree.push(entry)

    if (entry.registryDependencies) {
      const dependencies = await resolveTree(index, entry.registryDependencies)
      tree.push(...dependencies)
    }
  }

  return tree.filter(
    (component, index, self) =>
      self.findIndex((c) => c.name === component.name) === index
  )
}

export async function fetchTree(
  tree: z.infer<typeof registryIndexSchema>
) {
  try {
    const shadcnPaths = tree.filter((item) => !item.context).map((item) => `styles/new-york/${item.name}.json`)
    const picassoPaths = tree.filter((item) => item.context === 'picasso').map((item) => `styles/${item.name}.json`)
    const result = await fetchRegistry(picassoPaths, shadcnPaths)

    return {
      shadcn: registryWithContentSchema.parse((result as {shadcn: unknown[]}).shadcn),
      picasso: registryWithContentSchema.parse((result as {picasso: unknown[]}).picasso)
    }
  } catch (error) {
    throw new Error(`Failed to fetch tree from registry.`)
  }
}

export async function getItemTargetPath(
  config: Config,
  item: Pick<z.infer<typeof registryItemWithContentSchema>, "type">,
  override?: string
) {
  // Allow overrides for all items but ui.
  if (override && item.type !== "components:ui") {
    return override
  }

  const [parent, type] = item.type.split(":")
  if (!(parent in config.resolvedPaths)) {
    return null
  }

  return path.join(
    config.resolvedPaths[parent as keyof typeof config.resolvedPaths],
    type
  )
}

async function fetchRegistry(paths: string[], shadcnPaths?: string[], fetchShadcn: boolean = true) {
  try {
    const picasso = await Promise.all(
      paths.map(async (path) => {
        const response = await fetch(`${baseUrl}/registry/${path}`, {
          agent,
        })
        return await response.json()
      })
    )

    if (fetchShadcn) {
    
      const shadcn = await Promise.all(
        (shadcnPaths || paths).map(async (path) => {
          const response = await fetch(`${shadcnUrl}/registry/${path}`, {
            agent,
          })
          return await response.json()
        })
      )
      return {
        picasso,
        shadcn
      }
    }

    return picasso
  } catch (error) {
    console.log(error)
    throw new Error(`Failed to fetch registry from ${baseUrl}.`)
  }
}

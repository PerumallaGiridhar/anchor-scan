export type Idl = {
    address: string
    metadata: {
        name: string
        version: string
        spec: string
        description?: string
    }
    instructions: {
        name: string
        discriminator?: number[]
        accounts: {
            name: string
            writable?: boolean
            signer?: boolean
            address?: string
            pda?: {
                seeds: {
                    kind: "const" | "account" | string
                    value?: number[]
                    path?: string
                }[]
            }
        }[]
        args: {
            name: string
            type: any // You can replace `any` with a specific union type if needed
        }[]
    }[]
    accounts: {
        name: string
        discriminator: number[]
    }[]
    types?: {
        name: string
        type: {
            kind: "struct"
            fields: {
                name: string
                type: string | { defined: string }
            }[]
        }
    }[]
}
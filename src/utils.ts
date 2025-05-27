import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export function getOptimalPageSize(rowHeight = 65, offset = 350) {
    // offset accounts for headers, footers, paddings, etc.
    const availableHeight = window.innerHeight - offset;
    const possiblePageSizes = [6, 8, 10, 12, 14, 16, 18, 20];
    const maxRowsFit = Math.floor(availableHeight / rowHeight);

    // Find the largest page size from the list that doesn't exceed maxRowsFit
    let optimalPageSize = possiblePageSizes[0];
    for (let size of possiblePageSizes) {
        if (size <= maxRowsFit) {
            optimalPageSize = size;
        } else {
            break;
        }
    }

    return optimalPageSize;
}

export function recursivelyConvertNumbersOnly(obj: any): any {
    if (obj instanceof BN) return obj.toString(10)

    if (Array.isArray(obj)) {
        return obj.map(recursivelyConvertNumbersOnly)
    }

    if (typeof obj === "object" && obj !== null) {
        // Don't modify if it's a PublicKey instance
        if (obj instanceof PublicKey) return obj

        return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => {
                // Skip conversion for keys you know are public keys
                if (v instanceof PublicKey) return [k, v]
                return [k, recursivelyConvertNumbersOnly(v)]
            })
        )
    }

    return obj
}
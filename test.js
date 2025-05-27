import { Connection, PublicKey } from "@solana/web3.js"
const connection = new Connection("https://api.devnet.solana.com")

const accounts = await connection.getProgramAccounts(
  new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
  {
    dataSlice: { offset: 0, length: 0 }, // Don't fetch full data
  }
)

console.log("Total accounts:", accounts.length)
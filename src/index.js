import { bAtomPriceSafe } from './bAtomPrice'
import { handleJsonRpcRequests } from './JsonRpcRequestsHandler'
import { setGlobals } from './globals'

let ethRPCs = []
// Before adding new encrypted env variable to cloudflare
// wrangler compiles and deploys application. At this step
// variable ETH_RPCS doesn't exists yet, so we have to have
// try/catch block here to allow script to be compiled
try {
  ethRPCs = JSON.parse(ETH_RPCS)
  var {
    ENV,
    SENTRY_PROJECT_ID,
    SENTRY_KEY,
    DEVIATION_BLOCK_OFFSETS,
    // BETH_RATE_LIMITS,
    BATOM_PRICE_LIMITS,
    // STETH_RATE_LIMITS,
    ATOM_PRICE_LIMITS,
    ETH_RPCS,
    REQUEST_TIMEOUT,
    CHAINLINK_CONTRACT_ADDRESS,
  } = process.env
} catch (e) {
  console.error(e)
}

setGlobals({
  env: ENV,
  sentryProjectId: SENTRY_PROJECT_ID,
  sentryKey: SENTRY_KEY,
  ethRpcs: ethRPCs,
  deviationBlockOffsets:
    DEVIATION_BLOCK_OFFSETS && JSON.parse(DEVIATION_BLOCK_OFFSETS),
  // bEthRateLimits: BETH_RATE_LIMITS && JSON.parse(BETH_RATE_LIMITS),
  bAtomPriceLimits: BATOM_PRICE_LIMITS && JSON.parse(BATOM_PRICE_LIMITS),
  // stEthRateLimits: STETH_RATE_LIMITS && JSON.parse(STETH_RATE_LIMITS),
  atomPriceLimits: ATOM_PRICE_LIMITS && JSON.parse(ATOM_PRICE_LIMITS),
  requestTimeout: REQUEST_TIMEOUT && Number.parseInt(REQUEST_TIMEOUT, 10),
  chainLinkContractAddress: CHAINLINK_CONTRACT_ADDRESS,
})

addEventListener('fetch', event => {
  event.respondWith(
    handleJsonRpcRequests(event.request, { currentPrice: bAtomPriceSafe }),
  )
})

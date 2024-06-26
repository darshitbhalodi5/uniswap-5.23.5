import { MATIC_POLYGON, nativeOnChain } from 'constants/tokens'
import { supportedChainIdFromGQLChain } from 'graphql/data/util'
import { Chain } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'

export function getNativeTokenDBAddress(chain: Chain): string | undefined {
  const pageChainId = supportedChainIdFromGQLChain(chain)
  if (pageChainId === undefined) {
    return undefined
  }
  switch (chain) {
    // Celo & Polygon have precompiles for their native tokens
    case Chain.Celo:
      return nativeOnChain(pageChainId).wrapped.address
    case Chain.Polygon:
      // Like Celo, native MATIC does have a ERC20 precompile, but we use WMATIC in routing/pools
      // So instead of returning nativeOnChain().wrapped.address, should directly use the precompile address here
      return MATIC_POLYGON.address
    case Chain.Ethereum:
    case Chain.Mode:
    case Chain.Arbitrum:
    case Chain.EthereumGoerli:
    case Chain.Optimism:
    default:
      return undefined
  }
}
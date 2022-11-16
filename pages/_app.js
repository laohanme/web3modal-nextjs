import '../styles/globals.css'

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID)
  throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable')
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

// 2. Configure wagmi client
const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum]
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId }),
])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3moda', chains }),
  provider,
})

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains)

function MyApp({ Component, pageProps }) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <Component {...pageProps} />
      </WagmiConfig>
      <Web3Modal
        projectId={projectId}
        theme="dark"
        accentColor="default"
        ethereumClient={ethereumClient}
      />
    </>
  )
}

export default MyApp

'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import '@rainbow-me/rainbowkit/styles.css';

const avalancheFuji = {
  id: 43113,
  name: 'Avalanche Fuji',
  iconUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'AVAX',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
    },
    public: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: 'PropChain',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [avalancheFuji],
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
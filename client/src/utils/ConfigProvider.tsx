import React, {createContext, useContext, useState } from 'react';

import { WalletProviders } from '.';

type Config = {
  apiProvider: boolean
  walletProviders: WalletProviders[]
  contractAddress: string
  currency : "ETH" | "USDC"
}

interface IConfigContext {
  config : Config
}

type ConfigProviderProps = {
  children: React.ReactNode
  config: Config
}
 const ConfigContext = createContext<IConfigContext>({} as IConfigContext);

  export const ConfigProvider = ({ children, config }: ConfigProviderProps) =>{

    return (
      <ConfigContext.Provider value={{ config }}>
        {children }
      </ConfigContext.Provider>
    );
  };
export const useConfig = () => {
  const context = useContext(ConfigContext)
  if (context === undefined){
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
  
 
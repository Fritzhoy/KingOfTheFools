import { useState } from 'react';
import Web3 from 'web3';


export const useWeb3 = ({setIsLoading, setErrorMessage}) => {

  const [provider, setProvider] = useState(null);
  const [account, setAccount ] = useState('');

  const connect = async () => {
    try{
    setIsLoading(true);
    setErrorMessage('');

    if(!window.ethereum) throw new Error ('You should enable MetaMask');
    await window.ethereum.request({ method: 'eth_requestAccounts'});
    const web3 = new Web3(window.ethereum);
    setProvider(web3);

    window.ethereum.on('accountsChanged', (accounts) => setAccount(accounts[0]), );

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    setIsLoading(false);
  }
  };
  const disconnect = () => {
    setProvider(null);
    setAccount('');
  };
  return {connect, disconnect, provider, account}
}
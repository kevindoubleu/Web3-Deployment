import { ethers } from "ethers";
import Token from "./artifacts/contracts/Token.sol/Token.json";

import { useState, useEffect } from "react";
import ConnectButton from "./components/ConnectButton";
import Wallet from "./components/Wallet";
import Transfer from "./components/Transfer";

function App() {
  // set up wallet
  const [ethProvider, setEthProvider] = useState({
    provider : undefined,
    signer   : undefined,
  })
  useEffect(() => {
    if (!window.ethereum) {return}
    async function initWallet() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      setEthProvider({
        ...ethProvider,
        provider : provider,
        signer   : signer,
      })
    }
    initWallet()
  }, [])

  
  // update balance when address is updated
  const [address, setAddress] = useState()
  async function getAddress() {
    const [ethAddress] = await window.ethereum.enable()
    setAddress(ethAddress)
  }

  const [balance, setBalance] = useState()
  useEffect(() => {
    async function getBalance() {
      const ethBalance = await ethProvider.provider.getBalance(address)
      setBalance(ethers.utils.formatEther(ethBalance))

      window.ethereum.on("accountsChanged", () => {
        getAddress()
      })
    }
    if (ethProvider.provider) {
      getBalance()
    }
  }, [address])

  const transferEther = async (detail) => {
    try {
      const tx = await ethProvider.signer.sendTransaction({
        to    : detail.toAddress,
        value : ethers.utils.parseEther(detail.amount),
      })
      alert("issued transaction " + tx.hash)
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }


  // initialize token contract
  const [contract, setContract] = useState({
    contract : undefined,
    name     : undefined,
    symbol   : undefined,
    balance  : undefined,
  })

  useEffect(() => {
    const contractAddress = "0xEd4a531962528CF84c95D8dc2e9FAD41c172dcb5"
    const contractAbi = Token.abi
    const tokenContract = new ethers.Contract(contractAddress, contractAbi, ethProvider.provider)
    setContract((prevState) => {
      if (tokenContract.provider) {
        return {
          ...prevState,
          contract : tokenContract,
        }
      }
    })
  }, [ethProvider])

  useEffect(() => {
    async function getContractInfo(contract) {
      if (!contract || !address) {return}
      if (!contract.contract) {return}

      const name    = await contract.contract.name()
      const symbol  = await contract.contract.symbol()
      const balance = await contract.contract.balanceOf(address)
      setContract((prevState) => {
        return {
          ...prevState,
          name    : name,
          symbol  : symbol,
          balance : ethers.utils.formatUnits(balance, 0),
        }
      })
    }
    getContractInfo(contract)
  }, [contract, address])

  const transferToken = async (detail) => {
    if (!ethProvider.signer) {return}
    
    try {
      const contractWithSigner = contract.contract.connect(ethProvider.signer)
      const tx = await contractWithSigner.transfer(detail.toAddress, detail.amount)
      console.log(tx)
      alert("issued transaction " + tx.hash)
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }


  return (
    <>
      {/* no wallet is installed */}
      {!window.ethereum &&
        <p>please install a wallet, like metamask</p>
      }

      {/* wallet installed but not connected you */}
      {window.ethereum && typeof address == "undefined" &&
        <ConnectButton
          onClick = {getAddress}
        />
      }

      {/* wallet is connected */}
      {address &&
        <>
          <h1>welcome</h1>

          <Wallet
            address = {address} />

          <Transfer
            onClick = {transferEther}
            name    = "Ethereum"
            symbol  = "ETH"
            balance = {balance} />

          <Transfer
            onClick = {transferToken}
            name    = {contract.name}
            symbol  = {contract.symbol}
            balance = {contract.balance} />
        </>
      }
    </>
  );
}

export default App;

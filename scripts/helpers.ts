import { Contract, ethers, Wallet } from "ethers";
import { CustomBallot, MyToken } from "../typechain";
import BallotFactory from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import TokenFactory from "../artifacts/contracts/MyToken.sol/MyToken.json";

export async function getTokenContract(tokenAdress: string, signer: Wallet) {
  return (await new Contract(tokenAdress, TokenFactory.abi, signer)) as MyToken;
}

export async function getBallotContract(ballotAdress: string, signer: Wallet) {
  return (await new Contract(
    ballotAdress,
    BallotFactory.abi,
    signer
  )) as CustomBallot;
}

export async function getSigner(wallet: ethers.Wallet) {
  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);
  console.log(`$signer: ${signer.address}`);
  const balance = Number(ethers.utils.formatEther(await signer.getBalance()));
  console.log(`balance: ${balance}`);
  return signer;
}

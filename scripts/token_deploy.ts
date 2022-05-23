import { ethers } from "ethers";
import TokenFactory from "../artifacts/contracts/MyToken.sol/MyToken.json";
import { MyToken } from "../typechain";
import { getSigner } from "./helpers";
import { EXPOSED_KEY } from "./key";
async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);

  const signer = await getSigner(wallet);
  const tokenFactory = await new ethers.ContractFactory(
    TokenFactory.abi,
    TokenFactory.bytecode,
    signer
  );
  const tokenContract: MyToken = (await tokenFactory.deploy()) as MyToken;
  console.log(`Waiting Confirmation`);
  const deployTx = await tokenContract.deployed();
  console.log(`deployed at: `, deployTx.address);
  console.log(`token total sypply: ${await tokenContract.totalSupply()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

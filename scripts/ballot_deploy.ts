import { ethers } from "ethers";
import BallotFactory from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { CustomBallot } from "../typechain";
import { getSigner } from "./helpers";
import { EXPOSED_KEY } from "./key";

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    1;
  }
  return bytes32Array;
}

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);

  const signer = await getSigner(wallet);

  if (process.argv.length < 3) {
    throw new Error("Token address missing");
  }
  const tokenAdress = process.argv[2];
  const ballotFactory = await new ethers.ContractFactory(
    BallotFactory.abi,
    BallotFactory.bytecode,
    signer
  );
  const ballotontract: CustomBallot = (await ballotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS),
    tokenAdress
  )) as CustomBallot;
  console.log(`Waiting Confirmation`);
  const deployTx = await ballotontract.deployed();
  console.log(`deployed at: `, deployTx.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

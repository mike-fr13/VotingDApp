import { BigNumber } from "ethers";

export interface Proposal {
  proposalId: BigNumber;
  proposalDescription: string;
  nbVote: BigNumber;
}

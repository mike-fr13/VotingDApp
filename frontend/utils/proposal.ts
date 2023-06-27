import { Proposal } from "@/types/Proposal";

export function getProposals(account, contract) : Promise<Proposal[]>  {
    let proposals = [];
  
    if (account && account.length !== 0) {
      const proposalsFilter = contract.filters.ProposalRegistered();
  
      return contract
      .queryFilter(proposalsFilter)
      .then((events) => {
        console.log("getProposals - events :", events);
        
        const promises = [];
  
          for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const proposalId = event.args.proposalId.toNumber();
  
            console.log("getProposals - proposalId :", proposalId);
            console.log("getProposals - account :", account);
  
            const promise = contract
              .connect(account)
              .getOneProposal(proposalId)
              .then((proposal) => ({
                proposalId: proposalId,
                proposalDescription: proposal.description,
                nbVote: proposal.voteCount,
              }));
  
            promises.push(promise);
          }
  
          return Promise.all(promises).then((result) => {
            console.log("getProposals - proposals :", result);
            proposals = result;
            return proposals;
          });
        })
        .catch((error) => {
          console.log("getProposals - Error:", error);
          return proposals;
        });
    }
  
    return proposals;
  }

  
  
  
  
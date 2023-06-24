/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Voting, VotingInterface } from "../Voting";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "ProposalRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "Voted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "voterAddress",
        type: "address",
      },
    ],
    name: "VoterRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum Voting.WorkflowStatus",
        name: "previousStatus",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum Voting.WorkflowStatus",
        name: "newStatus",
        type: "uint8",
      },
    ],
    name: "WorkflowStatusChange",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_desc",
        type: "string",
      },
    ],
    name: "addProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "addVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "endProposalsRegistering",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "endVotingSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getOneProposal",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
        ],
        internalType: "struct Voting.Proposal",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "getVoter",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "isRegistered",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "hasVoted",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "votedProposalId",
            type: "uint256",
          },
        ],
        internalType: "struct Voting.Voter",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "setVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startProposalsRegistering",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startVotingSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tallyVotes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "winningProposalID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "workflowStatus",
    outputs: [
      {
        internalType: "enum Voting.WorkflowStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061002d61002261003260201b60201c565b61003a60201b60201c565b6100fe565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b612237806200010e6000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c8063a7bfab1611610097578063d4f50f9811610066578063d4f50f98146101ee578063ee74c6781461021e578063f2fde38b14610228578063f4ab9adf14610244576100f5565b8063a7bfab16146101b2578063bdc01431146101bc578063c7038a4e146101da578063c88af42f146101e4576100f5565b8063715018a6116100d3578063715018a61461013c5780638da5cb5b14610146578063a1edffa214610164578063a2788cce14610182576100f5565b8063230796ae146100fa5780632fdae3c514610116578063378a217814610132575b600080fd5b610114600480360381019061010f91906114d7565b610260565b005b610130600480360381019061012b9190611569565b6105b7565b005b61013a610841565b005b610144610927565b005b61014e61093b565b60405161015b91906115f7565b60405180910390f35b61016c610964565b6040516101799190611689565b60405180910390f35b61019c600480360381019061019791906114d7565b610977565b6040516101a99190611789565b60405180910390f35b6101ba610ade565b005b6101c4610bc4565b6040516101d191906117ba565b60405180910390f35b6101e2610bca565b005b6101ec610d4c565b005b61020860048036038101906102039190611801565b610e31565b604051610215919061188b565b60405180910390f35b610226610f59565b005b610242600480360381019061023d9190611801565b61103f565b005b61025e60048036038101906102599190611801565b6110c2565b005b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900460ff166102ef576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e690611903565b60405180910390fd5b6003600581111561030357610302611612565b5b600260009054906101000a900460ff16600581111561032557610324611612565b5b14610365576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161035c90611995565b60405180910390fd5b60011515600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160019054906101000a900460ff161515036103fb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103f290611a01565b60405180910390fd5b6003805490508110610442576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161043990611a6d565b60405180910390fd5b80600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101819055506001600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160016101000a81548160ff021916908315150217905550600381815481106104f8576104f7611a8d565b5b9060005260206000209060020201600101600081548092919061051a90611aeb565b919050555060036001548154811061053557610534611a8d565b5b9060005260206000209060020201600101546003828154811061055b5761055a611a8d565b5b906000526020600020906002020160010154111561057b57806001819055505b7f4d99b957a2bc29a30ebd96a7be8e68fe50a3c701db28a91436490b7d53870ca433826040516105ac929190611b33565b60405180910390a150565b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900460ff16610646576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161063d90611903565b60405180910390fd5b6001600581111561065a57610659611612565b5b600260009054906101000a900460ff16600581111561067c5761067b611612565b5b146106bc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106b390611ba8565b60405180910390fd5b6040516020016106cb90611bee565b6040516020818303038152906040528051906020012082826040516020016106f4929190611c4a565b604051602081830303815290604052805190602001200361074a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161074190611ce0565b60405180910390fd5b6107526113b5565b82828080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050508160000181905250600381908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000190805190602001906107e79291906113cf565b506020820151816001015550507f92e393e9b54e2f801d3ea4beb0c5e71a21cc34a5d34b77d0fb8a3aa1650dc18f60016003805490506108279190611d00565b60405161083491906117ba565b60405180910390a1505050565b61084961126b565b6004600581111561085d5761085c611612565b5b600260009054906101000a900460ff16600581111561087f5761087e611612565b5b146108bf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108b690611da6565b60405180910390fd5b6005600260006101000a81548160ff021916908360058111156108e5576108e4611612565b5b02179055507f0a97a4ee45751e2abf3e4fc8946939630b11b371ea8ae39ccdc3056e98f5cc3f6004600560405161091d929190611dc6565b60405180910390a1565b61092f61126b565b61093960006112e9565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600260009054906101000a900460ff1681565b61097f6113b5565b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900460ff16610a0e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a0590611903565b60405180910390fd5b60038281548110610a2257610a21611a8d565b5b9060005260206000209060020201604051806040016040529081600082018054610a4b90611e1e565b80601f0160208091040260200160405190810160405280929190818152602001828054610a7790611e1e565b8015610ac45780601f10610a9957610100808354040283529160200191610ac4565b820191906000526020600020905b815481529060010190602001808311610aa757829003601f168201915b505050505081526020016001820154815250509050919050565b610ae661126b565b60036005811115610afa57610af9611612565b5b600260009054906101000a900460ff166005811115610b1c57610b1b611612565b5b14610b5c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b5390611995565b60405180910390fd5b6004600260006101000a81548160ff02191690836005811115610b8257610b81611612565b5b02179055507f0a97a4ee45751e2abf3e4fc8946939630b11b371ea8ae39ccdc3056e98f5cc3f60036004604051610bba929190611dc6565b60405180910390a1565b60015481565b610bd261126b565b60006005811115610be657610be5611612565b5b600260009054906101000a900460ff166005811115610c0857610c07611612565b5b14610c48576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c3f90611ec1565b60405180910390fd5b6001600260006101000a81548160ff02191690836005811115610c6e57610c6d611612565b5b0217905550610c7b6113b5565b6040518060400160405280600781526020017f47454e4553495300000000000000000000000000000000000000000000000000815250816000018190525060038190806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000019080519060200190610d019291906113cf565b506020820151816001015550507f0a97a4ee45751e2abf3e4fc8946939630b11b371ea8ae39ccdc3056e98f5cc3f60006001604051610d41929190611dc6565b60405180910390a150565b610d5461126b565b60016005811115610d6857610d67611612565b5b600260009054906101000a900460ff166005811115610d8a57610d89611612565b5b14610dca576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dc190611f53565b60405180910390fd5b60028060006101000a81548160ff02191690836005811115610def57610dee611612565b5b02179055507f0a97a4ee45751e2abf3e4fc8946939630b11b371ea8ae39ccdc3056e98f5cc3f60016002604051610e27929190611dc6565b60405180910390a1565b610e39611455565b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900460ff16610ec8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ebf90611903565b60405180910390fd5b600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206040518060600160405290816000820160009054906101000a900460ff161515151581526020016000820160019054906101000a900460ff161515151581526020016001820154815250509050919050565b610f6161126b565b60026005811115610f7557610f74611612565b5b600260009054906101000a900460ff166005811115610f9757610f96611612565b5b14610fd7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fce90611fe5565b60405180910390fd5b6003600260006101000a81548160ff02191690836005811115610ffd57610ffc611612565b5b02179055507f0a97a4ee45751e2abf3e4fc8946939630b11b371ea8ae39ccdc3056e98f5cc3f60026003604051611035929190611dc6565b60405180910390a1565b61104761126b565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036110b6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110ad90612077565b60405180910390fd5b6110bf816112e9565b50565b6110ca61126b565b600060058111156110de576110dd611612565b5b600260009054906101000a900460ff166005811115611100576110ff611612565b5b14611140576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161113790612109565b60405180910390fd5b60011515600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900460ff161515036111d6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111cd90612175565b60405180910390fd5b6001600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548160ff0219169083151502179055507fb6be2187d059cc2a55fe29e0e503b566e1e0f8c8780096e185429350acffd3dd8160405161126091906115f7565b60405180910390a150565b6112736113ad565b73ffffffffffffffffffffffffffffffffffffffff1661129161093b565b73ffffffffffffffffffffffffffffffffffffffff16146112e7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112de906121e1565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b604051806040016040528060608152602001600081525090565b8280546113db90611e1e565b90600052602060002090601f0160209004810192826113fd5760008555611444565b82601f1061141657805160ff1916838001178555611444565b82800160010185558215611444579182015b82811115611443578251825591602001919060010190611428565b5b509050611451919061147a565b5090565b6040518060600160405280600015158152602001600015158152602001600081525090565b5b8082111561149357600081600090555060010161147b565b5090565b600080fd5b600080fd5b6000819050919050565b6114b4816114a1565b81146114bf57600080fd5b50565b6000813590506114d1816114ab565b92915050565b6000602082840312156114ed576114ec611497565b5b60006114fb848285016114c2565b91505092915050565b600080fd5b600080fd5b600080fd5b60008083601f84011261152957611528611504565b5b8235905067ffffffffffffffff81111561154657611545611509565b5b6020830191508360018202830111156115625761156161150e565b5b9250929050565b600080602083850312156115805761157f611497565b5b600083013567ffffffffffffffff81111561159e5761159d61149c565b5b6115aa85828601611513565b92509250509250929050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006115e1826115b6565b9050919050565b6115f1816115d6565b82525050565b600060208201905061160c60008301846115e8565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b6006811061165257611651611612565b5b50565b600081905061166382611641565b919050565b600061167382611655565b9050919050565b61168381611668565b82525050565b600060208201905061169e600083018461167a565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156116de5780820151818401526020810190506116c3565b838111156116ed576000848401525b50505050565b6000601f19601f8301169050919050565b600061170f826116a4565b61171981856116af565b93506117298185602086016116c0565b611732816116f3565b840191505092915050565b611746816114a1565b82525050565b600060408301600083015184820360008601526117698282611704565b915050602083015161177e602086018261173d565b508091505092915050565b600060208201905081810360008301526117a3818461174c565b905092915050565b6117b4816114a1565b82525050565b60006020820190506117cf60008301846117ab565b92915050565b6117de816115d6565b81146117e957600080fd5b50565b6000813590506117fb816117d5565b92915050565b60006020828403121561181757611816611497565b5b6000611825848285016117ec565b91505092915050565b60008115159050919050565b6118438161182e565b82525050565b60608201600082015161185f600085018261183a565b506020820151611872602085018261183a565b506040820151611885604085018261173d565b50505050565b60006060820190506118a06000830184611849565b92915050565b600082825260208201905092915050565b7f596f75277265206e6f74206120766f7465720000000000000000000000000000600082015250565b60006118ed6012836118a6565b91506118f8826118b7565b602082019050919050565b6000602082019050818103600083015261191c816118e0565b9050919050565b7f566f74696e672073657373696f6e20686176656e74207374617274656420796560008201527f7400000000000000000000000000000000000000000000000000000000000000602082015250565b600061197f6021836118a6565b915061198a82611923565b604082019050919050565b600060208201905081810360008301526119ae81611972565b9050919050565b7f596f75206861766520616c726561647920766f74656400000000000000000000600082015250565b60006119eb6016836118a6565b91506119f6826119b5565b602082019050919050565b60006020820190508181036000830152611a1a816119de565b9050919050565b7f50726f706f73616c206e6f7420666f756e640000000000000000000000000000600082015250565b6000611a576012836118a6565b9150611a6282611a21565b602082019050919050565b60006020820190508181036000830152611a8681611a4a565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611af6826114a1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611b2857611b27611abc565b5b600182019050919050565b6000604082019050611b4860008301856115e8565b611b5560208301846117ab565b9392505050565b7f50726f706f73616c7320617265206e6f7420616c6c6f77656420796574000000600082015250565b6000611b92601d836118a6565b9150611b9d82611b5c565b602082019050919050565b60006020820190508181036000830152611bc181611b85565b9050919050565b50565b6000611bd86000836118a6565b9150611be382611bc8565b600082019050919050565b60006020820190508181036000830152611c0781611bcb565b9050919050565b82818337600083830152505050565b6000611c2983856118a6565b9350611c36838584611c0e565b611c3f836116f3565b840190509392505050565b60006020820190508181036000830152611c65818486611c1d565b90509392505050565b7f566f7573206e6520706f7576657a20706173206e65207269656e2070726f706f60008201527f7365720000000000000000000000000000000000000000000000000000000000602082015250565b6000611cca6023836118a6565b9150611cd582611c6e565b604082019050919050565b60006020820190508181036000830152611cf981611cbd565b9050919050565b6000611d0b826114a1565b9150611d16836114a1565b925082821015611d2957611d28611abc565b5b828203905092915050565b7f43757272656e7420737461747573206973206e6f7420766f74696e672073657360008201527f73696f6e20656e64656400000000000000000000000000000000000000000000602082015250565b6000611d90602a836118a6565b9150611d9b82611d34565b604082019050919050565b60006020820190508181036000830152611dbf81611d83565b9050919050565b6000604082019050611ddb600083018561167a565b611de8602083018461167a565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611e3657607f821691505b602082108103611e4957611e48611def565b5b50919050565b7f5265676973746572696e672070726f706f73616c732063616e7420626520737460008201527f6172746564206e6f770000000000000000000000000000000000000000000000602082015250565b6000611eab6029836118a6565b9150611eb682611e4f565b604082019050919050565b60006020820190508181036000830152611eda81611e9e565b9050919050565b7f5265676973746572696e672070726f706f73616c7320686176656e742073746160008201527f7274656420796574000000000000000000000000000000000000000000000000602082015250565b6000611f3d6028836118a6565b9150611f4882611ee1565b604082019050919050565b60006020820190508181036000830152611f6c81611f30565b9050919050565b7f5265676973746572696e672070726f706f73616c73207068617365206973206e60008201527f6f742066696e6973686564000000000000000000000000000000000000000000602082015250565b6000611fcf602b836118a6565b9150611fda82611f73565b604082019050919050565b60006020820190508181036000830152611ffe81611fc2565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b60006120616026836118a6565b915061206c82612005565b604082019050919050565b6000602082019050818103600083015261209081612054565b9050919050565b7f566f7465727320726567697374726174696f6e206973206e6f74206f70656e2060008201527f7965740000000000000000000000000000000000000000000000000000000000602082015250565b60006120f36023836118a6565b91506120fe82612097565b604082019050919050565b60006020820190508181036000830152612122816120e6565b9050919050565b7f416c726561647920726567697374657265640000000000000000000000000000600082015250565b600061215f6012836118a6565b915061216a82612129565b602082019050919050565b6000602082019050818103600083015261218e81612152565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006121cb6020836118a6565b91506121d682612195565b602082019050919050565b600060208201905081810360008301526121fa816121be565b905091905056fea26469706673582212207727a6f7618dd9d4a75ba340388a4b7f6555a25d699af3068fa4732b5d7a82fb64736f6c634300080d0033";

type VotingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VotingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Voting__factory extends ContractFactory {
  constructor(...args: VotingConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Voting> {
    return super.deploy(overrides || {}) as Promise<Voting>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Voting {
    return super.attach(address) as Voting;
  }
  override connect(signer: Signer): Voting__factory {
    return super.connect(signer) as Voting__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VotingInterface {
    return new utils.Interface(_abi) as VotingInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Voting {
    return new Contract(address, _abi, signerOrProvider) as Voting;
  }
}
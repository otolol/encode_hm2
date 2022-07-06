// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/// @title Custom Ballot Smart Contract
/// @author otolol
/// @notice For voting custom proposals
interface IERC20Votes {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract CustomBallot {
    /// @notice Voted event
    event Voted(
        address indexed voter,
        uint256 indexed proposal,
        uint256 weight,
        uint256 proposalVotes
    );

    /// @notice Proposal struct
    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    mapping(address => uint256) public spentVotePower;

    Proposal[] public proposals;
    IERC20Votes public voteToken;
    uint256 public referenceBlock;

    /// @notice constructor for customBallot contract
    /// @param proposalNames Array of proposals
    /// @param _voteToken address of vote token
    constructor(
        bytes32[] memory proposalNames,
        address _voteToken
    ) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
        voteToken = IERC20Votes(_voteToken);
        referenceBlock = block.number;
    }

    /// @notice vote proposal with give amount of votes
    /// @dev after vote is complited it fires `Voted` Event
    /// @param proposal The index of proposal
    /// @param amount The amount of votes(tokens) for specific proposal
    function vote(uint256 proposal, uint256 amount) external {
        uint256 votingPowerAvailable = votingPower();
        require(votingPowerAvailable >= amount, "Has not enough voting power");
        spentVotePower[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
        emit Voted(msg.sender, proposal, amount, proposals[proposal].voteCount);
    }

    /// @notice returns proposal with the most amount of votes
    /// @return winningProposal_ proposal with the most amount of votes
    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /// @notice returns winninng proposal name
    /// @return winnerName_ winning proposal name
    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    /// @notice returns if sender has enough votes for vote
    /// @return votingPowerAvailable has or no sender votes for vote
    function votingPower() public view returns (uint256) {
        uint256 votingPowerAvailable = voteToken.getPastVotes(
            msg.sender,
            referenceBlock
        ) - spentVotePower[msg.sender]; 
        return votingPowerAvailable;
    }
}
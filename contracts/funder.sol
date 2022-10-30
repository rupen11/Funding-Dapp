// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Funder {
    uint256 public noOfFunders;
    mapping(uint256 => address) private funders;

    receive() external payable {}

    function transfer() public payable {
        funders[noOfFunders] = msg.sender;
    }

    function withdraw(uint256 value) external {
        require(
            value <= 2000000000000000000,
            "Can not withdrae more than 2 Ether"
        );
        payable(msg.sender).transfer(value);
    }
}

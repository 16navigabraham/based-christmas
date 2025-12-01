// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChristmasCapPFP is Ownable {
    IERC20 public usdc;
    uint256 public constant PRICE = 100000; // 0.1 USDC (6 decimals)

    mapping(address => string) public userPFP;

    event PFPCapped(
        address indexed user,
        string originalImage,
        string cappedImage,
        uint256 timestamp
    );

    constructor(address _usdc) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
    }

    function addChristmasCap(
        string memory _originalImage,
        string memory _cappedImage
    ) external {
        require(
            usdc.transferFrom(msg.sender, address(this), PRICE),
            "Payment failed"
        );

        userPFP[msg.sender] = _cappedImage;

        emit PFPCapped(
            msg.sender,
            _originalImage,
            _cappedImage,
            block.timestamp
        );
    }

    function withdraw() external onlyOwner {
        uint256 bal = usdc.balanceOf(address(this));
        require(bal > 0, "No balance");
        usdc.transfer(owner(), bal);
    }
}

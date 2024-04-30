// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract PolPick is Ownable {

  struct BetGroup {
    uint256[] bets;
    address[] addresses;
    string[] avatars;
    string[] countries;
    string[] whiteLabelIds;
    uint256 total;
    uint256 distributedCount;
    uint256 totalDistributed;
  }

  struct Round {
    bool created;
    int32 startPrice;
    int32 endPrice;
    uint256 minBetAmount;
    uint256 maxBetAmount;
    uint256 poolBetsLimit;
    BetGroup upBetGroup;
    BetGroup downBetGroup;
    int64 roundStartTime;
    uint256 tradesStartTimeMS;
    uint256 tradesEndTimeMS;
  }

  struct Distribution {
    uint256 winnersFeeAmt;
    uint256 fee;
    uint256 feeJackpot;
    uint256 feeService;
    uint256 totalFees;
    uint256 remainWinAmt;
    uint256 remainingFeeAmt;
    uint256 pending;

  }

  address public gameController;
  mapping(bytes => Round) public pools;
  uint8 public feePercentage = 11;
  uint8 public feeJackpotPercentage = 1;
  uint8 public serviceFeePercentage = 1;
  address public feeAddress = msg.sender; //default fee address
  address public feeJackpotAddress = msg.sender; //default fee jackpot address
  address public serviceFeeAddress = msg.sender;
  bool public isRunning;
  bytes public notRunningReason;
  mapping(address => bool) private allowedContracts; //allowed contracts to place trades
  address[] private allowedContractsList;

  // Errors
  error PendingDistributions();

  // Events
  event RoundStarted(bytes poolId, int64 timestamp, int32 price, uint256 minTradeAmount, uint256 maxTradeAmount, uint256 poolTradesLimit, bytes indexed indexedPoolId);
  event RoundEnded(bytes poolId, int64 timestamp, int32 startPrice, int32 endPrice, bytes indexed indexedPoolId);
  event TradePlaced(bytes poolId, address sender, uint256 amount, string prediction, uint256 newTotal, bytes indexed indexedPoolId, address indexed indexedSender, string avatarUrl, string countryCode, int64 roundStartTime, string whiteLabelId);
  event TradeReturned(bytes poolId, address sender, uint256 amount, string whiteLabelId);
  event GameStopped(bytes reason);
  event GameStarted();
  event RoundDistributed(bytes poolId, uint totalWinners, uint from, uint to, int64 timestamp);
  event TradeWinningsSent(bytes poolId, address sender, uint256 tradeAmount, uint256 winningsAmount, address indexed indexedSender, string whiteLabelId, uint8 feePercentage, uint8 feeJackpotPercentage);

  // Modifiers
 modifier onlyOpenPool (bytes calldata poolId) {
    require(isPoolOpen(poolId), 'This pool has a round in progress');
    _;
  }

  modifier onlyGameController () {
    require(msg.sender == gameController, 'Only game controller can do this');
    _;
  }

  modifier onlyGameRunning () {
    require(isRunning, 'The game is not running');
    _;
  }

  modifier onlyPoolExists (bytes calldata poolId) {
    require(pools[poolId].created, 'Pool does not exist');
    _;
  }

  constructor(address newGameController) Ownable(newGameController) {
    gameController = newGameController;
  }

  function startGame() public onlyOwner {
    isRunning = true;
    notRunningReason = '';
    emit GameStarted();
  }

    function stopGame(bytes calldata reason) public onlyOwner {
    isRunning = false;
    notRunningReason = reason;
    emit GameStopped(reason);
  }

  function createPool(bytes calldata poolId, uint256 minBetAmount , uint256 maxBetAmount, uint256 poolBetsLimit) public onlyGameController {
    pools[poolId].created = true;
    pools[poolId].minBetAmount = minBetAmount;
    pools[poolId].maxBetAmount = maxBetAmount;
    pools[poolId].poolBetsLimit = poolBetsLimit;
  }

  function isPoolOpen(
    bytes calldata poolId
  ) public view returns (bool) {
    bool a = pools[poolId].startPrice == 0;
    return a;
  }

  function trigger(
    bytes calldata poolId,
    int64 timeMS,
    uint256 tradesStartTimeMS,
    uint256 tradesEndTimeMS,
    int32 price,
    uint32 batchSize
  ) public onlyGameController onlyPoolExists(poolId) {
    Round storage currentRound = pools[poolId];

    if(isPoolOpen(poolId)) { 
      require(isRunning, 'The game is not running, rounds can only be ended at this point');
      currentRound.startPrice = price;
    
      currentRound.roundStartTime = timeMS;
      currentRound.tradesStartTimeMS = tradesStartTimeMS;
      currentRound.tradesEndTimeMS = tradesEndTimeMS;
      
      emit RoundStarted(poolId, timeMS, currentRound.startPrice, currentRound.minBetAmount, currentRound.maxBetAmount, currentRound.poolBetsLimit, poolId);
    } else if (currentRound.endPrice == 0) {
      currentRound.endPrice = price;

      emit RoundEnded(poolId, timeMS, currentRound.startPrice, currentRound.endPrice, poolId);

      distribute(poolId, batchSize, timeMS);
    } else {
      revert PendingDistributions();
    }
  }

  function distribute (
    bytes calldata poolId,
    uint32 batchSize,
    int64 timeMS
  ) public onlyGameController onlyPoolExists(poolId) {
    Round storage round = pools[poolId];

    if (round.upBetGroup.bets.length == 0 || round.downBetGroup.bets.length == 0 || (round.startPrice == round.endPrice)) 
    {
         
      if (round.startPrice == round.endPrice){ //In case of TIE return the investments to both sides
        BetGroup storage returnGroupUp = round.upBetGroup;
        BetGroup storage returnGroupDown = round.downBetGroup;

        uint fromReturnUp = returnGroupUp.distributedCount;
        uint fromReturnDown = returnGroupDown.distributedCount;

        returnBets(poolId, returnGroupUp, batchSize);
        returnBets(poolId, returnGroupDown, batchSize);

        emit RoundDistributed(poolId, returnGroupUp.bets.length, fromReturnUp, returnGroupUp.distributedCount,timeMS);
        emit RoundDistributed(poolId, returnGroupDown.bets.length, fromReturnDown, returnGroupDown.distributedCount,timeMS);

        if (returnGroupUp.distributedCount == returnGroupUp.bets.length && returnGroupDown.distributedCount == returnGroupDown.bets.length) {
          clearPool(poolId);
        }

      }else{
        BetGroup storage returnGroup = round.downBetGroup.bets.length == 0 ? round.upBetGroup : round.downBetGroup;
         
        uint fromReturn = returnGroup.distributedCount;
        returnBets(poolId, returnGroup, batchSize);
        emit RoundDistributed(poolId, returnGroup.bets.length, fromReturn, returnGroup.distributedCount,timeMS);

        if (returnGroup.distributedCount == returnGroup.bets.length) {
          clearPool(poolId);
        }
      }
 
      return;
    }
    
    BetGroup storage winners = round.downBetGroup;
    BetGroup storage losers = round.upBetGroup;

    if (round.startPrice < round.endPrice) {
      winners = round.upBetGroup;
      losers = round.downBetGroup;
    }

    Distribution memory dist = calculateDistribution(winners, losers);
    uint256 limit = dist.pending > batchSize ? batchSize : dist.pending;
    uint256 to = winners.distributedCount + limit;

    for (uint i = winners.distributedCount; i < to; i++) {
      uint256 winnings = (winners.bets[i] * dist.totalFees * 100 / winners.total  / 100);
      sendEther(winners.addresses[i], winnings + (winners.bets[i] - (winners.bets[i] * feePercentage /100)));
      emit TradeWinningsSent(poolId, winners.addresses[i], winners.bets[i], winnings, winners.addresses[i], winners.whiteLabelIds[i],feePercentage,feeJackpotPercentage);
      winners.totalDistributed = winners.totalDistributed + winnings;
    }

    emit RoundDistributed(poolId, winners.bets.length, winners.distributedCount, to, timeMS);

    winners.distributedCount = to;
    if (winners.distributedCount == winners.bets.length) {
      sendEther(feeAddress, dist.remainingFeeAmt);
      sendEther(feeJackpotAddress, dist.feeJackpot);
      sendEther(serviceFeeAddress, dist.feeService);
      //Send leftovers to fee address
      sendEther(feeAddress,getContractBalance());

      clearPool(poolId);
    }
  }

  function calculateDistribution (
    BetGroup storage winners,
    BetGroup storage losers
) private view returns (Distribution memory) {
    
    uint256 feeAmt = ((winners.total + losers.total) * feePercentage) / 100;
    uint256 jackpotFeeAmount = (feeAmt * feeJackpotPercentage) / 100;
    uint256 serviceFeeAmount = (feeAmt * serviceFeePercentage) / 100;
    uint256 remainingFeeAmt = feeAmt - (jackpotFeeAmount + serviceFeeAmount);
    uint256 remainLoserAmt = losers.total - ((losers.total * feePercentage) / 100);
    uint256 remainWinnersAmt = winners.total - ((winners.total * feePercentage) / 100);
    uint256 pending = winners.bets.length - winners.distributedCount;


    return Distribution({
        winnersFeeAmt: (winners.total * feePercentage) / 100,
        fee: feeAmt,
        feeJackpot: jackpotFeeAmount,
        feeService: serviceFeeAmount,
        totalFees: remainLoserAmt,
        remainWinAmt: remainWinnersAmt,
        remainingFeeAmt: remainingFeeAmt,
        pending: pending
    });

}

  function clearPool (
    bytes calldata poolId
  ) private {
    delete pools[poolId].upBetGroup;
    delete pools[poolId].downBetGroup;
    delete pools[poolId].startPrice;
    delete pools[poolId].endPrice;
  }

  function hasPendingDistributions(
    bytes calldata poolId
  ) public view returns (bool) {
    return (pools[poolId].upBetGroup.bets.length + pools[poolId].downBetGroup.bets.length) > 0;
  }

   function returnBets (
    bytes calldata poolId,
    BetGroup storage group,
    uint32 batchSize
  ) private {
    uint256 pending = group.bets.length - group.distributedCount;
    uint256 limit = pending > batchSize ? batchSize : pending;
    uint256 to = group.distributedCount + limit;

    for (uint i = group.distributedCount; i < to; i ++) {
      sendEther(group.addresses[i], group.bets[i]);
      emit TradeReturned(poolId, group.addresses[i], group.bets[i], group.whiteLabelIds[i]);
    }
    group.distributedCount = to;
  }


  struct makeTradeStruct{
    bytes poolId;
    string avatarUrl;
    string countryCode;
    bool upOrDown;
    string whiteLabelId;
  }

  struct userDataStruct{
      string avatar;
      string countryCode;
      string whiteLabelId;
      int64 roundStartTime;
    }

 function addBet (
    BetGroup storage betGroup,
    uint256 amount,
    string calldata avatar,
    string calldata countryCode,
    string calldata whiteLabelId
  ) private returns (uint256) {
    betGroup.bets.push(amount);
    betGroup.addresses.push(msg.sender);
    betGroup.avatars.push(avatar);
    betGroup.countries.push(countryCode);
    betGroup.whiteLabelIds.push(whiteLabelId);
    betGroup.total += amount;
    return betGroup.total;
  }

  function makeTrade(
    makeTradeStruct calldata userTrade
  ) public payable onlyOpenPool(userTrade.poolId) onlyGameRunning onlyPoolExists(userTrade.poolId) {
    require(isEOA(msg.sender) || allowedContracts[msg.sender], "Caller must be EOA or allowed contract");
    require(msg.value > 0, "Msg.value must be greater than zero");
    require(msg.value >= pools[userTrade.poolId].minBetAmount, "Trade amount should be higher than the minimum");
    require(msg.value <= pools[userTrade.poolId].maxBetAmount, "Trade amount should be lower than the maximum");
    //Prevent making trade while end round transaction being confirmed on blockchain
    require(block.timestamp <= pools[userTrade.poolId].tradesEndTimeMS , "Round closed");

    //Prevent making trade while round starts
    require(block.timestamp >= pools[userTrade.poolId].tradesStartTimeMS , "Round not started yet");

    uint256 newTotal;

    if (userTrade.upOrDown) {
      require(pools[userTrade.poolId].upBetGroup.bets.length <= pools[userTrade.poolId].poolBetsLimit-1,"Pool is full, wait for next round");
      newTotal = addBet(pools[userTrade.poolId].upBetGroup, msg.value, userTrade.avatarUrl, userTrade.countryCode, userTrade.whiteLabelId);

    } else {
      require(pools[userTrade.poolId].downBetGroup.bets.length <= pools[userTrade.poolId].poolBetsLimit-1,"Pool is full, wait for next round");
      newTotal = addBet(pools[userTrade.poolId].downBetGroup, msg.value, userTrade.avatarUrl, userTrade.countryCode, userTrade.whiteLabelId);
    
    }

    userDataStruct memory userTradeData;
    userTradeData.avatar = userTrade.avatarUrl;
    userTradeData.countryCode = userTrade.countryCode;
    userTradeData.whiteLabelId = userTrade.whiteLabelId;
    userTradeData.roundStartTime = pools[userTrade.poolId].roundStartTime;
    
    emit TradePlaced(userTrade.poolId, msg.sender, msg.value, (userTrade.upOrDown) ? "UP":"DOWN", newTotal, 
    userTrade.poolId, msg.sender, userTradeData.avatar, userTradeData.countryCode, 
    userTradeData.roundStartTime, userTradeData.whiteLabelId);
  }

  function sendEther (
    address to, 
    uint256 amount
  ) private {
    (bool sent, bytes memory data) = payable(to).call{gas: 0, value: amount}("");
    require(sent, "Couldn't send ether");
  }

   function getContractBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function isEOA(address _addr) private view returns (bool) {
      // Checks if the caller is an EOA
      return _addr == tx.origin;
  }
     // Methods
  function changeGameControllerAddress(address newGameControllerAddress) public onlyOwner  {
    gameController = newGameControllerAddress;
  }

  function changeGameFeePercentage(uint8 newFeePercentage) public onlyOwner {
    require (newFeePercentage <=100 , "Wrong fee percentage value");
    feePercentage = newFeePercentage;
  }
   function changeGameFeeAddress(address newFeeAddress) public onlyOwner {
   feeAddress = newFeeAddress;
  }

  function changeGameFeeJackpotPercentage(uint8 newFeeJackpotPercentage) public onlyOwner {
    require (newFeeJackpotPercentage <=100 , "Wrong jackpot fee percentage value");
    feeJackpotPercentage = newFeeJackpotPercentage;
  }

  function changeGameFeeJackpotAddress(address newFeeJackpotAddress) public onlyOwner {
      feeJackpotAddress = newFeeJackpotAddress;
  }

  function changeGameServiceFeeAddress(address newServiceFeeAddress) public onlyOwner {
      serviceFeeAddress = newServiceFeeAddress;
  }

   function changeGameServicePercentage(uint8 newFeeServicePercentage) public onlyOwner {
    require (newFeeServicePercentage <=100 , "Wrong Service fee percentage value");
    serviceFeePercentage = newFeeServicePercentage;
  }

  function allowContract(address _contract) public onlyOwner {
      if (!allowedContracts[_contract]) {
          allowedContracts[_contract] = true;
          allowedContractsList.push(_contract);
      }
  }

  function removeContract(address _contract) public onlyOwner {
      if (allowedContracts[_contract]) {
          allowedContracts[_contract] = false;
          // Remove the contract from the allowedContractsList
          for (uint i = 0; i < allowedContractsList.length; i++) {
              if (allowedContractsList[i] == _contract) {
                  allowedContractsList[i] = allowedContractsList[allowedContractsList.length - 1];
                  allowedContractsList.pop();
                  break;
              }
          }
      }
  }

  function getAllowedContracts() public view returns (address[] memory) {
      return allowedContractsList;
  }

}
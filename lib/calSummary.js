'use strict';

// return the summary fields

var getMedian = function (values) {
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if(values.length % 2)
        return values[half].toFixed(2);
    else
        return ((values[half-1] + values[half])/2).toFixed(2);
}

var exports = module.exports = {};
exports.calSummary = function(items){
  var executed = {
    total: 0,
    avgSave: 0,
    highestSave: 0,
    highestSave: 0,
    highestAmtSave: 0,
    avgAmtSave: 0,
    medAmtSave: 0,
    maxPrice: 0,
    minPrice: Number.MAX_SAFE_INTEGER,
    avgPrice:0,
    medPrice: 0,
    avgAmt: 0,
    medAmt: 0,
  },
  open = {
    total: 0,
    avgDisReq: 0,
    maxDisReq: 0,
    minDisReq: Number.MAX_SAFE_INTEGER,
    medDisReq: 0,
    avgBidAmt: 0,
    maxBidAmt: 0,
    minBidAmt: Number.MAX_SAFE_INTEGER,
    medBidAmt: 0,
  };


  var sumSavePercent = 0,
      sumPrice = 0,
      sumAmt = 0,
      sumAmtSave = 0,
      priceList = [],
      amtList = [],
      amtSaveList = [];
  var sumDisReq = 0,
      sumBidAmt = 0,
      disReqList = [],
      bidAmtList = [];
  for (var i in items) {
    //Excluding the at-price bid
    if (items[i].originalPrice == items[i].strikePrice) continue;
    if (items[i].status === 'executed' || items[i].status === 'executedArchived') {
      let savePercent = ((items[i].originalPrice - items[i].executionPrice)/items[i].originalPrice * 100);
      sumSavePercent = sumSavePercent + savePercent;
      executed.highestSave = Math.max(executed.highestSave, savePercent);

      //executed price
      let exPrice = items[i].executionPrice;
      priceList.push(exPrice);
      sumPrice = sumPrice + exPrice;
      executed.maxPrice = Math.max(executed.maxPrice,exPrice);
      executed.minPrice = Math.min(executed.minPrice,exPrice);
      //bid amount
      let amt = (items[i].strikePrice * items[i].quantity);
      amtList.push(amt);
      sumAmt = sumAmt + amt;
      //amount saved
      let amtSave = (items[i].originalPrice - items[i].executionPrice) * items[i].quantity;
      amtSaveList.push(amtSave);
      sumAmtSave = sumAmtSave + amtSave;
      executed.highestAmtSave = Math.max(executed.highestAmtSave, amtSave);

      executed.total++;
    }
    else if (items[i].status === 'open') {
      let disReq = ((items[i].originalPrice - items[i].strikePrice)/items[i].originalPrice * 100);
      disReqList.push(disReq);
      sumDisReq = sumDisReq + disReq;
      open.maxDisReq = Math.max(open.maxDisReq, disReq);
      open.minDisReq = Math.min(open.minDisReq, disReq);

      let bidAmt = (items[i].strikePrice * items[i].quantity);
      bidAmtList.push(bidAmt);
      sumBidAmt = sumBidAmt + bidAmt;
      open.maxBidAmt = Math.max(open.maxBidAmt, bidAmt);
      open.minBidAmt = Math.min(open.minBidAmt, bidAmt);


      open.total++;
    }
  }
  if (executed.total !== 0) {
    executed.highestSave = executed.highestSave.toFixed(2);
    executed.maxPrice = executed.maxPrice.toFixed(2);
    executed.minPrice = executed.minPrice.toFixed(2);
    executed.highestAmtSave = executed.highestAmtSave.toFixed(2);
    executed.avgSave = (sumSavePercent/executed.total).toFixed(2);
    executed.avgPrice = (sumPrice/executed.total).toFixed(2);
    executed.avgAmt = (sumAmt/executed.total).toFixed(2);
    executed.avgAmtSave = (sumAmtSave/executed.total).toFixed(2);
    executed.medPrice = getMedian(priceList);
    executed.medAmt = getMedian(amtList);
    executed.medAmtSave = getMedian(amtSaveList);
  }
  if (open.total !== 0) {
    open.maxDisReq = open.maxDisReq.toFixed(2);
    open.minDisReq = open.minDisReq.toFixed(2);
    open.maxBidAmt = open.maxBidAmt.toFixed(2);
    open.minBidAmt = open.minBidAmt.toFixed(2);
    open.avgDisReq = (sumDisReq/open.total).toFixed(2);
    open.avgBidAmt = (sumBidAmt/open.total).toFixed(2);
    open.medDisReq = getMedian(disReqList);
    open.medBidAmt = getMedian(bidAmtList);
  }
  return {'executed': executed,'open': open};
};

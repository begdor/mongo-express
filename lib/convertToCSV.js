'use strict';

var exports = module.exports = {};
exports.convertToCSV = function(objArray){
  var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  var line = '';
  var index = [];
  var count = 0;
  for (let prop in array[0]) {
    index[count] = prop;
    if (line !== '') line += ',';
    line += prop;
    count++;
  }
  str += line + '\r\n';

  for (let i = 0; i < array.length; i++) {
    line = '';
    for (let j = 0; j < index.length; j++) {
      if (line !== '') line += ',';
      if (typeof array[i][index[j]] === undefined ) line += ',';
      else line += array[i][index[j]];
    }
    str += line + '\r\n';
  }
  return str;
};

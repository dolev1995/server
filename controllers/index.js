'use strict';
const mongoose = require('mongoose'),
   // xlsx = require('node-xlsx'),
    fs = require('fs')
  //  q = require('q')
//const avgFunc = require('./user')
exports.default_add = (model, data) => {
    let b=5;
    let newItem = new model(data);
    return newItem.save();
}

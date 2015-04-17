var Table = require("./lib/db").db;

var table = new Table();

table.createIndex("username");
table.createIndex("status");

for (var i = 0; i < 100; i++) {
  table.insert({
    "username": "user" + i,
    "name": "The User #" + i,
    "status": i % 10 === 0 ? 'online' : 'offline'
  })
}

var record = table.findById(1)
console.log("record for id 1: ");
console.log(record);

console.time("findBy username");
var records = table.findBy('username', "user98");
console.timeEnd("findBy username");
console.log(records);

console.time("findBy status");
var records = table.findBy('status', "online");
console.timeEnd("findBy status");
console.log("Length");
console.log('Found', records.length, 'records');

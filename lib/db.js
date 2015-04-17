var BTree = require('./btree').BTree

function db() {
  this.records = [
  ]
  this.indexes = {

   }
}
exports.db = db

db.prototype.insert = function(values) {
  this.records.push(values)

  var id = this.records.length;

  // Update the indexes
  var self = this;
  Object.keys(this.indexes).forEach(function(attribute) {
    self.updateIndex(attribute, values[attribute], id)
  })

  return id;
}

db.prototype.findById = function(id) {
  return this.records[id - 1];
}

db.prototype.findBy = function(attribute, value) {

  var index = this.indexes[attribute];

  if (index) {
    var ids = index.search(value) || []
    var self = this;
    return ids.map(function(id) { return self.findById(id) })

  } else {
    return this.records.filter(function(record) {
      return record[attribute] === value;
    })

  }
}

db.prototype.createIndex = function(attribute) {
  this.indexes[attribute] = new BTree();
}

db.prototype.updateIndex = function(attribute, value, id) {
  var index = this.indexes[attribute];

  var ids = index.search(value);

  if (!ids) {
    ids = [];
    index.insert(value, ids);
  }

  ids.push(id);
}

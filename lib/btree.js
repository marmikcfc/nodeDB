function BTree() {
  this.root = new Node()
}
exports.BTree = BTree

// minimization factor t=2
BTree.degree = 2

BTree.prototype.search = function(key) {
  return this.root.search(key)
}

BTree.prototype.insert = function(key, value) {
  // Always split the root if it's full
  if (this.root.isFull()) {
    var oldRoot = this.root
    this.root = new Node()
    this.root.children.push(oldRoot)
    this.root.split(0)
  }

  this.root.insert(key, value)
}

BTree.prototype.inspect = function() {
  return this.root.inspect()
}


function Node() {
  this.children = []
  this.keys = []
  this.values = []
}

Node.prototype.search = function(key) {
  var i = 0

  // Advance up to the position where the key might be
  while (key > this.keys[i]) i++

  // now i is the least index in the key array such that
	// key <= keys[i], so key will be found here or
	// in the i'th child

  if (key === this.keys[i]) {
    return this.values[i]
  } else if (this.isLeaf()) {
    return
  }

  return this.children[i].search(key)
}

Node.prototype.isFull = function() {
  return this.keys.length >= 2 * BTree.degree - 1
}

Node.prototype.isLeaf = function() {
  return this.children.length === 0
}

Node.prototype.insert = function(key, value) {
  // Find where the new key belongs.
  var i = 0
  while (key > this.keys[i]) i++

  if (this.isLeaf()) {
    // shift everything over to the "right" up to the
    // point where the new key should go
    this.keys.splice(i, 0, key)
    this.values.splice(i, 0, value)

  } else {
    var child = this.children[i]

    if (child.isFull()) {
      this.split(i)
    }

    child.insert(key, value)
  }
}

// Split the `i`th child node (`splitChild`) in the middle.

Node.prototype.split = function(i) {
  // Full node has 2*degree - 1. Thus, middle item of a full node is at degree - 1.
  var middle = BTree.degree - 1

  var splitChild = this.children[i]
  var newChild = new Node()

  // Move over the right half into the new node.
  newChild.keys = splitChild.keys.splice(middle + 1)
  newChild.values = splitChild.values.splice(middle + 1)
  newChild.children = splitChild.children.splice(middle + 1)

  // Insert newChild right next to splitChild (i).
  this.children.splice(i + 1, 0, newChild)

  // Bring the middle key in the parent
  this.keys.splice(i, 0, splitChild.keys[middle])
  this.values.splice(i, 0, splitChild.values[middle])

  // Remove the middle key
  splitChild.keys.splice(middle)
  splitChild.values.splice(middle)
}

Node.prototype.inspect = function(indent) {
  indent = indent || ""
  var out = indent + this.keys.join(', ')
  this.children.forEach(function(child, i) {
    out += "\n" + child.inspect(indent + "  ")
  })
  return out
}

var _ = require("./underscore/underscore.js");

var associate = require("./associate");
var array = [{x:"a"},{x:"b"},{x:"c"}];

console.log("////testing associating\n");

var output = associate.associate(array),
    value;
console.log("output:", output);

value = associate.associate(_.first(array, 2), _.first(output, 2))
value.push(output[2]);
output = value;
console.log("output:", output);

value = associate.associate(_.first(array, 2), _.first(output, 2))
value.push(output[2]);
output = value;
console.log("output:", output);

value = associate.associate(_.last(array, 2), _.last(output, 2))
value.unshift(output[0]);
output = value;
console.log("output:", output);

console.log("\n\n//////testing getting associates (broken)\n");

var combined = _.map(array, function(object, index) {
  object.assoc = output[index];
  return object;
});
console.log("output (3): ", associate.getAssociates(3, combined, {
  transformer: function(object) {
    return object.assoc;
  }
}));

console.log("output (5): ", associate.getAssociates(5, combined, {
  transformer: function(object) {
    return object.assoc;
  }
}));

console.log("output (7): ", associate.getAssociates(7, combined, {
  transformer: function(object) {
    return object.assoc;
  }
}));

console.log("output (11): ", associate.getAssociates(11, combined, {
  transformer: function(object) {
    return object.assoc;
  }
}));

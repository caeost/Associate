var _ = require("./underscore/underscore.js");

var associate = require("./associate");
var array = [{x:"a"},{x:"b"},{x:"c"}];

var output = associate.associate(array);
console.log("output:" + output);

output = associate.associate(_.first(array, 2), output)
console.log("output:" + output);

output = associate.associate(_.first(array, 2), output)
console.log("output:" + output);

output = associate.associate(_.last(array, 2), output)
console.log("output:" + output);

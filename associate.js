var _ = require("./underscore/underscore.js");

var currentPrimes = [];
    currentPrimes[2] = 0;

var list = [];
var size = 0;
var threshold = .8;

var getSubPrimes = function(number) {
    //operates on the algorithm whereby for all currently existing primes starting from 2 we divide as many times as
    //we can per prime and keep track of these in order to return a list of primes and their number of occurences
    return _.reduce(currentPrimes, function(memo, occurence, prime){
        if(occurence !== void 0) {
          var count = 0, breaker = true;
          while(breaker){
              var temp = number / prime;
              if(temp % 1 === 0){
                  number = temp;
                  count++;
              } else {
                  breaker = false;
              }
          }
          if(count > 0) memo[prime] = count;
        }
        return memo;
    },[]);
};

exports.getSubPrimes = getSubPrimes;

//very referentially unpure
var createNewPrime = function() {
    //if necessary create a new larger prime to deal with new set, cache all primes for speed
    // current prime number
    var dumb = {}, 
        prime = currentPrimes.length;

    // return true if NUM is prime
    var isPrime = function(num) {
        var x, result = true, sqrt;
        if (num % 2 === 0) {
            return false;
        } else {
            sqrt = Math.sqrt(num);
            for (x = 3; x <= sqrt; x += 2) {
                result = num % x !== 0;
            }
            return result;
        }
    };

    while (!isPrime(prime)) {
        prime++;
    }

    currentPrimes[prime] = 0;
    return prime;
};

//lifted and slightly modified from underscore
var intersection = function(array) {
    var rest = _.rest(array);
        array = _.first(array);

    return _.map(array, function(val, index) {
        var runningTotal = _.reduce(rest, function(memo, other) {
          return memo += (other[index] || 0);
        }, 0);
        return runningTotal || void 0;
    });
};

//maybe optimize by applying math.max to array and seeing if the max is truthy?
var allUndefined = function(array) {
  return _.all(array, function(val) {
    return val === void 0;
  });
};

exports.associate =  function(array, existingArray, hardness)  {
    //given array of numbers tests them for already existant common subprimes, amplifying those subprimes if existant
    //if not generates a whole new subprime to assign to the set, subprimes assigned or amplified MUST serve to
    //differntiate the set. Hardness is optional and allows external setting of how much linkage should be created
    var totalSubs = [];

    //seperate from getting confused with hardness better
    if(!_.isArray(existingArray)) {
      existingArray = [];
    } else {
      totalSubs = getSubPrimes(existingArray[0]);
    }

    hardness || (hardness = 1)

    _.each(_.rest(array), function(object, key){
        var number = existingArray[key + 1];
        if(number) {
          var subs = getSubPrimes(number);
          totalSubs = findPrimeIntersection(totalSubs, getSubPrimes(number));
        }
    });


    if(!allUndefined(totalSubs)) {
      var percentCurrentTotal = array.length / size;

      totalSubs = _.map(totalSubs, function(occurence, prime) {
        //hows this work again??
        var percentPrimeTotal = currentPrimes[prime] / size;
        var difference = percentCurrentTotal / percentPrimeTotal;
        if(difference > threshold) {
          return 1;
        } else {
          return void 0;
        }
      });
    }


    if(!allUndefined(totalSubs)) {
      hardness = _.reduce(totalSubs, function(memo, occurence, prime){
        if(occurence) {
          return memo * prime;
        } else {
          return memo;
        }
      }, hardness);
    } else {
        var newPrime = createNewPrime();
        hardness *= newPrime;
        currentPrimes[newPrime] = array.length;
        var newObjects = array.length - existingArray.length;
        size += newObjects > 0 ? newObjects : 0;
    }

    return _.map(array, function(_, key){
              return (existingArray[key] || 1) * hardness;
            });
};

var findPrimeIntersection = function(array1, array2) {
  var result = [];
  for(var i = 0, length = array1.length; i < length; i++) {
    if(array1[i] && array2[i]) {
      result[i] = array1[i];
    }
  }
  return result;
};

//make this better later...
var combinePrimeArrays = function(array1, array2) {
  var result = [];
  for(var i = 0, length = array1.length; i < length; i++) {
    result[i] = array1[i];
  }
  for(var i = 0, length = array2.length; i < length; i++) {
    if(result[i]) {
      result[i] += array2[i];
    } else {
      result[i] = array2[i];
    }
  }

  return result;

};

//in progress
exports.getAssociates = function(primal, array, options) {
    //given a single associative prime or a list of primes and a list (can be list of one) fetches associated numbers, either disjunct or conjunct with a certain feather
    options = options || {};
    //unused
    var feather = options.feather,
        totalSubs,
        results = [];

    if(!_.isArray(primal)) {
      var temp = [];
      temp.push(primal);
      primal = temp;
    }

    //this is all messed up cant just push on
    totalSubs = _.reduce(primal, function(memo, number){
        memo = combinePrimeArrays(memo, getSubPrimes(number));
        return memo;
    }, []);

    //does this solve duplications? might
    //if(options.junctness === "disjunct" ) {
    //    totalSubs = _.union(totalSubs);
    //} else {
    //    totalSubs = intersection(totalSubs);
    //}
    
    var numberFunction = options.transformer || _.identity;

    _.each(array, function(object) {
      var objectPrimes = getSubPrimes(numberFunction(object));

      var common = findPrimeIntersection(objectPrimes, totalSubs);
      //rough... but it's ready
      var totalValue = _.reduce(common, function(memo, number) {
        return memo + number;
      }, 0);
      if(totalValue) results.push({value: totalValue, object: object});
    });

    results.sort(function(a, b) {
      return b.value - a.value
    });

    return results;
};

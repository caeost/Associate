var __ = require("./underscore/underscore.js");

var currentPrimes = [];
    currentPrimes[2] = 0;

var list = [];
var size = 0;
var threshold = 0;

exports.getSubPrimes = function(number) {
    //operates on the algorithm whereby for all currently existing primes starting from 2 we divide as many times as
    //we can per prime and keep track of these in order to return a list of primes and their number of occurences
    return __.map(currentPrimes, function(occurence, prime){
        if(occurence !== undefined) {
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
          if(count > 0) return count;
        }
        return undefined;
    });
};



exports.createNewPrime = function() {
    //if necessary create a new larger prime to deal with new set, cache all primes for speed
    // current prime number
    var dumb = {}, 
        prime = currentPrimes.length - 1;
    console.log(prime);

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

    prime++;
    while (!isPrime(prime)) {
        prime++;
    }

    currentPrimes[prime] = 0;
    return prime;
};

//lifted and slightly modified from underscore
var intersection = function(array) {
    var rest = __.rest(array);
    array = __.first(array);
    return __.map(array, function(val, index) {
        var runningTotal = 0;
        __.each(rest, function(other) {
          runningTotal += other[index];
        });
        if(runningTotal) {
          return runningTotal;
        }
        return undefined;
    });
};

var allUndefined = function(array) {
  return __.all(array, function(val) {
    return val === undefined;
  });
};

exports.associate =  function(array, hardness)  {
    //given array of numbers tests them for already existant common subprimes, amplifying those subprimes if existant
    //if not generates a whole new subprime to assign to the set, subprimes assigned or amplified MUST serve to
    //differntiate the set. Hardness is optional and allows external setting of how much linkage should be created
    var totalSubs = [], mult = hardness || 1;

    __.each(array, function(object){
        var number = object.ass || 1;
        if(!object.ass) {
          size++;
          return;
        }
        totalSubs.push(getSubPrimes(number));
    });

    totalSubs = intersection(totalSubs);

    totalSubs = __.map(totalSubs, function(occurence, prime) {
      var percentPrimeTotal = currentPrimes[prime];
      var percentCurrentTotal = size / array.length;
      var difference = percentPrimeTotal / percentCurrentTotal;
      if(difference < threshold) {
        return occurence;
      }
      return undefined;
    });

    if(!allUndefined(totalSubs)) {
      mult = __.reduce(totalSubs, function(memo, occurence, prime){
        if(occurence) {
          return memo * Math.pow(prime,mult);
        }
        return memo;
      }, 1);
    } else {
        var newPrime = createNewPrime();
        mult = Math.pow(newPrime,hardness);
        currentPrimes[newPrime] = array.length;
    }

    return __.map(array, function(obj){
                obj.ass = (obj.ass || 1) * mult;
                return obj;
            });
};

exports.getAssociates = function(array, junctness ,feather) {
    //given a list (can be list of one) fetches associated numbers, either disjunct or conjunct with a certain feather
    //this would be compared to an internally held list of the numbers
    
    if(!__.isArray(array)) {
      _arr = array;
      array = [];
      array[0] = _arr;
    }

    var totalSubs = [];

    __.each(array, function(object){
        var number = object.ass 
        if(number == null) return;
        totalSubs.push(getSubPrimes(number));
    });

    if(junctness === "disjunct" ) {
        totalSubs = __.union(totalSubs);
    } else {
        totalSubs = intersection(totalSubs);
    }

    __.each(list, function(obj) {

    });
};

//what does this do??
exports.generate = function(object, hints, hardness){
    if(hints) {
        this.associate(hints + object, hardness || 1);
    }
    size++;
    return object;
};

exports.test = function() {

};

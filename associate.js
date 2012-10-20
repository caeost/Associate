var __ = require("./underscore/underscore.js");

var currentPrimes = [{2: 0}];
var list = [];
var size = 0;
var threshold = 0;

exports.getSubPrimes = function(number) {
    //operates on the algorithm whereby for all currently existing primes starting from 2 we divide as many times as
    //we can per prime and keep track of these in order to return a list of primes and their number of occurences
    return __.map(currentPrimes, function(obj){
        var count = 0, breaker = true, dumb = {}, prime = __.keys(obj);
        while(breaker){
            var temp = number / prime;
            if(temp % 1 === 0){
                number = temp;
                count++;
            } else {
                breaker = false;
            }
        }
        if(count > 0) dumb[prime] = count;
        return dumb;
    });
};

var createNewPrime = function() {
    //if necessary create a new larger prime to deal with new set, cache all primes for speed
    // current prime number
    var dumb = {}, 
        prime = __.chain(currentPrimes).last().keys().value();

    // return true if NUM is prime
    var isPrime = function(num) {
        var x, result = true;
        if (num % 2 === 0) {
            return false;
        } else {
            var sqrt = Math.sqrt(num);
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
    dumb[prime] = 0;

    currentPrimes.push(dumb);
    return dumb;
};

//lifted and slightly modified from underscore
var intersection = function(array) {
    var rest = __.rest(array);
    array = __.first(array);
    return __.filter(__.uniq(array), function(item) {
        return __.every(rest, function(other) {
            return __.indexOf(other, item) >= 0;
        });
    });
};

exports.associate =  function(array, hardness)  {
    //given array of numbers tests them for already existant common subprimes, amplifying those subprimes if existant
    //if not generates a whole new subprime to assign to the set, subprimes assigned or amplified MUST serve to
    //differntiate the set. Hardness is optional and allows external setting of how much linkage should be created
    var totalSubs = [], mult = hardness || 1;

    __.each(array, function(object){
        var number = object.ass || 1;
        totalSubs.push(getSubPrimes(number));
    });

    totalSubs = intersection(totalSubs);

    __.filter(totalSubs, function(prime) {
      var percentPrimeTotal = currentPrimes[prime];
      var percentCurrentTotal = size / array.length;
      var difference = percentPrimeTotal / percentCurrentTotal;
      return difference < threshold;
    });

    if(totalSubs.length > 0) {
      mult = __.reduce(totalSubs, function(memo, sub){
        return memo * sub;
      }, mult);
    } else {
        mult = createNewPrime() * mult;
    }

    return __.map(array, function(obj){
                obj.ass = number * mult;
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

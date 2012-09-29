var __ = require("./underscore.js");

var currentPrimes = [{2: 0}];
var list = [];
var size = 0;
var threshold = 0;

exports.getSubPrimes = function(number) {
    //operates on the algorithm whereby for all currently existing primes starting from 2 we divide as many times as
    //we can per prime and keep track of these in order to return a list of primes and their number of occurences
    return __.map(currentPrimes, function(percent, prime){
        var count = 0, breaker = true, dumb = {};
        while(breaker){
            var temp = number / prime;
            if(temp % 1 === 0){
                number = temp;
                count++;
            } else {
                breaker = false;
            }
        }
        dumb[prime] = count;
        return dumb;
    });
};

var createNewPrime = function() {
    //if necessary create a new larger prime to deal with new set, cache all primes for speed
    // current prime number
    var prime = __.last(currentPrimes).keys;

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
    var p = {};
    p[prime] = 0;

    currentPrimes.push(p);
    return p;
};

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
    hardness = hardness || 1;
    var totalSubs = [];

    __.each(array, function(number){
        totalSubs.push(__.keys(getSubPrimes(number)));
    });

    totalSubs = intersection(totalSubs);

    if(totalSubs.length > 0) {
        var percentPrimeTotal = currentPrimes[totalSubs[0]];
        var percentCurrentTotal = size / array.length;

        var difference = percentPrimeTotal / percentCurrentTotal;
        if(difference > threshold) {
            var mult = __.reduce(totalSubs, function(memo, sub){
                return memo * sub;
            }, hardness);
            return __.map(array, function(number){
                return number * mult;
            });
        }
    }else{
        var p = createNewPrime() * hardness;
        return __.map(array, function(number){
            return number * p;
        });
    }
};

exports.getAssociates = function(array, junctness ,feather) {
    //given a list (can be list of one) fetches associated numbers, either disjunct or conjunct with a certain feather
    //this would be compared to an internally held list of the numbers
    var totalSubs = [];

    __.each(array, function(number){
        totalSubs.push(__.keys(getSubPrimes(number)));
    });

    if(junctness === "disjunct" ) {
        totalSubs = __.union(totalSubs);
    } else {
        totalSubs = intersection(totalSubs);
    }

    __.each(list, function(obj) {

    });
};

exports.generate = function(object, hints, hardness){
    object.theid = 1;
    if(hints) {
        this.associate(hints + object, hardness || 1);
    }
    size++;
    return object;
};
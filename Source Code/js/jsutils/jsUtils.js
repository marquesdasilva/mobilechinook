var jsUtils = jsUtils || {};

jsUtils.Chinnook = function Chinnook() {
    this.findKeyValueInJson = function findKeyValueInJson(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(findKeyValueInJson(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;
    }

    this.findKeyValueInJsonStartsWith = function findKeyValueInJsonStartsWith(obj, key, val) {
        var obj_ = [];
        console.log(obj);
        $.each(obj, function (index, value) {
            if (obj[index][key].toUpperCase().indexOf(val.toUpperCase()) === 0) {
                obj_.push(obj[index]);
            }
        })

        return obj_;
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    this.getRandomInt = function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.getRandomIndexesFromArray = function getRandomIndexesFromArray(array,nItems) {
        var obj_ = [];
        var indexesBounded = [];

        for (i = 0; i < nItems; i++) {
            var a = this.getRandomInt(0, array.length - 1);

            if (indexesBounded.length == 0 || indexesBounded.indexOf(a) == -1) {
                indexesBounded.push(a);
                obj_.push(array[a]);
            }
            else
            {
                i--;
            }
        }

        return obj_;
    }

    this.getUrlVars = function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
}
/**
 * Created by Tim on 2014/6/2.
 */


function getCommonCSS(strs) {
    var first = strs[0];
    var tokens = first.split(">");
    var maxLength = tokens.length;
    for (var i = 1; i < strs.length; i++) {
        var tokens2 = strs[i].split(">");
        var commonLength = 0;
        for (var j = 0; j < tokens.length; j++) {
            if (j >= maxLength)break;
            if (tokens[j] === tokens2[j]) {
                commonLength++;
            } else {
                break;
            }
        }
        if (maxLength > commonLength) {
            maxLength = commonLength;
        }
    }

    var subTokens = tokens.slice(0, maxLength);
    return subTokens.join(">");
}


function equal(o1, o2) {
    kango.console.log(angular.toJson(o1));
    kango.console.log(angular.toJson(o2));

    return angular.toJson(o1) === angular.toJson(o2);
}

function remove(arr, obj) {
    for (var i = arr.length; i--;) {
        if (arr[i] === obj) {
            arr.splice(i, 1);
        }
    }
}


var QueryString = function () {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]], pair[1] ];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
}();


function clone(item) {
    if (!item) {
        return item;
    } // null, undefined values check

    var types = [ Number, String, Boolean ],
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function (type) {
        if (item instanceof type) {
            result = type(item);
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call(item) === "[object Array]") {
            result = [];
            item.forEach(function (child, index, array) {
                result[index] = clone(child);
            });
        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode(true);
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone(item[i]);
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}

function extractBaseURL(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser.protocol + '//' + parser.host + '/';
}

function testRegex(pattern) {
    var tester = "abc";
    var regex = new RegExp(pattern);
    regex.test(tester);
}

if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
}
var LangUtils = (function() {

	var LangUtils = {};
	
	// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
	LangUtils.deepFreeze = function(o) {
		var prop, propKey;
		Object.freeze(o); // First freeze the object.
		for (propKey in o) {
			prop = o[propKey];
			if (!o.hasOwnProperty(propKey) || !(typeof prop === "object") || Object.isFrozen(prop)) {
				continue;
			}
			LangUtils.deepFreeze(prop); // Recursively call deepFreeze.
		}
	}
	
	LangUtils.isString = function(o) { return toString.call(o) == "[object String]" }

	
	LangUtils.camelCase = function(s) {
		return s.trim().toLowerCase().replace(/^(.)/, function(c) { return c.toUpperCase() });
	}
	
	LangUtils.containsAll = function(arr, expected) {
		return expected.every(function(el) {
			return arr.indexOf(el) != -1
		});
	}
	
	LangUtils.containsExactly = function(arr, expected) {
		return LangUtils.containsAll(arr, expected) && arr.length == expected.length;
	}
	
	LangUtils.deepClone = function(o) {
		return JSON.parse(JSON.stringify(o));
	}
	
	LangUtils.lazyMap = function(emptyValueGenerator) {
		var _map = {};
		return {
			get: function(key) {
				var result = _map[key];
				if ( result == null ) {
					result = emptyValueGenerator(key);
					_map[key] = result;
				}
				return result;
			},
			
			set: function(key, value) {
				_map[key] = value;
			},
			
			keys: function() {
				return Object.keys(_map);
			}
		}
	}
	
	return LangUtils;

}());
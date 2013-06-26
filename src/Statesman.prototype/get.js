statesmanProto.get = function ( keypath ) {
	return get( this, keypath && normalise( keypath ) );
};

var get = function ( statesman, keypath, keys, forceCache ) {
	var computed, lastKey, parentKeypath, parentValue, value;

	if ( !keypath ) {
		return statesman.data;
	}

	// if this is a non-cached computed value, compute it, unless we
	// specifically want the cached value
	if ( computed = statesman.computed[ keypath ] ) {
		if ( !forceCache && !computed.cache && !computed.override ) {
			statesman.cache[ keypath ] = computed.getter();
		}
	}

	// cache hit?
	if ( statesman.cache.hasOwnProperty( keypath ) ) {
		return statesman.cache[ keypath ];
	}

	keys = keys || keypath.split( '.' );
	lastKey = keys.pop();

	parentKeypath = keys.join( '.' );
	parentValue = get( statesman, parentKeypath, keys );

	if ( typeof parentValue === 'object' && parentValue.hasOwnProperty( lastKey ) ) {
		value = parentValue[ lastKey ];
		statesman.cache[ keypath ] = value;

		if ( !statesman.cacheMap[ parentKeypath ] ) {
			statesman.cacheMap[ parentKeypath ] = [];
		}
		statesman.cacheMap[ parentKeypath ].push( keypath );
	}

	return value;
};
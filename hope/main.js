(function () {

	'use strict';

	var blocks, typewriter, typewriteNode, typewriteTextNode, parseTransitionParams, throttle, isWithinBounds, noop, update;


	typewriteNode = function ( node, complete, interval ) {
		var children, next;

		if ( node.nodeType === 1 ) {
			node.style.display = node._display;
		}

		if ( node.nodeType === 3 ) {
			typewriteTextNode( node, complete, interval );
			return;
		}

		children = Array.prototype.slice.call( node.childNodes );

		next = function () {
			if ( !children.length ) {
				if ( node.nodeType === 1 ) {
					node.setAttribute( 'style', node._style || '' );
				}

				complete();
				return;
			}

			typewriteNode( children.shift(), next, interval );
		};

		next();
	};

	typewriteTextNode = function ( node, complete, interval ) {
		var str, len, loop, i;

		// text node
		str = node._hiddenData;
		len = str.length;

		if ( !len ) {
			complete();
			return;
		}

		i = 0;

		loop = setInterval( function () {
			var substr, remaining, match, remainingNonWhitespace, filler;

			substr = str.substr( 0, i );
			remaining = str.substring( i );

			match = /^\w+/.exec( remaining );
			remainingNonWhitespace = ( match ? match[0].length : 0 );

			// add some non-breaking whitespace corresponding to the remaining length of the
			// current word (only really works with monospace fonts, but better than nothing)
			filler = new Array( remainingNonWhitespace + 1 ).join( '\u00a0' );

			node.data = substr + filler;
			if ( i === len ) {
				clearInterval( loop );
				delete node._hiddenData;
				complete();
			}

			i += 1;
		}, interval );
	};

	// TODO differentiate between intro and outro
	typewriter = function ( node ) {
		var interval, style, computedStyle, hide;

		interval = 7;
		
		style = node.getAttribute( 'style' );
		computedStyle = window.getComputedStyle( node );

		node.style.visibility = 'hidden';

		hide = function ( node ) {
			var children, i;

			if ( node.nodeType === 1 ) {
				node._style = node.getAttribute( 'style' );
				node._display = window.getComputedStyle( node ).display;

				node.style.display = 'none';
			}

			if ( node.nodeType === 3 ) {
				node._hiddenData = '' + node.data;
				node.data = '';
				
				return;
			}

			children = Array.prototype.slice.call( node.childNodes );
			i = children.length;
			while ( i-- ) {
				hide( children[i] );
			}
		};

		var computedHeight, computedWidth, computedVisibility;

		computedWidth = computedStyle.width;
		computedHeight = computedStyle.height;
		computedVisibility = computedStyle.visibility;

		hide( node );

		setTimeout( function () {
			node.style.width = computedWidth;
			node.style.height = computedHeight;
			node.style.visibility = 'visible';

			typewriteNode( node, function () {
				node.setAttribute( 'style', style || '' );
				node.style.visibility = 'visible';
			}, interval );
		}, 0 );
	};

	
	// throttling
	if ( typeof Date.now !== 'function' ) {
		Date.now = function () {
			return new Date().getTime();
		};
	}

	throttle = function ( fn, options ) {
		var active, timeout, nextAllowed, scheduled;

		if ( typeof options !== 'object' ) {
			options = {
				delay: options
			};
		}

		if ( !options.delay ) {
			options.delay = 250; // default value is 250 milliseconds
		}

		return function () {
			var args, timeNow, call, context;

			args = arguments;
			timeNow = Date.now();

			context = options.context || this;

			call = function () {
				fn.apply( context, args );
				
				nextAllowed = Date.now() + options.delay;
				scheduled = false;
			};

			// if it's been less than [delay] since the last call...
			if ( timeNow < nextAllowed ) {
				// schedule a call, if one isn't already scheduled
				if ( !scheduled ) {
					setTimeout( call, nextAllowed - timeNow );
					scheduled = true;
				}
			}

			else {
				call();
			}
		};
	};

	isWithinBounds = function ( node ) {
		var bcr = node.getBoundingClientRect();

		return  bcr.bottom > 0 && bcr.top < window.innerHeight;
	};

	noop = function () {};

	blocks = Array.prototype.slice.call( document.getElementsByClassName( 'typewriter' ) );
	blocks.forEach( function ( block ) {
		//console.log( block );
	});

	update = throttle( function () {
		var i, block;

		i = blocks.length;

		if ( !i ) {
			window.removeEventListener( 'resize', update, false );
			window.removeEventListener( 'scroll', update, false );
		}

		while ( i-- ) {
			block = blocks[i];

			if ( isWithinBounds( block ) ) {
				if ( window.getComputedStyle( block ).visibility !== 'visible' ) {
					typewriter( block, noop );
				} else {
					node.style.visibility = 'visible';
				}
				
				blocks.splice( i, 1 );
			}
		}
	}, 500 );

	window.addEventListener( 'resize', update, false );
	window.addEventListener( 'scroll', update, false );

	update();

}());
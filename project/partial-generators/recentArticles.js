module.exports = function ( data, helpers, render ) {
	var posts, rendered, sortByDate, mustacheData;

	sortByDate = function ( a, b ) {
		return moment( b.date ).valueOf() - moment( a.date ).valueOf();
	};

	posts = data.content.articles.sort( require( 'sortByDate' ) ).slice( 0, 5 || posts.length );

	mustacheData = {
		posts: posts.map( function ( post ) {
			post.url = '/science/' + post.path;
			return post;
		}),
		subtitle: 'Explore more',
		pathPrefix: 'science'
	};

	return render( data.partials.headlinelist, mustacheData );
};
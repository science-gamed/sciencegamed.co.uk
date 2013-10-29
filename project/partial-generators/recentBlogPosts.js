module.exports = function ( data, helpers, render ) {
	var posts, rendered, sortByDate, mustacheData;

	sortByDate = function ( a, b ) {
		return moment( b.date ).valueOf() - moment( a.date ).valueOf();
	};

	posts = data.content.blogposts.sort( require( 'sortByDate' ) ).slice( 0, 5 || posts.length );

	mustacheData = {
		posts: posts.map( function ( post ) {
			post.url = '/blog/' + post.path;
			return post;
		}),
		subtitle: 'Recent blog posts',
		pathPrefix: 'blog'
	};

	return render( data.partials.headlinelist, mustacheData );
};
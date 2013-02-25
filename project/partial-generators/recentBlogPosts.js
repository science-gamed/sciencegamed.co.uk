module.exports = function ( data, helpers, render ) {
	var posts, result, rendered;

	posts = data.content.blogposts.concat();

	// sort by date
	posts.sort( helpers.sortByDate );

	// cutoff
	result = posts.slice( 0, 5 || posts.length ).map( function ( post ) {
		post.url = '/blog/' + post.path;
		return post;
	});

	return render( data.partials.headlinelist, result );
};
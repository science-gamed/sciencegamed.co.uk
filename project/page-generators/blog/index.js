module.exports = function ( data, helpers, render ) {
	var posts, mustacheData;

	posts = data.content.blogposts.sort( require( 'sortByDate' ) ).slice( 0, 5 );

	mustacheData = {
		title: 'Our blog',
		posts: posts,
		pathPrefix: 'blog'
	};

	return render( data.templates.postIndex, mustacheData );
};
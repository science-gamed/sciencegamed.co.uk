module.exports = function ( data, helpers, render ) {
	var posts, mustacheData;

	posts = data.content.articles.sort( require( 'sortByDate' ) ).slice( 0, 5 );

	mustacheData = {
		title: 'Science stuff',
		posts: posts,
		pathPrefix: 'science'
	};

	return render( data.templates.postIndex, mustacheData );
};
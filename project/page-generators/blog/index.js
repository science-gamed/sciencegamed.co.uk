module.exports = function ( data, helpers, render ) {
	var posts, mustacheData, sortByDate;

	sortByDate = function ( a, b ) {
		return a.date.valueOf() - b.date.valueOf();
	};

	posts = data.content.blogposts.sort( sortByDate ).slice( 0, 5 );

	mustacheData = {
		title: 'Our blog',
		posts: posts,
		pathPrefix: 'blog'
	};

	return render( data.templates.postIndex, mustacheData );
};
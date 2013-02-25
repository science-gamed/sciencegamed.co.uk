module.exports = function ( data, helpers, render ) {
	var posts, mustacheData, sortByDate;

	sortByDate = function ( a, b ) {
		return a.date.valueOf() - b.date.valueOf();
	};

	posts = data.content.articles.sort( sortByDate ).slice( 0, 5 );

	mustacheData = {
		title: 'Science articles',
		posts: posts,
		pathPrefix: 'articles'
	};

	return render( data.templates.postIndex, mustacheData );
};
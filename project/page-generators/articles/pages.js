module.exports = function ( data, helpers, render ) {
	var pages, i, id, posts, post;

	pages = [];

	posts = data.content.articles;

	i = posts.length;
	while ( i-- ) {
		post = posts[ i ];

		post.pathPrefix = 'articles';

		pages[ pages.length ] = {
			path: post.path,
			data: render( data.templates.post, post )
		};
	}

	return pages;
};
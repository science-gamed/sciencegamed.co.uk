module.exports = function ( data, helpers, render ) {
	var pages, i, id, posts, post;

	pages = [];

	posts = data.content.blogposts;

	i = posts.length;
	while ( i-- ) {
		post = posts[ i ];

		post.pathPrefix = 'blog';

		pages[ pages.length ] = {
			path: post.path,
			data: render( data.templates.blogpost, post )
		};
	}

	return pages;
};
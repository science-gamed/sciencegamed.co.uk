module.exports = function ( data, helpers, render ) {
	var pages, i, id, posts, post;

	pages = [];

	data.content.misc.forEach( function ( item ) {
		pages[ pages.length ] = {
			path: item.path,
			data: render( data.templates.base, { content: item.html })
		};
	});

	return pages;
};
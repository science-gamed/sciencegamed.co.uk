module.exports = function ( data, helpers, render ) {
	
	'use strict';

	var pages, i, j, id, post, posts, postTags, tag, tagsBySlug, mustacheData, postsByTag, path, slug, slugs;

	tagsBySlug = {};
	slugs = [];
	postsByTag = {};

	posts = data.content.blogposts;

	// organise posts by tag
	i = posts.length;
	while ( i-- ) {
		post = posts[i];

		postTags = post.tags || [];

		j = postTags.length;
		while ( j-- ) {
			tag = postTags[j];

			if ( !postsByTag[ tag.slug ] ) {
				postsByTag[ tag.slug ] = [];
			}

			if ( !tagsBySlug[ tag.slug ] ) {
				tagsBySlug[ tag.slug ] = tag;
			}

			postsByTag[ tag.slug ].push( post );
		}
	}

	// generate a page for each tag
	pages = [];

	for ( slug in postsByTag ) {
		path = slug + '.html';
		tag = tagsBySlug[ slug ];

		posts = postsByTag[ slug ].sort( helpers.sortByDate );
		
		mustacheData = {
			tag: tag,
			pathPrefix: 'blog/tags/',
			tagPath: path,
			description: 'Science: Gamed blog posts tagged with "' + tag.name + '"',
			posts: postsByTag[ slug ].sort( helpers.sortByDate )
		};


		pages[ pages.length ] = {
			path: path,
			data: render( data.templates.tagpage, mustacheData )
		};
	}


	return pages;
};
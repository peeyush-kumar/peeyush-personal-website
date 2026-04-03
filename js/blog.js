// Fetch and display Substack posts
// Renders in WordPress su-posts-default-loop style (100x100 thumbnail floated left)
document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('blog-posts');
  if (!container) return;

  var SUBSTACK_URL = 'https://peeyushkumarloj.substack.com';
  var SUBSTACK_FEED = SUBSTACK_URL + '/feed';
  var API_URL = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(SUBSTACK_FEED);

  fetch(API_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then(function (data) {
      if (!data.items || data.items.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:40px 0;">No posts found.</p>';
        return;
      }

      var html = '<div class="su-posts su-posts-default-loop">';

      html += data.items.map(function (post) {
        var date = new Date(post.pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // 100x100 thumbnail floated left
        var coverImage = '';
        var imgSrc = '';
        if (post.thumbnail && post.thumbnail.length > 0) {
          imgSrc = post.thumbnail;
        } else if (post.enclosure && post.enclosure.link) {
          imgSrc = post.enclosure.link;
        }
        if (imgSrc) {
          coverImage = '<div class="su-post-thumbnail">' +
            '<a href="' + escapeHtml(post.link) + '" target="_blank" rel="noopener">' +
            '<img src="' + escapeHtml(imgSrc) + '" alt="' + escapeHtml(post.title) + '" loading="lazy">' +
            '</a></div>';
        }

        // Plain-text excerpt
        var excerpt = '';
        if (post.description) {
          var tmp = document.createElement('div');
          tmp.innerHTML = post.description;
          var text = tmp.textContent || tmp.innerText || '';
          excerpt = text.substring(0, 280);
          if (text.length > 280) excerpt += ' [\u2026]';
          excerpt = '<div class="su-post-excerpt"><p>' + escapeHtml(excerpt) + '</p></div>';
        }

        var postUrl = post.link || post.guid;

        return '<div class="su-post">' +
          coverImage +
          '<h2 class="su-post-title"><a href="' + escapeHtml(postUrl) + '" target="_blank" rel="noopener">' + escapeHtml(post.title) + '</a></h2>' +
          '<div class="su-post-meta">Posted: ' + date + '</div>' +
          excerpt +
          '</div>';
      }).join('');

      html += '</div>';
      container.innerHTML = html;
    })
    .catch(function () {
      container.innerHTML =
        '<div style="text-align:center;color:#666;padding:40px 0;">' +
        '<p>Unable to load posts automatically.</p>' +
        '<p><a href="' + SUBSTACK_URL + '" target="_blank" rel="noopener" style="text-decoration:underline;">Visit my Substack to read all posts</a></p>' +
        '</div>';
    });

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});

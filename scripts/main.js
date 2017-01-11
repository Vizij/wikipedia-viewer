$(document).ready(function() {
	var $subject = $("#subject");
	var $search = $("#search");
	var $resultsBox = $("#resultsBox");
	var url = "";
	var results = "";
	
	$subject.keyup(function(key) {
		if (key.which == 13) {
			wikiArticles();
		}
	});
	$search.click(wikiArticles);
	
	function wikiArticles() {
		if (!$subject.val()) {
			$resultsBox.text("Please enter a subject to search.");
		} else {
			url = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages%7Cpageterms&generator=search&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=200&pilimit=20&wbptterms=description&gsrlimit=20&gsrsearch=" + $subject.val().trim().replace(/\s/g, "_");
			$.ajax({
				method: "GET",
				dataType: "json",
				url: url,
				success: function(data) {
					results = "";
					data.query.pages.sort(function(a, b) {
						if (a.index > b.index) {
							return 1;
						}
						if (a.index < b.index) {
							return -1;
						}
						return 0;
					});
					data.query.pages.forEach(function(page) {
						results += "<div class='row entry'>";
						results += "<div class='col-xs-12 col-lg-2'>";
						if (page.thumbnail) {
							results += "<img src='" + page.thumbnail.source + "'>";
						} else {
							results += "<img src='https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg'>";
						}
						results += "</div>";
						results += "<div class='col-xs-12 col-lg-8'>";
						results += "<b><a href='https://en.wikipedia.org/wiki/" + page.title.replace(/\s/g, "_") + "' target='_blank'>" + page.title + "</a></b><br>";
						if (page.terms) {
							results += page.terms.description[0];
						}
						results += "</div></div>";
					});
					$resultsBox.html(results);
				}
			});
		}
	}
});

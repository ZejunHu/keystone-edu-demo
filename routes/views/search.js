var keystone = require("keystone");

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.filters = {
		keywords: req.query.keywords
	};
	locals.data = {
		results: [],
		keywords: "",
		invalid: ""
	};

	// Load the current product
	view.on("init", function(next) {
		console.log("search keywords=" + locals.filters.keywords);
		locals.data.keywords = locals.filters.keywords;

		// search the full-text index
		keystone.list("Post").model.find(
			{
				// title: new RegExp("^" + locals.data.keywords + "$", "i")
				title: new RegExp(locals.data.keywords, "i"),
				state: "published"
			},
			function(err, res) {
				// Do your action here..
				console.log(res);
				locals.data.results = res;
				if (res == "") {
					locals.data.invalid = "Invalid search";
				}
				next(err);
			}
		);
	});

	view.render("search");
};

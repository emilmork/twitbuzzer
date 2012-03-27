
install:
	@echo "Collecting frameword JS files"
	@cat public/js/jquery.js public/js/knockout.js public/js/knockout.mapping.js public/js/bootstrap.js public/js/dates.js > public/js/collected.js

	@echo "Collection graph JS files"
	@cat public/js/raphael.min.js public/js/popup.raphael.js public/js/graph.raphael.js public/js/repo-graph.js >> public/js/collected.js

	@echo "Collecting APP JS files"
	@cat public/js/app.js public/js/noisy.jquery.js >> public/js/collected.js

	@echo "Minifying files"
	@uglifyjs -nc public/js/collected.js > public/js/twitbuzzer.min.js

	@echo "Cleaning up files"
	@rm public/js/collected.js


.PHONY: test 
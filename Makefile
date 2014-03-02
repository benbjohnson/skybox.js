
COMPONENT = node_modules/component/bin/component
UGLIFY = node_modules/uglify-js/bin/uglifyjs
PHANTOM = node_modules/.bin/mocha-phantomjs
LINT = node_modules/.bin/jslint

build: components lib/*.js
	mkdir build
	@component build --dev

clean:
	rm -fr build components template.js

components: component.json
	@component install --dev

lint:
	$(LINT) lib/*.js

test: lint build
	$(PHANTOM) test/index.html

track.js: components
	$(COMPONENT) build --standalone track --out . --name track
	$(UGLIFY) track.js --output track.min.js

.PHONY: build clean components lint test

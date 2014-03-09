
COMPONENT = node_modules/component/bin/component
UGLIFY = node_modules/uglify-js/bin/uglifyjs
PHANTOM = node_modules/.bin/mocha-phantomjs
LINT = node_modules/.bin/jslint

build: components lib/*.js
	@mkdir -p build
	@component build --dev

clean:
	rm -fr build components template.js

components: component.json
	@component install --dev

lint:
	$(LINT) lib/*.js

test: lint build
	$(PHANTOM) test/index.html

skybox.js: components
	$(COMPONENT) build --standalone skybox --out . --name skybox
	$(UGLIFY) skybox.js --output skybox.min.js

.PHONY: build clean components lint test

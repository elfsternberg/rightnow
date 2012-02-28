.PHONY: watch

HAML=/usr/bin/haml
COFFEE = coffee
LESSCSS=lessc
CLOSURE=java -jar $(CURDIR)/build/compiler.jar
INCLUDES=--js lib/json2.js \
 --js lib/lawnchair.js \
 --js lib/lawnchair-dom.js \
 --js lib/lawnchair-indexed-db.js \
 --js lib/lawnchair-window-name.js \
 --js lib/zepto.js

all: index.html style.css todo.js

todo.js: todo.coffee
	$(COFFEE) --compile --lint  $<

style.css: style.less
	$(LESSCSS) $< $@

index.html: index.haml
	$(HAML) --unix-newlines --no-escape-attrs --double-quote-attributes $< > $@

compile: all
	${CLOSURE} ${INCLUDES} --js clock.js.js --js todo.js --js_output_file compiled.js

watch:
	while inotifywait *.less *.haml *.coffee ; do make all; done


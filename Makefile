.PHONY: watch

HAML=/usr/bin/haml
COFFEE = coffee
LESSCSS=lessc
COMPILER=uglifyjs 
INCLUDES= lib/json2.js \
 lib/lawnchair.js \
 lib/lawnchair-dom.js \
 lib/lawnchair-window-name.js \
 lib/jquery-1.7.1.js

all: index.html style.css todo.js

todo.js: todo.coffee
	$(COFFEE) --compile --lint $<

style.css: style.less
	$(LESSCSS) $< $@

index.html: index.haml
	$(HAML) --unix-newlines --no-escape-attrs --double-quote-attributes $< > $@

compile: all
	cat clock.js ${INCLUDES} todo.js | ${COMPILER} > compiled.js

watch:
	while inotifywait *.less *.haml *.coffee ; do make all; done


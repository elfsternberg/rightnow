.PHONY: watch

HAML=haml
COFFEE = coffee
LESSCSS=lessc
CLOSURE=java -jar $(CURDIR)/build/compiler.jar
# INCLUDES=--js jquery-1.7.1.js --js underscore.js --js backbone.js --js backbone-relational.js --js jquery-ui-1.8.17.custom.min.js --js json2.js

all: index.html style.css todo.js

todo.js: todo.coffee
	$(COFFEE) --compile --lint  $<

style.css: style.less
	$(LESSCSS) $< $@

index.html: index.haml
	$(HAML) --unix-newlines --no-escape-attrs --double-quote-attributes $< > $@

compile: all
	cd app/attachments/js ; \
	${CLOSURE} ${INCLUDES} --js ptah.js --js_output_file compiled_ptah.js

watch:
	while inotifywait *.less *.haml *.coffee ; do make all; done


(function() {
  var Category, CategoryList, CategoryListView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Category = (function() {

    __extends(Category, Backbone.Model);

    function Category() {
      Category.__super__.constructor.apply(this, arguments);
    }

    return Category;

  })();

  CategoryList = (function() {

    __extends(CategoryList, Backbone.Collection);

    function CategoryList() {
      CategoryList.__super__.constructor.apply(this, arguments);
    }

    CategoryList.prototype.lawnchair = new Lawnchair({
      name: "RightNowCategoryList"
    }, new Function());

    return CategoryList;

  })();

  CategoryListView = (function() {

    __extends(CategoryListView, Backbone.View);

    function CategoryListView() {
      this.stopEdit = __bind(this.stopEdit, this);
      this.edit = __bind(this.edit, this);
      CategoryListView.__super__.constructor.apply(this, arguments);
    }

    CategoryListView.prototype.template = $("#todo-template").html();

    CategoryListView.prototype.editTemplate = $('#todo-edit-template').html();

    CategoryListView.prototype.el = $('#todos');

    CategoryListView.prototype.events = {
      "click .task": "nowEdit",
      "mouseover .task": "maybeEdit",
      "mouseleave .task": "maybeNotEdit"
    };

    CategoryListView.prototype.catAndTask = function(t) {
      return $(t).attr('id').split('-').slice(1, 3);
    };

    CategoryListView.prototype.maybeEdit = function(ev) {
      var ht, tg;
      var _this = this;
      tg = $(ev.currentTarget);
      if (tg.hasClass('editing')) return;
      ht = tg.data('hoverTimeout');
      if (ht != null) clearTimeout(tg.data('hoverTimeout'));
      return tg.data('hoverTimeout', setTimeout((function() {
        return _this.edit(tg);
      }), 300));
    };

    CategoryListView.prototype.maybeNotEdit = function(ev) {
      var ht, tg;
      var _this = this;
      tg = $(ev.currentTarget);
      if (tg.hasClass('dirty')) return;
      ht = tg.data('hoverTimeout');
      if (ht != null) clearTimeout(tg.data('hoverTimeout'));
      return tg.data('hoverTimeout', setTimeout((function() {
        return _this.stopEdit(tg);
      }), 300));
    };

    CategoryListView.prototype.nowEdit = function(ev) {
      var tg;
      tg = $(ev.currentTarget);
      if (tg.hasClass('editing')) return;
      return this.edit(tg);
    };

    CategoryListView.prototype.edit = function(tg) {
      var category, task, _ref;
      tg.addClass('editing');
      _ref = this.catAndTask(tg), category = _ref[0], task = _ref[1];
      $(tg).html(_.template(this.editTemplate, {
        task: this.collection.at(category).get('tasks')[task],
        taskid: task,
        catid: category
      }));
      return clearTimeout(tg.data('hoverTimeout'));
    };

    CategoryListView.prototype.stopEdit = function(tg) {
      var category, task, _ref;
      tg.removeClass('editing');
      _ref = this.catAndTask(tg), category = _ref[0], task = _ref[1];
      $(tg).html((this.collection.at(category).get('tasks')[task]));
      return clearTimeout(tg.data('hoverTimeout'));
    };

    CategoryListView.prototype.render = function() {
      return this.el.html(_.template(this.template, {
        'categories': this.collection.toJSON()
      }));
    };

    return CategoryListView;

  })();

  $(function() {
    var categoryList;
    categoryList = new CategoryList();
    return categoryList.fetch({
      success: function(categoryList) {
        var view;
        if (categoryList.length === 0) {
          categoryList.add([
            {
              name: 'Writing:',
              tasks: ["<em>Toby and Kasserine</em>", "<em>Boy from Brazil</em>", "<em>Princess Jera</em>", "<em>Wet Angels</em>", "<em>Falling Star</em>", "<em>Janae</em>", "<em>Moon, Sun, Dragons</em>", "<em>Rome</em>"]
            }, {
              name: 'Programming:',
              tasks: ["Consilience", "Erotica Online", "Live Elephant", "Stuff", "Kodanshi"]
            }, {
              name: 'Playing:',
              tasks: ["With your family", "In your garden"]
            }
          ]);
          categoryList.each(function(i) {
            return i.save();
          });
        }
        view = new CategoryListView({
          collection: categoryList
        });
        return view.render();
      }
    });
  });

}).call(this);

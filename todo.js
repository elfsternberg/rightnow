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
      this.render = __bind(this.render, this);
      this.editTaskView = __bind(this.editTaskView, this);
      CategoryListView.__super__.constructor.apply(this, arguments);
    }

    CategoryListView.prototype.template = $("#todo-template").html();

    CategoryListView.prototype.editTemplate = $('#todo-edit-template').html();

    CategoryListView.prototype.el = $('#rightnow');

    CategoryListView.prototype.events = {
      "mouseover div.category": "showAddButton",
      "mouseout div.category": "hideAddButton",
      "mouseover h3.newcat": "showAddButton",
      "mouseout div.category": "hideAddButton",
      "click .task": "nowEditTask",
      "keyup .editing .edit-task-field": "maybeTaskSave"
    };

    CategoryListView.prototype.initialize = function(options) {
      return this.collection.bind('change', this.render);
    };

    CategoryListView.prototype.showAddButton = function(ev) {
      return $("button.addcat", ev.currentTarget).fadeIn('fast');
    };

    CategoryListView.prototype.hideAddButton = function(ev) {
      return $("button.addcat", ev.currentTarget).fadeOut('fast');
    };

    CategoryListView.prototype.catAndTask = function(t) {
      t = t.get(0);
      t = t.tagName.toUpperCase() === 'LI' ? t : $(t).closest('li.task');
      return $(t).attr('id').split('-').slice(1, 3);
    };

    CategoryListView.prototype.catOnly = function(t) {
      t = t.tagName.toUpperCase() === 'LI' ? t : $(t).closest('li.category');
      return $(t).attr('id').split('-')[1];
    };

    CategoryListView.prototype.displayTaskView = function(el) {
      var category, task, _ref;
      $(el).removeClass('editing');
      _ref = this.catAndTask(el), category = _ref[0], task = _ref[1];
      return $(el).html((this.collection.at(category).get('tasks')[task]));
    };

    CategoryListView.prototype.registerUnclick = function() {
      var _this = this;
      if (this.registered) return;
      this.registered = true;
      return $('#content').click(function(ev) {
        var editing;
        ev.preventDefault();
        editing = $('li.editing');
        editing.each(function(i, el) {
          return _this.displayTaskView($(el));
        });
        $('bind').unbind('click');
        return _this.registered = false;
      });
    };

    CategoryListView.prototype.editTaskView = function(tg) {
      var category, task, _ref;
      var _this = this;
      if (tg.hasClass('editing')) return;
      $('li.editing').each(function(i, el) {
        return _this.displayTaskView($(el));
      });
      tg.addClass('editing');
      this.registerUnclick();
      _ref = this.catAndTask(tg), category = _ref[0], task = _ref[1];
      $(tg).html(_.template(this.editTemplate, {
        task: this.collection.at(category).get('tasks')[task],
        taskid: task,
        catid: category
      }));
      return $('input.edit-task-field', tg).focus();
    };

    CategoryListView.prototype.taskSave = function(ev, tg) {
      var category, input, task, tasks, _ref;
      input = tg.val();
      _ref = this.catAndTask(tg), category = _ref[0], task = _ref[1];
      category = this.collection.at(category);
      tasks = category.get('tasks');
      if (input.trim === "") {
        category.set('tasks', tasks.slice(0, task).append(tasks.slice(task + 1, tasks.length)));
        return this.render();
      } else {
        tasks[task] = input;
        category.set('tasks', tasks);
        category.save({
          silent: true
        });
        return this.displayTaskView(tg.closest('li'));
      }
    };

    CategoryListView.prototype.maybeTaskSave = function(ev) {
      var category, code, task, tg, _ref;
      code = ev.keyCode ? ev.keyCode : ev.which;
      console.log(code);
      tg = $(ev.currentTarget);
      _ref = this.catAndTask(tg), category = _ref[0], task = _ref[1];
      if (code === 13) return this.taskSave(ev, tg);
      if (code === 27) return this.displayTaskView($(tg).closest('li'));
    };

    CategoryListView.prototype.nowEditTask = function(ev) {
      var tg;
      ev.stopPropagation();
      tg = $(ev.currentTarget).closest('li');
      return this.editTaskView(tg);
    };

    CategoryListView.prototype.render = function() {
      return $('#todos', this.el).html(_.template(this.template, {
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
        view = new CategoryListView({
          collection: categoryList
        });
        return view.render();
      }
    });
  });

}).call(this);

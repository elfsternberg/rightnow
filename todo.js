(function() {
  var Category, CategoryList, CategoryListView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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
      CategoryListView.__super__.constructor.apply(this, arguments);
    }

    CategoryListView.prototype.template = $("#todo-template").html();

    CategoryListView.prototype.el = $('#todos');

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
          console.log("Adding?");
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

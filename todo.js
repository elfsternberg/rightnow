(function() {
  var Category, CategoryList;
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

  $(function() {
    var categoryList;
    categoryList = new CategoryList();
    if (categoryList.size() === 0) {
      return categoryList.add([
        {
          name: 'Writing',
          todos: ["<em>Toby and Kasserine</em>", "<em>Boy from Brazil</em>", "<em>Princess Jera</em>", "<em>Wet Angels</em>", "<em>Falling Star</em>", "<em>Janae</em>", "<em>Moon, Sun, Dragons</em>", "<em>Rome</em>"]
        }, {
          name: 'Programming',
          todos: ["Consilience", "Erotica Online", "Live Elephant", "Stuff", "Kodanshi"]
        }, {
          name: 'Playing',
          todos: ["With your family", "In your garden"]
        }
      ]);
    }
  });

}).call(this);

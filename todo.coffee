class Category extends Backbone.Model

class CategoryList extends Backbone.Collection
    lawnchair: new Lawnchair({ name: "RightNowCategoryList"}, new Function())

$ ->
    categoryList = new CategoryList()
    if categoryList.size() == 0
        categoryList.add([
            {
                name: 'Writing',
                todos: ["<em>Toby and Kasserine</em>", "<em>Boy from Brazil</em>", "<em>Princess Jera</em>", "<em>Wet Angels</em>",
                        "<em>Falling Star</em>", "<em>Janae</em>", "<em>Moon, Sun, Dragons</em>", "<em>Rome</em>"]
            },
            {
                name: 'Programming',
                todos: ["Consilience", "Erotica Online", "Live Elephant", "Stuff", "Kodanshi"]
            },
            {
                name: 'Playing',
                todos: ["With your family", "In your garden"]
            }
        ])




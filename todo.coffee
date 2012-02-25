class Category extends Backbone.Model


class CategoryList extends Backbone.Collection
        lawnchair: new Lawnchair({ name: "RightNowCategoryList"}, new Function())


class CategoryListView extends Backbone.View
    template: $("#todo-template").html()
    el: $('#todos')
    render: ->
        @el.html(_.template(@template, {'categories': @collection.toJSON()}))

$ ->
    categoryList = new CategoryList()
    categoryList.fetch
        success: (categoryList) ->
            if categoryList.length == 0
                console.log("Adding?")
                categoryList.add([
                    {
                        name: 'Writing:',
                        tasks: ["<em>Toby and Kasserine</em>", "<em>Boy from Brazil</em>", "<em>Princess Jera</em>", "<em>Wet Angels</em>",
                                "<em>Falling Star</em>", "<em>Janae</em>", "<em>Moon, Sun, Dragons</em>", "<em>Rome</em>"]
                    },
                    {
                        name: 'Programming:',
                        tasks: ["Consilience", "Erotica Online", "Live Elephant", "Stuff", "Kodanshi"]
                    },
                    {
                        name: 'Playing:',
                        tasks: ["With your family", "In your garden"]
                    }
                ])
                categoryList.each (i) -> i.save()
            view = new CategoryListView {collection: categoryList}
            view.render()


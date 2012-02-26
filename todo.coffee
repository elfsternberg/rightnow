class Category extends Backbone.Model

class CategoryList extends Backbone.Collection
        lawnchair: new Lawnchair({ name: "RightNowCategoryList"}, new Function())

class CategoryListView extends Backbone.View
    template: $("#todo-template").html()
    editTemplate: $('#todo-edit-template').html()
    el: $('#todos')

    events:
        "click .task": "nowEdit"
        "mouseover .task": "maybeEdit"
        "mouseleave .task": "maybeNotEdit"

    catAndTask: (t) -> $(t).attr('id').split('-')[1..2]

    maybeEdit: (ev) ->
        tg = $(ev.currentTarget)
        return if tg.hasClass('editing')
        ht = tg.data('hoverTimeout')
        if ht?
            clearTimeout tg.data 'hoverTimeout'
        tg.data 'hoverTimeout', setTimeout (=> @edit tg), 300

    maybeNotEdit: (ev) ->
        tg = $(ev.currentTarget)
        return if tg.hasClass('dirty')
        ht = tg.data('hoverTimeout')
        if ht?
            clearTimeout tg.data 'hoverTimeout'
        tg.data 'hoverTimeout', setTimeout (=> @stopEdit tg), 300

    nowEdit: (ev) ->
        tg = $(ev.currentTarget)
        return if tg.hasClass('editing')
        @edit(tg)

    edit: (tg) =>
        tg.addClass('editing')
        [category, task] = @catAndTask(tg)
        $(tg).html _.template @editTemplate,
            task: @collection.at(category).get('tasks')[task]
            taskid: task
            catid: category
        clearTimeout tg.data 'hoverTimeout'

    stopEdit: (tg) =>
        tg.removeClass('editing')
        [category, task] = @catAndTask(tg)
        $(tg).html (@collection.at(category).get('tasks')[task])
        clearTimeout tg.data 'hoverTimeout'

    render: ->
        @el.html(_.template(@template, {'categories': @collection.toJSON()}))

$ ->
    categoryList = new CategoryList()
    categoryList.fetch
        success: (categoryList) ->
            if categoryList.length == 0
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


class Category extends Backbone.Model

class CategoryList extends Backbone.Collection
        lawnchair: new Lawnchair({ name: "RightNowCategoryList"}, new Function())

class CategoryListView extends Backbone.View
    template: $("#todo-template").html()
    editTemplate: $('#todo-edit-template').html()
    el: $('#rightnow')

    events:
        "mouseover div.category": "showAddButton"
        "mouseout div.category": "hideAddButton"
        "mouseover h3.newcat": "showAddButton"
        "mouseout div.category": "hideAddButton"
        "click .task": "nowEditTask"
        "keyup .editing .edit-task-field": "maybeTaskSave"

    initialize: (options) ->
        @collection.bind('change', @render)

    showAddButton: (ev) ->
        $("button.addcat", ev.currentTarget).fadeIn('fast')

    hideAddButton: (ev) ->
        $("button.addcat", ev.currentTarget).fadeOut('fast')

    catAndTask: (t) ->
        t = t.get(0)
        t = if t.tagName.toUpperCase() == 'LI' then t else $(t).closest('li.task')
        $(t).attr('id').split('-')[1..2]

    catOnly: (t) ->
        t = if t.tagName.toUpperCase() == 'LI' then t else $(t).closest('li.category')
        $(t).attr('id').split('-')[1]

    # Restores a task back to its normal view.

    displayTaskView: (el) ->
        $(el).removeClass('editing')
        [category, task] = @catAndTask(el)
        $(el).html (@collection.at(category).get('tasks')[task])

    # If the user clicks outside the editable, all editable
    # are reset.

    registerUnclick: ->
        return if @registered
        @registered = true
        $('#content').click (ev) =>
            ev.preventDefault()
            editing = $('li.editing')
            editing.each (i, el) =>
                @displayTaskView($(el))
            $('bind').unbind('click')
            @registered = false

    # Sets a task to its edit view

    editTaskView: (tg) =>
        return if tg.hasClass('editing')
        $('li.editing').each (i, el) => @displayTaskView($(el))
        tg.addClass('editing')
        @registerUnclick()
        [category, task] = @catAndTask(tg)
        $(tg).html _.template @editTemplate,
            task: @collection.at(category).get('tasks')[task]
            taskid: task
            catid: category
        $('input.edit-task-field', tg).focus()

    # Save the content of a task on a save event

    taskSave: (ev, tg) ->
        input = tg.val()
        [category, task] = @catAndTask(tg)
        category = @collection.at(category)
        tasks = category.get('tasks')
        if input.trim == ""
            category.set('tasks', tasks.slice(0, task).append(tasks.slice(task + 1, tasks.length)))
            @render()
        else
            tasks[task] = input
            category.set('tasks', tasks)
            category.save({silent: true})
            @displayTaskView(tg.closest('li'))

    maybeTaskSave: (ev) ->
        code = if ev.keyCode then ev.keyCode else ev.which
        console.log(code)
        tg = $(ev.currentTarget)
        [category, task] = @catAndTask(tg)
        return @taskSave(ev, tg) if code == 13
        return @displayTaskView($(tg).closest('li')) if code == 27

    nowEditTask: (ev) ->
        ev.stopPropagation()
        tg = $(ev.currentTarget).closest('li')
        @editTaskView(tg)

    render: =>
        $('#todos', @el).html(_.template(@template, {'categories': @collection.toJSON()}))

$ ->
    categoryList = new CategoryList()
    categoryList.fetch
        success: (categoryList) ->
            view = new CategoryListView {collection: categoryList}
            view.render()


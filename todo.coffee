class RightNow

    constructor: (@repo) ->
        @repo.get 'rightnow', (cat) =>
            @todos = if cat? and cat.rightnow? then cat.rightnow else []
            @render()
            $('body').on 'click', @render

            # You'll find the next two triggers in the HTML file
            $('#newcat h1').on 'click', @showAddButton
            $('#addcat').on 'click', @newCategory
            # $('#newcat h1').on 'tap', @showAddButton
            # $('#addcat').on 'tap', @newCategory

    save: ->
        @repo.save {key: 'rightnow', 'rightnow': @todos}, () =>
            @render()

    catAndTask: (t) ->
        (parseInt(i) for i in $(t).attr('id').split('-')[1..2])

    catOnly: (t) ->
        parseInt($(t).attr('id').split('-')[1])

    # Shows all buttons contained in the event generator's parent.
    showAddButton: (ev) =>
        ev.stopPropagation()
        tg = $("button.fadebutton", ev.currentTarget.parentNode)
        tg.fadeIn('fast')
        clearTimeout(tg.data("fader")) if tg.data("fader")
        tg.data("fader", setTimeout (() -> if tg.css("display") != "none" then tg.fadeOut('fast')), 2500)

    hideAllButtons: ->
        $('.fadebutton').hide()

    editCategory: (ev) =>
        ev.stopPropagation()
        tg = $($(ev.currentTarget).closest('li.cat'))

        edit_render = (cid, category) ->
            "<div class=\"edit-category\">" + \
            "<input type=\"text\" value=\"#{category}\" id=\"edit-#{cid}\" " + \
            "class=\"edit-task-field\" />" + \
            "<button class=\"delete-task-field\" id=\"del-#{cid}\">&#x02A2F;</button>" + \
            "</div>"

        cid = @catOnly(tg)
        tg.html(edit_render(cid, @todos[cid].name))

        deleteCat = (ev) =>
            ev.stopPropagation()
            if @todos[cid].tasks.length
                alert("You cannot delete a category with existing tasks")
                return
            @todos = @todos.slice(0, cid).concat(@todos.slice(cid + 1, @todos.length))
            @save()

        maybeCatSave = (ev) =>
            catSave = =>
                # Need to catch "empty category, full storylist" here!
                @todos[cid].name = $('.edit-task-field', tg).val()
                @save()

            code = if ev.keyCode then ev.keyCode else ev.which
            return catSave() if code == 13
            return @cleanAndRender() if code == 27

        @hideAllButtons()
        $('.edit-category', tg).on 'click', (ev) => ev.stopPropagation()
        $('input.edit-task-field', tg).on 'keyup', maybeCatSave
        $('.delete-task-field', tg).on 'click', deleteCat
        $('input.edit-task-field', tg).focus()

        # $('.delete-task-field', tg).on 'tap', deleteCat
        # $('.edit-category', tg).on 'tap', (ev) => ev.stopPropagation()

    newCategory: (ev) =>
        ev.stopPropagation()
        edit_render = "<div class=\"edit-category\">" + \
            "<input type=\"text\" id=\"edit-new-cid\" class=\"edit-task-field\" />" + \
            "<button class=\"delete-task-field\" id=\"del-new-cid\">&#x02A2F;</button>" + \
            "</div>"

        tg = $('#categorylist').append('<li class="category editing newcategory">' + edit_render + '</li>')

        maybeNewCatSave = (ev) =>
            catSave = =>
                @todos.push({'name': $('#edit-new-cid').val(), tasks: []})
                @save()

            code = if ev.keyCode then ev.keyCode else ev.which
            return catSave() if code == 13
            return @cleanAndRender() if code == 27

        @hideAllButtons()
        $('.edit-category', tg).on 'click', (ev) => ev.stopPropagation()
        $('input.edit-task-field', tg).on 'keyup', maybeNewCatSave
        $('.delete-task-field', tg).on 'click', @render
        $('input.edit-task-field', tg).focus()
        # $('.edit-category', tg).on 'tap', (ev) => ev.stopPropagation()
        # $('.delete-task-field', tg).on 'tap', @render

    editTask: (ev) =>
        ev.stopPropagation()
        tg = $(ev.currentTarget)

        edit_render = (cid, tid, task) ->
            "<div class=\"edit-task\">" + \
            "<input type=\"text\" value=\"#{task}\" id=\"edit-#{cid}-#{tid}\" " + \
            "class=\"edit-task-field\" />" + \
            "<button class=\"delete-task-field\" id=\"del-#{cid}-#{tid}\">&#x02A2F;</button>" + \
            "</div>"

        [cid, tid] = @catAndTask(tg)
        tg.html(edit_render(cid, tid, @todos[cid].tasks[tid]))

        deleteTask = (ev) =>
            ev.stopPropagation()
            t = @todos[cid].tasks
            @todos[cid].tasks = t.slice(0, tid).concat(t.slice(tid + 1, t.length))
            @save()

        maybeTaskSave = (ev) =>
            taskSave = =>
                val = $('.edit-task-field', tg).val()
                return deleteTask(ev) if val.trim() == ""
                @todos[cid].tasks[tid] = val
                @save()

            code = if ev.keyCode then ev.keyCode else ev.which
            return taskSave() if code == 13
            return @cleanAndRender() if code == 27

        @hideAllButtons()
        $('.edit-category', tg).on 'click', (ev) => ev.stopPropagation()
        $('input.edit-task-field', tg).on 'keyup', maybeTaskSave
        $('.delete-task-field', tg).on 'click', deleteTask
        $('input.edit-task-field', tg).focus()
        # $('.delete-task-field', tg).on 'tap', deleteTask
        # $('.edit-category', tg).on 'tap', (ev) => ev.stopPropagation()

    newTask: (ev) =>
        ev.stopPropagation()
        edit_render = "<div class=\"edit-task\">" + \
            "<input type=\"text\" value=\"\" id=\"edit-new-task\" " + \
            "class=\"edit-task-field\" />" + \
            "<button class=\"delete-task-field\" id=\"del-new-task\">&#x02A2F;</button>" + \
            "</div>"

        cid = @catOnly(ev.currentTarget)
        tg = $("#tasklist-#{cid}").append('<li class="task editing newcategory">' + edit_render + '</li>')

        maybeNewTaskSave = (ev) =>
            taskSave = =>
                @todos[cid].tasks.push($('#edit-new-task').val())
                @save()

            code = if ev.keyCode then ev.keyCode else ev.which
            return taskSave() if code == 13
            return @cleanAndRender() if code == 27

        @hideAllButtons()
        $('.edit-category', tg).on 'click', (ev) => ev.stopPropagation()
        $('input.edit-task-field', tg).on 'keyup', maybeNewTaskSave
        $('.delete-task-field', tg).on 'click', @render
        $('input.edit-task-field', tg).focus()
        # $('.delete-task-field', tg).on 'tap', @render
        # $('.edit-category', tg).on 'tap', (ev) => ev.stopPropagation()


    # Restores the todo state list by clearing out the dead entries
    clean: ->
        @todos = ({name: c.name, tasks: (t for t in c.tasks when t.trim() != "")} for c in @todos when c.name.trim() != "")

    cleanAndRender: ->
        @clean()
        @render()

    # Re-draws the site according to the existing todos array
    render: =>
        cat_render = (cat) ->
            cat_enumerate = (c) ->
                # Guard condition needed because coffeescript will
                # cheerfully create a range (0, -1) if length == 0
                return [] if c.length == 0
                ({idx: i, name: c[i].name, tasks: c[i].tasks} for i in [0..c.length - 1])

            cat_renderer = (c, rendered_tasks) ->
                "<li id=\"cat-#{c.idx}\" class=\"cat\">" + \
                "<div class=\"catcontainer\">" + \
                "<div class=\"category\" id=\"cdv-#{c.idx}\" >#{c.name}</div>" + \
                "<button class=\"fadebutton editcat\" id=\"cec-#{c.idx}\" style=\"display:none\">Edit Category</button>" + \
                "<button class=\"fadebutton addstory\" id=\"cas-#{c.idx}\" style=\"display:none\">+ New Project</button>" + \
                "</div></div>#{rendered_tasks}</li>"

            tasks_render = (cid, tasks) ->
                task_enumerate = (t) ->
                    return [] if t.length == 0
                    ({idx:i, task: t[i]} for i in [0..t.length - 1])

                tasks_renderer = (cid, tid, task) ->
                    "<li id=\"cat-#{cid}-#{tid}\" class=\"task\"><div>#{task}</div></li>"

                "<ul class=\"tasklist\" id=\"tasklist-#{cid}\">" + \
                (tasks_renderer(cid, t.idx, t.task) for t in task_enumerate(tasks)).join("") + \
                "</ul>"

            # START HERE and read upwards to grok.

            "<ul id=\"categorylist\">" + \
            (cat_renderer(i, tasks_render(i.idx, i.tasks)) for i in cat_enumerate(cat)).join("") + \
            "</ul>"

        $('#todos').html(cat_render(@todos))

        if (@todos.length) == 0 and $('#message').css("display") == "none"
            $('#message').fadeIn('fast')

        if (@todos.length) != 0 and $('#message').css("display") != "none"
            $('#message').fadeOut('fast')

        $('div.category').on 'click', @showAddButton
        $('.editcat').on 'click', @editCategory
        $('.addstory').on 'click', @newTask
        $('li.task').on 'click', @editTask

        # $('div.category').on 'tap', @showAddButton
        # $('.editcat').on 'tap', @editCategory
        # $('.addstory').on 'tap', @newTask
        # $('li.task').on 'tap', @editTask


$ ->
    rightnow = new Lawnchair {name: 'RightNow'}, () ->
        handler = new RightNow(this)


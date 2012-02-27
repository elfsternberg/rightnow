class RightNow

    constructor: (@repo) ->
        @repo.get 'rightnow', (cat) =>
            @todos = cat.rightnow
            @render()
            $('body').on 'click', @endEdits

    catAndTask: (t) ->
        (parseInt(i) for i in $(t).attr('id').split('-')[1..2])

    catOnly: (t) ->
        parseInt($(t).attr('id').split('-')[1])

    cat_render: (cat) ->
        cat_enumerate = (c) -> ([i, c[i].name, c[i].tasks] for i in [0..c.length - 1])
        cat_renderer = (c, r) ->
            "<li id=\"cat-#{i[0]}\"><div class=\"catcontainer\"><div class=\"category\">#{i[1]}</div>" + \
            "<button class=\"fadebutton addstory\" style=\"display:none\">+ New Project</button>" + \
            "<button class=\"fadebutton editcat\" style=\"display:none\">Edit Category</button></div>#{r}</li>"

        task_enumerate = (t) -> ([i, t[i]] for i in [0..t.length - 1])
        tasks_renderer = (cid, tid, task) ->
            "<li id=\"cat-#{cid}-#{tid}\" class=\"task\"><div>#{task}</div></li>"

        tasks_render = (cid, tasks) ->
            return "" if not tasks.length
            "<ul>" + (tasks_renderer(cid, i[0], i[1]) for i in task_enumerate(tasks)).join("") + "</ul>"

        "<ul>" + (cat_renderer(i, tasks_render(i[0], i[2])) for i in cat_enumerate(cat)).join("") + "</ul>"

    showAddButton: (ev) =>
        ev.stopPropagation()
        tg = $("button.fadebutton", ev.currentTarget.parentNode)
        tg.fadeIn('fast')
        clearTimeout(tg.data("fader")) if tg.data("fader")
        tg.data("fader", setTimeout (() -> if tg.css("display") != "none" then tg.fadeOut('fast')), 2500)

    endEdits: =>
        $('li.editing').each (i, el) =>
            $(el).removeClass('editing')
            [cid, tid] = @catAndTask(el)
            if not @todos[cid].tasks[tid]?
                $(el).remove()
            else
                $(el).html (@todos[cid].tasks[tid])

    cleanAndEndEdits: ->
        @todos = ({name: c.name, tasks: (t for t in c.tasks when t.trim() != "")} for c in @todos when c.name.trim() != "")
        @endEdits()

    save: ->
        @repo.save {key: 'rightnow', 'rightnow': @todos}, () =>
            @render()

    taskSave: (ev, tg) ->
        val = tg.val()
        [cid, tid] = @catAndTask(tg)
        t = @todos[cid].tasks
        @todos[cid].tasks = if val.trim() == ""
            t.slice(0, tid).concat(t.slice(tid + 1, t.length))
        else
            t.slice(0, tid).concat([val]).concat(t.slice(tid + 1))
        @save()

    maybeTaskSave: (ev) =>
        console.log(ev)
        code = if ev.keyCode then ev.keyCode else ev.which
        tg = $(ev.currentTarget)
        [cid, tid] = @catAndTask(tg)
        return @taskSave(ev, tg) if code == 13
        return @cleanAndEndEdits() if code == 27

    deleteTask: (ev) =>
        ev.stopPropagation()
        tg = $(ev.currentTarget)
        console.log(tg)
        [cid, tid] = @catAndTask(tg)
        t = @todos[cid].tasks
        @todos[cid].tasks = t.slice(0, tid).concat(t.slice(tid + 1, t.length))
        @save()

    editRender: (tg) ->
        return if tg.hasClass('editing')

        @endEdits()

        [cid, tid] = @catAndTask(tg)
        return if cid == null or cid == null

        task = @todos[cid].tasks[tid]
        return if task == null

        console.log(tg, cid, tid, "[" + task + "]")

        edit_render = (cid, tid, task) ->
            "<div class=\"edit-task\">" + \
            "<input type=\"text\" value=\"#{task}\" id=\"edit-#{cid}-#{tid}\" " + \
            "class=\"edit-task-field\" />" + \
            "<button class=\"delete-task-field\" id=\"del-#{cid}-#{tid}\">&#x02A2F;</button>" + \
            "</div>"

        tg.addClass('editing')
        tg.html edit_render(cid, tid, task)

        $('input.edit-task-field', tg).on 'keyup', @maybeTaskSave
        $('.edit-task', tg).on 'click', (ev) => ev.stopPropagation()
        $('.delete-task-field', tg).on 'click', @deleteTask
        $('input.edit-task-field', tg).focus()

    editCatRender: (tg) ->
        return if tg.hasClass('editing')

        @endEdits()

        [cid, tid] = @catAndTask(tg)
        return if cid == null or cid == null

        task = @todos[cid].tasks[tid]
        return if task == null

        console.log(tg, cid, tid, "[" + task + "]")

        edit_render = (cid, tid, task) ->
            "<div class=\"edit-task\">" + \
            "<input type=\"text\" value=\"#{task}\" id=\"edit-#{cid}-#{tid}\" " + \
            "class=\"edit-task-field\" />" + \
            "<button class=\"delete-task-field\" id=\"del-#{cid}-#{tid}\">&#x02A2F;</button>" + \
            "</div>"

        tg.addClass('editing')
        tg.html edit_render(cid, tid, task)

        $('input.edit-task-field', tg).on 'keyup', @maybeTaskSave
        $('.edit-task', tg).on 'click', (ev) => ev.stopPropagation()
        $('.delete-task-field', tg).on 'click', @deleteTask
        $('input.edit-task-field', tg).focus()


    newTask: (ev) =>
        ev.stopPropagation()
        tg = $($(ev.currentTarget).closest('li'))
        $('.fadebutton', tg).hide()
        cid = @catOnly(tg)
        tid = @todos[cid].tasks.length
        @todos[cid].tasks.push("")
        $("li#cat-#{cid} ul").append("<li id=\"cat-#{cid}-#{tid}\" class=\"task\"></li>")
        setTimeout (() => @editRender($("#cat-#{cid}-#{tid}"))), 10

    editTask: (ev) =>
        ev.stopPropagation()
        tg = $(ev.currentTarget)
        @editRender(tg)

    connect: ->

    render: ->
        $('#todos').html(@cat_render(@todos))
        $('div.category').on 'click', @showAddButton
        $('#newcat h1').on 'click', @showAddButton
        $('li.task').on 'click', @editTask
        $('.addstory').on 'click', @newTask


$ ->
    rightnow = new Lawnchair {name: 'RightNow'}, (rightnow) ->
        handler = new RightNow(rightnow)


(function() {
  var RightNow;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  RightNow = (function() {

    function RightNow(repo) {
      var _this = this;
      this.repo = repo;
      this.render = __bind(this.render, this);
      this.newTask = __bind(this.newTask, this);
      this.editTask = __bind(this.editTask, this);
      this.newCategory = __bind(this.newCategory, this);
      this.editCategory = __bind(this.editCategory, this);
      this.showAddButton = __bind(this.showAddButton, this);
      this.repo.get('rightnow', function(cat) {
        _this.todos = (cat != null) && (cat.rightnow != null) ? cat.rightnow : [];
        _this.render();
        $('body').on('click', _this.render);
        $('#newcat h1').on('click', _this.showAddButton);
        return $('#addcat').on('click', _this.newCategory);
      });
    }

    RightNow.prototype.save = function() {
      var _this = this;
      return this.repo.save({
        key: 'rightnow',
        'rightnow': this.todos
      }, function() {
        return _this.render();
      });
    };

    RightNow.prototype.catAndTask = function(t) {
      var i, _i, _len, _ref, _results;
      _ref = $(t).attr('id').split('-').slice(1, 3);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(parseInt(i));
      }
      return _results;
    };

    RightNow.prototype.catOnly = function(t) {
      return parseInt($(t).attr('id').split('-')[1]);
    };

    RightNow.prototype.showAddButton = function(ev) {
      var tg;
      ev.stopPropagation();
      tg = $("button.fadebutton", ev.currentTarget.parentNode);
      tg.fadeIn('fast');
      if (tg.data("fader")) clearTimeout(tg.data("fader"));
      return tg.data("fader", setTimeout((function() {
        if (tg.css("display") !== "none") return tg.fadeOut('fast');
      }), 2500));
    };

    RightNow.prototype.editCategory = function(ev) {
      var cid, deleteCat, edit_render, maybeCatSave, tg;
      var _this = this;
      ev.stopPropagation();
      tg = $($(ev.currentTarget).closest('li.cat'));
      edit_render = function(cid, category) {
        return "<div class=\"edit-category\">" + ("<input type=\"text\" value=\"" + category + "\" id=\"edit-" + cid + "\" ") + "class=\"edit-task-field\" />" + ("<button class=\"delete-task-field\" id=\"del-" + cid + "\">&#x02A2F;</button>") + "</div>";
      };
      cid = this.catOnly(tg);
      tg.html(edit_render(cid, this.todos[cid].name));
      deleteCat = function(ev) {
        ev.stopPropagation();
        if (_this.todos[cid].tasks.length) {
          alert("You cannot delete a category with existing tasks");
          return;
        }
        _this.todos = _this.todos.slice(0, cid).concat(_this.todos.slice(cid + 1, _this.todos.length));
        return _this.save();
      };
      maybeCatSave = function(ev) {
        var catSave, code;
        catSave = function() {
          _this.todos[cid].name = $('.edit-task-field', tg).val();
          return _this.save();
        };
        code = ev.keyCode ? ev.keyCode : ev.which;
        if (code === 13) return catSave();
        if (code === 27) return _this.cleanAndRender();
      };
      $('.edit-category', tg).on('click', function(ev) {
        return ev.stopPropagation();
      });
      $('input.edit-task-field', tg).on('keyup', maybeCatSave);
      $('.delete-task-field', tg).on('click', deleteCat);
      return $('input.edit-task-field', tg).focus();
    };

    RightNow.prototype.newCategory = function(ev) {
      var edit_render, maybeNewCatSave, tg;
      var _this = this;
      ev.stopPropagation();
      edit_render = "<div class=\"edit-category\">" + "<input type=\"text\" id=\"edit-new-cid\" class=\"edit-task-field\" />" + "<button class=\"delete-task-field\" id=\"del-new-cid\">&#x02A2F;</button>" + "</div>";
      tg = $('#categorylist').append('<li class="category editing newcategory">' + edit_render + '</li>');
      maybeNewCatSave = function(ev) {
        var catSave, code;
        catSave = function() {
          _this.todos.push({
            'name': $('#edit-new-cid').val(),
            tasks: []
          });
          return _this.save();
        };
        code = ev.keyCode ? ev.keyCode : ev.which;
        if (code === 13) return catSave();
        if (code === 27) return _this.cleanAndRender();
      };
      $('.edit-category', tg).on('click', function(ev) {
        return ev.stopPropagation();
      });
      $('input.edit-task-field', tg).on('keyup', maybeNewCatSave);
      $('.delete-task-field', tg).on('click', this.render);
      return $('input.edit-task-field', tg).focus();
    };

    RightNow.prototype.editTask = function(ev) {
      var cid, deleteTask, edit_render, maybeTaskSave, tg, tid, _ref;
      var _this = this;
      ev.stopPropagation();
      tg = $(ev.currentTarget);
      edit_render = function(cid, tid, task) {
        return "<div class=\"edit-task\">" + ("<input type=\"text\" value=\"" + task + "\" id=\"edit-" + cid + "-" + tid + "\" ") + "class=\"edit-task-field\" />" + ("<button class=\"delete-task-field\" id=\"del-" + cid + "-" + tid + "\">&#x02A2F;</button>") + "</div>";
      };
      _ref = this.catAndTask(tg), cid = _ref[0], tid = _ref[1];
      tg.html(edit_render(cid, tid, this.todos[cid].tasks[tid]));
      deleteTask = function(ev) {
        var t;
        ev.stopPropagation();
        t = _this.todos[cid].tasks;
        _this.todos[cid].tasks = t.slice(0, tid).concat(t.slice(tid + 1, t.length));
        return _this.save();
      };
      maybeTaskSave = function(ev) {
        var code, taskSave;
        taskSave = function() {
          var val;
          val = $('.edit-task-field', tg).val();
          if (val.trim() === "") return deleteTask(ev);
          _this.todos[cid].tasks[tid] = val;
          return _this.save();
        };
        code = ev.keyCode ? ev.keyCode : ev.which;
        if (code === 13) return taskSave();
        if (code === 27) return _this.cleanAndRender();
      };
      $('.edit-category', tg).on('click', function(ev) {
        return ev.stopPropagation();
      });
      $('input.edit-task-field', tg).on('keyup', maybeTaskSave);
      $('.delete-task-field', tg).on('click', deleteTask);
      return $('input.edit-task-field', tg).focus();
    };

    RightNow.prototype.newTask = function(ev) {
      var cid, edit_render, maybeNewTaskSave, tg;
      var _this = this;
      ev.stopPropagation();
      edit_render = "<div class=\"edit-task\">" + "<input type=\"text\" value=\"\" id=\"edit-new-task\" " + "class=\"edit-task-field\" />" + "<button class=\"delete-task-field\" id=\"del-new-task\">&#x02A2F;</button>" + "</div>";
      cid = this.catOnly(ev.currentTarget);
      tg = $("#tasklist-" + cid).append('<li class="task editing newcategory">' + edit_render + '</li>');
      maybeNewTaskSave = function(ev) {
        var code, taskSave;
        taskSave = function() {
          _this.todos[cid].tasks.push($('#edit-new-task').val());
          return _this.save();
        };
        code = ev.keyCode ? ev.keyCode : ev.which;
        if (code === 13) return taskSave();
        if (code === 27) return _this.cleanAndRender();
      };
      $('.edit-category', tg).on('click', function(ev) {
        return ev.stopPropagation();
      });
      $('input.edit-task-field', tg).on('keyup', maybeNewTaskSave);
      $('.delete-task-field', tg).on('click', this.render);
      return $('input.edit-task-field', tg).focus();
    };

    RightNow.prototype.clean = function() {
      var c, t;
      return this.todos = (function() {
        var _i, _len, _ref, _results;
        _ref = this.todos;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          if (c.name.trim() !== "") {
            _results.push({
              name: c.name,
              tasks: (function() {
                var _j, _len2, _ref2, _results2;
                _ref2 = c.tasks;
                _results2 = [];
                for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                  t = _ref2[_j];
                  if (t.trim() !== "") _results2.push(t);
                }
                return _results2;
              })()
            });
          }
        }
        return _results;
      }).call(this);
    };

    RightNow.prototype.cleanAndRender = function() {
      this.clean();
      return this.render();
    };

    RightNow.prototype.render = function() {
      var cat_render;
      cat_render = function(cat) {
        var cat_enumerate, cat_renderer, i, tasks_render;
        cat_enumerate = function(c) {
          var i, _ref, _results;
          if (c.length === 0) return [];
          _results = [];
          for (i = 0, _ref = c.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            _results.push({
              idx: i,
              name: c[i].name,
              tasks: c[i].tasks
            });
          }
          return _results;
        };
        cat_renderer = function(c, rendered_tasks) {
          return ("<li id=\"cat-" + c.idx + "\" class=\"cat\">") + "<div class=\"catcontainer\">" + ("<div class=\"category\" id=\"cdv-" + c.idx + "\" >" + c.name + "</div>") + ("<button class=\"fadebutton editcat\" id=\"cec-" + c.idx + "\" style=\"display:none\">Edit Category</button>") + ("<button class=\"fadebutton addstory\" id=\"cas-" + c.idx + "\" style=\"display:none\">+ New Project</button>") + ("</div></div>" + rendered_tasks + "</li>");
        };
        tasks_render = function(cid, tasks) {
          var t, task_enumerate, tasks_renderer;
          task_enumerate = function(t) {
            var i, _ref, _results;
            if (t.length === 0) return [];
            _results = [];
            for (i = 0, _ref = t.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              _results.push({
                idx: i,
                task: t[i]
              });
            }
            return _results;
          };
          tasks_renderer = function(cid, tid, task) {
            return "<li id=\"cat-" + cid + "-" + tid + "\" class=\"task\"><div>" + task + "</div></li>";
          };
          return ("<ul class=\"tasklist\" id=\"tasklist-" + cid + "\">") + ((function() {
            var _i, _len, _ref, _results;
            _ref = task_enumerate(tasks);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              t = _ref[_i];
              _results.push(tasks_renderer(cid, t.idx, t.task));
            }
            return _results;
          })()).join("") + "</ul>";
        };
        return "<ul id=\"categorylist\">" + ((function() {
          var _i, _len, _ref, _results;
          _ref = cat_enumerate(cat);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(cat_renderer(i, tasks_render(i.idx, i.tasks)));
          }
          return _results;
        })()).join("") + "</ul>";
      };
      $('#todos').html(cat_render(this.todos));
      $('div.category').on('click', this.showAddButton);
      $('.editcat').on('click', this.editCategory);
      $('.addstory').on('click', this.newTask);
      return $('li.task').on('click', this.editTask);
    };

    return RightNow;

  })();

  $(function() {
    var rightnow;
    return rightnow = new Lawnchair({
      name: 'RightNow'
    }, function() {
      var handler;
      return handler = new RightNow(this);
    });
  });

}).call(this);

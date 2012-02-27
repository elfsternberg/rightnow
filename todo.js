(function() {
  var RightNow;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  RightNow = (function() {

    function RightNow(repo) {
      var _this = this;
      this.repo = repo;
      this.editTask = __bind(this.editTask, this);
      this.newTask = __bind(this.newTask, this);
      this.deleteTask = __bind(this.deleteTask, this);
      this.maybeTaskSave = __bind(this.maybeTaskSave, this);
      this.endEdits = __bind(this.endEdits, this);
      this.showAddButton = __bind(this.showAddButton, this);
      this.repo.get('rightnow', function(cat) {
        _this.todos = cat.rightnow;
        _this.render();
        return $('body').on('click', _this.endEdits);
      });
    }

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

    RightNow.prototype.cat_render = function(cat) {
      var cat_enumerate, cat_renderer, i, task_enumerate, tasks_render, tasks_renderer;
      cat_enumerate = function(c) {
        var i, _ref, _results;
        _results = [];
        for (i = 0, _ref = c.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          _results.push([i, c[i].name, c[i].tasks]);
        }
        return _results;
      };
      cat_renderer = function(c, r) {
        return ("<li id=\"cat-" + i[0] + "\"><div class=\"catcontainer\"><div class=\"category\">" + i[1] + "</div>") + "<button class=\"fadebutton addstory\" style=\"display:none\">+ New Project</button>" + ("<button class=\"fadebutton editcat\" style=\"display:none\">Edit Category</button></div>" + r + "</li>");
      };
      task_enumerate = function(t) {
        var i, _ref, _results;
        _results = [];
        for (i = 0, _ref = t.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          _results.push([i, t[i]]);
        }
        return _results;
      };
      tasks_renderer = function(cid, tid, task) {
        return "<li id=\"cat-" + cid + "-" + tid + "\" class=\"task\"><div>" + task + "</div></li>";
      };
      tasks_render = function(cid, tasks) {
        var i;
        if (!tasks.length) return "";
        return "<ul>" + ((function() {
          var _i, _len, _ref, _results;
          _ref = task_enumerate(tasks);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(tasks_renderer(cid, i[0], i[1]));
          }
          return _results;
        })()).join("") + "</ul>";
      };
      return "<ul>" + ((function() {
        var _i, _len, _ref, _results;
        _ref = cat_enumerate(cat);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(cat_renderer(i, tasks_render(i[0], i[2])));
        }
        return _results;
      })()).join("") + "</ul>";
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

    RightNow.prototype.endEdits = function() {
      var _this = this;
      return $('li.editing').each(function(i, el) {
        var cid, tid, _ref;
        $(el).removeClass('editing');
        _ref = _this.catAndTask(el), cid = _ref[0], tid = _ref[1];
        if (!(_this.todos[cid].tasks[tid] != null)) {
          return $(el).remove();
        } else {
          return $(el).html(_this.todos[cid].tasks[tid]);
        }
      });
    };

    RightNow.prototype.cleanAndEndEdits = function() {
      var c, t;
      this.todos = (function() {
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
      return this.endEdits();
    };

    RightNow.prototype.save = function() {
      var _this = this;
      return this.repo.save({
        key: 'rightnow',
        'rightnow': this.todos
      }, function() {
        return _this.render();
      });
    };

    RightNow.prototype.taskSave = function(ev, tg) {
      var cid, t, tid, val, _ref;
      val = tg.val();
      _ref = this.catAndTask(tg), cid = _ref[0], tid = _ref[1];
      t = this.todos[cid].tasks;
      this.todos[cid].tasks = val.trim() === "" ? t.slice(0, tid).concat(t.slice(tid + 1, t.length)) : t.slice(0, tid).concat([val]).concat(t.slice(tid + 1));
      return this.save();
    };

    RightNow.prototype.maybeTaskSave = function(ev) {
      var cid, code, tg, tid, _ref;
      console.log(ev);
      code = ev.keyCode ? ev.keyCode : ev.which;
      tg = $(ev.currentTarget);
      _ref = this.catAndTask(tg), cid = _ref[0], tid = _ref[1];
      if (code === 13) return this.taskSave(ev, tg);
      if (code === 27) return this.cleanAndEndEdits();
    };

    RightNow.prototype.deleteTask = function(ev) {
      var cid, t, tg, tid, _ref;
      ev.stopPropagation();
      tg = $(ev.currentTarget);
      console.log(tg);
      _ref = this.catAndTask(tg), cid = _ref[0], tid = _ref[1];
      t = this.todos[cid].tasks;
      this.todos[cid].tasks = t.slice(0, tid).concat(t.slice(tid + 1, t.length));
      return this.save();
    };

    RightNow.prototype.editRender = function(tg) {
      var cid, edit_render, task, tid, _ref;
      var _this = this;
      if (tg.hasClass('editing')) return;
      this.endEdits();
      _ref = this.catAndTask(tg), cid = _ref[0], tid = _ref[1];
      if (cid === null || cid === null) return;
      task = this.todos[cid].tasks[tid];
      if (task === null) return;
      console.log(tg, cid, tid, "[" + task + "]");
      edit_render = function(cid, tid, task) {
        return "<div class=\"edit-task\">" + ("<input type=\"text\" value=\"" + task + "\" id=\"edit-" + cid + "-" + tid + "\" ") + "class=\"edit-task-field\" />" + ("<button class=\"delete-task-field\" id=\"del-" + cid + "-" + tid + "\">&#x02A2F;</button>") + "</div>";
      };
      tg.addClass('editing');
      tg.html(edit_render(cid, tid, task));
      $('input.edit-task-field', tg).on('keyup', this.maybeTaskSave);
      $('.edit-task', tg).on('click', function(ev) {
        return ev.stopPropagation();
      });
      $('.delete-task-field', tg).on('click', this.deleteTask);
      return $('input.edit-task-field', tg).focus();
    };

    RightNow.prototype.editCatRender = function(tg) {
      var cid, edit_render, task, tid, _ref;
      var _this = this;
      if (tg.hasClass('editing')) return;
      this.endEdits();
      _ref = this.catAndTask(tg), cid = _ref[0], tid = _ref[1];
      if (cid === null || cid === null) return;
      task = this.todos[cid].tasks[tid];
      if (task === null) return;
      console.log(tg, cid, tid, "[" + task + "]");
      edit_render = function(cid, tid, task) {
        return "<div class=\"edit-task\">" + ("<input type=\"text\" value=\"" + task + "\" id=\"edit-" + cid + "-" + tid + "\" ") + "class=\"edit-task-field\" />" + ("<button class=\"delete-task-field\" id=\"del-" + cid + "-" + tid + "\">&#x02A2F;</button>") + "</div>";
      };
      tg.addClass('editing');
      tg.html(edit_render(cid, tid, task));
      $('input.edit-task-field', tg).on('keyup', this.maybeTaskSave);
      $('.edit-task', tg).on('click', function(ev) {
        return ev.stopPropagation();
      });
      $('.delete-task-field', tg).on('click', this.deleteTask);
      return $('input.edit-task-field', tg).focus();
    };

    RightNow.prototype.newTask = function(ev) {
      var cid, tg, tid;
      var _this = this;
      ev.stopPropagation();
      tg = $($(ev.currentTarget).closest('li'));
      $('.fadebutton', tg).hide();
      cid = this.catOnly(tg);
      tid = this.todos[cid].tasks.length;
      this.todos[cid].tasks.push("");
      $("li#cat-" + cid + " ul").append("<li id=\"cat-" + cid + "-" + tid + "\" class=\"task\"></li>");
      return setTimeout((function() {
        return _this.editRender($("#cat-" + cid + "-" + tid));
      }), 10);
    };

    RightNow.prototype.editTask = function(ev) {
      var tg;
      ev.stopPropagation();
      tg = $(ev.currentTarget);
      return this.editRender(tg);
    };

    RightNow.prototype.connect = function() {};

    RightNow.prototype.render = function() {
      $('#todos').html(this.cat_render(this.todos));
      $('div.category').on('click', this.showAddButton);
      $('#newcat h1').on('click', this.showAddButton);
      $('li.task').on('click', this.editTask);
      return $('.addstory').on('click', this.newTask);
    };

    return RightNow;

  })();

  $(function() {
    var rightnow;
    return rightnow = new Lawnchair({
      name: 'RightNow'
    }, function(rightnow) {
      var handler;
      return handler = new RightNow(rightnow);
    });
  });

}).call(this);

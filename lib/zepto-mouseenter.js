
function addEvent(_elem, _evtName, _fn, _useCapture)
{
   if (typeof _elem.addEventListener != 'undefined')
   {
      if (_evtName === 'mouseenter')
         { _elem.addEventListener('mouseover', mouseEnter(_fn), _useCapture); }
      else if (_evtName === 'mouseleave')
         { _elem.addEventListener('mouseout', mouseEnter(_fn), _useCapture); }
      else
         { _elem.addEventListener(_evtName, _fn, _useCapture); }
   }
   else if (typeof _elem.attachEvent != 'undefined')
   {
      _elem.attachEvent('on' + _evtName, _fn);
   }
   else
   {
      _elem['on' + _evtName] = _fn;
   }
}
function mouseEnter(_fn)
{
   return function(_evt)
   {
      var relTarget = _evt.relatedTarget;
      if (this === relTarget || isAChildOf(this, relTarget))
         { return; }

      _fn.call(this, _evt);
   }
};

function isAChildOf(_parent, _child)
{
   if (_parent === _child) { return false; }
      while (_child && _child !== _parent)
   { _child = _child.parentNode; }

   return _child === _parent;
}






['mouseenter', 'mouseleave'].forEach(function(name) {
    $.fn[name] = function(callback) {
        if (callback) this.bind(name, callback);
        else if (this.length) try { this.get(0)[name]() } catch(e){};
        return this;
    };
}




    

$.fn['mouseleave'] = function(callback) {


+  function createWrapperFunction(element, eventName, handler) {
+    return function(event) {
+      if (!Event || !Event.extend ||
+       (event.eventName && event.eventName != eventName))
+        return false;
+
+      handler.call(element, Event.extend(event));
+    };
+  }
+
+  if (!Prototype.Browser.IE) {
+    var events = { enter: 'over', leave: 'out' },
+     isEnterLeave = /^mouse(enter|leave)$/;
+
+    getDOMEventName = getDOMEventName.wrap(function(proceed, eventName) {
+      var EL = isEnterLeave.exec(eventName);
+      if (EL) eventName = 'mouse' + events[EL[1]];
+      return proceed(eventName);
+    });
+
+    createWrapperFunction = createWrapperFunction.wrap(function(proceed, element, eventName, handler) {
+      var wrapper = proceed(element, eventName, handler);
+      if (isEnterLeave.test(eventName)) {
+        wrapper = wrapper.wrap(function(proceed, event) {
+          var parent = event.relatedTarget;
+          while (parent && parent != element) {
+            try { parent = parent.parentNode; }
+            catch(e) { parent = element; }
+          }
+          if (parent == element) return;
+          proceed(event);
+        });
+      }
+      return wrapper;
+    });
+  }
+
   function getCacheForID(id) {
     return cache[id] = cache[id] || { };
   }
@@ -177,15 +214,9 @@ Object.extend(Event, (function() {
 
     var w = getWrappersForEventName(id, eventName);
     if (w.pluck("handler").include(handler)) return false;
-    
-    var wrapper = function(event) {
-      if (!Event || !Event.extend ||
-        (event.eventName && event.eventName != eventName))
-          return false;
-      
-      handler.call(element, Event.extend(event));
-    };
-    
+
+    var wrapper = createWrapperFunction(element, eventName, handler);
+
     wrapper.handler = handler;
     w.push(wrapper);
     return wrapper;
-- 
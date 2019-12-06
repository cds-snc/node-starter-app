export const Repeater = (function() {
  "use strict"

  var repeatedSets

  // Since we can't depend on Array.prototype.map
  function map(arr, fn) {
    var out = new Array(arr.length)
    arr.forEach(function(x, i) { out[i] = fn(x, i) })
    return out
  }

  function indexBy(key, arr) {
    var out = {}
    arr.forEach(function(x) { out[x[key]] = x })
    return out
  }

  // a Block is the largest grouping in the repeater. It contains all the repeated
  // instances.
  function Block() { this.init.apply(this, arguments) }
  (function(_) {
    _.init = function(el) {
      var self = this // closure fix

      this.name = el.id
      this.container = el

      this.instances = map(el.querySelectorAll('.repeater-instance'), function(fieldset, i) {
        var instance = new Instance(self, fieldset, i)
        instance.reindex(i)
        return instance
      })
    }

    _.setupListeners = function() {
      // we use one global listener for removal, because the repeat links may
      // get added and removed from the DOM, and this means we don't have to
      // re-register the event listeners when we clone the nodes.
      handleLinkInteraction(this.container, function(evt) {
        if (!evt.target.classList.contains('remove-repeat-link')) return
        evt.preventDefault()
        var instance = instanceFor(evt.target)
        instance && instance.remove()
      })

      return this
    }

    _.repeat = function() {
      if (!this.instances.length) throw new Error('empty instances, can\'t repeat!')

      var newIndex = this.instances.length
      var newEl = this.instances[0].el.cloneNode(true)
      var newInstance = new Instance(this, newEl, newIndex)
      newInstance.reindex(newIndex, true)
      this.container.appendChild(newEl)
      this.instances.push(newInstance)
      return newInstance
    }
  })(Block.prototype)

  // one instance of a repeater
  function Instance() { return this.init.apply(this, arguments) }
  (function(_) {
    // private functions
    function reindex(str, index) {
      // it's always going to be the first [0] or [1] or etc.
      return str.replace(/\[\d+\]/, '['+index+']')
    }

    function reindexProp(el, prop, index) {
      var current = el.getAttribute(prop)
      if (!current) return
      el.setAttribute(prop, reindex(current, index))
    }

    function clearField(control) {
      if (control.tagName === 'textarea') {
        control.innerText = ''
      }
      else if (control.type === 'radio' || control.type === 'checkbox') {
        control.checked = false
      }
      else {
        control.value = ''
      }
    }

    _.init = function(block, el, index) {
      this.block = block
      this.el = el
      this.index = index
    }

    _.reindex = function(newIndex, clear) {
      this.index = newIndex

      reindexProp(this.el, 'name', newIndex)
      this.el.dataset.index = newIndex

      this.el.querySelectorAll('input,textarea,select').forEach(function(control) {
        reindexProp(control, 'name', newIndex)
        reindexProp(control, 'id', newIndex)
        reindexProp(control, 'aria-describedby', newIndex)
        if (clear) clearField(control)
      })

      this.el.querySelectorAll('label').forEach(function(label) {
        reindexProp(label, 'for', newIndex)
      })

      this.el.querySelectorAll('.validation-message').forEach(function(error) {
        reindexProp(error, 'id', newIndex)
      })

      this.el.querySelectorAll('.remove-repeat-link').forEach(function(link) {
        reindexProp(link, 'id', newIndex)
      })

      // special elements that show the user which number they're looking at
      this.el.querySelectorAll('.repeat-number').forEach(function(el) {
        el.innerText = ''+(newIndex+1)
      })

      return this
    }

    _.clear = function() {
      var first
      this.el.querySelectorAll('input,textarea,select').forEach(function(el) {
        if (!first) first = el
        clearField(el)
      })

      if (first) first.focus()
      return this
    }

    _.focus = function() {
      var first = this.el.querySelector('input,textarea,select')
      if (first) first.focus()
    }

    _.remove = function() {
      // if we're the last one, we should just empty the fields
      if (this.block.instances.length === 1) return this.clear()

      // remove the DOM element
      this.el.parentElement.removeChild(this.el)

      // reindex everything that comes after, updating name and label attributes
      for (var i = this.index+1; i < this.block.instances.length; i += 1) {
        this.block.instances[i].reindex(i - 1)
      }

      // remove from the list of instances
      this.block.instances.splice(this.index, 1)

      // focus the next fieldset if it exists, otherwise the last one
      var adjacent = this.block.instances[this.index] || this.block.instances[this.index-1]
      if (adjacent) adjacent.focus()

      return this
    }

  })(Instance.prototype)

  function repeat(name) {
    repeatedSets[name] && repeatedSets[name].repeat()
  }

  function instanceFor(el) {
    var fieldset = el.closest('.repeater-instance')
    if (!fieldset) return null

    var match = fieldset.name.match(/^\w+/)
    if (!match) return null

    var blockName = match[0]
    var index = parseInt(fieldset.dataset.index)

    var block = repeatedSets[blockName]
    if (!block) return null

    return block.instances[index]
  }

  function init() {
    repeatedSets = indexBy('name',
      map(document.querySelectorAll('.repeater'), function(el) {
        return new Block(el).setupListeners()
      }))

    // repeat links are expected to be *outside* the repeater, so can manage
    // their own event listeners.
    document.querySelectorAll('.repeat-link').forEach(function(link) {
      handleLinkInteraction(link, function(evt) {
        evt.preventDefault()
        repeat(link.dataset.target)
      })
    })
  }

  function handleLinkInteraction(el, handler) {
    el.addEventListener('click', handler)
    el.addEventListener('keydown', function(evt) {
      // spacebar
      if (evt.keyCode !== 32) return
      handler(evt)
    })
  }

  return {
    repeat: repeat,
    init: init
  }
})()

// we are run at the bottom of the page, all necessary elements should have loaded
Repeater.init()

export const Repeater = (() => {
  "use strict"

  var repeatedSets

  // mapping things that aren't quite arrays
  const map = (arr, fn) => Array.prototype.map.call(arr, fn)
  const query = (q, el=document) => el.querySelectorAll(q)

  const indexBy = (key, arr) => {
    var out = {}
    arr.forEach(x => { out[x[key]] = x })
    return out
  }

  // a Block is the largest grouping in the repeater. It contains all the repeated
  // instances.
  class Block {
    constructor(el) {
      var self = this // closure fix

      this.name = el.id
      this.container = el

      this.instances = map(query('.repeater-instance', el), (fieldset, i) => {
        var instance = new Instance(self, fieldset, i)
        instance.reindex(i)
        return instance
      })
    }

    setupListeners() {
      // we use one global listener for removal, because the repeat links may
      // get added and removed from the DOM, and this means we don't have to
      // re-register the event listeners when we clone the nodes.
      this.container.addEventListener('click', (evt) => {
        if (!evt.target.classList.contains('remove-repeat-link')) return
        evt.preventDefault()
        var instance = instanceFor(evt.target)
        instance && instance.remove()
      })

      return this
    }

    repeat() {
      if (!this.instances.length) throw new Error('empty instances, can\'t repeat!')

      var newIndex = this.instances.length
      var newEl = this.instances[0].el.cloneNode(true)
      var newInstance = new Instance(this, newEl, newIndex)
      newInstance.reindex(newIndex, true)
      this.container.appendChild(newEl)
      this.instances.push(newInstance)
      newInstance.focus()
      return newInstance
    }
  }

  const reindex = (str, index) => {
    // it's always going to be the first [0] or [1] or etc.
    return str.replace(/\[\d+\]/, '['+index+']')
  }

  const reindexProp = (el, prop, index) => {
    var current = el.getAttribute(prop)
    if (!current) return
    el.setAttribute(prop, reindex(current, index))
  }

  const clearField = (control) => {
    if (control.tagName === 'textarea') {
      control.innerText = ''
    }
    else if (control.type === 'radio' || control.type === 'checkbox') {
      control.checked = false
    }
    else {
      control.value = null
    }
  }

  // one instance of a repeater
  class Instance {
    // private functions
    constructor(block, el, index) {
      this.block = block
      this.el = el
      this.index = index
    }

    reindex(newIndex, clear) {
      this.index = newIndex

      reindexProp(this.el, 'name', newIndex)
      this.el.dataset.index = newIndex

      query('input,textarea,select', this.el).forEach(control => {
        reindexProp(control, 'name', newIndex)
        reindexProp(control, 'id', newIndex)
        reindexProp(control, 'aria-describedby', newIndex)
        if (clear) clearField(control)
      })

      query('label', this.el).forEach(label => {
        reindexProp(label, 'for', newIndex)
      })

      query('.validation-message', this.el).forEach(error => {
        reindexProp(error, 'id', newIndex)
      })

      query('.remove-repeat-link', this.el).forEach(link => {
        reindexProp(link, 'id', newIndex)
      })

      // special elements that show the user which number they're looking at
      query('.repeat-number', this.el).forEach(el => {
        el.innerText = ''+(newIndex+1)
      })

      return this
    }

    clear() {
      var first
      query('input,textarea,select', this.el).forEach(el => {
        if (!first) first = el
        clearField(el)
      })

      if (first) first.focus()
      return this
    }

    focus() {
      var first = this.el.querySelector('input,textarea,select')
      if (first) first.focus()
    }

    remove() {
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

  }

  const repeat = (name) => {
    repeatedSets[name] && repeatedSets[name].repeat()
  }

  const instanceFor = (el) => {
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

  const init = () => {
    repeatedSets = indexBy('name',
      map(query('.repeater'), (el) => {
        return new Block(el).setupListeners()
      }))

    // repeat links are expected to be *outside* the repeater, so can manage
    // their own event listeners.
    query('.repeat-link').forEach(link => {
      link.addEventListener('click', (evt) => {
        evt.preventDefault()
        repeat(link.dataset.target)
      })
    })
  }

  return {
    repeat: repeat,
    init: init
  }
})()

// we are run at the bottom of the page, all necessary elements should have loaded
Repeater.init()
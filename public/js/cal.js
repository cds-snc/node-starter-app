!(function(t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : (t.dayjs = e())
})(this, function() {
  'use strict'
  var t = 'millisecond',
    e = 'second',
    n = 'minute',
    r = 'hour',
    s = 'day',
    i = 'week',
    a = 'month',
    u = 'year',
    c = /^(\d{4})-?(\d{1,2})-?(\d{0,2})(.*?(\d{1,2}):(\d{1,2}):(\d{1,2}))?.?(\d{1,3})?$/,
    o = /\[.*?\]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
    h = {
      name: 'en',
      weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
        '_',
      ),
      months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
        '_',
      ),
    },
    d = function(t, e, n) {
      var r = String(t)
      return !r || r.length >= e ? t : '' + Array(e + 1 - r.length).join(n) + t
    },
    f = {
      padStart: d,
      padZoneStr: function(t) {
        var e = Math.abs(t),
          n = Math.floor(e / 60),
          r = e % 60
        return (t <= 0 ? '+' : '-') + d(n, 2, '0') + ':' + d(r, 2, '0')
      },
      monthDiff: function(t, e) {
        var n = 12 * (e.year() - t.year()) + (e.month() - t.month()),
          r = t.clone().add(n, 'months'),
          s = e - r < 0,
          i = t.clone().add(n + (s ? -1 : 1), 'months')
        return Number(-(n + (e - r) / (s ? r - i : i - r)))
      },
      absFloor: function(t) {
        return t < 0 ? Math.ceil(t) || 0 : Math.floor(t)
      },
      prettyUnit: function(c) {
        return (
          { M: a, y: u, w: i, d: s, h: r, m: n, s: e, ms: t }[c] ||
          String(c || '')
            .toLowerCase()
            .replace(/s$/, '')
        )
      },
      isUndefined: function(t) {
        return void 0 === t
      },
    },
    $ = 'en',
    l = {}
  l[$] = h
  var m = function(t) {
      return t instanceof D
    },
    y = function(t, e, n) {
      var r
      if (!t) return null
      if ('string' == typeof t) l[t] && (r = t), e && ((l[t] = e), (r = t))
      else {
        var s = t.name
        ;(l[s] = t), (r = s)
      }
      return n || ($ = r), r
    },
    M = function(t, e) {
      if (m(t)) return t.clone()
      var n = e || {}
      return (n.date = t), new D(n)
    },
    S = function(t, e) {
      return M(t, { locale: e.$L })
    },
    p = f
  ;(p.parseLocale = y), (p.isDayjs = m), (p.wrapper = S)
  var D = (function() {
    function h(t) {
      this.parse(t)
    }
    var d = h.prototype
    return (
      (d.parse = function(t) {
        var e, n
        ;(this.$d =
          null === (e = t.date)
            ? new Date(NaN)
            : p.isUndefined(e)
            ? new Date()
            : e instanceof Date
            ? e
            : 'string' == typeof e && /.*[^Z]$/i.test(e) && (n = e.match(c))
            ? new Date(
                n[1],
                n[2] - 1,
                n[3] || 1,
                n[5] || 0,
                n[6] || 0,
                n[7] || 0,
                n[8] || 0,
              )
            : new Date(e)),
          this.init(t)
      }),
      (d.init = function(t) {
        ;(this.$y = this.$d.getFullYear()),
          (this.$M = this.$d.getMonth()),
          (this.$D = this.$d.getDate()),
          (this.$W = this.$d.getDay()),
          (this.$H = this.$d.getHours()),
          (this.$m = this.$d.getMinutes()),
          (this.$s = this.$d.getSeconds()),
          (this.$ms = this.$d.getMilliseconds()),
          (this.$L = this.$L || y(t.locale, null, !0) || $)
      }),
      (d.$utils = function() {
        return p
      }),
      (d.isValid = function() {
        return !('Invalid Date' === this.$d.toString())
      }),
      (d.$compare = function(t) {
        return this.valueOf() - M(t).valueOf()
      }),
      (d.isSame = function(t) {
        return 0 === this.$compare(t)
      }),
      (d.isBefore = function(t) {
        return this.$compare(t) < 0
      }),
      (d.isAfter = function(t) {
        return this.$compare(t) > 0
      }),
      (d.year = function() {
        return this.$y
      }),
      (d.month = function() {
        return this.$M
      }),
      (d.day = function() {
        return this.$W
      }),
      (d.date = function() {
        return this.$D
      }),
      (d.hour = function() {
        return this.$H
      }),
      (d.minute = function() {
        return this.$m
      }),
      (d.second = function() {
        return this.$s
      }),
      (d.millisecond = function() {
        return this.$ms
      }),
      (d.unix = function() {
        return Math.floor(this.valueOf() / 1e3)
      }),
      (d.valueOf = function() {
        return this.$d.getTime()
      }),
      (d.startOf = function(t, c) {
        var o = this,
          h = !!p.isUndefined(c) || c,
          d = function(t, e) {
            var n = S(new Date(o.$y, e, t), o)
            return h ? n : n.endOf(s)
          },
          f = function(t, e) {
            return S(
              o
                .toDate()
                [t].apply(
                  o.toDate(),
                  h ? [0, 0, 0, 0].slice(e) : [23, 59, 59, 999].slice(e),
                ),
              o,
            )
          }
        switch (p.prettyUnit(t)) {
          case u:
            return h ? d(1, 0) : d(31, 11)
          case a:
            return h ? d(1, this.$M) : d(0, this.$M + 1)
          case i:
            return d(h ? this.$D - this.$W : this.$D + (6 - this.$W), this.$M)
          case s:
          case 'date':
            return f('setHours', 0)
          case r:
            return f('setMinutes', 1)
          case n:
            return f('setSeconds', 2)
          case e:
            return f('setMilliseconds', 3)
          default:
            return this.clone()
        }
      }),
      (d.endOf = function(t) {
        return this.startOf(t, !1)
      }),
      (d.$set = function(i, c) {
        switch (p.prettyUnit(i)) {
          case s:
            this.$d.setDate(this.$D + (c - this.$W))
            break
          case 'date':
            this.$d.setDate(c)
            break
          case a:
            this.$d.setMonth(c)
            break
          case u:
            this.$d.setFullYear(c)
            break
          case r:
            this.$d.setHours(c)
            break
          case n:
            this.$d.setMinutes(c)
            break
          case e:
            this.$d.setSeconds(c)
            break
          case t:
            this.$d.setMilliseconds(c)
        }
        return this.init(), this
      }),
      (d.set = function(t, e) {
        return this.clone().$set(t, e)
      }),
      (d.add = function(t, c) {
        var o = this
        t = Number(t)
        var h,
          d = p.prettyUnit(c),
          f = function(e, n) {
            var r = o.set('date', 1).set(e, n + t)
            return r.set('date', Math.min(o.$D, r.daysInMonth()))
          },
          $ = function(e) {
            var n = new Date(o.$d)
            return n.setDate(n.getDate() + e * t), S(n, o)
          }
        if (d === a) return f(a, this.$M)
        if (d === u) return f(u, this.$y)
        if (d === s) return $(1)
        if (d === i) return $(7)
        switch (d) {
          case n:
            h = 6e4
            break
          case r:
            h = 36e5
            break
          case e:
            h = 1e3
            break
          default:
            h = 1
        }
        var l = this.valueOf() + t * h
        return S(l, this)
      }),
      (d.subtract = function(t, e) {
        return this.add(-1 * t, e)
      }),
      (d.format = function(t) {
        var e = this,
          n = t || 'YYYY-MM-DDTHH:mm:ssZ',
          r = p.padZoneStr(this.$d.getTimezoneOffset()),
          s = this.$locale(),
          i = s.weekdays,
          a = s.months,
          u = function(t, e, n, r) {
            return (t && t[e]) || n[e].substr(0, r)
          }
        return n.replace(o, function(t) {
          if (t.indexOf('[') > -1) return t.replace(/\[|\]/g, '')
          switch (t) {
            case 'YY':
              return String(e.$y).slice(-2)
            case 'YYYY':
              return String(e.$y)
            case 'M':
              return String(e.$M + 1)
            case 'MM':
              return p.padStart(e.$M + 1, 2, '0')
            case 'MMM':
              return u(s.monthsShort, e.$M, a, 3)
            case 'MMMM':
              return a[e.$M]
            case 'D':
              return String(e.$D)
            case 'DD':
              return p.padStart(e.$D, 2, '0')
            case 'd':
              return String(e.$W)
            case 'dd':
              return u(s.weekdaysMin, e.$W, i, 2)
            case 'ddd':
              return u(s.weekdaysShort, e.$W, i, 3)
            case 'dddd':
              return i[e.$W]
            case 'H':
              return String(e.$H)
            case 'HH':
              return p.padStart(e.$H, 2, '0')
            case 'h':
            case 'hh':
              return 0 === e.$H
                ? 12
                : p.padStart(
                    e.$H < 13 ? e.$H : e.$H - 12,
                    'hh' === t ? 2 : 1,
                    '0',
                  )
            case 'a':
              return e.$H < 12 ? 'am' : 'pm'
            case 'A':
              return e.$H < 12 ? 'AM' : 'PM'
            case 'm':
              return String(e.$m)
            case 'mm':
              return p.padStart(e.$m, 2, '0')
            case 's':
              return String(e.$s)
            case 'ss':
              return p.padStart(e.$s, 2, '0')
            case 'SSS':
              return p.padStart(e.$ms, 3, '0')
            case 'Z':
              return r
            default:
              return r.replace(':', '')
          }
        })
      }),
      (d.diff = function(t, c, o) {
        var h = p.prettyUnit(c),
          d = M(t),
          f = this - d,
          $ = p.monthDiff(this, d)
        switch (h) {
          case u:
            $ /= 12
            break
          case a:
            break
          case 'quarter':
            $ /= 3
            break
          case i:
            $ = f / 6048e5
            break
          case s:
            $ = f / 864e5
            break
          case r:
            $ = f / 36e5
            break
          case n:
            $ = f / 6e4
            break
          case e:
            $ = f / 1e3
            break
          default:
            $ = f
        }
        return o ? $ : p.absFloor($)
      }),
      (d.daysInMonth = function() {
        return this.endOf(a).$D
      }),
      (d.$locale = function() {
        return l[this.$L]
      }),
      (d.locale = function(t, e) {
        var n = this.clone()
        return (n.$L = y(t, e, !0)), n
      }),
      (d.clone = function() {
        return S(this.toDate(), this)
      }),
      (d.toDate = function() {
        return new Date(this.$d)
      }),
      (d.toArray = function() {
        return [this.$y, this.$M, this.$D, this.$H, this.$m, this.$s, this.$ms]
      }),
      (d.toJSON = function() {
        return this.toISOString()
      }),
      (d.toISOString = function() {
        return this.toDate().toISOString()
      }),
      (d.toObject = function() {
        return {
          years: this.$y,
          months: this.$M,
          date: this.$D,
          hours: this.$H,
          minutes: this.$m,
          seconds: this.$s,
          milliseconds: this.$ms,
        }
      }),
      (d.toString = function() {
        return this.$d.toUTCString()
      }),
      h
    )
  })()
  return (
    (M.extend = function(t, e) {
      return t(e, D, M), M
    }),
    (M.locale = y),
    (M.isDayjs = m),
    (M.unix = function(t) {
      return M(1e3 * t)
    }),
    (M.en = l[$]),
    M
  )
})

/**
 * The following code is for demonstration purposes only. It is extremely verbose and procedural, with most front-end best practices not implemented in favor of being able to exhibit every step needed to make a fully accessible/ usable calendar.
 *
 * In any case, the real star of this example is the *HTML markup* used to provide proper accessibility. The HTML is what the users interact with, so you can choose any way you want to render it as long as the accessibility properties are intact.
 *
 * This code is provide for for 24 Accessibility article "A New Day: Making a Better Calendar" available at https://www.24a11y.com/2018/a-new-day-making-a-better-calendar/
 */

const prevButton = document.getElementById('previous')
const nextButton = document.getElementById('next')
const monthSelect = document.getElementById('month')
const yearSelect = document.getElementById('year')
const calendarSection = document.getElementById('Calendar-dates')
const calendarHelp = document.getElementById('Calendar-help-trigger')
const calendarUpdates = document.getElementById('Calendar-updates')
const currentDate = dayjs()
let selected = ''
let selectedDates = []
const holidays = {
  2019: {
    0: {
      1: {
        label: " New Year's day, Office Closed",
        isEnabled: false,
      },
    },
    4: {
      16: {
        label: 'Global Accessibility Awareness Day',
        isEnabled: true,
      },
    },
  },
}

/**************************************************************************
 * Important Accessibility Bits
 *
 * This is the special stuff to pay attention to. Everything else is just procedural stuff in support of this.
 *************************************************************************/

/**
 * Announce content to assistive technologies, such as dynamic updates based on changing calendar views or selecting a date.
 * @param  {String} content [The content to be announced to assistive technologies]
 * @return {void}
 */
const announce = content => {
  setText(calendarUpdates, content)

  setTimeout(function() {
    setText(calendarUpdates, '')
  }, 1000)
}

/**
 * Selecting a date updates important accessibility properties.
 *
 * If there is a currently selected date, it is reset:
 *   - aria-pressed is set to false.
 *   - tabindex is set to -1, to remove from natural tab flow.
 * With the newly selected date:
 *   - aria-pressed is set to true, to indicate selected state.
 *   - tabindex attribute is removed, effectively relying on the buttons natural focusable properties, placing it in the natural tab order.
 *   - The selection is announced to assistive technologies.
 *
 * @param  {HTMLButtonElement} date The button element that was selected.
 * @return {void}
 */
const selectDate = date => {
  const timestamp = date.getAttribute('data-timestamp')
  const calDay = date.getAttribute('data-day')

  if (selectedDates.includes(calDay)) {
    const found = selectedDates.findIndex(function(element) {
      return element === calDay
    })

    if (found >= 0) {
      selectedDates.splice(found, 1)
      date.setAttribute('aria-pressed', 'false')
      date.setAttribute('tabindex', '-1')
    }

    return
  }

  selectedDates.push(calDay)
  // ensure unique array
  selectedDates = [...new Set(selectedDates)]

  date.setAttribute('aria-pressed', 'true')
  date.removeAttribute('tabindex')

  selected = dayjs.unix(timestamp)

  announce(`selected ${date.getAttribute('aria-label')}`)
}

/**
 * Shows the keyboard shortcut information using a dialog pattern:
 *
 *  - Set aria-hidden to false, making the dialog visible to assistive technologies. CSS using [aria-hidden] is used to hide the dialog from sighted users.
 *  - Set focus on the dialogs first focusable element. Since the first, and only, focusable element is the close button at the bottom, focus is placed on the first paragraph, which has tabindex="-1" to make it programatically focusable, so that the instructions are not skipped over.
 *  - Event listeners are set.
 * @param  {Event} event
 * @return {void}
 */
const showDialog = () => {
  const dialog = document.getElementById('Calendar-help-dialog')
  dialog.setAttribute('aria-hidden', 'false')
  dialog.firstElementChild.focus()
  dialog.addEventListener('keydown', onDialogKeydown)
  dialog.addEventListener('click', onDialogUx)
  document.documentElement.setAttribute('tabindex', '-1')
  document.addEventListener('focus', onDialogUx, true)
}

/**
 * Close the keyboard shortcuts dialog by doing the following:
 *
 *  - Event handlers are cleaned up.
 *  - tabindex on the document is removed.
 *  - Set the aria-hidden to true, hiding the dialog from assistive technologies. CSS with selector [aria-hidden="true"] hides content with display: none.
 *  - The element that spawned the dialog is focused.
 * @return {void}
 */
const closeDialog = () => {
  const dialog = document.getElementById('Calendar-help-dialog')

  dialog.removeEventListener('keydown', onDialogKeydown)
  dialog.removeEventListener('click', onDialogUx)
  document.removeEventListener('focus', onDialogUx, true)
  document.documentElement.removeAttribute('tabindex')

  dialog.setAttribute('aria-hidden', 'true')
  calendarHelp.focus()
}

/**
 * Keydown handler for dialog.
 *
 * - Dialogs require ESC to close, and cycling tab within. Since there is only one interactive in this implementation, tab cycles between the close button and dialog container.
 * @param  {Event} event
 * @return {void}
 */
const onDialogKeydown = event => {
  const target = event.target

  if (event.key === 'Escape') {
    closeDialog()
    return
  }

  if (event.key === 'Tab') {
    const dialog = document.getElementById('Calendar-help-dialog')
    const close = document.getElementById('Calendar-help-close')

    if (event.shiftKey && target === dialog) {
      event.preventDefault()
      close.focus()
    } else if (target === close) {
      event.preventDefault()
      dialog.focus()
    }
  }
}

/**
 * Builds a date template with necessary accessibility properties:
 *
 *  1: A button element, with baked in accessibility for keyboard interaction. Button type set to "button" to replace the default value of "submit."
 *  2. aria-pressed, used for selection state. A value of "true" means that the date is selected. Default value is false.
 *  3. aria-label, used to provide an accessible name for the date, which includes the date first, then the day and month, and finally year. Any additional information, e.g. holiday information or disabled (unselectable) dates is also included.
 *  4. aria-current="date" is used to specify today's date on the calendar.
 *  5. tabindex is managed, most dates are set to tabindex="-1" which removes them from the natural tab order but makes them problematically focusable. The tabindex property is removed for the same day (today) of every month, and places that day in the natural focus order. In a natural tab sequence, this places that day in the next tab after the Keyboard shortcuts control. Any day could have been chosen, with more logic applied, but this was the easiest for this example.
 *
 * @param  {dayjs} day The dayjs object for the calendar day that needs to be rendered.
 * @param  {dayjs} month A dayjs object with reference to the currently selected month.
 * @param  {dayjs} today A dayjs object for today's date.
 * @return {String}     Returns a template for the calendar that needs to be rendered with all accessibility properties set.
 */

const isWeekend = day => {
  return day.$W === 0 || day.$W === 6
}

const isBlockedDay = (day, month) => {
  const blocked = [2, 5, 6, 9, 12, 13, 16, 19, 20, 23, 26, 27, 30]
  const d = day.$D
  if (blocked.includes(d)) return true
}

const getDateTemplate = (day, month, today) => {
  const hasHoliday = getHoliday(day)

  const isDisabled =
    day.$M !== month.$M ||
    isWeekend(day) ||
    (hasHoliday && !hasHoliday.isEnabled) ||
    isBlockedDay(day, month)
  const isCurrent = day.isSame(today)
  const isSelected = day.isSame(selected)

  return `<button
                class="Calendar-item ${
                  isDisabled
                    ? 'Calendar-item--unavailable'
                    : 'Calendar-item--active'
                } ${hasHoliday ? 'Calendar-item--holiday' : ''}"
                type="button"
                aria-pressed="${isSelected}"
                aria-label="${dayjs(day).format('D, dddd MMMM YYYY')}${
    hasHoliday ? `, ${hasHoliday.label}` : ''
  }${isDisabled ? ', Unavailable' : ''}"
                ${isCurrent ? 'aria-current="date"' : ''}
                ${day.$D !== today.$D ? 'tabindex="-1"' : ''}
                data-timestamp="${day.unix()}" data-day="day-${day.$D}">
                  ${day.$D}
              </button>`
}

/**
 * Keydown handler for Calendar date navigation. This calendar supports the following keys:
 *   - RIGHT, moves keyboard focus to the next day.
 *   - LEFT, moves keyboard focus to the previous day.
 *   - UP, moves keyboard focus to the same day in the previous week.
 *   - DOWN, moves keyboard focus to the same day in the next week.
 *   - HOME, moves keyboard focus to the first day of the month.
 *   - END, moves keyboard focus to the last day of the month.
 *   - PAGE UP, moves keyboard focus to the same day of the previous month.
 *   - PAGE DOWN, moves keyboard focus to the same day of the next month.
 * @param  {Event} event
 * @return {void}
 */
const onKeydown = event => {
  const target = event.target
  const key = event.key.replace('Arrow', '')
  let next = ''

  if (
    target.classList.contains('Calendar-item') &&
    key.match(/Up|Down|Left|Right|Home|End|PageUp|PageDown/)
  ) {
    switch (key) {
      case 'Right':
        if (target === getLastDate()) {
          nextMonth()
          next = getFirstDate()
        } else {
          next =
            target.nextElementSibling ||
            target.parentElement.nextElementSibling.firstElementChild
        }
        break
      case 'Left':
        if (target === getFirstDate()) {
          previousMonth()
          next = getLastDate()
        } else {
          next =
            target.previousElementSibling ||
            target.parentElement.previousElementSibling.lastElementChild
        }
        break
      case 'Up':
        if (target === getFirstDate()) {
          previousMonth()
          next = getLastDate()
        } else {
          const parent = target.parentElement
          const index = Array.from(parent.children).indexOf(target)
          const row = parent.previousElementSibling

          if (row) {
            next = row.children.item(index)
          }
        }
        break
      case 'Down':
        if (target === getLastDate()) {
          nextMonth()
          next = getFirstDate()
        } else {
          const parent = target.parentElement
          const index = Array.from(parent.children).indexOf(target)
          const row = parent.nextElementSibling

          if (row) {
            next = row.children.item(index)
          }
        }
        break
      case 'Home':
        next = getFirstDate()
        break
      case 'End':
        next = getLastDate()
        break
      case 'PageUp':
      case 'PageDown':
        if (key === 'PageUp') {
          previousMonth()
        } else {
          nextMonth()
        }
        next = Array.from(
          calendarSection.querySelectorAll('.Calendar-item'),
        ).find(date => date.textContent === target.textContent)
        break
      default:
    }
    event.preventDefault()

    if (next) {
      next.focus()
    } else {
      announce('end of calendar')
    }
  }
}

/**************************************************************************
 * The below is not relevant to providing accessibility, just a bunch of procedural DOM manipulation.
 *************************************************************************/

/**
 * Helpers
 */
const getIndex = (index, len, dir) => (index + len + dir) % len

const getDisplayedMonth = () =>
  dayjs(
    new Date(
      yearSelect.item(yearSelect.selectedIndex).value,
      monthSelect.selectedIndex,
      '1',
    ),
  )

const getFirstDate = () =>
  calendarSection.firstElementChild.querySelector(
    '.Calendar-item:first-of-type:not(.Calendar-item--empty)',
  )

const getLastDate = () =>
  calendarSection.lastElementChild.querySelector(
    '.Calendar-item:last-of-type:not(.Calendar-item--empty)',
  )

const getHoliday = date => {
  if (holidays[date.$y]) {
    if (holidays[date.$y][date.$M]) {
      if (holidays[date.$y][date.$M][date.$D]) {
        return holidays[date.$y][date.$M][date.$D]
      }
    }
  }
}

const setText = (node, text) => {
  let child = node.firstChild

  if (child && !child.nextSibling && child.nodeType === 3) {
    child.data = text
  } else {
    node.textContent = text
  }
}

/**
 * Event Handlers
 */

/**
 * Previous month control activated
 *
 * @return {void}
 */
const previousMonth = () => {
  const newMonth = getIndex(monthSelect.selectedIndex, monthSelect.length, -1)
  monthSelect.selectedIndex = newMonth

  if (newMonth === monthSelect.length - 1) {
    yearSelect.selectedIndex -= 1
  }
  updateUI()
}

/**
 * Next month control activated
 *
 * @return {void}
 */
const nextMonth = () => {
  const newMonth = getIndex(monthSelect.selectedIndex, monthSelect.length, 1)
  monthSelect.selectedIndex = newMonth

  if (newMonth === 0) {
    yearSelect.selectedIndex += 1
  }
  updateUI()
}

/**
 * User has requested to close the dialog
 *
 * @param  {Event} event
 * @return {void}
 */
const onDialogUx = event => {
  const target = event.target
  const dialog = document.getElementById('Calendar-help-dialog')
  const close = dialog.querySelector('.Calendar-help-close')

  if (
    !dialog.contains(target) ||
    (event.type === 'click' && target === close)
  ) {
    closeDialog()
  }
}

/**
 * Calendar date control was activated, either fine pointer (mouse, touch, pen) or keyboard (SPACE or ENTER)
 *
 * @param  {Event} event
 * @return {void}
 */
const onActivation = event => {
  const target = event.target
  if (target.classList.contains('Calendar-item--active')) {
    selectDate(target)
  }
}

/**
 * Updates UI elements based on calendar navigation, then announces changes to assistive technologies.
 *
 * @return {void} [description]
 */
const updateUI = () => {
  const prevMonth = getIndex(monthSelect.selectedIndex, monthSelect.length, -1)
  const prevYear =
    prevMonth === monthSelect.length - 1
      ? yearSelect.selectedIndex - 1
      : yearSelect.selectedIndex

  const nextMonth = getIndex(monthSelect.selectedIndex, month.length, 1)
  const nextYear =
    nextMonth === 0 ? yearSelect.selectedIndex + 1 : year.selectedIndex

  if (prevMonth === 0 && prevYear === 0) {
    prevButton.disabled = true
  } else {
    prevButton.disabled = false
    prevButton.setAttribute(
      'aria-label',
      'Previous month, ' +
        month.item(prevMonth).value +
        ' ' +
        year.item(prevYear).value,
    )
  }

  nextButton.setAttribute(
    'aria-label',
    `Next month, ${month.item(nextMonth).value} ${year.item(nextYear).value}`,
  )

  let update = `${monthSelect.value} ${year.value}`

  announce(update)

  renderDates(getDisplayedMonth())
}

/**
 * Renders the actual calendar grid.
 *
 * @param  {dayjs} date A dayjs object based on the currently selected month.
 *
 * @return {void}
 */
const renderDates = date => {
  let start = dayjs(date)
    .startOf('month')
    .startOf('week')
    .subtract(1, 'day')
  let end = dayjs(date)
    .endOf('month')
    .endOf('week')
    .subtract(1, 'day')
  let today = dayjs()
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
  let calendar = []

  while (start.isBefore(end)) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => {
          start = start.add(1, 'day')
          return start
        }),
    )
  }

  let grid = calendar.reduce((rowAcc, row) => {
    let days = row.reduce((dayAcc, day) => {
      day = day
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)

      if (day.$M !== date.$M) {
        return `${dayAcc}<span class="Calendar-item Calendar-item--empty"></span>`
      } else {
        return `${dayAcc}${getDateTemplate(day, date, today)}`
      }
    }, '')

    return `${rowAcc}<div class="Calendar-row">${days}</div>`
  }, '')

  calendarSection.innerHTML = ''
  calendarSection.insertAdjacentHTML('beforeEnd', grid)
}

/* Setup */
monthSelect.selectedIndex = currentDate.$M

yearSelect.selectedIndex = Array.from(yearSelect.options).findIndex(
  option => option.textContent == currentDate.$y,
)

/* Event Listeners */
monthSelect.addEventListener('change', updateUI)
yearSelect.addEventListener('change', updateUI)
prevButton.addEventListener('click', previousMonth)
nextButton.addEventListener('click', nextMonth)
calendarSection.addEventListener('click', onActivation)
calendarSection.addEventListener('keydown', onKeydown)
calendarHelp.addEventListener('click', showDialog)

/* Init */
updateUI()

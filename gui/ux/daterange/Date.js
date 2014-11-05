/**
 * This class specifies the definition for a date field inside a {@link Ext.ux.daterange.picker.Daterange}.
 * In general, this class will not be created directly. The number of date fields inside a date range is defined
 * via {@link #numberOfCalendars}. Via {@link #datePickerConfig} you can define optional extra configurations for each
 * Ext.ux.daterange.Date. All valid {@link Ext.picker.Date} configuration is accepted.
 */
Ext.define("Ext.ux.daterange.Date", {
	extend: 'Ext.picker.Date',
	xtype: 'daterangedate',

    /**
     * @cfg {Boolean} showPrevArrow
     * Show or hide navigation arrow for previous month. Default to true
     */
    showPrevArrow: true,

    /**
     * @cfg {Boolean} showNextArrow
     * Show or hide navigation arrow for next month. Default to false
     */
    showNextArrow: true,


    /**
     * @cfg {String} Css class for start date. Default x-datepicker-start
     */
    /**
     * @cfg {String} Css class for end date. Default x-datepicker-end
     */

	initComponent: function() {
		var me = this,
			days = new Array(me.numDays);

        //Apply additional render data for template
		me.renderData = {};
		me.renderData.showPrevArrow = me.showPrevArrow;
		me.renderData.showNextArrow = me.showNextArrow;
        me.callParent();
        me.initRefs();

        me.startCls = me.baseCls + '-start';
        me.endCls = me.baseCls + '-end';

	},


    /**
     * @private
     * Define references.
     */
    initRefs: function() {
        var me = this;

        if (me.initialConfig.daterange === undefined) {
            me.initialConfig.daterange = { numberOfCalendars: 1};
        }
        me.daterange = me.initialConfig.daterange;
        me.calendarIndex = me.initialConfig.calendarIndex;
    },

    childEls: [
        'innerEl', 'eventEl', 'prevEl', 'nextEl', 'middleBtnEl', 'footerEl'
    ],

    renderTpl: [
        '<div id="{id}-innerEl" data-ref="innerEl" role="grid">',
            '<div role="presentation" class="{baseCls}-header">',
                '<tpl if="showPrevArrow">',
                    '<a id="{id}-prevEl" data-ref="prevEl" class="{baseCls}-prev {baseCls}-arrow" role="button" title="{prevText}" hidefocus="on" ></a>',
                '</tpl>',

            '<div id="{id}-middleBtnEl" data-ref="middleBtnEl" class="{baseCls}-month">{%this.renderMonthBtn(values, out)%}</div>',
                '<tpl if="showNextArrow">',
                    '<a id="{id}-nextEl" data-ref="nextEl" class="{baseCls}-next {baseCls}-arrow" role="button" title="{nextText}" hidefocus="on" ></a>',
                '</tpl>',

            '</div>',
            '<table id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" cellspacing="0" role="grid">',
                '<thead role="presentation"><tr role="row">',
                    '<tpl for="dayNames">',
                        '<th role="columnheader" class="{parent.baseCls}-column-header" title="{.}">',
                            '<div class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
                        '</th>',
                    '</tpl>',
                '</tr></thead>',
            '<tbody role="presentation"><tr role="row">',
                '<tpl for="days">',
                '{#:this.isEndOfWeek}',
                    '<td role="gridcell" id="{[Ext.id()]}">',
                    // The '#' is needed for keyboard navigation
                        '<a href="#" role="button" hidefocus="on" class="{parent.baseCls}-date"></a>',
                    '</td>',
                '</tpl>',
            '</tr></tbody>',
            '</table>',
            '<tpl if="showToday">',
                '<div id="{id}-footerEl" data-ref="footerEl" role="presentation" class="{baseCls}-footer">{%this.renderTodayBtn(values, out)%}</div>',
            '</tpl>',
        '</div>',
        {
            firstInitial: function(value) {
                return Ext.picker.Date.prototype.getDayInitial(value);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],
	renderTplOld: [
		'<div id="{id}-innerEl" role="grid">',
            '<div role="presentation" class="{baseCls}-header">',
                 // the href attribute is required for the :hover selector to work in IE6/7/quirks
                '<tpl if="showPrevArrow">',
					'<a id="{id}-prevEl" class="{baseCls}-prev {baseCls}-arrow" href="#" role="button" title="{prevText}" hidefocus="on" ></a>',
				'</tpl>',
                '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
                 // the href attribute is required for the :hover selector to work in IE6/7/quirks
                '<tpl if="showNextArrow">',
                    '<a id="{id}-nextEl" class="{baseCls}-next {baseCls}-arrow" href="#" role="button" title="{nextText}" hidefocus="on" ></a>',
                '</tpl>',
            '</div>',
        '<table id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" cellspacing="0" role="grid">',
                '<thead role="presentation"><tr role="row">',
                    '<tpl for="dayNames">',
                        '<th role="columnheader" class="{parent.baseCls}-column-header" title="{.}">',
                            '<div class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
                        '</th>',
                    '</tpl>',
                '</tr></thead>',
                '<tbody role="presentation"><tr role="row">',
                    '<tpl for="days">',
                        '{#:this.isEndOfWeek}',
                        '<td role="gridcell" id="{[Ext.id()]}">',
                            // the href attribute is required for the :hover selector to work in IE6/7/quirks
                            '<a role="button" hidefocus="on" class="{parent.baseCls}-date" href="#"></a>',
                        '</td>',
                    '</tpl>',
                '</tr></tbody>',
            '</table>',
            '<tpl if="showToday">',
                '<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer">{%this.renderTodayBtn(values, out)%}</div>',
            '</tpl>',
        '</div>',

        {
            firstInitial: function(value) {
                return Ext.picker.Date.prototype.getDayInitial(value);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],

    /**
     * @private
     * @ineritdoc
     */
    initEvents: function(){
        var me = this,
            eDate = Ext.Date,
            day = eDate.DAY;

        //If the prev or next arrow is not rendered, we don't need to apply click handlers
        if(me.showPrevArrow) {
            me.prevRepeater = new Ext.util.ClickRepeater(me.prevEl, {
                handler: me.showPrevMonth,
                scope: me,
                preventDefault: true,
                stopDefault: true
            });
        }

        if(me.showNextArrow) {
            me.nextRepeater = new Ext.util.ClickRepeater(me.nextEl, {
                handler: me.showNextMonth,
                scope: me,
                preventDefault:true,
                stopDefault:true
            });
        }

        //todo
        if (me.showToday) {
            me.todayKeyListener = me.eventEl.addKeyListener(Ext.EventObject.SPACE, me.displayToday,  me);

            /* (Extjs5 code)  me.todayKeyListener = me.eventEl.addKeyListener(
                Ext.event.Event.prototype.SPACE, me.showToday,  me
            );*/
        }
        me.update(me.value);
    },

    /**
     * Show the previous month. Updates all calendars accordingly.
     * @param {Object} e
     * @return {Ext.picker.Date} this
     */
    showPrevMonth: function(e, forwardMonth){
        var me=this,
            j = 0,
            calendar;

        if(!Ext.isNumber(forwardMonth)) forwardMonth = 1;
        for(;j < me.daterange.calendars.length; j++) {
            calendar=me.daterange.calendars[j];
            calendar.setValue(Ext.Date.add(calendar.activeDate, Ext.Date.MONTH, -1 * forwardMonth));
        }
    },

    /**
     * Show the next month.  Updates all calendars accordingly.
     * @param {Object} e
     * @return {Ext.picker.Date} this
     */
    showNextMonth: function(e, forwardMonth){
        var me=this,
            j = 0,
            calendar;

        if(!Ext.isNumber(forwardMonth)) forwardMonth = 1;
        for(;j < me.daterange.calendars.length; j++) {
            calendar=me.daterange.calendars[j];
            calendar.setValue(Ext.Date.add(calendar.activeDate, Ext.Date.MONTH, 1 * forwardMonth));
        }
    },

    /**
     * Show the previous year.  Updates all calendars accordingly.
     * @param {Object} e
     * @return {Ext.picker.Date} this
     */
    showPrevYear: function(e){
        var me=this,
            j = 0,
            calendar;

        for(;j < me.daterange.calendars.length; j++) {
            calendar=me.daterange.calendars[j];
            calendar.setValue(Ext.Date.add(calendar.activeDate, Ext.Date.YEAR, -1));
        }
    },

    /**
     * Show the next month.  Updates all calendars accordingly.
     * @param {Object} e
     * @return {Ext.picker.Date} this
     */
    showNextYear: function(e){
        var me=this,
            j = 0,
            calendar;

        for(;j < me.daterange.calendars.length; j++) {
            calendar=me.daterange.calendars[j];
            calendar.setValue(Ext.Date.add(calendar.activeDate, Ext.Date.YEAR, 1));
        }
    },

    /**
     * Respond to an ok click on the month picker
     * @private
     */
    onOkClick: function(picker, value) {
        var me = this,
            month = value[0],
            year = value[1],
            date = new Date(year, month, me.getActive().getDate()),
            j = 0,
            startValue = 0,
            calendar;

        if (date.getMonth() !== month) {
            // 'fix' the JS rolling date conversion if needed
            date = Ext.Date.getLastDateOfMonth(new Date(year, month, 1));
        }

        me.daterange.displayDate(date, me.calendarIndex);
        me.hideMonthPicker();
    },

    /**
     * Respond to a date being clicked in the picker
     * @private
     * @param {Ext.EventObject} e
     * @param {HTMLElement} t
     */
    handleDateClick : function(e, t){
        var me = this,
            handler = me.handler;

        e.stopEvent();
        if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)){
            me.doCancelFocus = me.focusOnSelect === false;
            me.daterange.setValue(new Date(t.dateValue));
            delete me.doCancelFocus;
            me.fireEvent('select', me, me.daterange.value.startDate);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            // event handling is turned off on hide
            // when we are using the picker in a field
            // therefore onSelect comes AFTER the select
            // event.
            me.onSelect();
        }
    },

    /**
     * Show today in the current calendar
     * All other calendars will be updated accordingly.
     * This method does NOT set the value. It changes only the diplayed month.
     * @return {Ext.picker.Date} this
     */
    selectToday : function(){
        var me = this,
            btn = me.todayBtn,
            handler = me.handler;

        if(btn && !btn.disabled){
            me.daterange.displayDate(Ext.Date.clearTime(new Date()),me.calendarIndex);
        }

        return me;
    },


    /**
     * Update the contents of the picker for a new month
     * @private
     * @param {Date} date The new date
     */
    fullUpdate: function(date) {
        var me = this,
            cells = me.cells.elements,
            textNodes = me.textNodes,
            disabledCls = me.disabledCellCls,
            eDate = Ext.Date,
            i = 0,
            extraDays = 0,
            visible = me.isVisible(),
            newDate = +eDate.clearTime(date, true),
            newDateRange,
            today = +eDate.clearTime(new Date()),
            min = me.minDate ? eDate.clearTime(me.minDate, true) : Number.NEGATIVE_INFINITY,
            max = me.maxDate ? eDate.clearTime(me.maxDate, true) : Number.POSITIVE_INFINITY,
            ddMatch = me.disabledDatesRE,
            ddText = me.disabledDatesText,
            ddays = me.disabledDays ? me.disabledDays.join('') : false,
            ddaysText = me.disabledDaysText,
            format = me.format,
            days = eDate.getDaysInMonth(date),
            firstOfMonth = eDate.getFirstDateOfMonth(date),
            startingPos = firstOfMonth.getDay() - me.startDay,
            previousMonth = eDate.add(date, eDate.MONTH, -1),
            longDayFormat = me.longDayFormat,
            prevStart,
            current,
            disableToday,
            tempDate,
            setCellClass,
            html,
            cls,
            formatValue,
            value,
            hide;

        if (startingPos < 0) {
            startingPos += 7;
        }

        if(Ext.isEmpty(me.daterange)) {
            newDateRange = {startDate: null, endDate:null};
        } else {
            newDateRange =  {
                startDate: Ext.isEmpty(me.daterange.value) ? null : +eDate.clearTime(me.daterange.value.startDate),
                endDate: Ext.isEmpty(me.daterange.value) ?  null :
                    Ext.isEmpty(me.daterange.value.endDate) ? null : +eDate.clearTime(me.daterange.value.endDate)
            };
        }

        days += startingPos;
        prevStart = eDate.getDaysInMonth(previousMonth) - startingPos;
        current = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), prevStart, me.initHour);

        //First and last calendar don't have today button
        if (me.showToday) {
            tempDate = eDate.clearTime(new Date());
            disableToday = (tempDate < min || tempDate > max ||
                (ddMatch && format && ddMatch.test(eDate.dateFormat(tempDate, format))) ||
                (ddays && ddays.indexOf(tempDate.getDay()) != -1));

            if (!me.disabled) {
                me.todayBtn.setDisabled(disableToday);
                me.todayKeyListener.setDisabled(disableToday);

            }
        }

        setCellClass = function(cell, cls, hide){
            value = +eDate.clearTime(current, true);

            if(hide) {
                Ext.DomHelper.applyStyles(cell, "visibility:hidden;");
            } else {
                Ext.DomHelper.applyStyles(cell, "visibility:visible;");
            }

            cell.title = eDate.format(current, longDayFormat);
            // store dateValue number as an expando
            cell.firstChild.dateValue = value;
            if(value == today){
                cls += ' ' + me.todayCls;
                cell.title = me.todayText;

                // Extra element for ARIA purposes
                me.todayElSpan = Ext.DomHelper.append(cell.firstChild, {
                    tag:'span',
                    cls: Ext.baseCSSPrefix + 'hide-clip',
                    html:me.todayText
                }, true);
            }
            if(value > newDateRange.startDate && value < newDateRange.endDate) {
                cls += ' ' + me.selectedCls;
            }

            if(value == newDateRange.startDate) {
                cls += ' ' + me.startCls;
            }

            if(value == newDateRange.endDate) {
                if(newDateRange.endDate !== newDateRange.startDate)
                    cls += ' ' + me.endCls;
                me.fireEvent('highlightitem', me, cell);
                if (visible && me.floating) {
                    Ext.fly(cell.firstChild).focus(50);
                }
            }

            if (value < min) {
                cls += ' ' + disabledCls;
                cell.title = me.minText;
            }
            else if (value > max) {
                cls += ' ' + disabledCls;
                cell.title = me.maxText;
            }
            else if (ddays && ddays.indexOf(current.getDay()) !== -1){
                cell.title = ddaysText;
                cls += ' ' + disabledCls;
            }
            else if (ddMatch && format){
                formatValue = eDate.dateFormat(current, format);
                if(ddMatch.test(formatValue)){
                    cell.title = ddText.replace('%0', formatValue);
                    cls += ' ' + disabledCls;
                }
            }
            cell.className = cls + ' ' + me.cellCls;
        };

        for(; i < me.numDays; ++i) {
            if (i < startingPos) {
                html = (++prevStart);
                cls = me.prevCls;
                hide = me.calendarIndex !==0;
            } else if (i >= days) {
                html = (++extraDays);
                cls = me.nextCls;
                hide = me.calendarIndex !== (me.daterange.numberOfCalendars-1);
            } else {
                html = i - startingPos + 1;
                cls = me.activeCls;
                hide = false;
            }
            textNodes[i].innerHTML = html;
            current.setDate(current.getDate() + 1);
            setCellClass(cells[i], cls, hide);
        }

        me.monthBtn.setText(Ext.Date.format(date, me.monthYearFormat));
    },

    /**
     * Due a bug in the extjs5 beta version I am using, I have to override this function.
     * @returns {Array}
     */
    getRefItems: function() {
        var results = [];
        if (this.rendered) {
            this.monthBtn && results.push(this.monthBtn);
            this.todayBtn && results.push(this.todayBtn);
        }
        return results;
    }



});
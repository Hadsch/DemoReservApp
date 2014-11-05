/**
 * A date range field. This class is based on {@link Ext.picker.Date} and allows the user to select two dates.
 * This two dates (start date and end date) are describing one date range.
 *
 * With the configuration {@link #numberOfCalendars} you can define how many calendars are rendered next to each other,
 * so that the user can easier select a huge date range.
 *
 *     @example
 *     Ext.create('Ext.panel.Panel', {
 *         title: 'Choose a future date:',
 *         width: 200,
 *         bodyPadding: 10,
 *         renderTo: Ext.getBody(),
 *         items: [{
 *              xtype: 'daterangefield',
 *              weekDayStart: 1,
 *              weekDayEnd:5,
 *              numberOfCalendars: 4,
 *              datePickerConfig: {
 *                  minDate: new Date(2014,1,1),
 *                  startDay: 1
 *              }
 *			}]
 *     });
 */
Ext.define("Ext.ux.daterange.picker.DateRange", {
    extend: 'Ext.container.Container',
    xtype: 'daterange',

    requires: [
        'Ext.ux.daterange.Date',
        'Ext.ux.daterange.util.Date'
    ],

    /**
     * @cfg {Number} numberOfCalendars - How many calendars ({@link Ext.picker.Date}) will be shown. Default to 3.
     */
    numberOfCalendars: 3,

    /**
     * @private
     * @cfg {Boolean} Defines if the next click or setVaule(date) will set the start or end date. Toggles automatically.
     */
    setStartDate: true,

    /**
     * @cfg {Number} weekDayStart - This config is only important in conjunction with {@link #selectNextDateRange}
     * or {@link #selectPreviousDateRange}
     */
    weekDayStart: 0,
    /**
     * @cfg {Number} weekDayEnd - This config is only important in conjunction with {@link #selectNextDateRange}
     * or {@link #selectPreviousDateRange}
     */
    weekDayEnd: 6,

    /**
     * @cfg {String} [baseCls='x-datepicker']
     * The base CSS class to apply to all calendars ( {@link Ext.ux.daterange.Date}).
     */
    baseDateCls: Ext.baseCSSPrefix + 'datepicker',

    /**
     * @cfg {String}
     * The base CSS class to apply to this components element.
     */
    baseCls: Ext.baseCSSPrefix + 'daterange',

    /**
     * @cfg {Object} Specifies optional extra configurations for each Ext.picker.Date. Must
     * conform to the config format recognized by the {@link Ext.picker.Date} constructor.
     *
     *  @example
     *  datePickerConfig: {
     *      minDate: new Date(2014,1,1),
     *      startDay: 1
     *  },
     */
    datePickerConfig: {},

    /**
     * @cfg {Object} keyNavConfig
     * Specifies optional custom key event handlers for the {@link Ext.util.KeyNav} attached to this date range field. Must
     * conform to the config format recognized by the {@link Ext.util.KeyNav} constructor. Handlers specified in this
     * object will replace default handlers of the same name.
     */
    /**
     * @cfg {String} overStartDateCls
     * The base CSS class for selecting the start date.
     */
     /**
     * @cfg {String} overEndDateCls
     * The base CSS class for selecting the end date.
     */

     initKeyNavArrows: false,
    /**
     * @private
     * How the calendars ({@link Ext.picker.Date}) get arranged
     */
    layout: 'hbox',

    /**
     * @private
     * @inheritdocs
     */
    initComponent: function() {
        var me = this,
            i= 0,
            items = [],
            monthAhead = -1,
            date,
            calWidth;

        if( !Ext.isEmpty(me.datePickerConfig.baseCls))
            me.baseDateCls = me.datePickerConfig.baseCls;
        
        //apply default value if necessary
        if( Ext.isEmpty(me.numberOfCalendars) || (!Ext.isNumber(me.numberOfCalendars)))
            me.numberOfCalendars = 3;

        me.overStartDateCls = me.baseDateCls + '-over-startdate';
        me.overEndDateCls   = me.baseDateCls + '-over-enddate';

        date = Ext.isEmpty(me.value) ? new Date() : me.value.startDate;
        for(i=0; i < me.numberOfCalendars; i++) {
            items.push(Ext.apply({
                xtype: 'daterangedate',
                daterange: me,  //Convenient way to access the parent
                calendarIndex: i,
                overCls: me.overStartDateCls,
                //First and last calendar have navigation arrows
                showPrevArrow: i === 0,
                showNextArrow: i === (me.numberOfCalendars-1),
                value: Ext.Date.add(date, Ext.Date.MONTH, monthAhead + i)
            }, me.datePickerConfig));
        }


        me.items = items;
        me.callParent();
        me.initRefs();

        //Start day is the same for all calendars
        me.startDay = me.calendars[0].startDay;

        me.setWidth(calWidth);

    },

    /**
     * @private
     */
    initRefs: function() {
        var me = this;

        me.calendars = me.query("> daterangedate");
    },

    /**
     * @private
     * @inheritdocs
     */
    initEvents: function() {
        if(this.initKeyNavArrows) {

            this.keyNav = new Ext.util.KeyNav(this.getEl(), Ext.applyIf( {
                scope: this,
                left : function(e){
                    if(e.ctrlKey){
                        this.moveToDateRange(-1,true);
                    } else {
                        this.selectPrevDateRange();
                    }
                },
                right : function(e){
                    if(e.ctrlKey) {
                        this.moveToDateRange(1,true);
                    } else {
                        this.selectNextDateRange();
                    }
                }
            }, this.keyNavConfig));

        }
    },

    /**
     * Gets the current selected value of the date range field
     * @return {Date} The selected date
     */
    getValue: function(value) {
        return this.value;
    },

    /**
     * Sets either the start date or the end date for the date range.
     * {@link #setStartDate} defines if the start or the end date is set.
     * You can clear the date range by calling setValue() or setValue(null).
     * @param value {Date|Object} date - {@link #setStartDate} defines if the start or the end date is set.
     *                            object - {startDate: date, endDate: date}: Start and end date are set.
     * @param silent - Don't fire events
     * @return {Object} The selected date range
     */
    setValue: function(value, silent) {
        var me = this,
            firstCal = me.calendars[0],
            lastCal = me.calendars[me.calendars.length-1],
            setBothDates = false,
            setStartDateOld = me.getSetStartDate(),
            valueOld = { startDate: null, endDate:null };

        //Init value if it is empty
        if(Ext.isEmpty(this.value)) {
            me.value = {};
            me.value.endDate = null;
            me.value.startDate = null;
        }

        valueOld.startDate = me.value.startDate;
        valueOld.endDate = me.value.endDate;

        //Reset date range if value is not a date. e.g.: setValue()
        if( ! Ext.isDate(value)) {

            //Maybe value is an object {startDate: date, endDate: date}
            //setValue( {startDate:xxxx, endDate: xxx} )
            if(value && value.startDate && value.endDate) {
                me.value.startDate = Ext.isDate(value.startDate) ?  value.startDate : null;
                me.value.endDate = Ext.isDate(value.endDate) ?  value.endDate : null;
                setBothDates = true;
            } else {
                //reset value and leave function
                me.value = null;
                me.setSetStartDate(true);
                return this.update();
            }

        } else {

            //setStartDate triggers if a start or end date is set
            if(me.setStartDate) {
                me.value.startDate = value;
                me.setSetStartDate(false);
            } else {
                me.value.endDate = value;
                me.setSetStartDate(true);
            }

            if( ! Ext.Date.between(value, Ext.Date.getFirstDateOfMonth(firstCal.getValue()), Ext.Date.getLastDateOfMonth(lastCal.getValue())) ) {
                if(value < firstCal.getValue())
                    firstCal.showPrevMonth(undefined, me.numberOfCalendars);
                else
                    lastCal.showNextMonth(undefined, me.numberOfCalendars);
            }
        }

        if(!me.validateDateRange(me.value.startDate, me.value.endDate, setStartDateOld)) {
            //not a valid date range... reset value and leave function
            me.value = valueOld;
            return me.value;
        }
        if(!silent)
            me.fireEvent('select', me, me.value, setBothDates ? 'both' : setStartDateOld ? 'start' : 'end');

        this.update();
        return me.value;
    },


    /**
     * What happens if the start date is bigger as the end date?? When should a date range be valid (e.g. maybe the
     * user has to select at minimum one week, ...)
     * Change code here, to change the behaviour.
     * @param startDate
     * @param endDate
     * @param setStartDate - true: User has set start date; false: User has set end date
     * @returns {boolean}
     */
    validateDateRange: function(startDate, endDate, setStartDate) {
        var me = this;

        //We can only validate the date range, if both dates are set!
        if(Ext.isEmpty(startDate) || Ext.isEmpty(endDate)) return true;

        /* Try which behaviour you like most */

        //Case 1: Swap dates.
        /*if(endDate !== null && (endDate < startDate)) {
            //smaller date is becoming startDate and the larger will be endDate
            var tmp = me.value.startDate;
            me.value.startDate = me.value.endDate;
            me.value.endDate = tmp;
            //We have made it valid, so we also must return true
        }*/

        //Case 2: Don't allow it
        /*if(startDate > endDate) return false;*/

        //Case 3: Set it to the same date
        if(startDate > endDate) {
            if(setStartDate) {
                endDate = startDate
            } else {
                startDate = endDate;
            }
            me.value.startDate = startDate;
            me.value.endDate = endDate;
        }

        return true;
    },

    /**
     * @private
     * Updates all calendars ({@link Ext.picker.Date}). This function must be called after the value of the date range
     * has been changed.
     * @returns {null|*}
     */
    update: function() {
        var me = this,
            calendar,
            i=0;

        /** Don't update DOM if we are not visible. */
        if( !me.isVisible() )
            return me.value;

        for (; i < me.calendars.length; i++) {
            calendar = me.calendars[i];
            calendar.fullUpdate(calendar.value, false); //ToDo also override selectedUpdate
        }

        if(me.pickerField === undefined)
            me.focus(false);
        return me.value;
    },

    setSetStartDate: function(setStartDate) {
        var me = this;

        me.setStartDate = setStartDate;
        if(setStartDate)
            me.setOverCls(me.overStartDateCls);
        else
            me.setOverCls(me.overEndDateCls);
    },

    getSetStartDate: function() {
        return this.setStartDate;
    },

    /**
     * Set the overCls name for each calendar ({@link Ext.picker.Date})
     * @param name
     */
    setOverCls: function (name) {
        var me = this,
            calendar,
            i;

        for (i=0; i < me.calendars.length; i++) {
            calendar = me.calendars[i];
            calendar.removeOverCls();
            Ext.apply(calendar, {overCls: name});
            calendar.addOverCls(name);
        }
    },

    /**
     * @private
     * Applies the necessary overrides to{@link Ext.picker.Date}
     */
    applyOverride: function() {
        var me = this,
            i=0;

        //Apply override for each instance of Ext.picker.Date (stored in this.calendars)
        for(;i < me.calendars.length; i++) {
            Ext.override(me.calendars[i], {});
        }
    },

    /**
     * @private
     * Move to next date range which is specified through direction.
     *
     * e.g.: date range: 1. May - 31. May; moveToDateRange(1) -> date range: 1. June - 30. June
     *
     * This method is looking for human date ranges (like month, year, week,...) and moves the date range therefore in the right direction.
     *
     * A week can be very special (e.g. from Sunday - Saturday or from Monday to Friday (workweek),...
     * To specify what is a week for you, you can set weekDayStart and weekDayEnd (0-based; 0 ... Sunday)
     *
     * @param direction - 1 or -1 (forward or backward)
     * @returns {*}
     */
    moveToDateRange: function(direction, fastForward) {
        var me = this,
            uDate = Ext.ux.daterange.util.Date,
            daterange,
            forward = 1,
            add = 0,
            diffDateRange,
            diffCalendar,
            firstCalendar = me.calendars[0],
            lastCalendar = me.calendars[me.calendars.length-1];

        if(!Ext.isNumber(direction)) direction = 1;
        if(!Ext.isBoolean(fastForward)) fastForward = false;

        if(Ext.isEmpty(me.value) || Ext.isEmpty(me.value.endDate)) return;

        daterange = uDate.isDateRange(me.value.startDate,me.value.endDate, me.weekDayStart, me.weekDayEnd);
        daterange.count *= direction;

        if(daterange.isDays) {
            add = daterange.count;
            if(fastForward) {
                if(Math.abs(daterange.count) < 7)
                    add = 7 * direction; //fastForward: e.g. Monday 5.5. is selected -> Fast forward: Monday 12.5. is selected
                else
                    add = daterange.count * 2;
            }
            me.value.startDate = Ext.Date.add(me.value.startDate,Ext.Date.DAY, add);
            me.value.endDate = Ext.Date.add(me.value.endDate,Ext.Date.DAY, add);
        }

        if( daterange.isWeeks) {
            if(fastForward) add = 4 * direction * 7; //jump one month forward
            me.value.startDate = Ext.Date.add(me.value.startDate,Ext.Date.DAY, add === 0 ? 7 * daterange.count : add);
            me.value.endDate = Ext.Date.add(me.value.endDate,Ext.Date.DAY, add === 0 ? 7 * daterange.count : add);
        }

        if(daterange.isMonths) {
            if(fastForward) add = 12 * direction;
            me.value.startDate = Ext.Date.add(me.value.startDate,Ext.Date.MONTH, add === 0 ? daterange.count : add);
            me.value.endDate = Ext.Date.add(me.value.endDate,Ext.Date.MONTH, add === 0 ?  daterange.count : add);
            me.value.endDate = Ext.Date.getLastDateOfMonth(me.value.endDate);
        }

        if(daterange.isYears) {
            if(fastForward) add = 10 * direction;
            me.value.startDate = Ext.Date.add(me.value.startDate,Ext.Date.YEAR, add === 0 ? daterange.count : add);
            me.value.endDate = Ext.Date.add(me.value.endDate,Ext.Date.YEAR, add === 0 ? daterange.count : add);
        }

        //Look if date range is smaller as the displayed date range (first date from first calendar to last date of last calendar)
        if(me.isVisible()) {
            diffDateRange = Ext.ux.daterange.util.Date.diffDays(me.value.startDate,me.value.endDate);
            diffCalendar = Ext.ux.daterange.util.Date.diffDays(
                Ext.Date.getFirstDateOfMonth(firstCalendar.getValue()),
                Ext.Date.getLastDateOfMonth(lastCalendar.getValue()));

            if( diffCalendar > diffDateRange) {
                //The whole date range can be displayed across all calendars

                if(direction >= 1) { //We are moving forward
                    if(me.value.startDate >= Ext.Date.getFirstDateOfMonth(lastCalendar.getValue()) )
                        lastCalendar.showNextMonth(undefined, Math.ceil(diffDateRange / 30));
                } else { //We are moving backwards
                    if(me.value.endDate <= Ext.Date.getLastDateOfMonth(firstCalendar.getValue()) )
                        firstCalendar.showPrevMonth(undefined, Math.ceil(diffDateRange / 30));
                }
                if(fastForward) {
                    me.displayDate(me.value.startDate, 0);
                }
            } else {
                if(direction >= 1) {
                    me.displayDate(me.value.startDate, 0);
                } else {
                    me.displayDate(me.value.endDate, me.numberOfCalendars -1);
                }
            }
        }

        me.fireEvent('select', me, me.value, me.setStartDate);

        return me.update();

    },

    /**
     * Moves the current selected date range forward.
     * This method recognize human date ranges (e.g. months, years, weeks, ...) and moves the date range according to this date range forward
     * E.g.: current selected date range:
     *      value: 1. feb - 28. feb;
     *      after selectNextDateRange():
     *      value: 1. mar - 31. mar
     *
     * What is week? Is it from sunday to saturday, or from monday to sunday? What is if the user want to select a workweek from monday to friday?)
     * To specify what is a week in your application, you can set {@link #weekDayStart) and {@link #weekDayEnd) (0-based; 0 ... Sunday)
     * This means if a week is selected and you call selectNextDateRange() the next week will be selected.
     *
     * e.g.: weekDayStart: 1 (monday) / weekDayEnd: 5 (friday)
     * value: Mo, 5. May - Fr, 9. May; -> expected result: Mo, 12. May - Fr, 16. May
     * value: Mo, 5. May - Fr, 16. May; -> expected result: Mo, 19. May - Fr, 30. May
     *
     * If no year, month or week is recognized, the difference of the days between start and end date will be moved forward.
     * weekDayStart: 0 (sunday) / weekDayEnd: 6 (saturday)
     * value: Mo, 5. May - Fr, 9. May; -> expected result: Sa, 10. May - We, 14. May
     * value: Mo, 5. May - Fr, 16. May; -> expected result: Sa, 17. May - We, 28. May
     *
     * With the default configuration you can move with the left and right arrow key the selected date range forward
     * and backwards.
     *
     * @returns {Object} - current date range
     */
    selectNextDateRange: function() {
        return this.moveToDateRange(1);
    },

    /**
     * Same as {@link selectNextDateRange} but only in the other direction.
     * @returns {*}
     */
    selectPrevDateRange: function() {
        return this.moveToDateRange(-1);
    },

    /**
     * Display the date in the specified calendar. This method does not set the value for the date range.
     * It only specifies the month and year which will be shown in the calendars (Ext.picker.Date)
     * @param date - The date which you want to show.
     * @param calendarIndex - 0-based.
     */
    displayDate: function(date, calendarIndex) {
        var me = this,
            startValue = 0,
            i=0;

        startValue -= calendarIndex;

        for(;i < me.calendars.length; i++) {
            calendar=me.calendars[i];
            calendar.setValue(Ext.Date.add(date, Ext.Date.MONTH, startValue + i ));
        }

        return true;

    },

    listeners: {
        afterlayout: function(daterange, eOpts) {
            var me = daterange;
            if(me.getWidth() !== me.totalWidth)
                me.setWidth(me.totalWidth);
        },

        afterrender: function(daterange, eOpts) {
            var me = daterange,
                totalWidth = 0,
                i=0;

            for(i=0; i < me.numberOfCalendars; i++) {
                totalWidth += me.calendars[i].getWidth();
            }

            me.totalWidth = totalWidth;
        }
    }

});




Ext.define('Ext.ux.daterange.field.DateRange', {
    extend:'Ext.form.field.Picker',
    xtype: 'daterangefield',
    requires: ['Ext.ux.daterange.picker.DateRange'],

    //<locale>
    /**
     * @cfg {String} format
     * The default date format string which can be overriden for localization support. The format must be valid
     * according to {@link Ext.Date#parse}.
     */
    format : "m/d/Y",
    //<locale>
    /**
     * @cfg {String} altFormats
     * Multiple date formats separated by "|" to try when parsing a user input value and it does not match the defined
     * format.
     */
    altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|j.n.|d.n.|j.m.|d.m.|m-d|md|mdy|mdY|j|d|Y-m-d|n-j|n/j|d.m.Y|d.m.y|j.n.y|j.n.Y|n.y|n.Y",
    //</locale>

    /**
     * @cfg {String} specialFormats - This are shortcuts, for selecting a date range only with one date!
     * E.g. 4/2014 or 4/14-> 1. april to 30. april
     * 2014 -> 1/1/2014 to 12/1/2014
     * 5/13/2014 -> 31. May 2014 is selected (Start date and end date are set to 5/13/2014)
     * CW 30 -> calendar week 30 will be selected. For localization the parameter can be overriden {@link #calendarWeekShortcut}
     *
     * The format must be valid according to {@link Ext.Date#parse}
     */
    specialFormats: 'n/Y|n/y|m/Y|m/y|Y|j|d|j.n.|d.n.|j.m.|d.m.|m.y|m.Y|n.y|n.Y|d.m.y|j.n.y|d.m.Y|j.n.Y|d.n.y|d.n.Y',

    /**
     * Prefix for selecting one calendar week.
     *
     * E.g. CW 30 -> calendar week 30 will be selected form {@link weekDayStart} to {@link weekDayEnd}.
     */
    calendarWeekShortcut: 'CW',

    /**
     * @cfg {String} startDateFormat -
     * You can override {@link #format} to give the start date a special format.
     * Default to **undefined** ({@link #format} is used)
     */
    startDateFormat: undefined,

    /**
     * @cfg {String} endDateFormat -
     * You can override {@link #format} to give the end date a special format.
     * Default to **undefined** ({@link #format} is used)
     */
    endDateFormat: undefined,

    /**
     * @cfg {String}
     * Delimiter between start and end date. Default to '-'.
     * E.g: 4/18/2012 - 4/23/2012
     */
    startEndDateDelimiter: '-',

    //</locale>
    // in the absence of a time value, a default value of 12 noon will be used
    // (note: 12 noon was chosen because it steers well clear of all DST timezone changes)
    initTime: '12', // 24 hour format

    initTimeFormat: 'H',

    //<locale>
    /**
     * @cfg {Number} [startDay=undefined]
     * Day index at which the week should begin, 0-based.
     *
     * Defaults to `0` (Sunday).
     */
    startDay: 0,
    //</locale>

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

    matchFieldWidth: false,

    /**
     * @cfg {string} How the picker gets aligned. Default to: t-b?
     */
    pickerAlign : 't-b?',

    initComponent : function() {
        var me = this;
        me.startDateFormat = Ext.isEmpty(me.startDateFormat) ? me.format : me.startDateFormat;
        me.endDateFormat = Ext.isEmpty(me.endDateFormat) ? me.format : me.endDateFormat;
        me.callParent();
    },

    initEvents: function() {
        var me = this;

        me.callParent();

        this.keyNav = new Ext.util.KeyNav(this.getEl(),Ext.applyIf( {
            scope: this,
            left : function(e){
                if(e.ctrlKey){
                    this.getPicker().moveToDateRange(-1,true);
                } else {
                    this.getPicker().selectPrevDateRange();
                }
            },
            right : function(e){
                if(e.ctrlKey) {
                    this.getPicker().moveToDateRange(1,true);
                } else {
                    this.getPicker().selectNextDateRange();
                }
            }
        }, this.keyNavConfig));

    },

    /**
     * @private
     * @override
     * @returns {Ext.ux.daterange.picker.DateRange}
     */
    createPicker: function() {
        var me = this,
            daterangeConfig;

        daterangeConfig = ({
            pickerField: me,
            floating: true,
            focusOnShow: true,
            weekDayStart: me.weekDayStart,
            weekDayEnd: me.weekDayEnd,
            value: me.value,
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }

         });
        if(me.numberOfCalendars !== undefined)
            daterangeConfig.numberOfCalendars = me.numberOfCalendars;
        if(me.datePickerConfig !== undefined)
            daterangeConfig.datePickerConfig = me.datePickerConfig;
        return new Ext.ux.daterange.picker.DateRange(daterangeConfig);
    },

    /**
     * @override
     * @param rawValue
     * @returns {*|null}
     */
    rawToValue: function(rawValue) {
        var value = this.parseDate(rawValue) || rawValue || null;

        return value;
    },

    /**
     * @private
     * @overridden
     * @param value
     * @returns {string}
     */
    valueToRaw: function(value) {
        return this.formatDate(this.parseDate(value));
    },

    /**
     * @private
     * Formats start and end date in the text field
     * @param value
     * @returns {string}
     */
    formatDate : function(value){
        var me = this,
            val = "";

        if (value && Ext.isDate(value.startDate)) {
            val = Ext.Date.dateFormat(value.startDate, me.startDateFormat) + " " + me.startEndDateDelimiter + " ";
        }
        if (value && Ext.isDate(value.endDate)) {
            val += Ext.Date.dateFormat(value.endDate, me.endDateFormat);
        }
        return val;
    },

    /**
     * @private
     */
    parseDate : function(value) {
        if(!value || (Ext.isDate(value.startDate) || Ext.isDate(value.endDate)) ){
            return value;
        }

        var me = this,
            dates,
            dateRange = {},
            altFormats = me.altFormats,
            specialFormats = me.specialFormats,
            specialDate,
            parseAltFormats;

        //if value is a string, we have to split the string and then try to parse each token into a valid date
        if(Ext.isString(value)) {
            dates = value.split(me.startEndDateDelimiter);
            dateRange.startDate = me.safeParse(dates[0].trim(), me.startDateFormat);
            dateRange.endDate = me.safeParse(dates[1] ? dates[1].trim() : " ", me.endDateFormat);
        }

        //function for trying alternative date formats
        parseAltFormats = function(formatArray, value) {
            var val,
                i= 0,
                altFormatArray = formatArray.split("|"),
                len = altFormatArray.length;

            for (; i < len && !val; ++i) {
                val = me.safeParse(value, altFormatArray[i]);
            }
            return {format: altFormatArray[i-1], value: val};
        };

        if (!dateRange.startDate && altFormats) {
            dateRange.startDate = parseAltFormats(altFormats, dates ? dates[0].trim() : null || value.startDate || " ").value;

            //Try to parse special dates
            if(dates.length === 1 && specialFormats) {
                specialDate = parseAltFormats(specialFormats, dates[0]);
                dateRange = me.getSpecialDate(specialDate.format, specialDate.value);
            }
        }
        if (dateRange && !dateRange.endDate && altFormats) {
            dateRange.endDate = parseAltFormats(altFormats,
                dates[1] ? dates[1].trim() : null ||
                value.endDate ? value.endDate : null || " ").value;
        }

        //Override toString function! This is important to compare values
        if(dateRange) dateRange.toString = function() {return (this.startDate?this.startDate: " ") +" "+ (this.endDate ? this.endDate : " ")};
        return dateRange;
    },

    /**
     * @private
     * @param date {Date}
     * @param format {String}
     * @returns {{startDate: Date, endDate: Date}}
     */
    getSpecialDate: function(format, date) {
        if(Ext.isEmpty(format) || !Ext.isDate(date)) return null;

        var me = this,
            hasYear = format.match("y|Y") ? true : false,
            hasMonth = format.match("m|n|M|F") ? true : false,
            hasDay = format.match("d|j") ? true : false,
            eDate = Ext.Date,
            daterange = {};

        if(hasDay) {
            daterange.startDate = daterange.endDate = date;
            return daterange;
        }

        if(hasMonth) {
            daterange.startDate = eDate.clone(date);
            daterange.startDate.setDate(1);
            daterange.endDate = eDate.clone(date);
            daterange.endDate.setDate(eDate.getDaysInMonth(date));
            return daterange;
        }

        if(hasYear) {
            daterange.startDate = eDate.clone(date);
            daterange.startDate.setDate(1);
            daterange.startDate.setMonth(0);
            daterange.endDate = eDate.clone(date);
            daterange.endDate.setMonth(11);
            daterange.endDate.setDate(31);
            return daterange;
        }

        return daterange
    },

    /**
     * Attempts to parse a given string value using a given {@link Ext.Date#parse date format}.
     * @param {String} value The value to attempt to parse
     * @param {String} format A valid date format (see {@link Ext.Date#parse})
     * @return {Date} The parsed Date object, or null if the value could not be successfully parsed.
     */
    safeParse : function(value, format) {
        var me = this,
            utilDate = Ext.Date,
            result = null,
            strict = me.useStrict,
            parsedDate;

        if (utilDate.formatContainsHourInfo(format)) {
            // if parse format contains hour information, no DST adjustment is necessary
            result = utilDate.parse(value, format, strict);
        } else {
            // set time to 12 noon, then clear the time
            parsedDate = utilDate.parse(value + ' ' + me.initTime, format + ' ' + me.initTimeFormat, strict);
            if (parsedDate) {
                result = utilDate.clearTime(parsedDate);
            }
        }
        return result;
    },

    /**
     * If a date inside a datepicker gets selected, we set the value and call the select event
     * @param picker
     * @param value
     * @param whichDateWasSet
     */
    onSelect: function(picker, value, whichDateWasSet) {
        var me = this;

        //Prevent circling around...
        //select event was fired from Ext.ux.daterange.picker.DateRange (setValue() )
        //If we wouldn't stop it, than our change-listner would set the value (this.getPicker().setValue(xxx) ) again

        me.suspendCheckChange = 1;
        me.setValue(value);
        me.suspendCheckChange = 0;
        me.fireEvent('select', me, value, whichDateWasSet);
    },

    /**
     * Value inside the text field has changed
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    onChange: function (newValue, oldValue, eOpts) {
        var me = this;
        //Tell the picker (Ext.ux.DateRange) that we have a new value!
        if(me.getPicker() !== undefined && (Ext.isObject(newValue) || Ext.isEmpty(newValue)))
            me.getPicker().setValue(newValue, true);
    },


    /**
     * @private
     * Sets the Date picker's value to match the current field value when expanding.
     */
    onExpand: function() {
        var me = this,
            val = me.getValue(),
            picker = me.getPicker(),
            firstCalendar = picker.calendars[0],
            firstCalDate =  Ext.Date.getFirstDateOfMonth(firstCalendar.getValue()),
            lastCalendar = picker.calendars[picker.calendars.length-1],
            lastCalDate = Ext.Date.getLastDateOfMonth(lastCalendar.getValue()),
            eDate = Ext.Date;

        //Update calendars
        me.getPicker().update(); //Updates the selection

        //Update which month is shown in the calendar
        if(  (Ext.isEmpty(val) || ( !(Ext.isDate(val.startDate) && Ext.isDate(val.endDate)) )) === false )
            if( ! (eDate.between(val.startDate,firstCalDate,lastCalDate) || eDate.between(val.endDate,firstCalDate,lastCalDate))) {
                me.getPicker().displayDate(val.startDate,0);
            }
    },

    /**
     * @private
     * Focuses the field when collapsing the Date picker.
     */
    onCollapse: function() {
        this.focus(false, 60);
    }
});
/**
 * An extension for Ext.ux.field.DateRange
 * This class provides a sidepanel with datepickers and a combo box where you can predefine special date ranges.
 */
Ext.define("Ext.ux.daterange.field.DateRangeSelection",{
    extend: "Ext.ux.daterange.field.DateRange",
    alias: "widget.daterangeselection",

    requires: [
        'Ext.ux.daterange.field.DateRange'
    ],

    startDateText: 'Start date',
    endDateText: 'End date',
    selectStartDateText: 'Select a start date',
    selectEndDateText: 'Select an end date',

    /**
     * @cfg {Function} handlerBtnApply
     * A function called when the apply button is clicked (can be used instead of click event).
     * @cfg {Ext.button.Button} handler.button This button.
     * @cfg {object} value - The current date range.
     * @cfg {Ext.EventObject} handler.e The click event.
     */
    /**
     * @cfg {Function} handlerBtnCancel
     * A function called when the cancel button is clicked (can be used instead of click event).
     * @cfg {Ext.button.Button} handler.button This button.
     * @cfg {Ext.EventObject} handler.e The click event.
     */

    /**
     * @overridden
     * @private
     */
    initComponent: function() {
        var me = this,
            picker;

        me.baseCls = Ext.baseCSSPrefix + 'daterange';
        //handle selection (user has selected a start or an end date)
        me.on("select", me.onDateRangeSelect, me);
        //create store for combo box
        me.dateRangesStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'scope', 'selectDateRange'],
            data : me.dateRangeItems()
        });
        //datePickerConfig: showToday -> default to 'false' (hide today btn under the calendars).
        //-> we add 'today' btn at the side panel
        if(me.datePickerConfig === undefined) me.datePickerConfig = {};
        me.datePickerConfig = Ext.applyIf( { showToday: false }, me.datePickerConfig );
        me.callParent();

        /*  We are adding start, end date picker and 'Apply' button to the side */
        picker = me.getPicker();
        picker.add(me.dateRangeSelectionItemsConfig());

        //oldValue: If user change the daterange, and clicks the 'cancel' btn, we restore the value from 'oldValue'
        me.oldValue = me.value;

        me.initRefs();
    },

    /**
     * @private
     * Define and apply references
     */
    initRefs: function() {
        var me = this;

        me.sidebarTitle = me.picker.down('container[itemId=' + me.id + '-sidepanel-title]');
        me.startDateContainer = me.picker.down('fieldcontainer[itemId=' + me.id + '-startContainer]');
        me.endDateContainer = me.picker.down('fieldcontainer[itemId=' + me.id + '-endContainer]');
        me.startDate = me.startDateContainer.down('datefield');
        me.endDate = me.endDateContainer.down('datefield');
        me.nextButton = me.picker.down('button[itemId=' + me.id + '-next]');
        me.prevButton = me.picker.down('button[itemId=' + me.id + '-previous]');

    },

    /**
     * @private
     * Config for the extra items which are added to {@link Ext.ux.field.DateRange}
     */
    dateRangeSelectionItemsConfig: function() {
        var me = this;
        return {
            baseCls: me.baseCls + '-sidepanel',
            layout: {
                type: 'vbox',
                pack: 'top'
            },
            height: '100%',
            width: 222,

            items: [{
             //Header
                xtype: 'container',
                itemId: me.id + '-sidepanel-title',
                html: me.selectStartDateText,
                height:26,
                width: '100%',
                border: '0 0 1 0',
                cls: me.baseCls + '-sidepanel-title'
            },{
                xtype: 'container',
                flex:2,

                layout: {
                    type: 'hbox'
                },

                items: [{
                    xtype: 'button',
                    itemId: me.id + '-previous',
                    margin: '10 0 10 0',
                    height: '100%',
                    cls: me.baseCls + '-sidepanel-btn',
                    disabled: true,
                    listeners: {
                        scope: this,
                        click: function() {
                            this.getPicker().selectPrevDateRange();
                        }
                    },
                    text: '<'
                },
                    me.dateRangeSelectionInnerItemsConfig(),
                {
                    xtype: 'button',
                    itemId: me.id + '-next',
                    margin: '10 0 10 0',
                    height: '100%',
                    text: '>',
                    cls: me.baseCls + '-sidepanel-btn',

                    disabled: true,
                    listeners: {
                        scope: this,
                        click: function() {
                            this.getPicker().selectNextDateRange();
                        }
                    }
                }]
            }]
        };
    },

    /**
     * @private
     * Cofig for the extra items which are added to {@link Ext.ux.field.DateRange}
     * @returns {}
     */
    dateRangeSelectionInnerItemsConfig: function() {
        var me = this;
        return {
            xtype: 'container',
            height: '100%',
            width: 150,

            layout: {
                type: 'vbox',
                pack: 'top'
            },

            defaults: {
                layout: 'hbox'
            },
            items: [{ //start date selection
                xtype: 'fieldcontainer',
                itemId: me.id + '-startContainer' ,
                baseCls: me.baseCls + '-start',
                cls: me.baseCls + '-active ' + me.baseCls + '-sidepanel-item',
                width: '100%',
                listeners: {
                    scope: this,
                    render: function(c){
                        c.el.on('click', function(a,e) {
                            this.onDateRangeSelect(this, null, 'end');
                        }, this);
                    }},
                items: [{
                    xtype: 'container',
                    margin: '9 5 8 5',
                    width: 15,
                    height: '100%',
                    baseCls: me.baseCls + '-start-inner '
                },{
                    xtype: 'datefield',
                    itemId: me.id + '-startDate',
                    width: 110,
                    margin: '6 3 6 3',
                    format: me.format,
                    emptyText: me.startDateText,
                    hideOnSelect: true,
                    listeners: {
                        scope: me,
                        select: me.onDateSelect,
                        focus: me.onDateFocus
                    }
                }]
            },{ //end date selection
                xtype: 'fieldcontainer',
                itemId: me.id + '-endContainer',
                baseCls: me.baseCls + '-end',
                cls: me.baseCls + '-disabled ' + me.baseCls + '-sidepanel-item',
                width: '100%',
                listeners: {
                    scope: this,
                    render: function(c){
                        c.el.on('click', function(a,e) {
                            this.onDateRangeSelect(this, null, 'start');
                        }, this);
                    }},
                items: [{
                    xtype: 'container',
                    margin: '9 5 8 5',
                    width: 15,
                    height: '100%',
                    baseCls: me.baseCls + '-end-inner'
                },{
                    xtype: 'datefield',
                    itemId: me.id + '-endDate',
                    hideOnSelect: true,
                    width: 110,
                    margin: '6 5 6 3',
                    format: me.format,
                    emptyText: me.endDateText,
                    listeners: {
                        scope: me,
                        select: me.onDateSelect,
                        focus: me.onDateFocus
                    }
                }]
            },{
                xtype: 'combo',
                emptyText: 'Date range',
                height: 16,
                fieldStyle: 'min-height: 16px; height: 16px;',
                labelCls: me.baseCls + '-label',
                cls: me.baseCls + '-sidepanel-combo ' + me.baseCls + '-sidepanel-item',
                editable: false,
                width: '100%',
                listConfig: {
                    cls: me.baseCls + '-list-items'
                },
                store: me.dateRangesStore,
                displayField: 'name',
                listeners: {
                    scope: this,
                    select: function(combo, records, eOpts) {
                        var record = records.length >= 1 ? records[0] : null,
                            selectFct,
                            scope;

                        if(record === null) return;

                        //Execute function to select the desired date range
                        selectFct = record.get("selectDateRange");
                        scope = record.get("scope");

                        if(typeof selectFct === 'function')
                            selectFct.call(scope);
                    }
                }
            },{ //Buttons
                xtype: 'fieldcontainer',
                flex: 1,
                width: '100%',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'bottom'
                },
                defaults: {
                    margin: '0 0 0 5'
                },
                margin: '0 0 9 0',
                style: {
                    backgroundColor: 'transparent'
                },
                items: [{
                    xtype: 'button',
                    text: 'Cancel',
                    cls: me.baseCls + '-sidepanel-btn-cancel',
                    handler: function(btn, eOpts) {
                        var me = this;
                        me.getPicker().setValue(me.oldValue);
                        me.handlerBtnCancel && this.handlerBtnCancel.call(me.scope || btn, me, eOpts);
                        me.collapse();
                    },
                    scope: this
                }, {
                    xtype: 'button',
                    scale: 'small',
                    cls: me.baseCls + '-btn-apply',
                    text: 'Apply',
                    handler: function(btn, eOpts) {
                        var me = this;
                        me.setOldValue();
                        me.handlerBtnApply && this.handlerBtnApply.call(me.scope || btn, me, me.value, eOpts);
                        me.collapse();
                    },
                    scope: this
                }]
            }]
        };
    },

    /**
     * Items which are shown inside the date range combo box.
     * You need to define a function (property: selectDateRange) which selects the date range.
     * @returns {*[]}
     */
    dateRangeItems:function() {
        return [
            {"id":"TD", "name":"Today", "scope": this, "selectDateRange": function() {
                var me = this,
                    eDate = Ext.Date,
                    today = new Date();

                today = eDate.clearTime(today);
                me.setStartAndEndDate( today, today);
            } },
            {"id":"LM", "name":"Last Month", "scope": this, "selectDateRange": function() {
                var me = this,
                    eDate = Ext.Date,
                    today = new Date();

                today = eDate.clearTime(today);
                me.setStartAndEndDate( eDate.getFirstDateOfMonth( eDate.add(today, eDate.MONTH, -1)),
                                       eDate.getLastDateOfMonth( eDate.add(today, eDate.MONTH, -1)) );
            } },
            {"id":"CM", "name":"Current Month", "scope": this, "selectDateRange": function() {
                var me = this,
                    eDate = Ext.Date,
                    today = new Date();

                today = eDate.clearTime(today);
                me.setStartAndEndDate( eDate.getFirstDateOfMonth(today),
                                       eDate.getLastDateOfMonth(today) );
            } },
            {"id":"NM", "name":"Next Month","scope": this, "selectDateRange": function() {
                var me = this,
                    eDate = Ext.Date,
                    today = new Date();

                today = eDate.clearTime(today);
                me.setStartAndEndDate( eDate.getFirstDateOfMonth( eDate.add(today, eDate.MONTH, 1)),
                    eDate.getLastDateOfMonth( eDate.add(today, eDate.MONTH, 1)) );
            } }
        ];
    },


    /**
     * Set the start and end date for this date range
     * @param startDate {Date}
     * @param endDate {Date}
     * @returns {{startDate: *, endDate: *}}
     */
    setStartAndEndDate: function(startDate, endDate) {
        var me = this,
            newValue = {startDate: startDate, endDate: endDate};

        if(! (Ext.isDate(startDate) && Ext.isDate(endDate)) ) return null;

        //Set value of the date pickers
        me.startDate.setValue(startDate);
        me.endDate.setValue(endDate);
        //Set value of the date range field
        me.getPicker().setValue(newValue);
        return newValue;
    },


    /**
     * User has clicked on a date from a Ext.picker.Date! (within the sidepanel)
     * @param datefield
     * @param value
     */
    onDateSelect: function(datefield, value) {
        var me = this;
        me.getPicker().setValue(value);
        if (datefield.hideOnSelect)
            datefield.collapse();
    },

    /**
     * Either start or end date picker has gained focus.
     * Apply necessary styles
     * @param datefield
     */
    onDateFocus: function(datefield) {
        var me = this;

        if(datefield.itemId.indexOf("-startDate") === -1) {
            me.onDateRangeSelect(this, null, 'start');
        } else {
            me.onDateRangeSelect(this, null, 'end');
        }
    },

    /**
     * A date from a calendar of the DateRange (Ext.ux.DateRange) has been selected.
     * We are changing the style of the startDateContainer and the endDateContainer and set the value
     * @param dr - Ext.ux.daterange.picker.DateRange
     * @param value - The new value
     * @param whichDateWasSet - 'start', 'end', 'both'
     * @returns {*}
     */
    onDateRangeSelect: function(dr, value, whichDateWasSet) {
        var me = this;

        // set value and flip style
        if(whichDateWasSet === 'start') {
            me.startDateContainer.removeCls(me.baseCls + "-active");
            me.startDateContainer.addCls(me.baseCls + "-disabled");

            me.endDateContainer.addCls(me.baseCls + "-active");
            me.endDateContainer.removeCls(me.baseCls + "-disabled");

            me.sidebarTitle.el.dom.innerText = me.selectEndDateText;
            !Ext.isEmpty(value) && me.startDate.setValue(value.startDate);
            me.getPicker().setSetStartDate(false);

        } else if(whichDateWasSet === 'end') {
            me.startDateContainer.addCls(me.baseCls + "-active");
            me.startDateContainer.removeCls(me.baseCls + "-disabled");

            me.endDateContainer.removeCls(me.baseCls + "-active");
            me.endDateContainer.addCls(me.baseCls + "-disabled");

            me.sidebarTitle.el.dom.innerText = me.selectStartDateText;
            !Ext.isEmpty(value) && me.endDate.setValue(value.endDate);
            me.getPicker().setSetStartDate(true);

        }

        if( !Ext.isEmpty(value)) {
            //update datepicker with the new values
            me.startDate.setValue(value.startDate);
            me.endDate.setValue(value.endDate);
        }

        //Enable / Disable next and previous button
        if(me.startDate.getValue() === null || me.endDate.getValue() === null) {
            me.nextButton.setDisabled(true);
            me.prevButton.setDisabled(true);
        } else {
            me.nextButton.setDisabled(false);
            me.prevButton.setDisabled(false);
        }

        return value;
    },

    /**
     * If the picker gets expanded, we update start and end date field.
     */
    onExpand: function() {
        var me = this,
            picker,
            pickerValue;
        me.callParent();

        //Apply value from Ext.ux.DateRange (our picker)
        picker = me.getPicker();
        pickerValue = picker.getValue();
        me.startDate.setValue(pickerValue ? pickerValue.startDate : undefined);
        me.endDate.setValue(pickerValue ? pickerValue.endDate : undefined);

        //Enable / Disable next and previous button
        if(me.startDate.getValue() === null || me.endDate.getValue() === null) {
            me.nextButton.setDisabled(true);
            me.prevButton.setDisabled(true);
        } else {
            me.nextButton.setDisabled(false);
            me.prevButton.setDisabled(false);
        }
    },

    /**
     * Copies the value over to oldValue, so that we can restore it, if needed!
     */
    setOldValue: function() {
        var me = this;
        me.oldValue = { startDate: me.value.startDate, endDate: me.value.endDate };
    }
});
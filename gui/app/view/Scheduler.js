Ext.define("Reserv.view.Scheduler", {
    extend: 'Ext.panel.Panel',
    xtype: 'reservscheduler',

    requires: [
        'Ext.panel.Panel',
        'Ext.tree.Column',
        'Ext.ux.daterange.field.DateRangeSelection',
        'Sch.panel.SchedulerTree',
        'Reserv.view.ReservationEditor',
        'Reserv.view.windows.AddRentalUnit',
        'Reserv.view.component.CssButton',
        'Reserv.view.MyGridPlugin'
    ],
    layout: 'border',
    border: false,

    initComponent: function() {
        var me = this,
            daterange,
            startDate,
            endDate,
            eDate = Ext.Date,
            today = eDate.clearTime( new Date() );

        var me = this;

        //Register viewConfig for the schedulertree
        Sch.preset.Manager.registerPreset("customDayAndWeek", this.schedulerViewConfig);

        Ext.apply(me, {
            items: [
                {
                    xtype: 'toolbar',
                    region: 'north',
                    border: false,
                    style: {
                        backgroundColor: '#376EA8'
                    },
                    items: [{
                        xtype: 'button',
                        itemId: 'showaddrentalunit',
                        text: 'Add',
                        scale: 'medium'
                    },'->',
                        {
                            xtype: 'cssbutton',
                            cls: 'x-datepicker-prev-fast-big x-datepicker-arrow-big',
                            btnType: 'navigation',
                            direction: -1,
                            fastForward: true
                        },
                        {
                            xtype: 'cssbutton',
                            cls: 'x-datepicker-prev-big x-datepicker-arrow-big',
                            btnType: 'navigation',
                            direction: -1,
                            fastForward: false
                        },
                        {
                            xtype: 'daterangeselection',
                            weekDayStart: 1, //monday to
                            weekDayEnd: 0,  // sunday
                            format: 'd.m.Y',
                            datePickerConfig: {
                                startDay: 1
                            },
                            handlerBtnApply: function(daterange, value, eOpts) {
                                var schedulertree = daterange.up("reservscheduler").down("schedulertree");
                                schedulertree.setStart(value.startDate);
                                schedulertree.setEnd(Ext.Date.add(value.endDate, Ext.Date.DAY, 1));

                            },
                            listeners: {
                                'select': function(daterange, value, eOpts) {
                                    var schedulertree;

                                    //if the daterange is not expanded, we apply each change directly
                                    //if it is expanded, user has to press 'apply'
                                    if(!daterange.isExpanded) {
                                        daterange.setOldValue();
                                        schedulertree = daterange.up("reservscheduler").down("schedulertree");
                                        schedulertree.setStart(value.startDate);
                                        schedulertree.setEnd(Ext.Date.add(value.endDate, Ext.Date.DAY, 1));
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'cssbutton',
                            cls: 'x-datepicker-next-big x-datepicker-arrow-big',
                            btnType: 'navigation',
                            direction: 1,
                            fastForward: false
                        },
                        {
                            xtype: 'cssbutton',
                            cls: 'x-datepicker-next-fast-big x-datepicker-arrow-big',
                            btnType: 'navigation',
                            direction: 1,
                            fastForward: true
                        },'->',
                        {
                            xtype: 'container'
                        }
                    ]
                },
                {
                    xtype: 'schedulertree',
                    region: 'center',
                    resourceStore: 'RentalUnitsTree',
                    rowHeight: 32,

                    eventStore: 'Reservations',
                    useArrows: true,
                    snapToIncrement: true,
                    multiSelect: true,
                    viewPreset: "customDayAndWeek",
                    forceFit: true,
                    allowOverlap: false,
                    headerConfig            : {         // This defines your header, you must include a "middle" object, and top/bottom are optional.
                        middle      : {                 // For each row you can define "unit", "increment", "dateFormat", "renderer", "align", and "scope"
                            unit        : "DAY",
                            dateFormat  : 'd.m.Y'
                        },
                        top         : {
                            unit        : "WEEK",
                            dateFormat  : 'm'
                        }
                    },
                    columns: [
                        {
                            xtype: 'treecolumn',
                            text: 'Rental Units',
                            width: 200,
                            dataIndex: 'Name'
                        }, {
                            xtype:'actioncolumn',
                            width:50,
                            items: [{
                                icon: 'resources/images/delete.png',
                                tooltip: 'Delete',
                                handler: function(grid, rowIndex, colIndex) {
                                    var resource = grid.getStore().getAt(rowIndex);
                                    Ext.Msg.confirm({
                                        title:'Delete resource?',
                                        msg: 'Do you really want to delete «' + resource.get('Name') + '» and all its child items?',
                                        buttons: Ext.Msg.YESNO,
                                        fn: function() {
                                            //Before we delete the
                                            resource.destroy();
                                        },
                                        icon: Ext.Msg.QUESTION
                                    });
                                }
                            }]
                        }
                    ],

                    plugins:
                        /*[
                        {
                            ptype: 'reservationeditor',
                            height: 140,
                            width: 290,
                            timeConfig: {
                                hidden: true
                            },
                            dateConfig: {
                                width: 200
                            }
                        },
                        {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        },*/
                        new Reserv.view.MyGridPlugin()
//                    ]
                }
            ]
        });

        me.callParent(arguments);

        //select current week
        daterange = me.down("daterangeselection");
        startDate = eDate.add(today,Ext.Date.DAY, daterange.weekDayStart - today.getDay());
        //add days to get to weekDayEnd.
        // E.g: weekDayEnd: 0 (Sun), today.getDay(): 3 -> expected result 4!
        // (weekDayEnd(0) + 7 ) - 3 = 4
        // other example: (weekDayEnd(6) + 7) - 3 = 10 % 7 = 3 -> in this case the expected result
        endDate = eDate.add(today,Ext.Date.DAY, ((daterange.weekDayEnd + 7) - today.getDay()) % 7 );
        daterange.setStartAndEndDate(startDate, endDate);

    },

    schedulerViewConfig: {
        timeColumnWidth:100,
        rowHeight:24,
        resourceColumnWidth:100,
        displayDateFormat:"Y-m-d G:i",
        shiftUnit:"DAY",
        shiftIncrement:1,
        defaultSpan:5,
        timeResolution:{unit:"HOUR",increment:24},
        columnLinesFor: 'bottom',
        headerConfig            : {         // This defines your header, you must include a "middle" object, and top/bottom are optional.
            bottom      : {                 // For each row you can define "unit", "increment", "dateFormat", "renderer", "align", and "scope"
                unit        : "DAY",
                dateFormat  : 'd.m.'
            },
            middle         : {
                unit        : "WEEK",
                renderer : function(start, end, headerConfig, index) {
                    return "CW " + Ext.Date.format(start, "W (d.m. - ") + Ext.Date.format(end, "d.m.Y)");
                }
            }
        }
    }


});
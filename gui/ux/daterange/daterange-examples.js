Ext.ns('App');

Ext.Loader.setConfig({enabled : true, disableCaching : true });
Ext.Loader.setPath('Ext.ux.daterange', '.');
Ext.Loader.setPath('Overrides', '../../overrides');

Ext.require([
    'Ext.ux.daterange.field.DateRangeSelection',
    'Overrides.Picker', //only needed for ext 4.2.1
    'Overrides.Component' //only needed for ext 4.2.1
]);

Ext.onReady(function () {
    var daterange = Ext.create('Ext.ux.daterange.picker.DateRange', {
        renderTo: 'example-container1',
        initKeyNavArrows: true
    });

    var daterangefield =  Ext.create('Ext.ux.daterange.field.DateRange', {
        renderTo: 'example-container2',
        format: 'd.m.Y',
        width: 190,
        datePickerConfig: {
            startDay: 1
        }
    });

    var daterangeselection = Ext.create('Ext.ux.daterange.field.DateRangeSelection', {
        renderTo: 'example-container3',
        width: 190,
        numberOfCalendars: 5,
        weekDayStart: 1,
        weekDayEnd: 5,
        datePickerConfig: {
            startDay: 1
        }
    });

    var eDate = Ext.Date,
        today = new Date();

    var startDate = eDate.add(today,Ext.Date.DAY, daterange.weekDayStart - today.getDay());
    //add days to get to weekDayEnd.
    // E.g: weekDayEnd: 0 (Sun), today.getDay(): 3 -> expected result 4!
    // (weekDayEnd(0) + 7 ) - 3 = 4
    // other example: (weekDayEnd(6) + 7) - 3 = 10 % 7 = 3 -> in this case the expected result
    var endDate = eDate.add(today,Ext.Date.DAY, ((daterange.weekDayEnd + 7) - today.getDay()) % 7 );

    daterangeselection.setStartAndEndDate(startDate, endDate);
});

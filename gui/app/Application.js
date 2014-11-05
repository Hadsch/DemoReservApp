Ext.define('Reserv.Application', {
    name: 'Reserv',

    extend: 'Ext.app.Application',

    views: [
        // TODO: add views here
    ],

    controllers: [
        'Main',
        'Scheduler'
    ],

    stores: [
        'RentalUnits',
        'RentalUnitsTree',
        'Reservations'
    ]
	
});

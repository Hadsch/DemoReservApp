Ext.define('Reserv.view.Main', {
    extend: 'Ext.container.Container',
    requires:[
        'Ext.layout.container.Border',
        'Reserv.view.Scheduler'
    ],

    xtype: 'app-main',

    layout: {
        type: 'fit'
    },

    items: [{
        xtype: 'reservscheduler'
    }]
});
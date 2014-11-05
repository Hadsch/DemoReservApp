
Ext.define('Reserv.view.windows.AddRentalUnit', {
    extend: 'Ext.window.Window',
    xtype: 'addrentalunit',

    requires: [
       'Ext.window.Window'
    ],

    title: 'Add rental unit',
    bodyPadding: 15,

    layout: 'anchor',
    items: [{
        xtype: 'textfield',
        name: 'Name',
        emptyText: 'Enter a name'
    }],
    buttons: [{
        text: 'Okay'
    }]

});
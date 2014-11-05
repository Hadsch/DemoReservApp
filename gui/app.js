/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/

Ext.Loader.setConfig({
    paths : {
        'Overrides': 'overrides',
        'Ext.ux': 'ux'
    }
});

Ext.override(Ext.picker.Date, {
    collapseImmune: true
});

Ext.application({
    name: 'Reserv',

    extend: 'Reserv.Application',
    
    autoCreateViewport: true
});

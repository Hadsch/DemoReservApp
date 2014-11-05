
Ext.define("Reserv.store.Reservations", {
    extend : 'Sch.data.EventStore',
    model : 'Reserv.model.Reservation',

    autoLoad : true,
    autoSync : true,

    proxy: {
        type: 'rest',
        url: 'reservation',

        noCache: false,
        limitParam: undefined,

        startParam: undefined,
        pageParam: undefined

    }

});


Ext.define('Reserv.store.RentalUnitsTree', {
    extend: 'Sch.data.ResourceTreeStore',

    model: 'Reserv.model.RentalUnit',

    storeId: 'RentalUnitsTreeStore',

    root: {
        expanded: true,
        text: "My Root"
    },

    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            root: 'children'
        },

        noCache: false,
        limitParam: undefined,

        startParam: undefined,
        pageParam: undefined,

        url : 'rentalUnit/tree'
    },

    autoLoad: false


});

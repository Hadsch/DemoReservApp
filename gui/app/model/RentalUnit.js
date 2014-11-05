Ext.define('Reserv.model.RentalUnit', {
    extend: 'Sch.model.Resource',
    
    fields: [
        { name: 'Id', type: 'auto', mapping: 'id' },
        { name: 'Name', type: 'auto', mapping: 'name' },
        { name: 'Type', type: 'auto', mapping: 'type' },
        { name: 'Parent', type: 'int', mapping: 'parent' }
    ],

    proxy: {
        type: 'rest',
        noCache: false,
        limitParam: undefined,

        startParam: undefined,
        pageParam: undefined,

        url : 'rentalUnit',
        writer: {
            nameProperty: 'mapping'
        }
    }
});

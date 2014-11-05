
Ext.define("Reserv.model.Reservation", {
    extend: 'Sch.model.Event',
    fields: [
        {
            name: 'Id',
            type: 'int',
            mapping: 'id'
        },
        {
            name: "Resizable",
            type: "boolean",
            defaultValue: true
        },
        {
            name: "Draggable",
            type: "boolean",
            defaultValue: true
        }
    ]
});
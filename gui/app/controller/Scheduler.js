Ext.define('Reserv.controller.Scheduler', {
    extend: 'Ext.app.Controller',

    refs: [{
        ref: 'scheduler',
        selector: 'schedulertree'
    },{
        ref: 'dateRange',
        selector: 'daterangeselection'
    }],

    requires: [

    ],

    init: function() {
        this.control({
            'button[itemId=showaddrentalunit]': {
                click: this.onButtonClickShowAddRentalUnit
            },
            'window button': {
                click: this.onButtonClickAddRentalUnit
            },
            'cssbutton[btnType=navigation]': {
                click: this.onButtonClickNavigation
            }
        });
    },

    /**
     * Create and show the add rental unit window
     * @param btn
     * @param eOpts
     */
    onButtonClickShowAddRentalUnit: function(btn, eOpts) {
        var window = Ext.widget('addrentalunit');
        window.show();
    },

    /**
     * Creates a new rental unit object. After it has been successfully submitted to the server it will be
     * added to the 'Reservations' store
     * @param btn
     * @param eOpts
     */
    onButtonClickAddRentalUnit: function(btn, eOpts) {
        var me = this,
            window = btn.up("window"),
            textfield = window.down("textfield"),
            selection = me.getScheduler().getSelectionModel().getSelection(),
            resourceStore = me.getScheduler().getResourceStore(),
            treeNode = resourceStore.getRootNode(),
            parent = 0,
            rentalUnit;

        if(Ext.isEmpty(textfield.getValue())) return;

        if(!Ext.isEmpty(selection) && selection.length > 0) {
            parent = selection[0].data.Id;
            treeNode = resourceStore.getById(parent);

            if(treeNode === undefined)
                treeNode = resourceStore.getRootNode();
        }

        rentalUnit = Ext.create('Reserv.model.RentalUnit', { Name: textfield.getValue(), Parent: parent});

        rentalUnit.save({
            success: function() {
                rentalUnit.set('leaf', true);
                treeNode.set('leaf', false);
                treeNode.insertChild(0, rentalUnit);
            },
            failure: function() {
                Ext.Msg.alert("Error", "Auuuuch.... This should not happen =(" );
            }
        });

        window.close();
    },

    onButtonClickNavigation: function(btn, eOpts) {
        var me = this,
            dateRangeField = me.getDateRange().getPicker();

        dateRangeField.moveToDateRange(btn.direction, btn.fastForward);
    }


});
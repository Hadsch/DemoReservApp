// A simple preconfigured editor plugin

Ext.define('Reserv.view.ReservationEditor', {

    extend: "Sch.plugin.EventEditor",
    alias: 'plugin.reservationeditor',

    requires: [
        'Ext.form.TextField'
    ],


    initComponent: function () {
        var me = this;
        Ext.apply(me, {

            durationUnit    : Sch.util.Date.DAY,
            durationConfig  : {
                minValue    : 1
            },

            buttonAlign: 'center',

            // panel with form fields
            fieldsPanelConfig: {
                xtype: 'container',

                layout: {
                    type: 'card',
                    deferredRender: true
                },

                items: [
                    // form for "Meeting" EventType
                    {
                        preventHeader: true,
                        xtype: 'form',
                        padding: 5,
                        layout: 'hbox',

                        style: 'background:#fff',
                        cls: 'editorpanel',
                        border: false,

                        items: [
                            {
                                xtype: 'container',

                                style: 'background:#fff',
                                border: false,

                                flex: 1,

                                layout: 'anchor',

                                defaults: {
                                    anchor: '90%'
                                },

                                items: [
                                    this.nameField = new Ext.form.TextField({
                                        name: 'Name',
                                        emptyText: 'Name...',
                                        listeners: {
                                            specialkey: function(field, e, eOpts){
                                                if (e.getKey() == e.ENTER) {
                                                    me.onSaveClick();
                                                }
                                            },
                                            scope: me
                                        }
                                    })

                                ]
                            }
                        ]
                    }
                    // eof form for "Meeting" EventType

                ]
            }
            // eof panel with form fields
        });

        me.on('expand', this.nameField.focus, this.nameField);

        me.callParent(arguments);

        me.saveButton.on('click', function() {

            me.startTimeField.setValue( Ext.Date.clearTime( me.startDateField.getValue()));

        }, me);
    }

});

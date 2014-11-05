Ext.define("Reserv.view.component.CssButton", {
    extend: 'Ext.Component',
    xtype: 'cssbutton',

    width: 16,
    height: 16,

    autoEl: 'a',

    initEvents: function() {
        var me = this;
        me.callParent();
        me.mon(me.el, 'click', me.onClick, me);
    },

    onClick: function(event, eOpts) {
        var me = this;
        me.fireEvent('click', me, event, eOpts);
    }

});
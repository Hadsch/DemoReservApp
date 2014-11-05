
Ext.define('MyPanel', {
    extend : 'Ext.Panel',

    sayHello : function() { console.log('Hello world'); },

    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            tbar : [
                {
                    text : 'Click to say hello',
                    handler : this.sayHello,
                    scope : this
                }
            ]
        });

        me.callParent();
    }
});
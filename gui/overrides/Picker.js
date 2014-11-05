
Ext.define('Overrides.Picker', {
    override: 'Ext.form.field.Picker',

    /**
     * @private
     * Runs on mousewheel and mousedown of doc to check to see if we should collapse the picker
     * You need this override only if you use extjs 4.2.1
     */
    collapseIf: function(e) {
        var me = this;
        if (!me.isDestroyed && !e.within(me.bodyEl, false, true) && !me.owns(e.target)) {
            me.collapse();
        }
    },

    /**
     * You need this override only if you use extjs 4.2.1
     * @param e
     */
    mimicBlur: function(e) {
        var me = this,
            picker = me.picker;

        // Continue blur processing for events which are NOT within this component's descedant tree
        if (!picker || !me.owns(e.target)) {
            me.callParent(arguments);
        } else {
            me.inputEl.focus();
        }
    }

});

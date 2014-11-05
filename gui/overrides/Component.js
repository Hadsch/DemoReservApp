
Ext.define('Overrides.Component', {
    override: 'Ext.Component',

    /**
     * @private
     * Returns `true` if the passed element is within the container tree of this component.
     * You need this override only if you use extjs 4.2.1!!
     */
    owns: function(element) {
        var result = false,
            cmp;

        cmp = Ext.Component.findComponentByElement(element);

        if (cmp) {
            result = (cmp === this) || (!!cmp.up(this)) || cmp.up("daterange");
        }

        return result;
    },

    statics: {
        /**
         * Walk the DOM tree upwards and find the Component these elements belong to.
         * @private
         */
        findComponentByElement: function(node) {
            var topmost = document.body,
                target = node,
                cmp;

            while (target && target.nodeType === 1 && target !== topmost) {
                cmp = Ext.getCmp(target.id);

                if (cmp) {
                    return cmp;
                }

                target = target.parentNode;
            }

            return null;
        }

    }

});
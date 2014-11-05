Ext.define('Overrides.AbstractElement', {
    override: 'Ext.dom.AbstractElement',


    /**
     * @property {Boolean} isEvent
     * `true` in this class to identify an object as an instantiated Event, or subclass thereof.
     */
    isElement: true

});

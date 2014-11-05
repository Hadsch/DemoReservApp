Ext.define('Overrides.Rest', {
    override: 'Ext.data.proxy.Rest',

    //Zero should not be a valid id
    isValidId: function(id) {
        return !Ext.isEmpty(id) && id !== 0;
    }
});
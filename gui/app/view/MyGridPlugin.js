Ext.define('Reserv.view.MyGridPlugin', {

    init : function(grid) {
        grid.getStore().on({
            load : function() {
                debugger;
                grid.el.highlight(); // Some cool fx to bring attention to the grid
            }
        });
    }
});



Ext.define('MyGridPlugin', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.mygridplugin',

    init : function(grid) {
        grid.getStore().on({
            load : function() {
                grid.el.highlight(); // Some cool fx to bring attention to the grid
            }
        });
    }
});

// Let’s try it out
var myGrid = new Ext.grid.Panel({
    renderTo : document.body,
    store : someStore,
    plugins :[{
        ptype: 'mygridplugin'
    }]
});
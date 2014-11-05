Ext.define('Reserv.controller.Main', {
    extend: 'Ext.app.Controller',

    requires: [
        'Overrides.Rest',
        'Overrides.Component',
        'Overrides.Picker'
//        'Overrides.EventObject',
//        'Overrides.AbstractElement',
//        'Overrides.ComponentQuery'
    ],

    init: function() {

        //Connect and listen to socket io
        /*var socket = io.connect('http://localhost:1337');

        socket.on('connect', function() {
            socket.get('/rentalunit',{},function(a) {console.log(a) });

            socket.on('message',function(message) {

                console.log(message);
            });
        });*/
        /*this.control({
            'schedulertree': {

            }
        });*/
    }



});

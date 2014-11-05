/**
 * RentalUnitController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    tree: function (req, res) {
        var tree = [];

        RentalUnit.find()
            .exec(function (err, rentalUnits) {

                rentalUnits.forEach(function(unit){

                    var parents = rentalUnits.filter(function(rec) {
                        return rec.id === unit.parent;
                    });

                    unit.loaded = true;
                    unit.expanded = true;

                    if(unit.leaf === undefined)
                        unit.leaf = true;

                    if(unit.parent === 0)
                        tree.push(unit);

                    if(parents.length !== 0) {
                        var parent = parents[0];

                        if(parent.children === undefined)
                            parent.children = [];
                        parent.children.push(unit);
                        parent.leaf = false;
                    }

                });
                res.json( {success:true,children: tree } );
            });

    },

    destroy: function(req, res) {
        var id = req.param("id"),
            resJson = {};


        //Delete RentalUnit and all reservations from this RentalUnit
        RentalUnit.findOne(id).exec(function (err, record) {

            RentalUnit.destroy(id, function (err) {

                if (err) return next (err);
                resJson.record = record;

                var options = { where: { "ResourceId" : record.id || -1 } };
                Reservation.destroy( options, function(err, records) {
                    res.json({record: record, reservation: records});
                });
            });

        });

    }
/*    index: function (req, res) {
        RentalUnit.find().exec(function (err, rentalUnits) {
            res.json(rentalUnits);
        });
    }*/

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to RentalUnitController)
     *//*
    _config: {}*/


};

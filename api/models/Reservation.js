/**
* Reservation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      Name: {
          type: 'STRING',
          required: true
      },
      StartDate : {
          type: 'DATE',
          required: true
      },
      EndDate : {
          type: 'DATE',
          required: true
      },
      ResourceId: {
          type: 'INTEGER',
          required: true
      }


  }
};


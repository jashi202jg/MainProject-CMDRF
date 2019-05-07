import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Mongo } from 'meteor/mongo';


Meteor.methods({
  'checkAadhar': function (aadharNumber) {

    if (Meteor.users.find({ "profile.aadharNumber": { "$eq": '' + aadharNumber } }).fetch().length == 0)
      return false
    else
      return true
  },

  "users.balanceUpdate"(_id, aadharNumber, balance) {

    //console.log(balance)

    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    Meteor.users.update({ _id: _id }, { $set: { profile: { "aadharNumber": aadharNumber, "balance": balance } } })
  }
})

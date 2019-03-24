import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Mongo } from 'meteor/mongo';


Meteor.methods({
    'checkAadhar':function(aadharNumber){

        if(Meteor.users.find({"profile.aadharNumber":{"$eq":''+aadharNumber}}).fetch().length==0)
          return false
        else
          return true
    }
})
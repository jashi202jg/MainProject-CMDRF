import { Meteor } from 'meteor/meteor';
import '../imports/api/users'
import '../imports/api/transactions'
Meteor.startup(() => {
    Meteor.users.allow({ update: () => true });
});


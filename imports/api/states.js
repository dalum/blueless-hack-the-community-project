import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const States = new Mongo.Collection('states');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('states', function statesPublication() {
      return States.find();
  });
}

Meteor.methods({
    'states.insert'(primary, secondary) {
        check(primary, String);
        check(secondary, String);
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        States.insert({
            primary,
            secondary,
            createdAt: new Date(),
            owner: Meteor.userId()
        });
    },
    'states.remove'(id) {
        check(id, String);
        States.remove(id);
    }//,
    //
    // 'states.update'(id, setChecked) {
    //     check(taskId, String);
    //     check(setChecked, Boolean);
    //     Tasks.update(taskId, { $set: { checked: setChecked } });
    // },
});

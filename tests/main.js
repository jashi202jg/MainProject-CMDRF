import assert from "assert";
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import '../imports/api/users'

describe("cmdrf", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "cmdrf");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });

  }

  if (Meteor.isServer) {

    beforeEach(function () {
      Meteor.users.remove({})
    })

    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    })

    it("Should not insert a new user with an existing aadhar number", function () {
      Accounts.createUser({ email: "test@gmail.com", username: "testUser", password: "pswd", profile: { aadharNumber: "121212121212", balance: 12 } })
      assert.strictEqual(Meteor.server.method_handlers['checkAadhar'].apply({}, ["121212121212"]), true)
    })

    it('Should not send money if not authenticated', function () {
      assert.throws(() => {
        Meteor.server.method_handlers['users.balanceUpdate']()
      })
    })

    it('Transaction Consistency check', function () {
      Accounts.createUser({ email: "test1@gmail.com", username: "testUser1", password: "pswd1", profile: { aadharNumber: "121212121211", balance: 11 } })
      Accounts.createUser({ email: "test2@gmail.com", username: "testUser2", password: "pswd2", profile: { aadharNumber: "121212121212", balance: 12 } })
      
      const users = Meteor.users.find({}).fetch().map(u=>u._id)

      Meteor.server.method_handlers['users.balanceUpdate'].apply({userId:users[0]},[users[0],"121212121211",6])
      Meteor.server.method_handlers['users.balanceUpdate'].apply({userId:users[1]},[users[1],"121212121212",17])

      const user1 = Meteor.users.find({_id:users[0]}).fetch()
      const user2 = Meteor.users.find({_id:users[1]}).fetch()

      assert.strictEqual(user1[0].profile.balance, 6)
      assert.strictEqual(user2[0].profile.balance, 17)

    })
       
  }
});

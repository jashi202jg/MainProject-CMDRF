import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom'
import { Accounts } from 'meteor/accounts-base'
import { Tracker } from 'meteor/tracker'
import { Meteor } from 'meteor/meteor'
import { Button, Message, Card, Form, Modal } from 'semantic-ui-react'

import { Transactions } from '../../api/transactions.js';


export default class UserAccount extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            error: '',
            loading: false,
            username: '',
            balance: '',
            id: '',
            aadhar: ''
        }
    }

    componentDidMount() {
        this.UserTracker = Tracker.autorun(() => {

            if (Meteor.user())
                this.setState({
                    username: Meteor.user().username,
                    balance: Meteor.user().profile.balance,
                    id: Meteor.user()._id,
                    aadhar: Meteor.user().profile.aadharNumber
                })
        })
    }

    componentWillUnmount() {
        this.UserTracker.stop()
    }

    onLogout = () => {
        this.setState({ loading: true })
        Accounts.logout()
    }

    getAccountTransactions = (startBlockNumber, endBlockNumber, callback) => {

        let flag = 0

        for (var i = endBlockNumber; i >= startBlockNumber; i--) {


            web3.eth.getBlock(i, true).then(a => {

                if (flag === 1)
                    return

                var t = a.transactions
                for (var i = 0; i < t.length; i++) {
                    if (t[i].to == "0x472d44B8ABD919Bef682109855d4141CD292c365") {
                        //console.log(t[i].hash)
                        callback(t[i].hash)
                        flag = 1
                        return
                    }
                }
            });
        }
    }

    distribute = (e) => {
        e.preventDefault()

        let amount = this.amount.value.trim()
        let aadharNumber = this.aadharNumber.value.trim()

        if (aadharNumber.length != 12) {
            alert("Aadhar number should be a 12 digit number")
            return
        }
        if (aadharNumber == "123456123456") {
            alert("No user found in this Aadhar Number")
            return
        }

        this.amount.value = ""
        this.aadharNumber.value = ""

        if (amount > this.state.balance) {
            alert("Insufficient fund")
            return
        }

        if (amount === "0") {
            alert("please enter a valid amount")
            return
        }

        var res = Meteor.users.find({ "profile.aadharNumber": { "$eq": aadharNumber } }).fetch()
        res = res.map(function (elem) {
            return elem.username;
        });
        var u = res[0]

        if (u == undefined) {
            alert("No user found in this Aadhar Number")
            return
        }

        Hashcademy.methods.setCertificate("CMDRF", aadharNumber, amount).send({ from: web3.eth.defaultAccount }).on('receipt', function (receipt) {
        });

        var delayInMilliseconds = 50000;

        web3.eth.getBlockNumber().then(a => {
            var latestBlock = a
            console.log(latestBlock)
            setTimeout(() => {
                this.getAccountTransactions(latestBlock, latestBlock + 10, (t) => {

                    var admin_b = this.state.balance - amount
                    Meteor.users.update({ _id: this.state.id }, { $set: { profile: { "aadharNumber": this.state.aadhar, "balance": admin_b } } })
                    // Meteor.call('users.balanceUpdate', this.state.id, this.state.aadhar, admin_b, (err) => {
                    //     //alert("Send!")
                    // })


                    var res = Meteor.users.find({ "profile.aadharNumber": { "$eq": aadharNumber } }).fetch()
                    var rec_id = res[0]._id
                    var rec_b = parseInt(res[0].profile.balance) + parseInt(amount)

                    Meteor.users.update({ _id: rec_id }, { $set: { profile: { "aadharNumber": aadharNumber, "balance": rec_b } } })
                    // Meteor.call('users.balanceUpdate', rec_id, aadharNumber, rec_b, (err) => {
                    //     alert("Send!")
                    // })


                    console.log(t)
                    Transactions.insert({ "From": "CMDRF", "To": u, "Amount": amount, "Hash": t })

                })
            }, delayInMilliseconds);
        })

    }

    donate = (e) => {
        e.preventDefault()


        let amount = this.amount.value.trim()
        this.amount.value = ""

        if (amount > this.state.balance) {
            alert("Insufficient fund")
            return
        }

        if (amount === "0") {
            alert("please enter a valid amount")
            return
        }


        Hashcademy.methods.setCertificate(Meteor.user().username, "CMDRF", amount).send({ from: web3.eth.defaultAccount }).on('receipt', function (receipt) {
        });


        var delayInMilliseconds = 50000;

        web3.eth.getBlockNumber().then(a => {
            var latestBlock = a
            console.log(latestBlock)
            setTimeout(() => {
                this.getAccountTransactions(latestBlock, latestBlock + 10, (t) => {

                    var donor_b = this.state.balance - amount
                    Meteor.users.update({ _id: this.state.id }, { $set: { profile: { "aadharNumber": this.state.aadhar, "balance": donor_b } } })
                    // Meteor.call('users.balanceUpdate', this.state.id, state, donor_b, (err) => {
                    //     //alert("Send!")
                    // })

                    var res = Meteor.users.find({ "profile.aadharNumber": { "$eq": "123456123456" } }).fetch()
                    var admin_id = res[0]._id
                    var admin_b = parseInt(res[0].profile.balance) + parseInt(amount)

                    Meteor.users.update({ _id: admin_id }, { $set: { profile: { "aadharNumber": "123456123456", "balance": admin_b } } })
                    // Meteor.call('users.balanceUpdate', admin_id, "123456123456", admin_b, (err) => {
                    //     alert("Send!")
                    // })

                    console.log(t)
                    var f = this.state.username
                    Transactions.insert({ "From": f, "To": "CMDRF", "Amount": amount, "Hash": t })

                })
            }, delayInMilliseconds);
        })

    }

    render() {

        if (this.state.username == 'Admin') {
            return (
                <div className="card-center">
                    <div className="ui centered card">
                        <Card>
                            <Card.Content>
                                <Card.Header><span className="user">{this.state.username}</span></Card.Header>
                                <br />
                                <Card.Description>
                                    <h4 style={{ textAlign: "center" }}>Balance: {this.state.balance}</h4>
                                    <Form onSubmit={this.distribute}>
                                        <Form.Field>
                                            <label>To</label>
                                            <input type="number" placeholder="Aadhar number" ref={e => this.aadharNumber = e} required /><br />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Amount</label>
                                            <input type="number" placeholder="Amount" ref={e => this.amount = e} required /><br /><br />
                                        </Form.Field>
                                        <Button type="submit" loading={this.state.loading}>Send</Button>
                                    </Form>
                                    <br />
                                    <div>
                                        <Message>
                                            <Link to='/transactions'>Transaction History</Link>
                                        </Message>
                                    </div>
                                </Card.Description>
                            </Card.Content>
                            <Button onClick={this.onLogout} loading={this.state.loading}>Logout</Button>
                        </Card>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="card-center">
                    <div className="ui centered card">
                        <Card>
                            <Card.Content>
                                <Card.Header><span className="user">{this.state.username}</span></Card.Header>
                                <br />
                                <Card.Description>
                                    <h4 style={{ textAlign: "center" }}>Balance: {this.state.balance}</h4>
                                    <Form onSubmit={this.donate}>
                                        <Form.Field>
                                            <label>To</label>
                                            <input type="text" disabled value="CMDRF" /><br />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Amount</label>
                                            <input type="number" placeholder="Amount" ref={e => this.amount = e} required /><br /><br />
                                        </Form.Field>
                                        <Button type="submit" loading={this.state.loading}>Donate</Button>
                                    </Form>
                                    <br />
                                    <div>
                                        <Message>
                                            <Link to='/transactions'>Transaction History</Link>
                                        </Message>
                                    </div>
                                </Card.Description>
                            </Card.Content>
                            <Button onClick={this.onLogout} loading={this.state.loading}>Logout</Button>
                        </Card>
                    </div>
                </div>
            )
        }
    }
}
import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom'
import { Accounts } from 'meteor/accounts-base'
import { Tracker } from 'meteor/tracker'
import { Meteor } from 'meteor/meteor'
import { Button, Message, Card, Form } from 'semantic-ui-react'

import { Transactions } from '../../api/transactions.js';

export default class UserAccount extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            error: '',
            loading: false,
            username: '',
            balance: '',
            id: ''
        }
    }

    componentDidMount() {
        this.UserTracker = Tracker.autorun(() => {

            if (Meteor.user())
                this.setState({
                    username: Meteor.user().username,
                    balance: Meteor.user().profile.balance,
                    id: Meteor.user()._id
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

        var res = Meteor.users.find({profile:{"aadharNumber":aadharNumber}}).fetch()
        res = res.map(function (elem) {
            return elem.username;
          });
        var u = res[0] 

        if(u == undefined){
            alert("No user found in this Aadhar Number")
            return 
        }

        Transactions.insert({ "From":"CMDRF", "To":u, "Amount":amount, "Hash":"G" })

        Hashcademy.methods.setCertificate("CMDRF", aadharNumber, amount).send({ from: web3.eth.defaultAccount }).on('receipt', function (receipt) {
        });
    }

    donate = (e) => {
        e.preventDefault()

        let amount = this.amount.value.trim()
        this.amount.value = ""

        if(amount > this.state.balance){
            alert("Insufficient fund")
            return
        }

        var donor_b = this.state.balance - amount
        Meteor.users.update({_id:this.state.id},{$set:{profile:{"balance":donor_b}}})

        //P9FcSToZh6H8BHtxE
        var res = Meteor.users.find({"profile.aadharNumber":{"$eq":"123456123456"}}).fetch()
        var admin_id = res[0]._id
        var admin_b = parseInt(res[0].profile.balance) + parseInt(amount)

        Meteor.users.update({_id:admin_id},{$set:{profile:{"balance":admin_b}}})  

        var f = this.state.username
        Transactions.insert({ "From":f, "To":"CMDRF", "Amount":amount, "Hash":"C" })

        Hashcademy.methods.setCertificate(Meteor.user().username, "CMDRF", amount).send({ from: web3.eth.defaultAccount }).on('receipt', function (receipt) {
        });
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
                                    <h4 style={{textAlign:"center"}}>Balance: {this.state.balance}</h4>
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
                                    <h4 style={{textAlign:"center"}}>Balance: {this.state.balance}</h4>
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
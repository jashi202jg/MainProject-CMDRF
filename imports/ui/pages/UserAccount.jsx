import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom'
import { Accounts } from 'meteor/accounts-base'
import { Tracker } from 'meteor/tracker'
import { Meteor } from 'meteor/meteor'
import { Button, Message, Card, Form } from 'semantic-ui-react'


export default class UserAccount extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            error: '',
            loading: false,
            username: ''
        }
    }

    componentDidMount() {
        this.UserTracker = Tracker.autorun(() => {

            if (Meteor.user())
                this.setState({
                    username: Meteor.user().username
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

        this.amount.value = ""
        this.aadharNumber.value = ""

        //alert("success")
        Hashcademy.methods.setCertificate("CMDRF", aadharNumber, amount).send({ from: web3.eth.defaultAccount }).on('receipt', function (receipt) {
        });
    }

    donate = (e) => {
        e.preventDefault()

        let amount = this.amount.value.trim()
        this.amount.value = ""

        //alert("success")
        Hashcademy.methods.setCertificate(Meteor.user().username, "CMDRF", amount).send({ from: web3.eth.defaultAccount }).on('receipt', function (receipt) {
        });
    }

    render() {
        //console.log(Web3)
     
        if (this.state.username == 'Admin') {
            return (
                <div className="card-center">
                    <div className="ui centered card">
                        <Card>
                            <Card.Content>
                                <Card.Header><span className="user">{this.state.username}</span></Card.Header>
                                <br />
                                <Card.Description>
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
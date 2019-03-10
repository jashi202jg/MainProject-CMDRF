import React from 'react'
import { Link } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Meteor } from 'meteor/meteor'
import { Button, Form, Message, Card } from 'semantic-ui-react'

export default class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            error: '',
            loading: false
        }
    }

    onSubmit = (e) => {
        e.preventDefault()

        let email = this.email.value.trim()
        let password = this.password.value.trim()

        this.email.value = ""
        this.password.value = ""

        this.setState({ loading: true })

        Meteor.loginWithPassword({ email }, password, (err) => {
            if (err) {
                this.setState({ error: err.reason, loading: false })
                alert(err.reason)
            }
            else
                this.setState({ error: '', loading: false })
        })
    }

    render() {
        return (
            <div className="card-center">
                <div className="ui centered card">
                    <Card>
                        <Card.Content>
                            <Card.Header>Login</Card.Header>
                            <Card.Description>
                                <Form onSubmit={this.onSubmit}>
                                    <Form.Field>
                                        <label>Email</label>
                                        <input type="email" placeholder="Email" ref={e => this.email = e} required />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Password</label>
                                        <input type="password" placeholder="Password" ref={e => this.password = e} required />
                                    </Form.Field>
                                    <Button type="submit" loading={this.state.loading}>Login</Button>
                                </Form>
                                <br/>
                                <div>
                                <Message>
                                    <p>New User? <Link to='/register'>Register</Link></p>
                                </Message>
                                <Message>
                                    <Link to='/transactions'>Transaction History</Link>
                                </Message>
                                </div>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </div>
            </div>
        )
    }
}
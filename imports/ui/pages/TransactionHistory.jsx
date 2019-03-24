import React from 'react'
import { Menu, Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { FaAngleRight } from 'react-icons/fa';
import { FaAngleLeft } from 'react-icons/fa';
import { Meteor } from 'meteor/meteor';

export default class TransactionHistory extends React.Component {

    constructor(props) {

        super(props)
        this.transactions = [{ from: 'A', to: 'B', amount: '1', hash: 'C' }, 
                            { from: 'A', to: 'B', amount: '1', hash: 'C' }]
    }

    renderRows = () => {

        return this.transactions.map(transaction => {

            return (
                <Table.Row>
                    <Table.Cell>{transaction.from}</Table.Cell>
                    <Table.Cell>{transaction.to}</Table.Cell>
                    <Table.Cell>{transaction.amount}</Table.Cell>
                    <Table.Cell>{transaction.hash}</Table.Cell>
                </Table.Row>
            )
        })
    }

    render() {

        return (
            <div className="table">
                <span className="transaction">Transaction History</span><br />
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>From</Table.HeaderCell>
                            <Table.HeaderCell>To</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Hash</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.renderRows()}
                    </Table.Body>

                </Table>
            </div>
        )
    }
}
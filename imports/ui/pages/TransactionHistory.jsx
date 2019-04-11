import React from 'react'
import { Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Meteor } from 'meteor/meteor';

import { Transactions } from '../../api/transactions.js';

export default class TransactionHistory extends React.Component {

    constructor(props) {

        super(props)
        this.records = Transactions.find({}).fetch()
    }

    renderRows = () => {

        return this.records.reverse().map(record => {

            return (
                <Table.Row>
                    <Table.Cell>{record.From}</Table.Cell>
                    <Table.Cell>{record.To}</Table.Cell>
                    <Table.Cell>{record.Amount}</Table.Cell>
                    <a href={`https://ropsten.etherscan.io/tx/${record.Hash}`} target="_blank"><Table.Cell>{record.Hash}</Table.Cell></a>
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
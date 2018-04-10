import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { Col, Row } from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import { API_ROOT } from './config.js';

export default class TotalsView extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            income_category_options: [],
            expense_category_options: [],
            collapse: false,
            data: {
                net: 0,
                total_income: 0,
                total_expense: 0,
                incomes: {

                },
                expenses: {

                }
            },
            date: new Date(),
		};
    }

    componentWillReceiveProps(props) {
		this.setState({
			income_category_options: props.income_category_options,
            expense_category_options: props.expense_category_options,
            date: props.date 
		}, () => this.getData());
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        var data = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			mode: 'cors',
        };
        
        fetch(API_ROOT + '/api/totals/' + this.state.date.getFullYear() + '/' + (this.state.date.getMonth() + 1) + '/')
        .then((data) => { 
            data.json()
                .then((data) => { 
                    this.setState({data:data});
                });
        })
        .catch(err => { console.log(err); this.close(); });
    }

    sortCategoryKeys = (categories) => {
        var keys = Object.keys(categories);
        return keys.sort((x, y) => {
            return categories[x] > categories[y]
        });
    }

    renderCategoryTotals = (categories) => {
        var keys = this.sortCategoryKeys(categories);

        return keys.map((key) => {
            if (categories[key]) {
                return <ListItem primaryText={key} secondaryText={this.formatMoney(categories[key])} />;
            }
        });
    }

    formatMoney = (amount) => {
        return "$ " + parseFloat(amount).toFixed(2);
    }

    clickOpen = () => {
        this.setState({collapse:!this.state.collapse});
    }

    close = () => {
        this.setState({collapse:!this.state.collapse});
    }
    
    render() {
        
        const style = {
            textAlign: 'center',
            display: 'inline-block',
            width:'100%'
        };

        var net_style = {
                
        };
    
        if (this.state.data.net > 0) {
            net_style = {
                color:"green"
            }
        }
        else if (this.state.data.net < 0) {
            net_style = {
                color:"red"
            }
        }

        return (
            <Paper
                style={style}
                zDepth={2}
            >
                <Row xs="center" lg="center">
                    <Col xs={4} lg={2}>
                        <p>Net</p>
                        <p style={net_style}>{this.formatMoney(this.state.data.net)}</p>
                    </Col>
                    <Col xs={4} lg={2}>
                        <p>Total Income</p>
                        <p>{this.formatMoney(this.state.data.total_income)}</p>
                    </Col>
                    <Col xs={4} lg={2}>
                        <p>Total Expenses</p>
                        <p>{this.formatMoney(this.state.data.total_expense)}</p>
                    </Col>
                </Row>
                <Row>
                    <Col lg={8}>
                        <RaisedButton label="category totals" onClick={this.clickOpen} style={{marginBottom:10}}/>
                        <Dialog 
                            title="Category Totals"
                            open={this.state.collapse}
                            onRequestClose={this.close}
                        >
                            <Row>
                                <Col xs={6} lg={4}>
                                    <h4>Incomes</h4>
                                    <List>
                                        {this.renderCategoryTotals(this.state.data.incomes)}
                                    </List>
                                </Col>
                                <Col xs={6} lg={4}>
                                    <h4>Expenses</h4>
                                    <List>
                                        {this.renderCategoryTotals(this.state.data.expenses)}
                                    </List>
                                </Col>
                            </Row>
                        </Dialog>
                    </Col>
                </Row>
            </Paper>
        );
    }
}
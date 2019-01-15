import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


export default class TotalsView extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            total_income: 0,
            total_expense: 0,
            date: new Date(),
            income_categories: {},
            expense_categories: {}
		};
    }

    componentWillReceiveProps(props) {
		this.setState({
            incomes: props.incomes,
            expenses: props.expenses,
            date: props.date 
		}, () => {
                this.calculateCategoryTotals();
            }
        );
    }

    calculateCategoryTotals = () => {

        var income_categories = {}
        this.state.incomes.map((income) => {
            if (income_categories[income.category]) {
                income_categories[income.category] = income_categories[income.category] + income.amount
            }
            else {
                income_categories[income.category] = income.amount
            }
            return 0;
        })

        this.setState({ income_categories: income_categories })

        var expense_categories = {}
        this.state.expenses.map((expense) => {
            if (expense_categories[expense.category]) {
                expense_categories[expense.category] = expense_categories[expense.category] + expense.amount
            }
            else {
                expense_categories[expense.category] = expense.amount
            }
            return 0;
        })

        this.setState({ expense_categories: expense_categories })
    }

    sortCategoryKeys = (categories) => {
        var keys = Object.keys(categories);
        return keys.sort((x, y) => {
            return categories[x] > categories[y]
        });
    }

    renderCategoryTotals = (categories) => {
        var keys = Object.keys(categories);
        return keys.map((key, i) => {
            return  <ListItem key={i} divider={true}>
                        <ListItemText 
                            inset
                            primary={key}
                            secondary={this.formatMoney(categories[key])}
                        >
                        </ListItemText>
                    </ListItem>;
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

        return (

            <div style={{width: '100%'}}>
                <h4>Incomes</h4>
                <List>
                    {this.renderCategoryTotals(this.state.income_categories)}
                </List>
                <h4>Expenses</h4>
                <List>
                    {this.renderCategoryTotals(this.state.expense_categories)}
                </List>
            </div>
            
        );
    }
}
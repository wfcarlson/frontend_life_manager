import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


export default class TotalsView extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            income_category_options: [],
            expense_category_options: [],
            collapse: false,
            total_income: 0,
            total_expense: 0,
            date: new Date(),
		};
    }

    componentWillReceiveProps(props) {
		this.setState({
            incomes: props.incomes,
            expenses: props.expenses,
            date: props.date 
		}, () => {
                this.getData();
                this.calculateTotals();
            }
        );
    }

    componentDidMount() {
        this.getData();
    }

    calculateTotals = () => {
        var income_total = 0;
        this.state.incomes.map((income) => {
            income_total += income.amount;
        })

        var expense_total = 0;
        this.state.expenses.map((expense) => {
            expense_total += expense.amount;
        })

        this.setState({total_income: income_total, total_expense: expense_total});
    }

    getData = () => {
        /*var data = {
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
        .catch(err => { console.log(err); this.close(); }); */
    }

    sortCategoryKeys = (categories) => {
        var keys = Object.keys(categories);
        return keys.sort((x, y) => {
            return categories[x] > categories[y]
        });
    }

    renderCategoryTotals = (categories) => {
        var keys = Object.keys(categories);
        return keys.map((key) => {
            return  <ListItem divider={true}>
                        <ListItemText 
                            inset primary={key} 
                            primaryTypographyProps={{variant: "headline"}} 
                            secondary={this.formatMoney(categories[key])}
                            secondaryTypographyProps={{variant: "h4"}}
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

        const style = {
            paddingTop: '30px',
            paddingBottom: '30px',
            textAlign: 'center',
            fontSize: 28,
            fontWeight: 'bold'
        };

        var net_style = {
                
        };

        var net = this.state.total_income - this.state.total_expense;
    
        if (net > 0) {
            net_style = {
                color:"green"
            }
        }
        else if (net < 0) {
            net_style = {
                color:"red"
            }
        }

        return (
            <Paper
                style={style}
            >
                <Grid container direction="column">
                    <Grid item xs={12}>
                        <p style={net_style}>{this.formatMoney(net)}</p>
                    </Grid>

                </Grid>
                {/*<Grid container direction="column">
                    <Grid item xs={12}>
                    <ExpansionPanel elevation={0}>
                        <ExpansionPanelSummary style={{backgroundColor: "#b2ebf2"}} expandIcon={<ExpandMoreIcon color="primary"/>}>
                            <Typography style={{flexBasis: "33.3%"}} variant="h4" color="primary">Category Totals</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container direction="column" wrap="nowrap">
                                <Grid item xs={12} lg={6}>
                                    <h4>Incomes</h4>
                                    <List>
                                        {this.renderCategoryTotals(this.state.data.incomes)}
                                    </List>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <h4>Expenses</h4>
                                    <List>
                                        {this.renderCategoryTotals(this.state.data.expenses)}
                                    </List>
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                        </ExpansionPanel>
                        </Grid>
        </Grid>*/}
            </Paper>
        );
    }
}
import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import { API_ROOT } from './config.js';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import { Typography, ListItemText } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';


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
        var keys = Object.keys(categories);
        return keys.map((key) => {
            return  <ListItem divider={true}>
                        <ListItemText 
                            inset primary={key} 
                            primaryTypographyProps={{variant: "headline"}} 
                            secondary={this.formatMoney(categories[key])}
                            secondaryTypographyProps={{variant: "display1"}}
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
        const { classes } = this.props;

        const style = {
            paddingTop: '50px',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold'
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
            <Card
                style={style}
                elevation="12"
            >
                <Grid container item direction="col">
                    <Grid item xs={12} lg={4}>
                        <p>Net</p>
                        <p style={net_style}>{this.formatMoney(this.state.data.net)}</p>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <p>Total Income</p>
                        <p>{this.formatMoney(this.state.data.total_income)}</p>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <p>Total Expenses</p>
                        <p>{this.formatMoney(this.state.data.total_expense)}</p>
                    </Grid>
                </Grid>
                <Grid container item direction="column">
                    <Grid item xs={12} direction="row">
                    <ExpansionPanel elevation={0}>
                        <ExpansionPanelSummary style={{backgroundColor: "#b2ebf2"}} expandIcon={<ExpandMoreIcon color="textPrimary"/>}>
                            <Typography style={{flexBasis: "33.3%"}} variant="display1" color="textPrimary">Category Totals</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container direction="column" xs wrap="nowrap">
                                <Grid item xs={12} lg={6} direction="row">
                                    <h4>Incomes</h4>
                                    <List>
                                        {this.renderCategoryTotals(this.state.data.incomes)}
                                    </List>
                                </Grid>
                                <Grid item xs={12} lg={6} direction="row">
                                    <h4>Expenses</h4>
                                    <List>
                                        {this.renderCategoryTotals(this.state.data.expenses)}
                                    </List>
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                        </ExpansionPanel>
                        </Grid>
                    </Grid>
            </Card>
        );
    }
}
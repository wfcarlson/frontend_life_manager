import React, { Component } from 'react';
import BudgetItemForm from './BudgetItemForm.js';
import BudgetItemList from './BudgetItemList.js';
import TotalsView from './TotalsView.js';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import { API_ROOT, API_KEY } from './config.js';
import MonthNavigation from './MonthNavigation.js';
import './App.css';
import { getMonthString } from './utils.js';
import IconButton from '@material-ui/core/IconButton';
import AccountBalance from '@material-ui/icons/AccountBalance';
import CloudDownload from '@material-ui/icons/CloudDownload';
import Typography from '@material-ui/core/Typography';
import { Toolbar } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			expense_category_options: [],
			income_category_options: [],
			expenses: [],
			incomes: [],
			total_expense: 0,
			total_income: 0,
			date: new Date(),
			start_date: new Date(),
		}
		this.getStartDate();
		this.getCategoryOptions();
	}

	componentDidMount(){
		document.title = "Life Manager";
		this.update();
	}

	getStartDate = () => {
		/*var data = {
			method: "GET",
			headers: {

			},
			mode: 'cors'
		};
		fetch(API_ROOT + '/api/start_date/', data).then((response) => {
			return response.json();
		}).then((result) => {
			this.setState({ start_date: new Date(result.date) });
		}).catch(err => {  })*/
	}

	getCategoryOptions = () => {
		/*var data = {
			method: "GET",
			headers: {

			},
			mode: 'cors'
		};

		fetch(API_ROOT + '/api/expenses/categories/', data).then((response) => {
			return response.json();
		}).then((result) => {
			this.setState({ expense_category_options: result });
		}).catch(err => {  })
		fetch(API_ROOT + '/api/incomes/categories/', data).then((response) => {
			return response.json();
		}).then((result) => {
			this.setState({ income_category_options: result });
		}).catch(err => {  })*/
	}

	getExpenses = () => {
		var data = {
			method: "GET",
			headers: {
				'x-api-key': API_KEY
			},
			mode: 'cors'
		};

		fetch(API_ROOT + '/expenses?year=' + this.state.date.getFullYear() + '&month=' + (this.state.date.getMonth() + 1), data).then((response) => {
			return response.json();
		}).then((result) => {
			this.setState({ expenses: result });
		}).catch(err => {  });
	}

	getIncomes = () => {
		var data = {
			method: "GET",
			headers: {
				'x-api-key': API_KEY
			},
			mode: 'cors'
		};

		fetch(API_ROOT + '/incomes?year=' + this.state.date.getFullYear() + '&month=' + (this.state.date.getMonth() + 1), data).then((response) => {
			return response.json();
		}).then((result) => {
			this.setState({ incomes: result });
		}).catch(err => {  });
	}

	update = () => {
		this.getIncomes();
		this.getExpenses();
	}

	updateCategories = () => {
	}

	setDate = (date) => {
		this.setState({
			date: new Date(date.getTime())
		}, () => { this.update() })
	}

    calculateNet = () => {

        function add(a, b) {
            return a + b.amount;
        }

        return this.state.incomes.reduce(add, 0) - this.state.expenses.reduce(add, 0)

	}
	
    formatMoney = (amount) => {
        return "$ " + parseFloat(amount).toFixed(2);
    }

	render() {

		var title = "Monthly Budget";
		title = title + ": " + getMonthString(this.state.date.getMonth())

		if (this.state.date.getFullYear() !== new Date().getFullYear()) {
			title = title + " " + this.state.date.getFullYear();
		}

        const style = {
            paddingTop: '30px',
            paddingBottom: '30px',
            textAlign: 'center',
            fontSize: 28,
			fontWeight: 'bold',
        };

        var net_style = {
                
		};
		
		var net = this.calculateNet();
    
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
			<div className="App">
					<Grid container justify="center">
						<AppBar
							position='fixed'
							color='primary'
						>
							<Toolbar>
								<Typography variant="h3" color="inherit" style={{fontWeight: 'bold', flexGrow: 1, justifyContent: "flex-start"}}>
									{ title }
								</Typography>
								<IconButton
									onClick={this.handleMenu}
									color='inherit'
								>
									<AccountBalance />
								</IconButton>
								<IconButton
									onClick={this.handleMenu}
									color='inherit'
								>
									<CloudDownload />
								</IconButton>
							</Toolbar>
						</AppBar>
					</Grid>
					<Grid style={{ paddingTop: 75, overflow: 'hidden' }} container>
						<Grid item xs={12}>
							<ExpansionPanel>
								<ExpansionPanelSummary style={style}>
									<Grid container direction="column">
										<Grid item xs={12}>
											<p style={net_style}>{this.formatMoney(net)}</p>
										</Grid>
									</Grid>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<TotalsView 
										date={ this.state.date }
										incomes={ this.state.incomes }
										expenses={ this.state.expenses }
									/>
								</ExpansionPanelDetails>
							</ExpansionPanel>
							<BudgetItemForm 
								update={ this.update }
								updateCategories={ this.updateCategories }
							/>
						</Grid>
						<Grid item xs={12}>
							<BudgetItemList
								title="Incomes"
								type="income"
								category_options={ this.state.income_category_options }
								budget_items={ this.state.incomes }
								update={ this.update }
								style={{paddingTop: '50px'}}
							/>
						</Grid>
						<Grid container style={{paddingTop:50}}>
							<BudgetItemList
								title="Expenses"
								type="expense"
								category_options={ this.state.expense_category_options }
								budget_items={ this.state.expenses }
								update={ this.update }	
							/>
						</Grid>
						<Grid item style={{paddingTop:50}} xs>
							<MonthNavigation setDate={this.setDate} selected_date={new Date(this.state.date.getTime())} start_date={new Date(this.state.start_date.getTime())}/>
						</Grid>
					</Grid>
			</div>
		);
	}
}

export default App;

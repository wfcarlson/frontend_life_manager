import React, { Component } from 'react';
import BudgetItemForm from './BudgetItemForm.js';
import BudgetItemList from './BudgetItemList.js';
import TotalsView from './TotalsView.js';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from '@material-ui/core/AppBar';
import { API_ROOT } from './config.js';
import MonthNavigation from './MonthNavigation.js';
import './App.css';
import { getMonthString } from './utils.js';
import IconButton from '@material-ui/core/IconButton';
import AccountBalance from '@material-ui/icons/AccountBalance';
import CloudDownload from '@material-ui/icons/CloudDownload';
import Typography from '@material-ui/core/Typography';
import { Toolbar } from '@material-ui/core';


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			expense_category_options: [],
			income_category_options: [],
			expenses: [],
			incomes: [],
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
		var data = {
			method: "GET",
			headers: {

			},
			mode: 'cors'
		};
		fetch(API_ROOT + '/api/start_date/', data).then((response) => {
			return response.json();
		}).then((result) => {
			this.setState({ start_date: new Date(result.date) });
		}).catch(err => { alert(err) })
	}

	getCategoryOptions = () => {
		var data = {
			method: "GET",
			headers: {

			},
			mode: 'cors'
		};

		fetch(API_ROOT + '/api/expenses/categories/', data).then((response) => {
			return response.json();
		}).then((result) => {
			this.setState({ expense_category_options: result });
		}).catch(err => { alert(err) })
		fetch(API_ROOT + '/api/incomes/categories/', data).then((response) => {
			return response.json();
		}).then((result) => {
			this.setState({ income_category_options: result });
		}).catch(err => { alert(err) })
	}

	getExpenses = () => {
		var data = {
			method: "GET",
			headers: {

			},
			mode: 'cors'
		};

		fetch(API_ROOT + '/api/expenses/' + this.state.date.getFullYear() + '/' + (this.state.date.getMonth() + 1) + '/', data).then((response) => {
			return response.json();
		}).then((result) => {
			this.setState({ expenses: result });
		}).catch(err => { alert(err) });
	}

	getIncomes = () => {
		var data = {
			method: "GET",
			headers: {

			},
			mode: 'cors'
		};

		fetch(API_ROOT + '/api/incomes/' + this.state.date.getFullYear() + '/' + (this.state.date.getMonth() + 1) + '/', data).then((response) => {
			return response.json();
		}).then((result) => {
			this.setState({ incomes: result });
		}).catch(err => { alert(err) });
	}

	update = () => {
		this.getIncomes();
		this.getExpenses();
	}

	updateCategories = () => {
		this.getCategoryOptions();
	}

	setDate = (date) => {
		this.setState({
			date: new Date(date.getTime())
		}, () => { this.update() })
	}

	handleMenu = () => {

	}

	render() {
		var title = "Monthly Budget - " + getMonthString(this.state.date.getMonth());
		if (new Date().getFullYear() > this.state.date.getFullYear()) {
			title = title + " " + this.state.date.getFullYear();
		}

		return (
			<div className="App">
					<AppBar
						position='fixed'
						color='primary'
					>
						<Toolbar>
							<Typography variant="display2" color="inherit" style={{flexGrow: 1, fontWeight: 'bold'}}>
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
					<Grid style={{ paddingTop: 75 }} fluid>
						<Row>
							<Col xs={12}>
								<TotalsView 
									income_category_options={ this.state.income_category_options }
									expense_category_options={ this.state.expense_category_options }
									date={ this.state.date }
								/>
							</Col>
						</Row>
						<Row center="xs">
							<BudgetItemList
								title="Incomes"
								type="income"
								category_options={ this.state.income_category_options }
								budget_items={ this.state.incomes }
								update={ this.update }
								style={{paddingTop: '50px'}}
							/>
						</Row>
						<Row center="xs"  style={{paddingTop:50}}>
							<BudgetItemList
								title="Expenses"
								type="expense"
								category_options={ this.state.expense_category_options }
								budget_items={ this.state.expenses }
								update={ this.update }	
							/>
						</Row>
							<BudgetItemForm 
								income_category_options={ this.state.income_category_options }
								expense_category_options={ this.state.expense_category_options }
								update={ this.update }
								updateCategories={ this.updateCategories }
							/>
						<Row center="xs"  style={{paddingTop:50}}>
							<MonthNavigation setDate={this.setDate} selected_date={new Date(this.state.date.getTime())} start_date={new Date(this.state.start_date.getTime())}/>
						</Row>
					</Grid>
			</div>
		);
	}
}

export default App;

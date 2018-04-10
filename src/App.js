import React, { Component } from 'react';
import BudgetItemForm from './BudgetItemForm.js';
import BudgetItemList from './BudgetItemList.js';
import TotalsView from './TotalsView.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';
import { API_ROOT } from './config.js';
import MonthNavigation from './MonthNavigation.js';
import './App.css';
import { getMonthString } from './utils.js';


const barStyle = {
	position: 'fixed',
	top: 0
};

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

	render() {
		var title = "Monthly Budget - " + getMonthString(this.state.date.getMonth());
		if (new Date().getFullYear() > this.state.date.getFullYear()) {
			title = title + " " + this.state.date.getFullYear();
		}

		return (
			<div className="App">
				<MuiThemeProvider>
					<div>
						<AppBar
							showMenuIconButton={false} 
							title={title}
							style={barStyle}
						/>
						<Grid style={{ paddingTop: 75 }} fluid>
							<Row>
								<Col lg={1} xs={12}>
									<BudgetItemForm 
										income_category_options={ this.state.income_category_options }
										expense_category_options={ this.state.expense_category_options }
										update={ this.update }
										updateCategories={ this.updateCategories }
									/>
								</Col>
								<Col lg={11} xs={12}>
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
							<Row center="xs"  style={{paddingTop:50}}>
								<MonthNavigation setDate={this.setDate} selected_date={new Date(this.state.date.getTime())} start_date={new Date(this.state.start_date.getTime())}/>
							</Row>
						</Grid>
					</div>
				</MuiThemeProvider>
			</div>

		);
	}
}

export default App;

import React, { Component } from 'react';
import { MenuItem, Button, Typography } from '@material-ui/core';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { Row, Col } from 'react-flexbox-grid';
import ListItemText from '@material-ui/core/ListItemText';
import { API_KEY, API_ROOT } from './config';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';



export default class BudgetItemForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			amount: "",
			time: new Date(Date.now()),
			category: "",
			description: "",
			party: "",
			type: "expense",
			income_category_options: [],
			expense_category_options: [],
			open_budget_item_modal: false,
			open_category_modal: false
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			income_category_options: props.income_category_options,
			expense_category_options: props.expense_category_options,
		})
	}

	handleChange = (attribute) => {
		if (attribute === "type"){
			return (event) => {
			var obj = {};
			obj[attribute] = event.target.value;
			obj['category'] = "";
			this.setState(obj);
		}
		}
		return (event) => {
			var obj = {};
			obj[attribute] = event.target.value;
			this.setState(obj);
		}
	}

	handleDateChange = (date) => {
		this.setState({date: new Date(date)});
		console.log(new Date(date).getFullYear())
		console.log(this.formatDate(new Date(date)));
	}

	handleNumberChange = (attribute) => {
		return (event) => {
			var valid = event.target.value.match(/^(\d*\.)?\d*$/);
			if (valid != null && valid.length === 2){
				var obj = {};
				obj[attribute] = event.target.value;
				this.setState(obj);
			}
		}
	}

	handleSelectChange = (attribute) => {
		return (event) => {
			if (event.target.value !== -1) {
				var obj = {};
				obj[attribute] = event.target.value;
				this.setState(obj);
			}
		}
	}

	clearItem = () => {
		this.setState({
			amount: "",
			time: new Date(Date.now()),
			category: "",
			description: "",
			party: "",
			type: "expense",
		});
	}

	today = () => {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!
		var yyyy = today.getFullYear();

		if (dd < 10) {
		dd = '0' + dd;
		}

		if (mm < 10) {
		mm = '0' + mm;
		}

		today = mm + '/' + dd + '/' + yyyy;
	}

	handleSubmit = () => {
		var budgetItem = {
			amount: this.state.amount,
			category: this.state.category,
			description: this.state.description,
			party: this.state.party,
			date: this.formatDate(this.state.date),
		}

		var data = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': API_KEY
			},
			mode: 'cors',
			body: JSON.stringify(budgetItem),
		};
		
		var endpoint = "/expenses";
		if (this.state.type === 'income') {
			endpoint = '/incomes'
		}

		fetch(API_ROOT + endpoint, data)
			.then(() => { this.props.update(), this.clearItem(); })
			.catch(err => { console.log(err) });
	
	}

	formatDate = (date) => {
		var month = "" + (date.getMonth() + 1);
		if (month.length === 1){
			month = "0" + month;
		}	

		return "" + date.getFullYear() + '-' + month + "-" + date.getDate();
	}

	renderCategoryOptions = () => {
		var options = (this.state.type === "income") ? (this.state.income_category_options.map((option) => {
			return (<MenuItem key={option.id} value={option.id}><ListItemText primary={option.name} /></MenuItem>);
		}))
		:
		(this.state.expense_category_options.map((option) => {
			return (<MenuItem key={option.id} value={option.id}><ListItemText primary={option.name} /></MenuItem>);
		}));
		return options;
	}

	addNewCategory = () => {
		this.setState({open_category_modal:true});
	}

	openBudgetItemModal = () => {
		this.setState({open_budget_item_modal:true});
	}

	closeBudgetItemModal = () => {
		this.setState({open_budget_item_modal:false});
	}

	closeCategoryModal = () => {
		this.setState({open_category_modal:false});
	}

	setCategory = (val) => {
		this.setState({category:val});
	}


	render() {
		
		return (
			<div style={{verticalAlign:"middle"}}>
					<ValidatorForm
							ref="form"
							onSubmit={this.handleSubmit}
							onError={errors => console.log(errors)}
							style={{ padding: '45px' }}
						>
							<Row>
								<Col xs={12}>
									<Typography variant="h3" color="primary" style={{ paddingBottom: '30px' }}>New Budget Item</Typography>
								</Col>
							</Row>
							<Row>
								<Col xs={12}>
									<SelectValidator
										onChange={this.handleChange('type')}
										value={this.state.type}
										name="type"
										style={{width: '178px'}}
									>
										<MenuItem value={'income'}>Income</MenuItem>
            							<MenuItem value={'expense'}>Expense</MenuItem>
									</SelectValidator>
								</Col>
							</Row>
							<Row>
								<Col xs={12}>
									<TextValidator
										label="Description"
										onChange={this.handleChange('description')}
										name="description"
										value={this.state.description}
										validators={['required']}
										errorMessages={'this field is required'}
									/>
								</Col>
							</Row>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<DatePicker
									margin="normal"
									label="Date"
									value={this.state.date}
									onChange={this.handleDateChange}
								/>
							</MuiPickersUtilsProvider>
							<Row>
								<Col xs={12}>
									<TextValidator
										label="Amount"
										onChange={this.handleNumberChange('amount')}
										name="amount"
										value={this.state.amount}
										validators={['required']}
										errorMessages={'this field is required'}
									/>
								</Col>
							</Row>
							<Row>
								<Col xs={12}>
									<TextValidator
										label="Vendor"
										onChange={this.handleChange('party')}
										name="vendor"
										value={this.state.party}
										validators={['required']}
										errorMessages={'this field is required'}
									/>
								</Col>
							</Row>
							<Row>
								<Col xs={12}>
									<TextValidator
										label="Category"
										onChange={this.handleChange('category')}
										name="category"
										value={this.state.category}
										validators={['required']}
										errorMessages={'this field is required'}
									/>
								</Col>
							</Row>
							<Row>
								<Col xs={12}>
									<Button type="Save" color="secondary" style={{ marginTop: '30px' }}>Submit</Button>
								</Col>
							</Row>
					</ValidatorForm>
			</div>
		);
	}
}
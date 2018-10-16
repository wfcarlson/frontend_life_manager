import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import { Radio, RadioGroup, MenuItem, Button, Typography, FormControlLabel, Paper } from '@material-ui/core';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { Row, Col } from 'react-flexbox-grid';
import { API_ROOT } from './config.js';
import CategoryForm from './CategoryForm.js';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';


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

	handleSubmit = () => {
		var budgetItem = {
			amount: this.state.amount,
			category: this.state.category,
			description: this.state.description,
			party: this.state.party,
			time: (this.state.time ? this.state.time : new Date(Date.now()).toJSON()),
		}

		var data = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			body: JSON.stringify(budgetItem),
		};

		fetch(API_ROOT + '/api/' + this.state.type + 's/', data)
			.then(() => { this.clearItem(); this.props.update(); this.closeBudgetItemModal(); })
			.catch(err => { console.log(err); this.closeBudgetItemModal(); });
	
	}

	formatDate = (date) => {
		var month = "" + (date.getMonth() + 1);
		if (month.length === 1){
			month = "0" + month;
		}	

		return "" + month + "/" + date.getDate() + "/" + date.getYear();
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
				<Dialog open={this.state.open_category_modal} onClose={this.closeCategoryModal}>
					<CategoryForm type={this.state.type} close={this.closeCategoryModal} update={this.props.updateCategories} setCategory={this.setCategory} />
				</Dialog>
				<Button style={{position: "fixed", marginTop:30, bottom: 50, right: 50}} onClick={this.openBudgetItemModal} variant="fab" color="secondary">
					<Add />
				</Button>
				<Dialog open={this.state.open_budget_item_modal} onClose={this.closeBudgetItemModal}>
					<ValidatorForm
							ref="form"
							onSubmit={this.handleSubmit}
							onError={errors => console.log(errors)}
						>
						<DialogTitle><Typography variant="display2" color="primary">New Budget Item</Typography></DialogTitle>
						<DialogContent>
							<Row>
								<Col xs={12}>
									<RadioGroup name="budget_item_type" value={this.state.type} onChange={this.handleChange('type')}>
										<FormControlLabel label="Expense" name="expense" value="expense" control={<Radio/>} />
										<FormControlLabel label="Income" name="income" value="income" control={<Radio/>} />
									</RadioGroup>
								</Col>
							</Row>
								{/* <DatePicker
									hintText="Date"
									name="time"
									value={this.state.time}
									onChange={this.handleChange('time')}
									formatDate={this.formatDate}
								/> */}
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
										label="Description"
										onChange={this.handleChange('description')}
										name="description"
										value={this.state.description}
										validators={['required']}
										errorMessages={'this field is required'}
									/>
								</Col>
							</Row>
							<Row>
								<Col xs={12}>
									<TextValidator
										label="Party"
										onChange={this.handleChange('party')}
										name="party"
										value={this.state.party}
										validators={['required']}
										errorMessages={'this field is required'}
									/>
								</Col>
							</Row>
							<Row>
								<Col xs={9}>
									<SelectValidator 
										label="Category"
										onChange={this.handleSelectChange('category')}
										name="category"
										value={this.state.category}
										validators={['required']}
										errorMessages={'this field is required'}
										style={{width: "80%"}}
									>
										{ this.renderCategoryOptions() }
									</SelectValidator>
								</Col>
								<Col xs={3}>
									<IconButton onClick={this.addNewCategory}><Add /></IconButton>
								</Col>
							</Row>
						</DialogContent>
						<DialogActions>
							<Row>
								<Col>
									<Button type="Save" color="secondary">Submit</Button>	
								</Col>
							</Row>
						</DialogActions>
					</ValidatorForm>
				</Dialog>
			</div>
		);
	}
}
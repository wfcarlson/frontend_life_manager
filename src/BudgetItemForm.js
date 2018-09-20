import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import { Radio, RadioGroup, MenuItem, Button, Typography, FormControlLabel, Paper } from '@material-ui/core';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { Row } from 'react-flexbox-grid';
import { API_ROOT } from './config.js';
import CategoryForm from './CategoryForm.js';
import Dialog from '@material-ui/core/Dialog';


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
			return (event, value) => {
			var obj = {};
			obj[attribute] = value;
			obj['category'] = "";
			this.setState(obj);
		}
		}
		return (event, value) => {
			var obj = {};
			obj[attribute] = value;
			this.setState(obj);
		}
	}

	handleNumberChange = (attribute) => {
		return (event, value) => {
			var valid = value.match(/^(\d*\.)?\d*$/);
			if (valid != null && valid.length === 2){
				var obj = {};
				obj[attribute] = value;
				this.setState(obj);
			}
		}
	}

	handleSelectChange = (attribute) => {
		return (event, index, value) => {
			if (value !== -1) {
				var obj = {};
				obj[attribute] = value;
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
			return (<MenuItem key={option.id} value={option.id} primaryText={option.name} />);
		}))
		:
		(this.state.expense_category_options.map((option) => {
			return (<MenuItem key={option.id} value={option.id} primaryText={option.name} />);
		}));
		options.push(<MenuItem key={-1} value={-1} primaryText="Add New Category" leftIcon={<Add />} onClick={this.addNewCategory} />		
					);
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

		const modalStyle = {

		}

		const paperStyle = {
			width: '400',
		}

		return (
			<div style={{verticalAlign:"middle"}}>
				<Modal open={this.state.open_category_modal} onClose={this.closeCategoryModal} little>
					<CategoryForm type={this.state.type} close={this.closeCategoryModal} update={this.props.updateCategories} setCategory={this.setCategory} />
				</Modal>
				<Button style={{position: "fixed", marginTop:30, bottom: 50, right: 50}} onClick={this.openBudgetItemModal} variant="fab" color="secondary">
					<Add />
				</Button>
				<Dialog open={this.state.open_budget_item_modal} onClose={this.closeBudgetItemModal} style={modalStyle}>
				<Paper style={paperStyle}>
					<ValidatorForm
						ref="form"
						onSubmit={this.handleSubmit}
						onError={errors => console.log(errors)}

					>
						<Row>
							<h4>New Budget Item</h4>
						</Row>
						<Row>
							<RadioGroup name="budget_item_type" value={this.state.type} onChange={this.handleChange('type')}>
								<FormControlLabel label="Income" name="income" value="income" labelPlacement="start" control={<Radio/>} />
								<FormControlLabel label="Income" name="income" value="income" labelPlacement="start" control={<Radio/>} />
							</RadioGroup>
						</Row>
						<Row>
							{/* <DatePicker
								hintText="Date"
								name="time"
								value={this.state.time}
								onChange={this.handleChange('time')}
								formatDate={this.formatDate}
							/> */}
						</Row>
						<Row>
							<TextValidator
			                    floatingLabelText="Amount"
			                    onChange={this.handleNumberChange('amount')}
			                    name="amount"
			                    value={this.state.amount}
			                    validators={['required']}
			                    errorMessages={'this field is required'}
			                />
		                </Row>
		                <Row>
			                <TextValidator
			                    floatingLabelText="Description"
			                    onChange={this.handleChange('description')}
			                    name="description"
			                    value={this.state.description}
			                    validators={['required']}
			                    errorMessages={'this field is required'}
			                />
		                </Row>
		                <Row>
			                <TextValidator
			                    floatingLabelText="Party"
			                    onChange={this.handleChange('party')}
			                    name="party"
			                    value={this.state.party}
			                    validators={['required']}
			                    errorMessages={'this field is required'}
			                />
		                </Row>
		                <Row>
		                	<SelectValidator 
			                	floatingLabelText="Category"
			                    onChange={this.handleSelectChange('category')}
			                    name="category"
			                    value={this.state.category}
			                    validators={['required']}
			                    errorMessages={'this field is required'}
			                >
			                	{ this.renderCategoryOptions() }
			                </SelectValidator>
		                </Row>
		                <Row end="xs">
		                	<Button type="Save" label="Submit" primary={true} />
		                </Row>
					</ValidatorForm>
					</Paper>
				</Dialog>
			</div>
		);
	}
}
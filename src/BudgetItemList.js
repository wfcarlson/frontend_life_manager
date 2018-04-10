import React, { Component } from 'react';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';
import { API_ROOT } from './config.js';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Modal from 'react-responsive-modal';
import RaisedButton from 'material-ui/RaisedButton';

export default class BudgetItemList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			budget_items: [],
			category_options: [],
			open_modal: false,
			budget_item: { id:-1, description:"hello" }
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			category_options: props.category_options,
			budget_items: props.budget_items,
		});
	}

	getCategoryOption = (pk) => {
		var name = "Unknown Category";
		this.state.category_options.forEach((option) => {
			if (option.id === pk){
				name = option.name;
			}
		});

		return name;
	}

	handleClickDelete = (budget_item) => {
		return (event) => {
			this.openModal(budget_item);
		}
	}

	onClickConfirm = () => {
		var data = {
			method: "DELETE",
			headers: {
				'Content-Type': 'application/json'
			},
			mode: 'cors',
		};

		fetch(API_ROOT + '/api/' + this.props.type + 's/' + this.state.budget_item.id + "/", data)
			.then(() => { this.props.update(); })
			.catch(err => { console.log(err) });
		this.closeModal();
	}

	openModal = (budget_item) => {
		this.setState({budget_item:budget_item, open_modal:true})
	}

	closeModal = () => {
		this.setState({open_modal:false})
	}

	renderRows = () => {
		return this.state.budget_items.map((budget_item) => {
			
			var date = new Date(budget_item.time);
			var month = "" + (date.getMonth() + 1);
			if (month.length === 1){
				month = "0" + month;
			}

			return (
				<TableRow key={ budget_item.id }>
					<TableRowColumn>
						{ month }/{ date.getDate() }/{ date.getYear() }
					</TableRowColumn>
					<TableRowColumn>
						{ budget_item.description }
					</TableRowColumn>
					<TableRowColumn>
						{ budget_item.party }
					</TableRowColumn>
					<TableRowColumn>
						${ budget_item.amount }
					</TableRowColumn>
					<TableRowColumn>
						{ this.getCategoryOption(budget_item.category) }
					</TableRowColumn>
					<TableRowColumn>
						<IconButton onClick={this.handleClickDelete(budget_item)}>
							<ContentClear hoverColor="red"/>
						</IconButton>
					</TableRowColumn>
				</TableRow>
			);
		});
	}

	render() {
		return (
			<div>
				<Modal open={this.state.open_modal} onClose={this.closeModal} little>
					<p>Delete {this.state.budget_item.description} - ${this.state.budget_item.amount}</p>
					<RaisedButton label="Confirm" primary={true} onClick={this.onClickConfirm} />
					&nbsp;&nbsp;&nbsp; 
					<RaisedButton label="Cancel" secondary={true} onClick={this.closeModal} />
				</Modal>
				<h3>{this.props.title}</h3>
				<Table fixedHeader={true}>
					
					<TableHeader displaySelectAll={false} adjustForCheckbox={false} >
						<TableRow>
							<TableHeaderColumn>Date</TableHeaderColumn>
					        <TableHeaderColumn>Description</TableHeaderColumn>
					        <TableHeaderColumn>Vendor</TableHeaderColumn>
					        <TableHeaderColumn>Amount</TableHeaderColumn>
					        <TableHeaderColumn>Category</TableHeaderColumn>
					        <TableHeaderColumn></TableHeaderColumn>
				        </TableRow>
					</TableHeader>
					<TableBody displayRowCheckbox={false}>
						{ this.renderRows() }
					</TableBody>
				</Table>
			</div>
		);
	}
}
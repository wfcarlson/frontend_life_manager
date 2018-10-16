import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { API_ROOT } from './config.js';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Modal from 'react-responsive-modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


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
					<TableCell md>
						{ month }/{ date.getDate() }/{ date.getYear() }
					</TableCell>
					<TableCell>
						{ budget_item.description }
					</TableCell>
					<TableCell md>
						{ budget_item.party }
					</TableCell>
					<TableCell>
						${ budget_item.amount }
					</TableCell>
					<TableCell>
						{ this.getCategoryOption(budget_item.category) }
					</TableCell>
					<TableCell>
						<IconButton onClick={this.handleClickDelete(budget_item)}>
							<Delete hoverColor="red"/>
						</IconButton>
					</TableCell>
				</TableRow>
			);
		});
	}

	render() {
		return (
			<Grid xs container wrap="wrap" justify="center">
				<Modal open={this.state.open_modal} onClose={this.closeModal} little>
					<p>Delete {this.state.budget_item.description} - ${this.state.budget_item.amount}</p>
					<Button label="Confirm" primary={true} onClick={this.onClickConfirm} />
					&nbsp;&nbsp;&nbsp; 
					<Button label="Cancel" secondary={true} onClick={this.closeModal} />
				</Modal>
				<Grid item wrap="wrap" zeroMinWidth style={{overflow: "auto"}} justify="center">
					<h3>{this.props.title}</h3>
					<Table fixedHeader={true}>						
						<TableHead displaySelectAll={false} adjustForCheckbox={false} >
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Vendor</TableCell>
								<TableCell>Amount</TableCell>
								<TableCell>Category</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody displayRowCheckbox={false}>
							{ this.renderRows() }
						</TableBody>
					</Table>
				</Grid>
			</Grid>
		);
	}
}
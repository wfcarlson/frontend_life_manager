import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Modal from 'react-responsive-modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { ExpansionPanelSummary, ExpansionPanelDetails, IconButton } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { API_ROOT, API_KEY } from './config';


export default class BudgetItemList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			budget_items: [],
			open_modal: false,
			budget_item: { id:-1, description:"hello" }
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			budget_items: props.budget_items,
		});
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
				'Content-Type': 'application/json',
				'x-api-key': API_KEY
			},
			mode: 'cors',
		};

		fetch(API_ROOT + '/' + this.props.type + 's?id=' + this.state.budget_item.id, data)
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
			
			var date = new Date(budget_item.date);
			var month = "" + (date.getMonth() + 1);
			if (month.length === 1){
				month = "0" + month;
			}
			var day = "" + (date.getDate());
			if (day.length === 1) {
				day = "0" + day;
			}

			return (
				<ExpansionPanel key={ budget_item.id }>
					<ExpansionPanelSummary style={{padding: '0'}}>
						<Typography style={{paddingLeft: '10px', paddingRight: '40px'}} variant="body1">{ month }/{ day }</Typography>
						<Typography variant="body1" noWrap={true}>{ budget_item.description }</Typography>
						<Typography style={{position: 'absolute', paddingRight: '0px', right: '10px'}} variant="body1">${ budget_item.amount }</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						<Grid container direction='row'>
							<Grid item>
								<IconButton onClick={() => this.openModal(budget_item)}>
									<DeleteIcon fontSize='small' />
								</IconButton>
							</Grid> 
							<Grid item>
								<Typography style={{ paddingLeft: '63px', paddingBottom: '15px' }} variant="body1">{ budget_item.vendor ? budget_item.vendor : budget_item.party }</Typography>
							</Grid>
							<Grid item>
								<Typography style={{ paddingLeft: '63px' }} variant="body1">{ budget_item.category }</Typography>
							</Grid>
						</Grid>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			);
		});
	}

	render() {
		return (
			<Grid container justify="center">
				<Modal open={this.state.open_modal} onClose={this.closeModal} little>
					<p>Delete?</p><p>{this.state.budget_item.description} - ${this.state.budget_item.amount}</p>
					<Button color='primary' onClick={this.onClickConfirm}>Confirm</Button>
					<Button color='secondary' onClick={this.closeModal}>Cancel</Button>
				</Modal>
				<Grid item zeroMinWidth style={{overflow: "auto"}} >
					<h3>{this.props.title}</h3>
					<Table>						
						<TableHead>
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Amount</TableCell>
							</TableRow>
						</TableHead>
					</Table>
					{ this.renderRows() }

				</Grid>
			</Grid>
		);
	}
}
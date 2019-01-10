import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator } from 'react-material-ui-form-validator';
import { API_ROOT } from './config.js';
import { Row, Col } from 'react-flexbox-grid';
import DialogTitle from '@material-ui/core/DialogContent';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

export default class CategoryForm extends Component {
    constructor(props) {
		super(props);
		this.state = {
			name: "",
			type: "",
			open_modal: false
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
            type: props.type,
		});
    }

    componentWillUpdate(props) {
		this.state.type = props.type;
    }

    handleClickSave = () => {
        var category = {
			name: this.state.name
		}

		var data = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			body: JSON.stringify(category),
		};

        fetch(API_ROOT + '/api/' + this.state.type + 's/categories/', data)
            .then((data) => { 
                data.json()
                    .then((data) => { 
                        this.props.update();
                        this.props.setCategory(data.id);
                        this.props.close(); 
                    }) 
            })
            .catch(err => { console.log(err); this.close(); });

    }

    handleChange = (event) => {
        this.setState({name:event.target.value});
    }

    submit = () => {

    }
    
    render() {
        return (
            <div>
                <DialogTitle>
                    <Typography variant="h3" color="primary">New Category</Typography>
                </DialogTitle>
                <DialogContent>

                            <ValidatorForm onSubmit={this.submit}>
                                <TextValidator
                                    label="Name"
                                    onChange={this.handleChange}
                                    name="name"
                                    value={this.state.name}
                                    validators={['required']}
                                    errorMessages={'this field is required'}
                                />
                            </ValidatorForm>
                            <Button onClick={this.handleClickSave} color="action">Submit</Button>
                </DialogContent>
            </div>
        );
    }

}

import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';

export default class MonthNavigation extends Component {

    constructor(props) {
      super(props);

      this.state = {
        months: [],
        selected_date: new Date(), 
        start_date: new Date(),
      }
    }

    getMonthString(month) {
      var months = [
        "Jan",
        "Feb", 
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ]

      return months[month];
    }

    componentWillReceiveProps(props) {
      this.setState({
        selected_date: new Date(props.selected_date.getTime()),
        start_date: new Date(props.start_date.getTime()),
      }, () => {
        this.state.selected_date.setDate(1);
        this.state.start_date.setDate(1);
      });
    }

    getMonths = () => {
      var numPages = 5;

      var twoMonthsBefore = new Date(this.state.selected_date.getTime());
      twoMonthsBefore.setDate(1);
      twoMonthsBefore.setMonth(this.state.selected_date.getMonth() - 2);

      var twoMonthsAfter = new Date(this.state.selected_date.getTime());
      twoMonthsAfter.setDate(1);
      twoMonthsAfter.setMonth(this.state.selected_date.getMonth() + 2);

      var today = new Date();

      var dates = [];
      var first_date = this.state.start_date > twoMonthsBefore ? new Date(this.state.start_date.getTime()) : new Date(twoMonthsBefore.getTime());

      var last_date = today < twoMonthsAfter ? new Date() : new Date(twoMonthsAfter.getTime());
      
      first_date.setDate(1);
      last_date.setDate(1);

      while (first_date.getFullYear() < last_date.getFullYear() || first_date.getMonth() <= last_date.getMonth()) {
        dates.push(new Date(first_date.getTime()));
        first_date.setMonth(first_date.getMonth() + 1);
      }
      
      while(dates.length < numPages){
        if (dates[0].getFullYear() > this.state.start_date.getFullYear() || (dates[0].getFullYear() === this.state.start_date.getFullYear() && dates[0].getMonth() > this.state.start_date.getMonth()))
        {
          //add another month onto beginning
          var new_date = new Date(dates[0].getTime());
          new_date.setMonth(dates[0].getMonth() - 1);
          dates.unshift(new_date);
        }
        else if ((dates[dates.length - 1].getFullYear() < today.getFullYear()) || dates[dates.length - 1].getMonth() < today.getMonth()){
          //add another month onto the end
          var new_date = new Date(dates[dates.length - 1].getTime());
          new_date.setMonth(dates[dates.length - 1].getMonth() + 1);
          dates.push(new_date);
        }
        else {
          break;
        }
      }

      return dates;
      
    }

    hasNextMonth = () => {
      var today = new Date();
      return this.state.selected_date.getFullYear() < today.getFullYear() || this.state.selected_date.getMonth() < today.getMonth();
    }

    hasPreviousMonth = () => {
      return (this.state.selected_date.getFullYear() > this.state.start_date.getFullYear()) || (this.state.selected_date.getFullYear() === this.state.start_date.getFullYear() && this.state.selected_date.getMonth() > this.state.start_date.getMonth());
    }

    setDate = (date) => {
      this.props.setDate(new Date(date.getTime()));
    }
    
    render() {

      var months = this.getMonths(this.state.selected_date);
      var hasNext = this.hasNextMonth();
      var hasPrev = this.hasPreviousMonth();
      
      var prevDate = new Date(this.state.selected_date.getTime());
      prevDate.setMonth(prevDate.getMonth() - 1);

      var nextDate = new Date(this.state.selected_date.getTime());
      nextDate.setMonth(nextDate.getMonth() + 1);

      var today = new Date();

      return (
        <div>
          <ul className="pagination">
            <li className={ hasPrev ? 'enabled' : 'disabled' }>
                <a onClick={ () => { if (hasPrev) { this.setDate(this.state.start_date); }}}>First</a>
            </li>
            <li className='enabled'>
                <a onClick={ () => { this.setDate(prevDate) }}>Previous Month</a>
            </li>
            {months.map((date, index) =>
                <li key={index} className={this.state.selected_date.getMonth() === date.getMonth() ? 'active enabled' : 'enabled'}>
                    <a onClick={ () => this.setDate(date) }> { this.getMonthString(date.getMonth()) } </a>
                </li>
            )}
            <li className={ hasNext ? 'enabled' : 'disabled'}>
                <a onClick={() => { if (hasNext){ this.setDate(nextDate)}}}>Next Month</a>
            </li>
            <li className={ hasNext ? 'enabled' : 'disabled'}>
                <a onClick={() => { if (hasNext){ this.setDate(today)}}}>Last</a>
            </li>
          </ul>
        </div>
      );
    }
}
import $ from 'jquery';
import React from 'react';

import Camper from 'Camper.js';

class LeaderBoard extends React.Component {
  propTypes = {
    recent: React.PropTypes.string.isRequired,
    alltime: React.PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {show: 'recent', recent: [], alltime: []};
  }

  componentDidMount = ()=> this.update();

  updateRecent = ()=>
    $.ajax({
      url: this.props.recent,
      dataType: 'json',
      cache: false,
      success: (recent)=>
        this.setState({recent}),
      error: (xhr, status, err)=>
        console.error(this.props.recent, status, err.toString())
    });

  updateAlltime = ()=>
    $.ajax({
      url: this.props.alltime,
      dataType: 'json',
      cache: false,
      success: (alltime)=>
        this.setState({alltime}),
      error: (xhr, status, err)=>
        console.error(this.props.alltime, status, err.toString())
    });

  update = ()=> {
    this.updateRecent();
    this.updateAlltime();
    setTimeout(this.update, 60000);
  };

  changeOrder = (order)=> ()=>
    this.setState({show: order});

  isActive= (order)=>
    (order === this.state.show ? ' active' : '');

  toggleClass = (order)=>
    `col-xs-3 text-right toggle${this.isActive(order)}`;

  camperNodes = ()=>
    this.state[this.state.show]
      .map((camper, position)=>
        <Camper rank={position + 1} {...camper} />);

  render = ()=>
    <div className="col-xs-10 col-xs-offset-1">
      <ul className="list-group">
        <li className="list-group-item row board-head">
          <div className="col-xs-1">#</div>
          <div className="col-xs-4">Camper</div>
          <div
            className={this.toggleClass('recent')}
            onClick={this.changeOrder('recent')}
          >
            last 30 days
          </div>
          <div
            className={this.toggleClass('alltime')}
            onClick={this.changeOrder('alltime')}
          >
            all time
          </div>
        </li>
        {this.camperNodes()}
      </ul>
    </div>;
}

export default LeaderBoard;

import React from 'react';

export default class Camper extends React.Component {
  propTypes = {
    rank: React.PropTypes.string.isRequired,
    img: React.PropTypes.string.isRequired,
    username: React.PropTypes.string.isRequired,
    recent: React.PropTypes.string.isRequired,
    alltime: React.PropTypes.string.isRequired
  };

  shouldComponentMount() {
    return false;
  }

  render() {
    return (
      <li className="list-group-item row">
        <div className="col-xs-1">
          {this.props.rank}
        </div>
        <div className="col-xs-4">
          <img role="presentation" src={this.props.img} />
          {this.props.username}
        </div>
        <div className="col-xs-3 text-right">
          {this.props.recent}
        </div>
        <div className="col-xs-3 text-right">
          {this.props.alltime}
        </div>
      </li>
    );
  }
}

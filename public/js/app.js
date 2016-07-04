import React from 'react';
import ReactDOM from 'react-dom';

import LeaderBoard from 'LeaderBoard.js';

ReactDOM.render(
  <LeaderBoard
    recent="http://fcctop100.herokuapp.com/api/fccusers/top/recent"
    alltime="http://fcctop100.herokuapp.com/api/fccusers/top/alltime"
  />,
  document.getElementById('leader-board'));

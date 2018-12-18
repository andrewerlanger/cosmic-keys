import React from 'react';
import './Dashboard.css';

class Dashboard extends React.Component {

  render() {
    return (
      <React.Fragment>
        <div className="dashboard-top">
          <h2>cosmic Keys</h2>
          <button id="record-button" className="round-button"><i className="fas fa-microphone"></i></button>
          <button className="round-button"><i className="fas fa-bars"></i></button>
          <button id="info-button" className="round-button final-button"><i className="fas fa-info"></i></button>
        </div>
        <div className="dashboard-bottom">
          <h2>0</h2>
          <input type="range" className="volume" step="0.1" min="0" max="1"></input>
          <h2>10</h2>
        </div>
      </React.Fragment>
    )
  }
}

export default Dashboard;




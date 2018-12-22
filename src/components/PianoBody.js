import React from 'react';
import './PianoBody.css';

class PianoBody extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="piano-body-top">
          <div className="speakers"></div>
            <div id="dashboard"></div>
          <div className="speakers"></div>
        </div>
        <div className="piano-body-bottom">
          <div id="keyboard"></div>
        </div>
      </React.Fragment>
    )
  }
}

export default PianoBody;

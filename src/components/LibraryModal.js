import React from 'react';
import PropTypes from 'prop-types';

import './Modal.css'
import './Dashboard.css'

class LibraryModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    play: PropTypes.func,
    savedNames: PropTypes.arrayOf(PropTypes.string),
    savedEvents: PropTypes.shape({
      id: PropTypes.string,
      fontSize: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.shape({
            duration: PropTypes.number,
            midiNumber: PropTypes.number,
            time: PropTypes.number,
      })))
    }),
  };

  render() {
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";

    const songIds = [];
    for (const key of Object.keys(this.props.savedEvents)) {
      songIds.push(parseInt(key, 10));
    }

    return (
      <div id ="save-modal" className={showHideClassName}>
        <section className="modal-main">
          <div className="close-modal" onClick={this.props.handleClose}>x</div>
            <h2>your library</h2>
            {songIds.map((id) => {
              return (
                <React.Fragment key={id}>
                  <div className="song-item">
                    <button
                      id={id}
                      className="song round-button round-button__modal"
                      onClick={ () =>
                        this.props.play(id)
                      }>
                      <i className="fas fa-play"></i>
                    </button>
                    <p>{this.props.savedNames[id]}</p>
                  </div>
                </React.Fragment>
                )
            })}
        </section>
      </div>
    );
  }
}

export default LibraryModal;

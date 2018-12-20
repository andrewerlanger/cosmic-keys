import React from 'react';
import PropTypes from 'prop-types';

import './Modal.css'
import './Dashboard.css'

class SaveModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    getName: PropTypes.func.isRequired,
  };

  render() {
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";

    return (
      <div id ="save-modal" className={showHideClassName}>
        <section className="modal-main">
          <div className="close-modal" onClick={this.props.handleClose}>x</div>
          <h2>save your recording</h2>
          <form>
            <div className="save-conatiner">
              <input id="save-input" type="text" placeholder="my masterpiece"/>
              <button
                type="button"
                id="save-button"
                onClick={ () =>
                  this.props.getName()
                }
                className="round-button round-button__save"
                ><i className="fas fa-check"></i>
                </button>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default SaveModal;

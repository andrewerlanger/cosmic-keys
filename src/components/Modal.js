import React from 'react';
// import ReactDOM from 'react-dom';
// import _ from 'lodash';
import PropTypes from 'prop-types';

import './Modal.css'
import './Dashboard.css'

class Modal extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    play: PropTypes.func,
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

    const songNames = [];
    for (const key of Object.keys(this.props.savedEvents)) {
      songNames.push(parseInt(key, 10));
    }

    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          <div className="close-modal" onClick={this.props.handleClose}>x</div>
            <h2> your library</h2>
            {songNames.map((id) => {
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
                    <p>song {id + 1}</p>
                  </div>
                </React.Fragment>
                )
            })}
        </section>
      </div>
    );
  }
}

export default Modal;


// const Modal = ({ handleClose, show, savedEvents }) => {

//   const showHideClassName = show ? "modal display-block" : "modal display-none";

//   console.log(savedEvents);

//   const songNames = [];
//   for (const key of Object.keys(savedEvents)) {
//     songNames.push(parseInt(key, 10));
//   }

//   return (
//     <div className={showHideClassName}>
//       <section className="modal-main">
//         <div className="close-modal" onClick={handleClose}>x</div>
//           <h2> your library</h2>
//           {songNames.map((song) => {
//             return (
//               <React.Fragment>
//                 <p>song {song + 1}</p>
//               </React.Fragment>
//             );
//           })}
//       </section>
//     </div>
//   );
// };

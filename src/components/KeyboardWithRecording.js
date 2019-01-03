/**
 * KeyboardWithRecording.js
 *
 * Adapted from react-piano (iqnivek):
 * https://codesandbox.io/s/l4jjvzmp47
 */

import React from 'react';
import Keyboard from './Keyboard';
import PropTypes from 'prop-types';

const DURATION_UNIT = 0.2;
const DEFAULT_NOTE_DURATION = DURATION_UNIT;

class KeyboardWithRecording extends React.Component {
  static defaultProps = {
    notesRecorded: false,
    modalDisplayed: PropTypes.func.isRequired,
  };

  state = {
    keysDown: {},
    noteDuration: DEFAULT_NOTE_DURATION,
  };

  onPlayNoteInput = midiNumber => {
    this.setState({
      notesRecorded: false,
    });
  };

  onStopNoteInput = (midiNumber, { prevActiveNotes }) => {
    if (this.state.notesRecorded === false) {
      this.recordNotes(prevActiveNotes, this.state.noteDuration);
      this.setState({
        notesRecorded: true,
        noteDuration: DEFAULT_NOTE_DURATION,
      });
    }
  };

  recordNotes = (midiNumbers, duration) => {
    if (this.props.recording.mode !== 'RECORDING') {
      return;
    }
    const newEvents = midiNumbers.map(midiNumber => {
      return {
        midiNumber,
        time: this.props.recording.currentTime,
        duration: duration,
      };
    });
    this.props.setRecording({
      events: this.props.recording.events.concat(newEvents),
      currentTime: this.props.recording.currentTime + duration,
    });
  };

  render() {
    const {
      playNote,
      stopNote,
      recording,
      setRecording,
      ...pianoProps
    } = this.props;

    const { mode, currentEvents } = this.props.recording;
    const activeNotes =
      mode === 'PLAYING' ? currentEvents.map(event => event.midiNumber) : null;

    return (
      <div>
        <Keyboard
          playNote={this.props.playNote}
          stopNote={this.props.stopNote}
          onPlayNoteInput={this.onPlayNoteInput}
          onStopNoteInput={this.onStopNoteInput}
          activeNotes={activeNotes}
          modalDisplayed={this.checkForModal}
          {...pianoProps}
        />
      </div>
    );
  }
}

export default KeyboardWithRecording;

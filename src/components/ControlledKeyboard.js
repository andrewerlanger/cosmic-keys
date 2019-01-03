/**
 * ControlledKeyboard.js
 *
 * Adapted from react-piano (iqnivek):
 * https://github.com/iqnivek/react-piano/blob/master/src/ControlledPiano.js
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import difference from 'lodash.difference';

import Keys from './Keys';

import './AllKeyboardStyles.css';

class ControlledKeyboard extends React.Component {
  static propTypes = {
    noteRange: PropTypes.object.isRequired,
    activeNotes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    playNote: PropTypes.func.isRequired,
    stopNote: PropTypes.func.isRequired,
    onPlayNoteInput: PropTypes.func.isRequired,
    onStopNoteInput: PropTypes.func.isRequired,
    renderNoteLabel: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    width: PropTypes.number,
    modalDisplayed: PropTypes.func.isRequired,
    keyWidthToHeight: PropTypes.number,
    keyboardShortcuts: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        midiNumber: PropTypes.number.isRequired,
      }),
    ),
  };

  static defaultProps = {
    renderNoteLabel: ({ keyboardShortcut, midiNumber, isActive, isAccidental }) =>
      keyboardShortcut ? (
        <div
          className={classNames('ReactPiano__NoteLabel', {
            'ReactPiano__NoteLabel--active': isActive,
            'ReactPiano__NoteLabel--accidental': isAccidental,
            'ReactPiano__NoteLabel--natural': !isAccidental,
          })}
        >
          {keyboardShortcut}
        </div>
      ) : null,
  };

  state = {
    isMouseDown: false,
    useTouchEvents: false,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeNotes !== prevProps.activeNotes) {
      this.handleNoteChanges({
        prevActiveNotes: prevProps.activeNotes || [],
        nextActiveNotes: this.props.activeNotes || [],
      });
    }
  }

  handleNoteChanges = ({ prevActiveNotes, nextActiveNotes }) => {
    if (this.props.disabled) {
      return;
    }
    const notesStopped = difference(prevActiveNotes, nextActiveNotes);
    const notesStarted = difference(nextActiveNotes, prevActiveNotes);
    notesStarted.forEach((midiNumber) => {
      const volumeInput = document.querySelector('.volume');
      let volume = parseFloat(volumeInput.value, 10);
      this.props.playNote(midiNumber, volume);
    });
    notesStopped.forEach((midiNumber) => {
      this.props.stopNote(midiNumber);
    });
  };

  getMidiNumberForKey = (key) => {
    if (!this.props.keyboardShortcuts) {
      return null;
    }
    const shortcut = this.props.keyboardShortcuts.find((sh) => sh.key === key);
    return shortcut && shortcut.midiNumber;
  };

  getKeyForMidiNumber = (midiNumber) => {
    if (!this.props.keyboardShortcuts) {
      return null;
    }
    const shortcut = this.props.keyboardShortcuts.find((sh) => sh.midiNumber === midiNumber);
    return shortcut && shortcut.key;
  };

  onKeyDown = (event) => {
    // Don't conflict with existing combinations like ctrl + t
    if (!this.props.modalDisplayed()) {
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }
      const midiNumber = this.getMidiNumberForKey(event.key);
      if (midiNumber) {
        this.onPlayNoteInput(midiNumber);
      }
    }
  };

  onKeyUp = (event) => {
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onStopNoteInput(midiNumber);
    }
  };

  onPlayNoteInput = (midiNumber) => {
    if (this.props.disabled) {
      return;
    }
    // Pass in previous activeNotes for recording functionality
    this.props.onPlayNoteInput(midiNumber, this.props.activeNotes);
  };

  onStopNoteInput = (midiNumber) => {
    if (this.props.disabled) {
      return;
    }
    // Pass in previous activeNotes for recording functionality
    this.props.onStopNoteInput(midiNumber, this.props.activeNotes);
  };

  onMouseDown = () => {
    this.setState({
      isMouseDown: true,
    });
  };

  onMouseUp = () => {
    this.setState({
      isMouseDown: false,
    });
  };

  onTouchStart = () => {
    this.setState({
      useTouchEvents: true,
    });
  };

  renderNoteLabel = ({ midiNumber, isActive, isAccidental }) => {
    const keyboardShortcut = this.getKeyForMidiNumber(midiNumber);
    return this.props.renderNoteLabel({ keyboardShortcut, midiNumber, isActive, isAccidental });
  };

  render() {
    return (
      <div
        style={{ width: '100%', height: '100%' }}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onTouchStart={this.onTouchStart}
        data-testid="container"
      >
        <Keys
          noteRange={this.props.noteRange}
          onPlayNoteInput={this.onPlayNoteInput}
          onStopNoteInput={this.onStopNoteInput}
          activeNotes={this.props.activeNotes}
          className={this.props.className}
          disabled={this.props.disabled}
          width={this.props.width}
          keyWidthToHeight={this.props.keyWidthToHeight}
          gliss={this.state.isMouseDown}
          useTouchEvents={this.state.useTouchEvents}
          renderNoteLabel={this.renderNoteLabel}
        />
      </div>
    );
  }
}

export default ControlledKeyboard;

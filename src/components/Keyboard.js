import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import difference from 'lodash.difference';
import ControlledKeyboard from './ControlledKeyboard';
import Keys from './Keys';

class Keyboard extends React.Component {
  static propTypes = {
    noteRange: PropTypes.object.isRequired,
    activeNotes: PropTypes.arrayOf(PropTypes.number.isRequired),
    playNote: PropTypes.func.isRequired,
    stopNote: PropTypes.func.isRequired,
    onPlayNoteInput: PropTypes.func,
    onStopNoteInput: PropTypes.func,
    renderNoteLabel: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    width: PropTypes.number,
    keyWidthToHeight: PropTypes.number,
    keyboardShortcuts: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        midiNumber: PropTypes.number.isRequired,
      }),
    ),
  };

  state = {
    activeNotes: this.props.activeNotes || [],
  };

  componentDidUpdate(prevProps) {
    // Make activeNotes "controllable" by using internal
    // state by default, but allowing prop overrides.
    if (
      prevProps.activeNotes !== this.props.activeNotes &&
      this.state.activeNotes !== this.props.activeNotes
    ) {
      this.setState({
        activeNotes: this.props.activeNotes || [],
      });
    }
  }

  handlePlayNoteInput = (midiNumber) => {
    if (this.props.onPlayNoteInput) {
      this.props.onPlayNoteInput(midiNumber, { prevActiveNotes: this.state.activeNotes });
    }
    this.setState((prevState) => {
      // Don't append note to activeNotes if it's already present
      if (prevState.activeNotes.includes(midiNumber)) {
        return null;
      }
      return {
        activeNotes: prevState.activeNotes.concat(midiNumber),
      };
    });
  };

  handleStopNoteInput = (midiNumber) => {
    if (this.props.onStopNoteInput) {
      this.props.onStopNoteInput(midiNumber, { prevActiveNotes: this.state.activeNotes });
    }
    this.setState((prevState) => ({
      activeNotes: prevState.activeNotes.filter((note) => midiNumber !== note),
    }));
  };

  render() {
    const { activeNotes, onPlayNoteInput, onStopNoteInput, ...otherProps } = this.props;
    return (
      <ControlledKeyboard
        activeNotes={this.state.activeNotes}
        onPlayNoteInput={this.handlePlayNoteInput}
        onStopNoteInput={this.handleStopNoteInput}
        {...otherProps}
      />
    );
  }
}

export default Keyboard;
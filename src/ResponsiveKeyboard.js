import React from 'react';
// import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
// import Soundfont from 'soundfont-player';
import _ from 'lodash';

import './index.css';

// import App from './App';
// import PianoBody from './components/PianoBody';
// import Dashboard from './components/Dashboard';
// import Keyboard from './components/Keyboard';
import MidiNumbers from './components/MidiNumbers';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import Modal from './components/Modal';

import SoundfontProvider from './SoundfontProvider';
import DimensionsProvider from './DimensionsProvider';
import KeyboardWithRecording from './KeyboardWithRecording';

// import * as serviceWorker from './serviceWorker';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('c5'),
};

const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

class ResponsiveKeyboard extends React.Component {
  state = {
    recording: {
      mode: 'OFF',
      events: [],
      currentTime: 0,
      currentEvents: [],
    },
    show: false,
    savedEvents: {},
    eventId: 0,
  };

  constructor(props) {
    super(props);

    this.scheduledEvents = [];
  }

  showModal = () => {
      this.setState({ show: true });
    };

  hideModal = () => {
      this.setState({ show: false });
      const libraryButton = document.getElementById('library-button');
      libraryButton.classList.toggle("round-button__active");
    };

  getRecordingEndTime = () => {
    if (this.state.recording.events.length === 0) {
      return 0;
    }
    return Math.max(
      ...this.state.recording.events.map(event => event.time + event.duration),
    );
  };

  componentDidMount() {

    const recordButton = document.getElementById('record-button');
    const libraryButton = document.getElementById('library-button');
    const infoButton = document.getElementById('info-button');

    // Record button
    recordButton.addEventListener('click', (event) => {

      // Update styles onclick
      event.target.classList.toggle("round-button__active");
      event.target.classList.toggle("round-button__flash");

      // Start/stop recording
      let currentMode = this.state.recording.mode;
      if (currentMode === 'RECORDING') {
        this.setMode("OFF");
        this.saveRecording();
      }
      else {
        // this.onClickStop();
        this.setMode('RECORDING');
      }
    });

    // Library button
    libraryButton.addEventListener('click', (event) => {

      // Update styles onclick
      event.target.classList.toggle("round-button__active");

      // Show modal
      this.showModal();

    });

    // Info button
    infoButton.addEventListener('click', (event) => {

      // Update styles onclick
      event.target.classList.toggle("round-button__active");

      // Show/hide labels
      const allLabels = document.querySelectorAll(".ReactPiano__NoteLabelContainer");
      allLabels.forEach((label) => {
        label.classList.toggle("HideNoteLabels");
      });

    })
  }

  setMode = value => {
    this.setState({
      recording: { ...this.state.recording, mode: value}
    });
  };

  clearEvents = () => {
    this.setState({
      recording: { ...this.state.recording, events: []}
    });
  };

  resetCurrentTime = () => {
    this.setState({
      recording: { ...this.state.recording, currentTime: 0}
    });
  };

  updateEventId = () => {
    let newId = this.state.eventId + 1;
    this.setState({ eventId: newId });
  };

  setRecording = value => {
    this.setState({
      recording: Object.assign({}, this.state.recording, value),
    });
  };

  saveRecording = () => {
    const id = this.state.eventId;
    const events = this.state.recording.events;
    this.state.savedEvents[id] = events;
    this.scheduledEvents.push([]);
    this.clearEvents();
    this.resetCurrentTime();
    this.updateEventId();
  }

  onClickPlay = (id) => {
    this.setRecording({
      mode: 'PLAYING',
    });
    const startAndEndTimes = _.uniq(
      _.flatMap(this.state.savedEvents[id], event => [
        event.time,
        event.time + event.duration,
      ]),
    );
    startAndEndTimes.forEach(time => {
      this.scheduledEvents[id].push(
        setTimeout(() => {
          const currentEvents = this.state.savedEvents[id].filter(event => {
            return event.time <= time && event.time + event.duration > time;
          });
          this.setRecording({
            currentEvents,
          });
        }, time * 1000),
      );
    });
    // Stop at the end
    setTimeout(() => {
      this.onClickStop();
    }, this.getRecordingEndTime() * 1000);
  };

  onClickStop = () => {
    this.scheduledEvents.forEach(scheduledEvent => {
      clearTimeout(scheduledEvent);
    });
    this.setRecording({
      // mode: 'RECORDING',
      currentEvents: [],
    });
  };

  render() {
    return (
      <React.Fragment>
        <DimensionsProvider>
          {({ containerWidth, containerHeight }) => (
            <SoundfontProvider
              instrumentName="pad_3_polysynth"
              audioContext={audioContext}
              hostname={soundfontHostname}
              render={({ isLoading, playNote, stopNote }) => (
                <KeyboardWithRecording
                  recording={this.state.recording}
                  setRecording={this.setRecording}
                  noteRange={noteRange}
                  width={containerWidth}
                  playNote={playNote}
                  stopNote={stopNote}
                  disabled={isLoading}
                  keyboardShortcuts={keyboardShortcuts}
                  containerStyle="width: 100px"
                />
              )}
            />
          )}
        </DimensionsProvider>
        <Modal
        show={this.state.show}
        handleClose={this.hideModal}
        savedEvents={this.state.savedEvents}
        play={this.onClickPlay}
        />
      </React.Fragment>
    );
  }
}

export default ResponsiveKeyboard;

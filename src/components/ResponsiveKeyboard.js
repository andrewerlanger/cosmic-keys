import React from 'react';
import _ from 'lodash';

import MidiNumbers from './MidiNumbers';
import KeyboardShortcuts from './KeyboardShortcuts';
import SaveModal from './SaveModal';
import LibraryModal from './LibraryModal';
import SoundfontProvider from './SoundfontProvider';
import DimensionsProvider from './DimensionsProvider';
import KeyboardWithRecording from './KeyboardWithRecording';

import '../index.css';

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
    showLibraryModal: false,
    showSaveModal: false,
    savedEvents: {},
    savedNames: [],
    eventId: 0,
  };

  constructor(props) {
    super(props);

    this.scheduledEvents = [];
  }

  componentDidMount() {
    // Initialize dashboard buttons
    const recordButton = document.getElementById('record-button');
    const libraryButton = document.getElementById('library-button');
    const infoButton = document.getElementById('info-button');

    // Record button
    recordButton.addEventListener('click', (event) => {
      // Update styles
      event.target.classList.toggle("round-button__active");
      event.target.classList.toggle("round-button__flash");
      // Start/stop recording
      let currentMode = this.state.recording.mode;
      if (currentMode === 'RECORDING') {
        this.setMode("OFF");
        this.showSaveModal();
      }
      else {
        this.setMode('RECORDING');
      }
    });

    // Library button
    libraryButton.addEventListener('click', (event) => {
      event.target.classList.toggle("round-button__active");
      this.showLibraryModal();
    });

    // Info button
    infoButton.addEventListener('click', (event) => {
      event.target.classList.toggle("round-button__active");
      const allLabels = document.querySelectorAll(".ReactPiano__NoteLabelContainer");
      allLabels.forEach((label) => {
        label.classList.toggle("HideNoteLabels");
      });

    })
  }

  showSaveModal = () => {
    this.clearSaveInput();
    this.setState({ showSaveModal: true });
    };

  hideSaveModal = () => {
      this.setState({ showSaveModal: false });
      this.clearEvents();
      this.state.recording.currentTime = 0;
    };

  clearSaveInput = () => {
    const saveInputField = document.getElementById("save-input");
    saveInputField.value = "";
  };

  showLibraryModal = () => {
      this.setState({ showLibraryModal: true });
    };

  hideLibraryModal = () => {
      this.setState({ showLibraryModal: false });
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

  setMode = value => {
    this.setState({
      recording: { ...this.state.recording, mode: value}
    });
  };

  clearEvents = () => {
    this.setState({
      recording: { ...this.state.recording, events: new Array()}
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

  onClickSave = () => {
    const songName = document.getElementById('save-input').value;
    const id = this.state.eventId;
    const events = this.state.recording.events;
    this.state.savedEvents[id] = events;
    this.state.savedNames[id] = songName;
    this.scheduledEvents.push([]);
    this.hideSaveModal();
    this.updateEventId();
  };

  onClickPlay = (id) => {
    this.setMode('PLAYING');
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

          // toggle mode to OFF after playback
          if (currentEvents.length === 0) {
            this.setMode('OFF');
          }

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
      currentEvents: [],
    });
  };

  checkForModal = () => {
    return this.state.showSaveModal || this.state.showLibraryModal;
  }

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
                  modalDisplayed={this.checkForModal}
                />
              )}
            />
          )}
        </DimensionsProvider>
        <LibraryModal
        show={this.state.showLibraryModal}
        handleClose={this.hideLibraryModal}
        savedEvents={this.state.savedEvents}
        savedNames={this.state.savedNames}
        play={this.onClickPlay}
        />

        <SaveModal
        show={this.state.showSaveModal}
        handleClose={this.hideSaveModal}
        getName={this.onClickSave}
        />
      </React.Fragment>
    );
  }
}

export default ResponsiveKeyboard;

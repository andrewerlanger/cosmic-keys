import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Soundfont from 'soundfont-player';

import './index.css';

import App from './App';
import PianoBody from './components/PianoBody';
import Dashboard from './components/Dashboard';
import Keyboard from './components/Keyboard';
import MidiNumbers from './components/MidiNumbers';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import RecordAudio from './components/RecordAudio';

import SoundfontProvider from './SoundfontProvider';
import DimensionsProvider from './DimensionsProvider';
import KeyboardWithRecording from './KeyboardWithRecording';

import * as serviceWorker from './serviceWorker';

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


ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<PianoBody />, document.getElementById('piano-body'));
ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
ReactDOM.render(<ResponsiveKeyboard />, document.getElementById('keyboard'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

// Toggle on/off button colors
const buttons = document.querySelectorAll(".round-button");
const allLabels = document.querySelectorAll(".ReactPiano__NoteLabelContainer");
buttons.forEach( (button) => {
  button.addEventListener('click', (e) => {
    e.target.classList.toggle("round-button__active");

    // Toggle flashing button if record selected
    if (e.target.id === 'record-button') {
      e.target.classList.toggle("round-button__flash");
      ReactDOM.render(<RecordAudio />);
    }

    // Toggle note labels if info selected
    if (e.target.id === 'info-button') {
      allLabels.forEach((label) => {
        label.classList.toggle("HideNoteLabels");
      })
    }
  })
})

function ResponsiveKeyboard(props) {
  return (
    <DimensionsProvider>
      {({ containerWidth, containerHeight }) => (
        <SoundfontProvider
          instrumentName="pad_3_polysynth"
          audioContext={audioContext}
          hostname={soundfontHostname}
          render={({ isLoading, playNote, stopNote }) => (
            <Keyboard
              noteRange={noteRange}
              width={containerWidth}
              playNote={playNote}
              stopNote={stopNote}
              disabled={isLoading}
              keyboardShortcuts={keyboardShortcuts}
              {...props}
            />
          )}
        />
      )}
    </DimensionsProvider>
  );
}

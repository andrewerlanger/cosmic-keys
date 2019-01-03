/**
 * DimensionsProvider.js
 *
 * From react-piano (iqnivek):
 * https://github.com/iqnivek/react-piano/blob/master/demo/src/DimensionsProvider.js
 */

import React from 'react';
import Dimensions from 'react-dimensions';

class DimensionsProvider extends React.Component {
  render() {
    return (
      <div>
        {this.props.children({
          containerWidth: this.props.containerWidth,
          containerHeight: this.props.containerHeight,
        })}
      </div>
    );
  }
}

export default Dimensions()(DimensionsProvider);

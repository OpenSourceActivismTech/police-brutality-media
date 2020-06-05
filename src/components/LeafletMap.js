import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import './leafletmap.css';

class LeafletMap extends React.Component {
  static propTypes = {
    /** Latitude and Longitude of the map centre in an array, eg [51, -1] **/
    position: PropTypes.array,

    /** Initial zoom level for the map (default 13) **/
    zoom: PropTypes.number,
    markers: PropTypes.arrayOf(PropTypes.shape({
      slug: PropTypes.string,
      position: PropTypes.arrayOf(PropTypes.number),
      count: PropTypes.number,
    }))
  };

  static defaultProps = {
    position: [38.24, -96.1], // center over continental US
    zoom: 5,
    markers: []
  };

  render() {

      return (
        <Map center={this.props.position} zoom={this.props.zoom}>
          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png"
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {this.props.markers.map( (m) => (
            <Marker position={m.position} key={m.slug}>
              <Popup>{m.count}</Popup>
            </Marker>
            )
          )}
        </Map>
      );
  }
};

export default LeafletMap;

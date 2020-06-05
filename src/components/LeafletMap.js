import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, Popup } from 'react-leaflet';
import Marker from 'react-leaflet-enhanced-marker';

import { clip } from '../utils/math';
import { EmbedContent } from './Embed';
import './leafletmap.css';

class CircleCounter extends React.Component {
  render() {
    const markerStyle = {
      backgroundColor: "red",
      color: "white",
      display: "flex",
      justifyContent: "center",
      position: "relative",
      left: `${this.props.radius*2}px`,
      width: `${this.props.radius*2}px`,
      height: `${this.props.radius*2}px`,
      borderRadius: `${this.props.radius*2}px`,
      alignItems: "center"
    };
    return <div style={markerStyle}>{this.props.text}</div>;
  }
}

class LeafletMap extends React.Component {
  static propTypes = {
    /** Latitude and Longitude of the map centre in an array, eg [51, -1] **/
    position: PropTypes.array,

    /** Initial zoom level for the map (default 13) **/
    zoom: PropTypes.number,
    markers: PropTypes.arrayOf(PropTypes.shape({
      slug: PropTypes.string,
      position: PropTypes.arrayOf(PropTypes.number),
      name: PropTypes.string,
      count: PropTypes.number,
      links: PropTypes.arrayOf(PropTypes.string),
    }))
  };

  static defaultProps = {
    position: [38.24, -96.1], // center over continental US
    zoom: 5,
    minZoom: 4,
    maxZoom: 10,
    markers: []
  };

  render() {
      return (
        <Map
          center={this.props.position}
          zoom={this.props.zoom}
          minZoom={this.props.minZoom}
          maxZoom={this.props.maxZoom}>
          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png"
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {this.props.markers.map( (m) => {
            let radius = clip(m.count, 10, 50);
            return (
              <Marker
                position={m.position}
                key={m.slug}
                icon={<CircleCounter text={m.count} radius={radius} iconAnchor={[radius, 0]}></CircleCounter>}
              >
                <Popup>
                  <h2>{m.name}</h2>
                  <EmbedContent url={m.links[0]} />
                </Popup>
              </Marker>
              )
            }
          )}
        </Map>
      );
  }
};

export default LeafletMap;

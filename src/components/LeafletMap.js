import React from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from "gatsby";
import { Map, TileLayer, Tooltip, ZoomControl } from 'react-leaflet';
import Marker from 'react-leaflet-enhanced-marker';

import { clip } from '../utils/math';
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
    // avoid errors when server-side rendering
    if (typeof window !== 'undefined') {
      return (
        <Map
          center={this.props.position}
          zoom={this.props.zoom}
          minZoom={this.props.minZoom}
          maxZoom={this.props.maxZoom}
          zoomControl={false}>
          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png"
            attribution='Map <a href="http://stamen.com">Stamen Design</a> <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ZoomControl position='bottomright' />
          {this.props.markers.map( (m) => {
            let radius = clip(m.count, 10, 50);
            return (
              <Marker
                position={m.position}
                key={m.slug}
                icon={<CircleCounter text={m.count} radius={radius} iconAnchor={[radius, 0]}></CircleCounter>}
                onClick={() => {
                  navigate(m.slug);
                }}
              >
                <Tooltip>
                  <Link to={m.slug}>{m.name}</Link>
                  <div>{m.date}</div>
                </Tooltip>
              </Marker>
              )
            }
          )}
        </Map>
      );
    } else {
      return null;
    }
  }
};

export default LeafletMap;

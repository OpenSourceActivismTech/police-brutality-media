import React from "react";
import { Helmet } from 'react-helmet';
import './global.css';

const GlobalWrapper = ({children, title}) => {
  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        background: "black",
        color: "white",
      }}
    >
      <Helmet>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossorigin=""/>
        <title>{title}</title>
      </Helmet>
      {children}
    </div>
    )
}

export default GlobalWrapper;

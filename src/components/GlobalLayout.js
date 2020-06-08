import React from "react";
import { Helmet } from 'react-helmet';
import { rhythm } from "../utils/typography";

const GlobalWrapper = ({children}) => {
  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        background: "black",
        color: "white",
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
      }}
    >
      <Helmet>
       <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossorigin=""/>
      </Helmet>
      {children}
    </div>
    )
}

export default GlobalWrapper;

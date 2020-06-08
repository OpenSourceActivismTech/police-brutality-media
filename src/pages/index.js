import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/FullPageLayout";
import LeafletMap from "../components/LeafletMap";

const MapIndex = ({ data }) => {
  const locations = data.allPoliceBrutalityVideo.group.map((g)=>{
    // pull geom from first edge node (sorted by date)
    const n = g.edges[0].node;
    const geom = n.fields.geocoderGeometry;
    if (geom && geom.lat && geom.lng) {
      return {
        'slug': n.fields.slug,
        'position': [geom.lat, geom.lng],
        'name': `${n.city}, ${n.fields.stateAbbr.toUpperCase()}`,
        'count': g.edges.length,
        'date': n.date,
      }
    } else {
      return false;
    }
  }).filter((item) => item);
  // remove items without geometry

  return (
    <Layout title="Police Brutality Map">
      <LeafletMap markers={locations} />
    </Layout>
  );
};

export default MapIndex;

export const pageQuery = graphql`
  query mapQuery {
    allPoliceBrutalityVideo(sort: {fields: date, order: DESC}) {
      group(field: fields___slug) {
        edges {
          node {
            id
            fields {
              slug
              geocoderGeometry {
                lng
                lat
              }
              stateAbbr
            }
            name
            city
            state
            date
          }
        }
      }
    }
  }
`;

import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/PageLayout";
import LeafletMap from "../components/LeafletMap";

const MapIndex = ({ data }) => {
  const locations = data.allPoliceBrutalityVideo.group.map((g)=>{
    // pull geom from first edge node
    const n = g.edges[0].node;
    const geom = n.fields.geocoderGeometry;
    return {
      'slug': n.fields.locationSlug,
      'position': [geom.lat, geom.lng],
      'name': `${n.city}, ${n.state}`,
      'count': g.edges.length,
      'links': n.links,
    }
  });

  return (
    <Layout title="Police Brutality Map">
      <LeafletMap markers={locations} />
    </Layout>
  );
};

export default MapIndex;

export const pageQuery = graphql`
  query mapQuery {
    allPoliceBrutalityVideo {
      group(field: fields___locationSlug) {
        edges {
          node {
            id
            fields {
              locationSlug
              geocoderGeometry {
                lng
                lat
              }
            }
            name
            city
            state
            date
            links
          }
        }
      }
    }
  }
`;

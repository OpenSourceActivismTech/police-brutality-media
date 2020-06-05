import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/PostLayout";
import { rhythm } from "../utils/typography";

const MdIncidentTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  console.log(data);

  return (
    <Layout {...pageContext}>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <hr
        style={{
          marginBottom: rhythm(1)
        }}
      />
    </Layout>
  );
};

export default MdIncidentTemplate;

export const pageQuery = graphql`
  query MdIncidentBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
    }
  }
`;

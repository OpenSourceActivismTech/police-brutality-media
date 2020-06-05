import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/PostLayout";
import { rhythm } from "../utils/typography";

const MdLocationTemplate = ({ data, pageContext }) => {
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

export default MdLocationTemplate;

export const pageQuery = graphql`
  query MdLocationBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
    }
  }
`;

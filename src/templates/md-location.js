import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/PostLayout";

const MdLocationTemplate = ({ data, pageContext }) => {
  const videos = data.allPoliceBrutalityVideo.nodes;

  return (
    <Layout {...pageContext}>
      { videos.map((video) => {
        const embed = video.childPoliceBrutalityVideoMarkdownBody.childMarkdownRemark;
        return (
          <article>
            <h3>{video.name}</h3>
            <h4>{video.date}</h4>
            <div dangerouslySetInnerHTML={{ __html: embed.html }} />
          </article>
        )
      })}
    </Layout>
  );
};

export default MdLocationTemplate;

export const pageQuery = graphql`
  query MdLocationBySlug($slug: String!) {
    allPoliceBrutalityVideo(filter: {fields: {slug: {eq: $slug}}}, sort: {fields: date, order: DESC}) {
      nodes {
        name
        city
        state
        childPoliceBrutalityVideoMarkdownBody {
          childMarkdownRemark {
            html
          }
        }
        date(formatString: "MMM Do, YYYY")
      }
    }
  }
`;

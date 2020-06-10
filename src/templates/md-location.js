import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/PostLayout";
import phoneToDigits from "../utils/phone";

const MdLocationTemplate = ({ data, pageContext }) => {
  const videos = data.allPoliceBrutalityVideo.nodes;
  const mayor = data.allMayorsCsv.nodes[0];
  const chief = data.allChiefsCsv.nodes[0];
  const agencies = data.allAgenciesCsv.nodes;

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
      <div id="responsible">
        <section id="mayor">
          <h3>{mayor.city}, {mayor.state} Mayor</h3>
          <div>{mayor.name}</div>
          <img src={mayor.img_url} alt={mayor.name} />
          <a href={`tel:${phoneToDigits(mayor.phone)}`}>{mayor.phone}</a>
          <a href={`mailto:${mayor.email}`}>{mayor.email}</a>
        </section>
        <section id="police-chief">
          <h3>{chief.name}</h3>
          <h4>{chief.agency}</h4>
          <img src={chief.img_url} alt={chief.name} />
        </section>
        <section id="police-agencies">
          { agencies.map((agency) => (
            <div key={agency.NAME}>
              <h4>{agency.NAME}</h4>
              { (agency.FTSWORN > 0) && (
                <div>{agency.FTSWORN} Sworn Officers</div>
              )}
              { phoneToDigits(agency.TELEPHONE) && (
              <a href={`tel:${phoneToDigits(agency.TELEPHONE)}`}>{agency.TELEPHONE}</a>
              )}
            </div>
          ))}
        </section>
      </div>
    </Layout>
  );
};

export default MdLocationTemplate;

export const pageQuery = graphql`
  query MdLocationBySlug($slug: String!, $city: String, $CITY: String, $state: String!, $state_name: String) {
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

    allMayorsCsv(filter: {state: {eq: $state}, city: {eq: $city}}) {
      nodes {
        city
        state
        name
        email
        phone
        img_url
      }
    }

    allChiefsCsv(filter: {state: {eq: $state_name}, city: {eq: $city}}) {
      nodes {
        name
        agency
        website
        img_url
      }
    }

    allAgenciesCsv(filter: {CITY: {eq: $CITY}, STATE: {eq: $state}}, sort: {fields: NAME, order: ASC}) {
      nodes {
        NAME
        TELEPHONE
        WEBSITE
        FTSWORN
      }
    }
  }
`;

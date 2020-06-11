import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/PostLayout";
import { Embed, EmbedSlider } from "../components/Embed";
import { FaFacebookSquare, FaTwitterSquare, FaWhatsappSquare } from 'react-icons/fa';

import phoneToDigits from "../utils/phone";

const MdLocationTemplate = ({ data, pageContext }) => {
  const videos = data.allPoliceBrutalityVideo.nodes;
  const mayor = data.allMayorsCsv.nodes[0];
  const chief = data.allChiefsCsv.nodes[0];
  const agencies = data.allAgenciesCsv.nodes;

  // match chief to agency by name
  const chiefAgency = agencies.find(elem => elem.NAME === chief.agency.toUpperCase());

  const embeds = videos.map((video) => (
    <Embed item={video.childPoliceBrutalityVideoMarkdownBody.childMarkdownRemark} />
  ));

  return (
    <Layout {...pageContext}>
      <EmbedSlider slides={embeds} />
      <div id="take-action">
      { mayor && (
        <section id="mayor">
          <h3>Mayor {mayor.name}</h3>
          <img src={mayor.img_url} alt={mayor.name} />
          <a href={`tel:${phoneToDigits(mayor.phone)}`}>{mayor.phone}</a>
          <a href={`mailto:${mayor.email}`}>{mayor.email}</a>
        </section>
        )}
        { chief && (
        <section id="police-chief">
          <h3>{chief.name}</h3>
          <img src={chief.img_url} alt={chief.name} />
          <div>{chief.agency}</div>
          { (chiefAgency.FTSWORN > 0) && (
            <div>{chiefAgency.FTSWORN} Sworn Officers</div>
          )}
          { phoneToDigits(chiefAgency.TELEPHONE) && (
            <a href={`tel:${phoneToDigits(chiefAgency.TELEPHONE)}`}>{chiefAgency.TELEPHONE}</a>
          )}
        </section>
        )}
        { agencies && (
        <section id="share">
          <h3>Share</h3>
          <div>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://policebrutality.media/"+pageContext.slug)}` }>
              <FaFacebookSquare /> Facebook
            </a>
          </div>
          <div>
            <a href={`whatsapp://send?text=${encodeURIComponent("https://policebrutality.media/"+pageContext.slug)}` }>
              <FaWhatsappSquare /> WhatsApp
            </a>
          </div>
          <div>
            <a href={`http://www.twitter.com/share?url=${encodeURIComponent("https://policebrutality.media/"+pageContext.slug)}` }>
              <FaTwitterSquare /> Twitter
            </a>
          </div>
        </section>
        )}
      </div>
    </Layout>
  );
};

export default MdLocationTemplate;

export const pageQuery = graphql`
  query MdLocationBySlug($slug: String!, $city: String, $CITY: String, $state: String!, $state_name: String) {
    allPoliceBrutalityVideo(filter: {fields: {slug: {eq: $slug}}}, sort: {fields: date, order: DESC}) {
      nodes {
        id
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
        ID
        NAME
        TELEPHONE
        WEBSITE
        FTSWORN
      }
    }
  }
`;

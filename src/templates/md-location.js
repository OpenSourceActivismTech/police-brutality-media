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
  const stateSheriffs = data.allSheriffsCsv.nodes; // returns all in this state
  const agencies = data.allAgenciesCsv.nodes;

  var chiefAgency;
  if (chief) {
    // match chief to agency by name
    chiefAgency = agencies.find(elem => elem.NAME === chief.agency.toUpperCase());
  }

  // get county from geocoder result on video (put this in node?)
  let geocoderResult = videos[0].fields.geocoderFullResult || {components: {county: ''}};
  let countyName = geocoderResult.components.county.replace(' County', '').replace(' Parish', '');

  var sheriff;
  if (countyName) {
    sheriff = stateSheriffs.find(elem => elem.county === countyName);
  }

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
          <div>Population: {Number(mayor.population).toLocaleString('en-us')}</div>
          { mayor.phone && (
            <a href={`tel:${phoneToDigits(mayor.phone)}`}>{mayor.phone}</a>
          )}
          { mayor.email && (
            <a href={`mailto:${mayor.email}`}>{mayor.email}</a>
          )}
        </section>
        )}
        { chief && (
        <section id="police-chief">
          <h3>{chief.name}</h3>
          <img src={chief.img_url} alt={chief.name} />
          { chiefAgency && (chiefAgency.WEBSITE > 0) ? (
              <a href="{chief.WEBSITE}">{chief.agency}</a>
          ) : (
            <div>{chief.agency}</div>
          )}
          { chiefAgency && (chiefAgency.FTSWORN > 0) && (
            <div>Officers: {Number(chiefAgency.FTSWORN).toLocaleString('en-us')}</div>
          )}
          { chiefAgency && phoneToDigits(chiefAgency.TELEPHONE) && (
            <a href={`tel:${phoneToDigits(chiefAgency.TELEPHONE)}`}>{chiefAgency.TELEPHONE}</a>
          )}
        </section>
        )}
        { sheriff && (
        <section id="county-sheriff">
          <h3>{sheriff.name}</h3>
          <img src={sheriff.img_url} alt={sheriff.name} />
          { sheriff.phone && (
            <a href={`tel:${phoneToDigits(sheriff.phone)}`}>{sheriff.phone}</a>
          )}
          { sheriff.email && (
            <a href={`mailto:${sheriff.email}`}>{sheriff.email}</a>
          )}
        </section>
        )}
      </div>

      <div id="share">
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
        fields {
          geocoderFullResult {
            components {
              county
            }
          }
        }
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
        population
      }
    }

    allChiefsCsv(filter: {state: {eq: $state_name}, city: {eq: $city}}) {
      nodes {
        name
        agency
        img_url
      }
    }

    allSheriffsCsv(filter: {state: {eq: $state}}) {
      nodes {
        name
        phone
        email
        county
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

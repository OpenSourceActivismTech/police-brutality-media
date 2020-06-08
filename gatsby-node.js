const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const slugify = require("slugify");
const states = require('us-state-converter');

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Create markdown posts
  const mdResults = await graphql(
    `{
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
    }`
  );

  if (mdResults.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" md query');
  }

  // Create blog posts pages.
  const mdPosts = mdResults.data.allMarkdownRemark.edges;
  const mdPostTemplate = path.resolve("./src/templates/md-post.js");

  mdPosts.forEach(({ node }, index) => {
    const previous =
      index === mdPosts.length - 1 ? null : mdPosts[index + 1].node;
    const next = index === 0 ? null : mdPosts[index - 1].node;

    if (!node.fields) { return; }

    createPage({
      path: node.fields.slug,
      component: mdPostTemplate,
      context: {
        slug: node.fields.slug,
        previous,
        next
      }
    });
  });

  // Create pages for each location (grouped by slug)
  const locationResults = await graphql(
    `{
      allPoliceBrutalityVideo {
        group(field: fields___slug) {
          nodes {
            fields {
              slug
              stateAbbr
            }
            id
            city
          }
        }
      }
    }`
  );

  if (locationResults.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" location query');
  }

  // Create location and incident pages
  const mdLocations = locationResults.data.allPoliceBrutalityVideo.group;
  const mdLocationTemplate = path.resolve("./src/templates/md-location.js");
  const mdIncidentTemplate = path.resolve("./src/templates/md-incident.js");

  mdLocations.forEach(({ nodes }) => {
    // base page for each location
    const locationSlug = `${nodes[0].fields.slug}`;
    const locationName = `${nodes[0].city}, ${nodes[0].fields.stateAbbr.toUpperCase()}`;
    createPage({
        path: `/${locationSlug}`,
        component: mdLocationTemplate,
        context: {
          slug: locationSlug,
          location: locationName,
        }
      });

    // and then sub-pages for incidents (by uuid?)
    nodes.forEach((node, index) => {
      const previous =
        index === nodes.length - 1 ? null : nodes[index + 1].node;
      const next = index === 0 ? null : nodes[index - 1].node;
      const incidentSlug = `${node.fields.locationSlug}/${index}`;

      createPage({
        path: `/${incidentSlug}`,
        component: mdIncidentTemplate,
        context: {
          slug: incidentSlug,
          previous,
          next
        }
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
  const { createNodeField, createNode, createParentChildLink } = actions;

  if (node.internal.type === `MarkdownRemark` && node.fileAbsolutePath) {
    // do this only for real markdown files, not the fake ones we have to create from the data
    const relativeFilePath = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value: `${relativeFilePath}`
    });
  } else if (node.internal.type === `PoliceBrutalityVideo`) {
    // create composite city-state slug for grouping
    const { city, state } = node;
    let citySlug = city ? slugify(city.replace('.','').toLowerCase()) : '';
    let stateAbbr = states.abbr(state).toLowerCase();
    var locationSlug;
    
    if (stateAbbr === "no abbreviation found with that state name") {
      stateAbbr = '';
      locationSlug = 'unknown-location';
    } else {
      if (citySlug) {
        locationSlug = `${citySlug}-${stateAbbr}`;
      } else {
        locationSlug = stateAbbr;
      }
    }
    createNodeField({
      name: `slug`,
      node,
      value: locationSlug
    });
    createNodeField({
      name: `stateAbbr`,
      node,
      value: stateAbbr
    });

    // create text node with links and this node as parent
    // retrieve links from list and join with linebreaks, so we can process their embeds
    let body = node.links ? node.links.map(l => l.link).join('\n\n') : '';
    const textNode = {
      id: `${node.id}-MarkdownBody`,
      parent: `${node.id}`,
      internal: {
        type: `${node.internal.type}MarkdownBody`,
        mediaType: "text/markdown",
        content: body,
        contentDigest: createContentDigest(body),
      },
    }
    createNode(textNode);
    // have to create the link explicitly, so it's bi-directional
    createParentChildLink({ parent: node, child: textNode });
  } else if (node.internal.type === `PoliceBrutalityVideoMarkdownBody` && node.parent) {
    // set slug based on the parent
    const parent = getNode(node.parent);
    if (parent && parent.fields && parent.fields.slug) {
      createNodeField({
        name: `slug`,
        node,
        value: parent.fields.slug
      });
    } else {
      // wtf parent?
      createNodeField({
        name: `slug`,
        node,
        value: node.id,
      });
    }
  }
};

// react-leaflet build error, server-side only
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-leaflet/,
            use: ['null-loader']
          },
        ],
      }
    })
  }
}


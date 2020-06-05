const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const slugify = require("slugify");
const states = require('us-state-converter');

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Create markdown posts
  const mdResults = await graphql(
    `
      {
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
      }
    `
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

    if (node.fields.slug) {
      createPage({
        path: node.fields.slug,
        component: mdPostTemplate,
        context: {
          slug: node.fields.slug,
          previous,
          next
        }
      });
    }
  });

  // Create pages for each location (grouped by slug)
  const locationResults = await graphql(
    `
      {
        allPoliceBrutalityVideo {
          group(field: fields___locationSlug) {
            nodes {
              fields {
                locationSlug
              }
              id
            }
          }
        }
      }
    `
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
    const locationSlug = `${nodes[0].fields.locationSlug}`;
    createPage({
        path: `/${locationSlug}`,
        component: mdLocationTemplate,
        context: {
          slug: locationSlug
        }
      });
    console.log('createPage', locationSlug);

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
      console.log('createPage', incidentSlug);
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
  const { createNodeField, createNode } = actions;

  if (node.internal.type === `MarkdownRemark` && !node.isFromData) {
      // do this only for real markdown files, not the fake ones we have to create from the data
      const relativeFilePath = createFilePath({ node, getNode });
      createNodeField({
        name: `slug`,
        node,
        value: `${relativeFilePath}`
      });
  }

  if (node.internal.type === `PoliceBrutalityVideo`) {
    // create composite city-state slug for grouping
    const { city, state } = node;
    const citySlug = slugify(city.replace('.','').toLowerCase());
    const stateAbbr = states.abbr(state).toLowerCase();
    var locationSlug = `${citySlug}-${stateAbbr}`;
    if (stateAbbr === "no abbreviation found with that state name") {
      locationSlug = 'unknown-location';
    }
    createNodeField({
      name: `locationSlug`,
      node,
      value: locationSlug
    });

    // create text node with links
    const body = node.links.join('\n\n');
    const textNode = {
      id: `${node.id}-MarkdownBody`,
      parent: node.id,
      path: path.resolve("./"),
      internal: {
        type: `${node.internal.type}MarkdownBody`,
        mediaType: "text/markdown",
        content: body,
        contentDigest: createContentDigest(body),
      },
      isFromData: true
    }
    createNode(textNode);
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

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

  mdLocations.forEach(({ nodes }) => {
    const node = nodes[0]; // create single location node for each group
    const locationName = `${node.city}, ${node.fields.stateAbbr}`;

    createPage({
      path: `/${node.fields.slug}`,
      component: mdLocationTemplate,
      context: {
        // gets passed to page query and context
        slug: node.fields.slug,
        location: locationName,
        city: node.city,
        CITY: node.city ? node.city.toUpperCase() : '',
        // agencies data have city as all uppercase, easier to transform here than do case-insensitive search
        state: node.fields.stateAbbr,
        state_name: states(node.fields.stateAbbr).name
      }
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
    let citySlug = city ? slugify(city.replace('.','')) : '';
    let stateAbbr = states.abbr(state);
    var locationSlug;
    
    if (stateAbbr === "No abbreviation found with that state name") {
      stateAbbr = '';
      locationSlug = 'unknown-location';
    } else {
      if (citySlug) {
        locationSlug = `${citySlug}-${stateAbbr}`.toLowerCase();
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
    let body = node.links ? node.links.join('\n\n') : '';
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


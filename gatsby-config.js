require("dotenv").config();

const {
  GEOCODER_KEY,
  GOOGLE_ANALYTICS_ID,
} = process.env;

module.exports = {
  siteMetadata: {
    title: "PoliceBruality.media",
    author: "jlev",
    description: "A site documenting police brutality in America in 2020",
    siteUrl: "https://policebruality.media/"
  },
  pathPrefix: "/",
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/posts`,
        name: "posts"
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    `gatsby-transformer-csv`,
    {
      resolve: 'gatsby-source-apiserver',
      options: {
        url: `http://api.policebrutality.io/v1/videos`,
        method: `get`,
        auth: false,
        name: 'PoliceBrutalityVideo',
        entityLevel: `data`,
      },
    },
    {
      resolve: `gatsby-transformer-opencage-geocoder`,
      options: {
        api_key: GEOCODER_KEY,
        nodeTypes: [
          {
            nodeType: `PoliceBrutalityVideo`,
            addressFields: ['city', 'state'],
            addFullResult: false,
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-react-leaflet',
      options: {
        linkStyles: false
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `@raae/gatsby-remark-oembed`,
            options: {
              withPrefix: false,
              providers: {
                settings: {
                  Twitter: {
                    theme: "dark"
                  },
                }
              }
            }
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`
            }
          }
        ]
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-plugin-typography",
      options: {
        pathToConfigModule: "src/utils/typography"
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: GOOGLE_ANALYTICS_ID,
      },
    },
    `gatsby-plugin-react-helmet`
  ]
};

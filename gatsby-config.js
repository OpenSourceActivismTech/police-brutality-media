require("dotenv").config();

const { GEOCODER_KEY } = process.env;

module.exports = {
  siteMetadata: {
    title: "ReplaceThePolice.org",
    author: "jlev",
    description: "A site documenting police brutality in America in 2020",
    siteUrl: "https://replacethepolice.org/"
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
      resolve: 'gatsby-source-apiserver',
      options: {
        url: `http://api.policebrutality.io/v1/videos`,
        method: `get`,
        auth: false,
        name: 'PoliceBrutalityVideo',
        entityLevel: `data`,
        schemaType: {
            date: `Date`,
            name: `String`,
            state: `String`,
            city: `String`,
            links: [`String`]
        },
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
        linkStyles: true
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
                    theme: "dark" // Use the Twitter dark theme
                  },
                  Instagram: {
                    hidecaption: true
                  }
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
    }
  ]
};

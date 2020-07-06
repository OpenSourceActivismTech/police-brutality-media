# Police Brutality Media

This is a map and video visualization of police brutality in 2020. Inicidents collected by [r/2020PoliceBrutality](https://www.reddit.com/r/2020PoliceBrutality/) on Reddit, made available on [GitHub](https://github.com/2020PB/police-brutality/). Number of sworn officers from [DHS](https://hifld-geoplatform.opendata.arcgis.com/datasets/local-law-enforcement-locations), agency chiefs from [Major Chiefs Association](https://www.majorcitieschiefs.com/members.php), local government officials from [US Council of Mayors](https://github.com/opensourceactivismtech/us-mayors).

Uses [React-Leaflet](https://react-leaflet.js.org), [gatsby-remark-oembed](https://github.com/raae/gatsby-remark-oembed) and is based on the [gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog).

## Install

`npm install`

## Environment Variables
`GEOCODER_KEY` = from https://opencagedata.com

## Running in development

`source .env`
`gatsby develop`

## Production

`gatsby build`

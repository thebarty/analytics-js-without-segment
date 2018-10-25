# Use analytics.js without Segment (analytics-js-without-segment)

A plugin use (and render) Segments open-source analytics library (analytics.js) WITHOUT using the paid Segment service (segment.com). To be used with your favorite analytics-tools like Google Analytics, Mixpanel, Hotjar, etc.

## INSTALL

Install via npm

```
npm install analytics-js-without-segment --save
```

## Usage

In your client, add:

```js
const { renderAnalytics, runAnalytics } = require('analytics-js-without-segment')

const options = ({
  cdnUrl: 'https://cdnjs.cloudflare.com/ajax/libs/analytics.js/2.9.1/analytics.min.js',  // host yourself or use cdnjs (https://cdnjs.com/libraries/analytics.js)
  services: {
    // see integration https://github.com/segment-integrations/analytics.js-integration-google-analytics/blob/master/lib/index.js
    'Google Analytics': {
      trackingId: 'UA-XXX-1',
      anonymizeIp: true,
    },
    // see integration https://github.com/segment-integrations/analytics.js-integration-mixpanel/blob/master/lib/index.js
    'Mixpanel': {
      token: 'XXX',
      people: true,
      trackAllPages: true,
    },
    // see integration https://github.com/segment-integrations/analytics.js-integration-fullstory/blob/master/lib/index.js
    'FullStory': {
      org: 'XXX',
      debug: true,
    },
    // ... other service? See supported integrations (that can be loaded via analytics.js) at https://github.com/segment-integrations.
  },
}

// OPTION 1)
// AUTOMATICALLY attach to window.analytics and make global `analytics.*`-object available
runAnalytics(options)  // after running this, `analytics` is globally available

// OPTION 2)
// MANUALLY attach to window.analytics and make global `analytics.*`-object available
const snippet = renderAnalytics(options)
eval(snippet)

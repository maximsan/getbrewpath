# What does Cloudflare keep from a page request?

Research for [issue #18](https://github.com/maximsan/getbrewpath/issues/18), part of [#3](https://github.com/maximsan/getbrewpath/issues/3). Sources checked on 2026-10-22.

## Short answer

Cloudflare keeps a per-request log only when Workers Logs is on. The site's Workers config does not turn it on. The deploy tool turns it off on every redeploy. So, after the second deploy, Cloudflare keeps no per-request log the site owner can see. Cloudflare's own privacy pages say it still processes visitor IP addresses "for a limited period of time". No Cloudflare page gives that period in days.

If Workers Logs were on, each log would include the request method, the address and the visitor's country. The Workers Free plan keeps those logs for 3 days.

Cloudflare Web Analytics keeps unsampled data for 7 days and a 10% sample for six months. It drops the visitor's IP address at the nearest data centre.

## Words used here

- **A Worker** is the program Cloudflare runs for each request to the site.
- **Wrangler** is Cloudflare's command-line deploy tool. The OpenNext adapter calls it to deploy.
- **The Workers config** is `wrangler.jsonc` at the repo root.
- **Workers Logs** is Cloudflare's stored log of Worker runs, viewed in the Cloudflare dashboard.
- **An invocation log** is the one log line Workers Logs writes per Worker run.
- **The `observability` block** is the part of the Workers config that turns Workers Logs on.
- **Head-based sampling** is logging only a share of runs, chosen at the start of each run.
- **Logpush** is Cloudflare's service that sends raw logs to storage the site owner picks.
- **Logpull** is the older service for downloading raw logs over Cloudflare's programming interface.
- **Web Analytics** is Cloudflare's visit counter. Its script is the **beacon**.
- **Real User Monitoring (RUM)** is Cloudflare's name for the beacon's page-timing data.
- **Internet Protocol (IP) address** is the number that identifies a visitor's connection.
- **Hypertext Transfer Protocol (HTTP)** is the protocol a browser uses to request a page.
- **Data Processing Addendum (DPA)** is Cloudflare's contract on handling personal data.
- **General Data Protection Regulation (GDPR)** is the European Union (EU) privacy law.
- **A processor** handles personal data on a customer's behalf and under the customer's instructions.
- **End User** is Cloudflare's legal term for a visitor to a customer's site.

## Facts

### Workers Logs

- Workers Logs needs an `observability` block in the Workers config. Cloudflare's page says: "You must add the observability setting for your Worker to write logs to Workers Logs." Source: [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/).
- The same page says: "All newly created Workers will come with the observability setting enabled by default." Source: [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/).
- The config reference says `observability.enabled` "Defaults to `true` for all new Workers." Source: [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/#observability).
- The site's Workers config has no `observability` block. Source: `wrangler.jsonc` on `main` at commit `b843166`, and at commit `2571c9b` of pull request #22.
- On the first deploy of a Worker, Wrangler sends no `observability` value. The Cloudflare default then applies. Source: [deploy.ts in workers-sdk](https://github.com/cloudflare/workers-sdk/blob/5c909cc20a01f7321752c868cf0a9acedcea155d/packages/deploy-helpers/src/deploy/deploy.ts), `observability: config.observability` in the upload metadata and the `canUseNewVersionsDeploymentsApi` condition, which needs `workerExists`.
- On every later deploy, Wrangler sends `observability: { enabled: false }` when the config has no block. The code comment says: "If the user hasn't specified observability assume that they want it disabled if they have it on." Source: [deploy.ts in workers-sdk](https://github.com/cloudflare/workers-sdk/blob/5c909cc20a01f7321752c868cf0a9acedcea155d/packages/deploy-helpers/src/deploy/deploy.ts), the `patchNonVersionedScriptSettings` call.
- Each Worker run writes one invocation log. It holds "details such as the Request, Response, and related metadata". For a page request, its message is the request method and the request address. Source: [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/), "Invocation logs".
- Stored invocation logs can be filtered and grouped by `$workers.event.request.path`, `$workers.event.response.status` and `$workers.event.request.cf.country`. Source: [Query Builder](https://developers.cloudflare.com/workers/observability/query-builder/).
- The `cf` object on a request holds the visitor's country, city, region, postal code, latitude, longitude, time zone, network number and connection details. It does not hold the IP address. Source: [Request](https://developers.cloudflare.com/workers/runtime-apis/request/), `IncomingRequestCfProperties`.
- The stored log event has the shape `event.request` with `url`, `method`, `headers` and `cf`. The docs' sample shows `headers` and `cf` as empty objects, so their stored contents are not documented. Source: [Real-time logs](https://developers.cloudflare.com/workers/observability/logs/real-time-logs/).
- Not confirmed: whether a stored invocation log keeps the `CF-Connecting-IP` header, which carries the visitor's IP address. Cloudflare's Tail Handler page redacts headers whose names contain "cookie", "auth", "key", "secret", "token" or "jwt". The IP header is not among those names. That page covers Tail Workers, not Workers Logs. Source: [Tail Handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/tail/) and [HTTP headers](https://developers.cloudflare.com/fundamentals/reference/http-headers/).
- Retention: Workers Free keeps logs for 3 days. Workers Paid keeps them for 7 days. Source: [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/), "Pricing", and [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).
- Daily limit: Workers Free may write 200,000 log events per day. Workers Paid includes 20 million per month, then $0.60 per extra million. Source: [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).
- Pricing changes on 1 December 2026. From then, Workers Logs uses "Cloudflare Observability pricing". Source: [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).
- Sampling: `head_sampling_rate` sets the share of runs logged, from 0 to 1. Unset, it is 1, so every run is logged. Source: [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/), "Head-based sampling".
- Each log is cut at 256 kilobytes. An account may write 5 billion logs a day; above that, only 1% is kept. Source: [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/), "Limits".
- Real-time logs in the dashboard or `wrangler tail` store nothing. The page says: "Real-time logs does not store Workers Logs." Source: [Real-time logs](https://developers.cloudflare.com/workers/observability/logs/real-time-logs/).

### Cloudflare's privacy policy and DPA

- Cloudflare processes "End Users' interactions with Customer's Internet Properties". The data "may include but is not limited to IP addresses, traffic routing data" and system configuration information. Source: [Privacy Policy](https://www.cloudflare.com/privacypolicy/), section 2, "End Users".
- The End User data Cloudflare shows a customer in the dashboard is called "Customer Logs". Source: [Privacy Policy](https://www.cloudflare.com/privacypolicy/), section 2.
- Cloudflare says it "is a data processor" for content from Customers and End Users. It processes that data under the customer's instructions. Source: [Privacy Policy](https://www.cloudflare.com/privacypolicy/), section 6.
- The policy gives no retention period for End User logs or IP addresses. Its retention section says data is kept "for a period of time that is consistent with the business purposes". Source: [Privacy Policy](https://www.cloudflare.com/privacypolicy/), section 11, "Data Retention".
- The policy is effective as of 4 November 2025. Source: [Privacy Policy](https://www.cloudflare.com/privacypolicy/), header.
- The DPA defines Customer Logs as "any logs of End Users' interactions with Customer's Internet Properties and the Service". It lists "IP addresses" as the example of End User personal data. Source: [Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/), Annex 1, section B.
- The DPA's retention period runs until the agreement ends or processing is no longer needed. After that, Cloudflare must delete or return personal data at the customer's choice. Source: [Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/), Annex 1 and section 3.1(i). Version 6.4, effective 3 April 2026.
- Cloudflare's GDPR page says log metadata "contains extremely limited personal data, most often in the form of IP addresses". It is processed "for a limited period of time". No number of days is given. Source: [GDPR](https://www.cloudflare.com/trust-hub/gdpr/) and [GDPR introduction](https://www.cloudflare.com/gdpr/introduction/).
- Cloudflare's Europe whitepaper lists its privacy commitments. One is: "Cloudflare only retains personal data as necessary to provide Cloudflare offerings to our customers." It also says "service logs may contain end-user IP addresses". Source: [How Cloudflare helps address data protection and locality obligations in Europe](https://cf-assets.www.cloudflare.com/slt3lc6tev37/66yV5siqmSYsx6u1POPxb7/84757b4c8a9941ac80fa4efae9a0cf79/cloudflare-helps-obligations-europe-whitepaper.pdf), pages "The data Cloudflare processes" and "Sharing logs with customers".
- Not found: a Cloudflare page that states, in days or hours, how long Cloudflare itself keeps a site visitor's IP address in its internal logs. The only numbers published are for products the site owner can read: Workers Logs, Logpull and Web Analytics.

### Cloudflare Web Analytics

- Web Analytics shows "data for the previous six months". Source: [Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/).
- Cloudflare keeps "unsampled beacon data for the past 7 days". After that, "data is aggregated down to around 10%". Source: [Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/).
- The beacon service "discards the IP address at the nearest Cloudflare data center" and "does not store it in core databases or logs". Truncation is not mentioned. Source: [RUM beacon](https://developers.cloudflare.com/speed/observatory/rum-beacon/).
- The beacon "does not store any data in the browser or access any storage data". It uses no cookies, local storage, session storage or IndexedDB. Source: [RUM beacon](https://developers.cloudflare.com/speed/observatory/rum-beacon/).
- The beacon sends page-load timings, Core Web Vitals, the page path and the referring page. Query strings are not logged, "to avoid collecting potentially sensitive data". Source: [RUM beacon](https://developers.cloudflare.com/speed/observatory/rum-beacon/) and [Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/).
- Cloudflare says Web Analytics "does not collect or use your visitors' personal data" and "does not track individual end users across our customers' Internet properties". Source: [About Web Analytics](https://developers.cloudflare.com/web-analytics/about/) and [Data origin and collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/).
- Beacon data is processed at the nearest data centre, which may be in another country. The site owner can exclude visitors from the European Economic Area. Source: [RUM beacon](https://developers.cloudflare.com/speed/observatory/rum-beacon/).

### Raw request logs by plan

- Logpush is available on the Free, Pro, Business and Enterprise plans. Source: [About Cloudflare Logs](https://developers.cloudflare.com/logs/about/) and [Logs FAQ](https://developers.cloudflare.com/logs/faq/general-faq/).
- Logpush on Free, Pro and Business is self-service and usage-based. Each account includes 25 gigabytes a month to an external destination, then $0.10 per gigabyte. Source: [Logpush pricing](https://developers.cloudflare.com/logs/logpush/pricing/).
- Logpush stores nothing. The page says: "Logpush does not offer storage or search functionality for logs." Source: [Logpush](https://developers.cloudflare.com/logs/logpush/).
- The HTTP requests dataset holds `ClientIP`, "IP address of the client", and `ClientCountry`, among other fields. It is a zone dataset, so it needs the site's domain on a Cloudflare zone. Source: [HTTP requests dataset](https://developers.cloudflare.com/logs/logpush/logpush-job/datasets/zone/http_requests/).
- Logpush for Worker runs, the Workers Trace Events dataset, "requires the Workers Paid plan". Source: [About Cloudflare Logs](https://developers.cloudflare.com/logs/about/) and [Workers Logpush](https://developers.cloudflare.com/workers/observability/logs/logpush/).
- Logpull "is available to customers on the Enterprise plan". Its logs reach back 3 to 7 days. Retention is off by default. Source: [Logpull](https://developers.cloudflare.com/logs/logpull/), [Logpull basics](https://developers.cloudflare.com/logs/logpull/understanding-the-basics/) and [Enabling log retention](https://developers.cloudflare.com/logs/logpull/enabling-log-retention/).

## What this means for the website privacy page

- Today the site keeps no per-request log the owner can read. If the owner wants Workers Logs, the Workers config must say so. Then the page must say that Cloudflare keeps request logs for 3 days.
- The page can say that Cloudflare, as processor, handles the visitor's IP address to deliver the page. It cannot give a number of days for that. Cloudflare publishes none.
- The Web Analytics facts in [issue #18](https://github.com/maximsan/getbrewpath/issues/18) hold. Two can be added: data is kept unsampled for 7 days and as a 10% sample for six months.

## Open decisions for the owner

1. Whether to turn Workers Logs on. It helps debugging. It also makes Cloudflare keep request details, including the visitor's country, for 3 days.
2. If Workers Logs stays off, whether to say so in the Workers config with `"observability": { "enabled": false }`. That makes the choice visible in the repo.

## Sources

- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Wrangler configuration, observability](https://developers.cloudflare.com/workers/wrangler/configuration/#observability)
- [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Query Builder](https://developers.cloudflare.com/workers/observability/query-builder/)
- [Real-time logs](https://developers.cloudflare.com/workers/observability/logs/real-time-logs/)
- [Tail Handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/tail/)
- [Request, `IncomingRequestCfProperties`](https://developers.cloudflare.com/workers/runtime-apis/request/)
- [Cloudflare HTTP headers](https://developers.cloudflare.com/fundamentals/reference/http-headers/)
- [deploy.ts in cloudflare/workers-sdk at commit 5c909cc](https://github.com/cloudflare/workers-sdk/blob/5c909cc20a01f7321752c868cf0a9acedcea155d/packages/deploy-helpers/src/deploy/deploy.ts)
- [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/)
- [Cloudflare Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/)
- [Cloudflare and the GDPR](https://www.cloudflare.com/trust-hub/gdpr/)
- [GDPR introduction](https://www.cloudflare.com/gdpr/introduction/)
- [Europe data protection whitepaper (PDF)](https://cf-assets.www.cloudflare.com/slt3lc6tev37/66yV5siqmSYsx6u1POPxb7/84757b4c8a9941ac80fa4efae9a0cf79/cloudflare-helps-obligations-europe-whitepaper.pdf)
- [Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/)
- [About Web Analytics](https://developers.cloudflare.com/web-analytics/about/)
- [Web Analytics data origin and collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/)
- [RUM beacon](https://developers.cloudflare.com/speed/observatory/rum-beacon/)
- [About Cloudflare Logs](https://developers.cloudflare.com/logs/about/)
- [Logs FAQ](https://developers.cloudflare.com/logs/faq/general-faq/)
- [Logpush](https://developers.cloudflare.com/logs/logpush/)
- [Logpush pricing](https://developers.cloudflare.com/logs/logpush/pricing/)
- [HTTP requests dataset](https://developers.cloudflare.com/logs/logpush/logpush-job/datasets/zone/http_requests/)
- [Workers Logpush](https://developers.cloudflare.com/workers/observability/logs/logpush/)
- [Logpull](https://developers.cloudflare.com/logs/logpull/)
- [Logpull basics](https://developers.cloudflare.com/logs/logpull/understanding-the-basics/)
- [Enabling log retention](https://developers.cloudflare.com/logs/logpull/enabling-log-retention/)

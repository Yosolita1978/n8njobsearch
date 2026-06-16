// Self-paced course content for the n8n job-hunter course.
// The lesson renderer reads this; progress is tracked in localStorage by lesson id.
// Snippet code uses String.raw so backslashes in the regexes are preserved verbatim.
//
// Types live in ./types so the renderer and this data share one definition.
// Any learner-facing string may contain the token "{role}"; the renderer swaps
// it for the learner's saved target role at display time.

import type { Module } from "./types";

export const modules: Module[] = [
  {
    id: "m2-first-data",
    title: "Move one piece of data",
    outcome:
      "After this you can run a node, read the data moving between nodes, and write a basic expression.",
    lessons: [
      {
        id: "l2-1-items",
        moduleId: "m2-first-data",
        title: "Everything is a list of items",
        estMinutes: 10,
        device: "laptop",
        why: "n8n passes data between steps as a list of items. Each item is a small package of data. Most nodes run once for each item they receive. This one idea explains almost everything later, including the worst bug in the course.",
        steps: [
          "Open n8n and create a new workflow.",
          "Add a Schedule Trigger node. This is how an automation starts on its own, on a timer.",
          "Click Execute Step and open the output panel on the right.",
          "Read the output. It is one item, shaped as a small block of data under a json field. That shape is what flows between every node.",
        ],
        snippets: [
          {
            label: "The shape of one item",
            code: String.raw`{
  "json": {
    "timestamp": "2026-06-09T13:00:00.000Z"
  }
}`,
          },
        ],
        images: [
          {
            src: "/images/trigger-input.png",
            caption:
              "The Schedule Trigger settings panel. Match this setup before you run the step.",
            afterStep: 2,
          },
        ],
        tryIt:
          "Run the Schedule Trigger once and find the timestamp in the output panel. That panel is where you will check your work for the rest of the course.",
        check:
          "You can point to one item in the output panel and read a value inside its json.",
      },
      {
        id: "l2-2-expressions",
        moduleId: "m2-first-data",
        title: "Write your first expression",
        estMinutes: 10,
        device: "laptop",
        why: "An expression is a small piece of code inside double curly braces that pulls a value out of the data flowing in. It is how one node uses what another node produced.",
        steps: [
          "Add an Edit Fields (Set) node after the Schedule Trigger.",
          "Add one field. Each field has two boxes: a Name on the left and a Value on the right. In the Name box, type greeting.",
          "Now look at the Value box, just to the right of the Name. Click the small fx toggle on that Value box to switch it from a fixed value into expression mode.",
          "With that Value box in expression mode, paste the expression below into it. This is where the expression goes: the Value box of the greeting field, not the Name.",
          "Execute the step and read the greeting in the output panel. The part inside the braces is replaced by the real timestamp.",
        ],
        images: [
          {
            src: "/images/set-node-expression.png",
            caption:
              "The greeting field on the Set node. The Name (greeting) is on the left; the expression goes in the Value box on the right, with its fx toggle switched on for expression mode.",
            afterStep: 3,
          },
        ],
        snippets: [
          {
            label: "Paste this into the greeting field's Value box (expression mode)",
            code: String.raw`Hello, this run started at {{ $json.timestamp }}`,
          },
        ],
        tryIt:
          "In that same Value box, change the greeting so it includes {role} as plain text and still keeps the timestamp from the expression. Confirm both show up in the output.",
        check:
          "The output shows a greeting with a live value pulled in by the expression.",
        pitfall: {
          title: "$json is the current item",
          body: "$json always means the data coming into this node right now. When you need data from an earlier node by name, you use $('Node Name') instead. You will do that soon.",
        },
      },
    ],
  },
  {
    id: "m3-real-data",
    title: "Bring real data in",
    outcome:
      "After this you can call a search API and turn its response into a clean list of job links.",
    lessons: [
      {
        id: "l3-1-search",
        moduleId: "m3-real-data",
        title: "Call a search API",
        estMinutes: 13,
        device: "laptop",
        why: "Searching Google directly from a script is fragile and against its terms. A search API does it properly and hands back clean results. You will search for {role} and get a list of hits.",
        steps: [
          "Sign up for a SerpApi account and copy your API key. The sign-up link is below.",
          "Add an HTTP Request node after your trigger.",
          "Set Method to GET and the URL to SerpApi's search endpoint: https://serpapi.com/search.json. Leave Authentication as None.",
          "Turn on Send Query Parameters, and leave Specify Query Parameters as Using Fields Below. You now add each parameter as a Name and a Value pair, using the plus on the right.",
          "Add a parameter named engine with the value google. This tells SerpApi which search engine to use.",
          "Add a parameter named q. This is the search itself. Paste the query below as its value, then adjust it to look for {role} on the site you chose.",
          "Add a parameter named api_key, and paste your own SerpApi key as its value.",
          "Execute the step and open the output. Look for organic_results, the list of search hits.",
        ],
        images: [
          {
            src: "/images/http-serpapi-config.png",
            caption:
              "The full HTTP Request setup: GET, URL https://serpapi.com/search.json, Authentication None, Send Query Parameters on, and three parameters — engine = google, q = your search query, and api_key = your own SerpApi key.",
            afterStep: 4,
          },
        ],
        links: [{ label: "Open SerpApi", href: "https://serpapi.com/" }],
        snippets: [
          {
            label: "Value for the q parameter (your search query)",
            code: String.raw`site:teamedforlearning.com instructional designer remote`,
          },
        ],
        tryIt:
          "Change the q parameter to a search for {role}. Run it and confirm organic_results comes back with real hits.",
        check:
          "The output panel contains an organic_results list with entries that look like real postings.",
        pitfall: {
          title: "Read the shape before you trust it",
          body: "APIs do not always return what you expect. Before building on a response, open the output and confirm the field you want is actually there and is the shape you think it is.",
        },
      },
      {
        id: "l3-2-parse",
        moduleId: "m3-real-data",
        title: "Filter to real job links",
        estMinutes: 12,
        device: "laptop",
        why: "Search results include more than job pages. A Code node lets you keep only the real postings and reshape them into clean items with just the fields you need.",
        steps: [
          "Add a Code node after the HTTP Request.",
          "Set its mode to Run Once for All Items, because you are returning a new list.",
          "Paste the snippet below. It checks the response is the shape you expect, keeps only links that look like job pages, and returns a tidy item for each.",
          "Execute the step and read the cleaned list in the output.",
        ],
        images: [
          {
            src: "/images/code-node-mode-all-items.png",
            caption:
              "The Code node's Mode set to Run Once for All Items — the right mode when you return a new list instead of editing one item at a time.",
            afterStep: 2,
          },
        ],
        snippets: [
          {
            label: "Code node: keep only job links",
            code: [
              "const results = $input.first().json.organic_results;",
              "if (!Array.isArray(results)) {",
              "  throw new Error(`Expected organic_results array, got ${typeof results}. Check the SerpApi response.`);",
              "}",
              "",
              "return results",
              "  .filter((r) => r.link && r.link.includes('/job-post/'))",
              "  .map((r) => ({",
              "    json: {",
              "      title: r.title || '',",
              "      url: r.link || '',",
              "      snippet: r.snippet || '',",
              "    },",
              "  }));",
            ].join("\n"),
          },
        ],
        asides: [{
          title: "Did you know?",
          body: [
            "A Code node runs in one of two modes, and that choice decides what your code receives and what it must return.",
            "Run Once for All Items runs your code a single time for the whole batch. You read every incoming item at once with $input.all(), and you return a new array of items. Reach for it when you filter, reshape, or change how many items there are — exactly what you are doing here, where many search results become a shorter list of clean job links.",
            "Run Once for Each Item runs your code once per item. You get a single item with $input.item and return one item. Reach for it when each item is transformed on its own and the count stays the same: one in, one out.",
            "Rule of thumb: if your code returns a list or changes the item count, use Run Once for All Items. If it edits one item at a time without adding or dropping any, use Run Once for Each Item. Handing an array to Each Item mode is the most common Code node error, because that mode expects exactly one item.",
          ],
        }],
        tryIt:
          "Find the .filter(...) line in the snippet. It keeps only links whose URL contains /job-post/, which is how Teamed marks a real job page. Open one real posting on your chosen site and look at its web address: replace /job-post/ with whatever path your site uses for a posting. Run the node and confirm only real postings remain, each with a title and a url.",
        check:
          "The output is a clean list where every item is an actual job posting with a title and url.",
        pitfall: {
          title: "Match the Code node mode to the data",
          body: "This node returns a list, so it must run in Run Once for All Items. Run Once for Each Item expects one item at a time and will error here. Pick the mode that matches the shape you return.",
        },
      },
    ],
  },
  {
    id: "m4-messy-pages",
    title: "Read messy pages",
    outcome:
      "After this you can pull structured facts out of a raw web page and filter on them, keeping the nuance instead of throwing it away.",
    lessons: [
      {
        id: "l4-1-fetch",
        moduleId: "m4-messy-pages",
        title: "Fetch the raw page",
        estMinutes: 10,
        device: "laptop",
        why: "This is your second HTTP Request, and it does a different job from the first. The first one searched SerpApi and handed back a list where each job is just a title, a link, and a one-line snippet — not enough to judge a role. To really read a posting you need the page it points to. So this node visits each job's own URL and downloads the full page as raw HTML, which the next steps will read for the work model and the full description.",
        steps: [
          "Add a second HTTP Request node after your Code node. The first one searched; this one opens each job page.",
          "Set Method to GET. In the URL field, click the fx toggle and enter the expression below. Because this node runs once per item, the expression resolves to a different job link on each run.",
          "Open Options, add the Response section, and set Response Format to Text. This is the setting people miss: without it n8n tries to parse the page and you lose the raw HTML.",
          "In Put Output in Field, type data. That is the field name the raw HTML lands in, which is why later steps read it from json.data.",
          "Execute the step and confirm the raw HTML lands in the data field of each item.",
        ],
        images: [
          {
            src: "/images/http-fetch-response-text.png",
            caption:
              "The second HTTP Request: Method GET, URL set to the expression {{ $json.url }} (note the real job link previewed below it), and under Options → Response, Response Format = Text with Put Output in Field = data.",
            afterStep: 4,
          },
        ],
        snippets: [
          {
            label: "Put this in the URL field (expression mode)",
            code: String.raw`{{ $json.url }}`,
          },
        ],
        asides: [{
          title: "What is {{ $json.url }}?",
          body: [
            "$json is the item flowing into this node right now. Each item here is one cleaned job from the previous Code node, shaped like { url, title, snippet }. So $json.url reads the url field of that one job.",
            "The double curly braces tell n8n to evaluate the code inside them instead of treating it as plain text. {{ $json.url }} therefore becomes the actual job link, for example https://www.teamedforlearning.com/job-post/....",
            "Because an HTTP Request runs once for each item it receives, $json points at a different job on each run. One expression, many pages: the node fetches every job's page in turn.",
          ],
        }],
        tryIt:
          "Run the fetch on your own list of links and confirm you can see real page HTML in the data field of each item.",
        check: "Each item now carries the raw HTML of its job page in json.data.",
        pitfall: {
          title: "Response Format must be Text",
          body: "If you leave the default, n8n tries to parse the response and you lose the raw HTML you need. Set Response Format to Text so the page arrives as a plain string in data.",
        },
      },
      {
        id: "l4-2-keep-remote",
        moduleId: "m4-messy-pages",
        title: "Keep only remote",
        estMinutes: 12,
        device: "laptop",
        why: "Now you filter. Teamed shows the work model as a label on the page. You read that label and keep only the fully remote roles, dropping hybrid and on-site.",
        steps: [
          "Add a Code node after the fetch, in Run Once for All Items mode. Name it Remote Gate, the name later modules will reference.",
          "For each item, read the HTML out of json.data.",
          "Find the work-model label with the snippet below, and keep the item only when it reads Remote.",
          "Execute and confirm hybrid and on-site postings have dropped out.",
        ],
        snippets: [
          {
            label: "Code node: find the work-model label and keep remote",
            code: String.raw`const results = [];
for (const item of $input.all()) {
  const html = item.json.data;
  if (typeof html !== 'string') {
    throw new Error('Expected raw HTML in json.data. Set the fetch Response Format to Text.');
  }
  const labelMatch = html.match(/<div class="job-main-detail">[\s\S]*?<label>\s*([\s\S]*?)\s*<\/label>/i);
  if (!labelMatch) throw new Error('Could not find the work-model label.');
  const workModel = labelMatch[1].split('|')[0].trim();
  if (workModel.toLowerCase() !== 'remote') continue; // drop hybrid and on-site
  results.push({ json: { url: item.json.url, work_model: workModel } });
}
return results;`,
          },
        ],
        tryIt:
          "If your chosen site marks remote work differently, find where it lives in the page and adjust the match. Run it and confirm only remote roles remain. Not sure where it lives? Paste a chunk of your job page's HTML into n8n's AI assistant, or open the Ask AI tab on the Code node, and ask it to find the work-model marker for your site and update the match — it can read the HTML and adjust the selector for you.",
        check: "Only fully remote postings survive this step.",
        pitfall: {
          title: "Real data has no neat flag",
          body: "Teamed's structured data has no machine-readable remote field, so you read the visible label instead. This is normal. You scrape what is actually on the page, not what you wish were there.",
        },
      },
      {
        id: "l4-3-flag-dont-drop",
        moduleId: "m4-messy-pages",
        title: "Flag, do not drop",
        estMinutes: 13,
        device: "laptop",
        why: "Some remote jobs quietly want you local, relocated, or traveling to an office. Dropping them loses good roles. Flagging them keeps the role visible and tells you to read closely. You also pull the clean job details out of the page's structured data.",
        steps: [
          "Replace the body of your Remote Gate node with the full gate below. It does everything the last step did, plus the details.",
          "It parses the page's JSON-LD to get the structured JobPosting with the title and description.",
          "It scans the description for caveat language like must be local, relocate, or travel to our offices.",
          "When it finds it, it sets a location_caveat flag and keeps the snippet that triggered it, without dropping the item.",
          "Execute and read the results: one clean item per remote job, with the flag attached.",
        ],
        snippets: [
          {
            label: "Code node: the full remote gate",
            code: String.raw`// Remote gate — Mode: Run Once for All Items
// Keeps fully-remote jobs, flags location caveats, and exposes the full
// job description so the cover-letter step can use it later.

const results = [];

const caveatPatterns = [
  /candidates?\s+local\s+to/i,
  /local\s+to\s+our/i,
  /top\s+consideration\s+will\s+be\s+given\s+to\s+candidates\s+local/i,
  /preference\s+(?:will\s+be\s+)?given\s+to\s+(?:local|candidates\s+local)/i,
  /must\s+(?:be\s+)?(?:located|based|reside|live)\s+(?:in|within|near)/i,
  /relocat/i,
  /travel\s+to\s+(?:our\s+)?offices?/i,
];

function findCaveat(text) {
  for (const re of caveatPatterns) {
    const m = text.match(re);
    if (m) {
      const start = Math.max(0, m.index - 30);
      return text.slice(start, m.index + m[0].length + 60).trim();
    }
  }
  return null;
}

for (const item of $input.all()) {
  const html = item.json.data;
  if (typeof html !== 'string') {
    throw new Error('Expected raw HTML in json.data. Set the Fetch job page HTTP Request "Response Format" to Text.');
  }

  const labelMatch = html.match(
    /<div class="job-main-detail">[\s\S]*?<label>\s*([\s\S]*?)\s*<\/label>/i
  );
  if (!labelMatch) {
    throw new Error('Could not find the work-model label. Paste the raw HTML so I can adjust the selector.');
  }

  const workModel = labelMatch[1].split('|')[0].trim();
  if (workModel.toLowerCase() !== 'remote') {
    continue;
  }

  const blocks = [...html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )].map((m) => m[1].trim());

  let job = null;
  for (const block of blocks) {
    let parsed;
    try { parsed = JSON.parse(block); } catch { continue; }
    if (parsed && parsed['@type'] === 'JobPosting') { job = parsed; break; }
  }

  const descText = ((job && job.description) || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const caveat = findCaveat(descText);

  const org = job && job.hiringOrganization;
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/i) || [])[1] || null;

  results.push({
    json: {
      title: (job && job.title) || null,
      company: (org && typeof org === 'object' ? org.name : org) || null,
      url: canonical || item.json.url || null,
      date_posted: (job && job.datePosted) || null,
      work_model: workModel,
      is_remote: true,
      location_caveat: Boolean(caveat),
      caveat_reason: caveat,
      description: descText,   // full job text, used later by the cover-letter step
    },
  });
}

return results;`,
          },
        ],
        tryIt:
          "Run the full gate on postings for {role}. Find one that is remote but mentions being local or traveling, and confirm it stays in the list with location_caveat set to true. Adapting this to another site? The label match and the JSON-LD parsing are the parts that change. Paste a sample of your page's HTML into n8n's AI assistant, or use the Ask AI tab on the Code node, and ask it to locate the work model and the JobPosting data for your site and rewrite the matches — then test on one page before you trust it.",
        check:
          "Your output is a clean list of remote jobs, and any with a location catch are flagged rather than removed.",
        pitfall: {
          title: "Flag, do not drop",
          body: "A binary keep-or-remove filter throws away good roles that mention occasional travel. Encoding the nuance as a flag keeps the decision with you, where it belongs.",
        },
      },
    ],
  },
  {
    id: "m5-memory",
    title: "Give it memory",
    outcome:
      "After this you can stop a workflow from finding the same jobs every day, using a natural key.",
    lessons: [
      {
        id: "l5-1-table",
        moduleId: "m5-memory",
        title: "Make a place to remember",
        estMinutes: 12,
        device: "laptop",
        why: "A workflow with no memory finds the same jobs every morning and alerts you about all of them again. Memory is a table that records what you have already seen, so you only hear about new matches for {role}. The url is the natural key, the one value that is unique to each posting.",
        steps: [
          "Create a free Supabase project. The sign-up link is below.",
          "Open the SQL editor and run the snippet below to create the job_alerts table.",
          "Notice url is marked UNIQUE. That is what lets the workflow tell new from already-seen.",
          "Now connect n8n to it: add a Supabase credential. It needs two values from your project — a Host and a Service Role Secret.",
          "In Supabase, open Project Settings (the gear in the left sidebar), then the API section. Copy the Project URL into Host, and copy the service_role key (under Project API keys — click to reveal it) into Service Role Secret.",
          "Leave Allowed HTTP Request Domains as All and save. n8n shows Connection tested successfully when the Host and secret are right.",
        ],
        images: [
          {
            src: "/images/supabase-auth.png",
            caption:
              "The Supabase credential in n8n: Host is your project URL (ends in .supabase.co), and Service Role Secret is the service_role key. Connection tested successfully means both are correct.",
            afterStep: 4,
          },
        ],
        links: [{ label: "Open Supabase", href: "https://supabase.com/" }],
        snippets: [
          {
            label: "Create the job_alerts table",
            code: String.raw`create table public.job_alerts (
  id bigint generated always as identity primary key,
  title text,
  url text unique,                                 -- the natural key used for dedup
  score integer,
  reason text,
  found_at timestamp with time zone default now(),
  location_caveat boolean not null default false,
  caveat_reason text
);`,
          },
        ],
        asides: [{
          title: "Where to find Host and the Service Role Secret",
          body: [
            "In a brand-new Supabase project, both values live in the same place. Click the gear (Project Settings) in the left sidebar, then open the API section.",
            "Project URL is your Host — copy it exactly, including the https:// and the .supabase.co ending. Under Project API keys you will see more than one key; the one you want is service_role, marked secret. Reveal it, copy it, and paste it into Service Role Secret.",
            "The service_role key can read and write your whole database, so treat it like a password: it belongs only in this n8n credential, never in a screenshot or a shared file.",
          ],
        }],
        tryIt:
          "Run the snippet, then open the table editor and confirm job_alerts exists with no rows yet, ready to fill.",
        check:
          "The job_alerts table exists in your Supabase project and has a url column marked unique.",
        pitfall: {
          title: "Pick a natural key on purpose",
          body: "url is unique per posting, so it is the honest key for new versus seen. Choosing the right key here is what makes deduplication reliable later.",
        },
      },
      {
        id: "l5-2-dedup",
        moduleId: "m5-memory",
        title: "Skip what you have already seen",
        estMinutes: 18,
        device: "laptop",
        why: "Now you teach the workflow to skip jobs it has already saved. It reads everything already in the table, then keeps only the remote postings that are not in there yet.",
        steps: [
          "Add a Supabase node. Set Resource to Row, Operation to Get Many, and Table Name or ID to job_alerts — the memory table you created last lesson. Turn Return All on, and name the node Get many rows.",
          "Add a Code node after it, in Run Once for All Items mode. Name it Check for new alerts.",
          "Paste the snippet. It reads three things — the urls already in the table, the urls that passed the Remote Gate, and the scraped jobs that still carry their snippet — then keeps only the scraped jobs that are both remote and brand new. It refers to those nodes by name (Get many rows, Remote Gate, Code in JavaScript), so rename them in the code if yours differ.",
        ],
        images: [
          {
            src: "/images/supabase-config.png",
            caption:
              "The Get many rows node. job_alerts is the table you created last lesson, selected here in Table Name or ID. With Resource Row, Operation Get Many, and Return All on, the node hands back every row already saved — your already-seen list.",
            afterStep: 1,
          },
        ],
        snippets: [
          {
            label: "Check for new alerts (Code node)",
            code: String.raw`// Jobs already saved in the database.
const existingUrls = $('Get many rows').all().map(item => item.json.url);

// URLs that PASSED the remote filter (Remote Gate output).
const remoteUrls = $('Remote Gate').all().map(item => item.json.url);

// The scraped jobs WITH their snippet (the early parse node).
const scraped = $('Code in JavaScript').all();

// Keep only jobs that are BOTH remote AND brand new.
const newJobs = scraped.filter(item =>
  remoteUrls.includes(item.json.url) &&     // must have survived the Remote Gate
  !existingUrls.includes(item.json.url)     // must not already be in the DB
);

if (newJobs.length === 0) {
  return [{ json: { skip: true } }];
}

return newJobs;`,
          },
        ],
        tryIt:
          "Run the workflow. With the table still empty, every remote job should pass through as new. You have built the mechanism that will skip them once they are saved.",
        check:
          "The Check for new alerts node returns your remote jobs while the table is empty, ready for the guard you add next.",
        pitfall: {
          title: "Read the scraped list, but guard it with the gate",
          body: "This keeps items from the scraped node because they still carry the snippet you want later. On its own that raw list includes on-site jobs, so the remoteUrls.includes check guards it: a job survives only if its url also passed the Remote Gate. Remote and new — both checks together.",
        },
      },
      {
        id: "l5-3-guard",
        moduleId: "m5-memory",
        title: "Stop when nothing is new",
        estMinutes: 8,
        device: "laptop",
        why: "Most mornings there will be nothing new. Without a guard, the workflow would still run the AI scoring and fire alerts on an empty hand — wasted calls, and sometimes errors. So right after Check for new alerts you add an IF that only lets real new jobs through and quietly stops the run when there is nothing to do.",
        steps: [
          "Add an IF node right after Check for new alerts.",
          "Add one condition. On the left, switch to expression mode and enter {{ $json.skip }}. Set the operator to is not equal to, and the value on the right to true.",
          "Leave Convert types where required on, so the text true compares cleanly.",
          "Wire the true output onward to the rest of the workflow — scoring comes next. Leave the false output unconnected: that is the nothing-new case, and the run simply ends there.",
        ],
        images: [
          {
            src: "/images/code-if-setup.png",
            caption:
              "The IF condition: {{ $json.skip }} is not equal to true, with Convert types where required on. Real jobs (no skip field) take the true branch; the nothing-new flag takes the false branch.",
            afterStep: 2,
          },
        ],
        snippets: [
          {
            label: "The IF condition (left side, expression mode)",
            code: String.raw`{{ $json.skip }}`,
          },
        ],
        asides: [{
          title: "What is {{ $json.skip }}, and what is the IF reading?",
          body: [
            "The Check for new alerts node sends one of two things into this IF. When there are new jobs, it sends those scraped job items, each with a url, a title, and a snippet. When there is nothing new, it sends a single item shaped { json: { skip: true } } — a small flag, not a job.",
            "{{ $json.skip }} reads the skip field of the current item. On a real job that field does not exist, so it is empty; on the nothing-new flag it is true. That one field is how the workflow tells the two cases apart.",
            "So the IF asks: is skip not equal to true? Real jobs answer yes and leave on the true branch toward scoring. The flag answers no and leaves on the false branch, which you leave unwired so the run quietly ends.",
          ],
        }],
        tryIt:
          "With your table still empty, run the workflow and watch real jobs leave the IF on the true branch. Then force the other case: run it again once those jobs are saved, or temporarily feed the skip flag, and confirm the run stops at the IF.",
        check:
          "Real new jobs continue past the IF on the true branch, and when there is nothing new the workflow stops at the IF.",
        pitfall: {
          title: "The true branch is the one that continues",
          body: "It is easy to wire the wrong output. Here the condition is skip is not equal to true, so real jobs make it true and must leave on the true output. The false output is the nothing-new flag, and you leave it unwired on purpose.",
        },
      },
    ],
  },
  {
    id: "m6-ai-score",
    title: "Let AI judge",
    outcome:
      "After this you can use a model to score jobs and read its output safely, then save the results.",
    lessons: [
      {
        id: "l6-1-score",
        moduleId: "m6-ai-score",
        title: "Score each job with AI",
        estMinutes: 15,
        device: "laptop",
        why: "A model can read a posting and give each job a score from 0 to 10 with a short reason. That turns a long list into a ranked one, so you spend attention on the best matches for {role}.",
        steps: [
          "Add an AI Agent node after your IF guard.",
          "Attach an OpenAI Chat Model node to the agent as its model. The agent uses the model to produce the answer.",
          "The first time, the model node asks for an OpenAI credential. Create one and paste your OpenAI API key into the API Key field — that is the only required field. Leave Base URL as the default. n8n shows Connection tested successfully when the key is valid.",
          "In the agent's system prompt, describe what a strong and a weak match looks like for {role}, and demand the answer as strict JSON. The example below is a real one: it leads with hard filters, then the signals to score higher, then the exact JSON shape.",
          "Execute and read the output. It arrives as a string of JSON in the output field.",
        ],
        images: [
          {
            src: "/images/openai-config.png",
            caption:
              "The OpenAI credential in n8n. Paste your key into API Key — the only required field — and leave Base URL as https://api.openai.com/v1. Connection tested successfully means the key works.",
            afterStep: 3,
          },
        ],
        links: [
          {
            label: "Get an OpenAI API key",
            href: "https://platform.openai.com/api-keys",
          },
        ],
        snippets: [
          {
            label: "A real scoring prompt (adapt the identity and filters to you)",
            code: String.raw`You are a job-relevance scoring agent for Cristina, a software engineer and curriculum developer looking for remote AI/EdTech instructional design and curriculum development roles in the USA.

Score each job 1-10. Apply these HARD FILTERS first — if any apply, score 1:
- K-12 focused = score 1
- On-site or in-office only = score 1
- Math-specific curriculum = score 1
- Manager or director level = score 1
- Located outside the USA = score 1

Score HIGHER for:
- Contract or part-time = high
- Remote = high
- AI, EdTech, or instructional design focus = high
- Curriculum developer or instructional designer title = high
- Entry to mid level = high

Respond ONLY in this exact JSON format:
{"score": 8, "reason": "Short explanation", "title": "the job title", "url": "the url"}`,
          },
        ],
        asides: [
          {
            title: "Why two nodes: the agent and the model",
            tone: "violet",
            after: "steps",
            body: [
              "You added two nodes for one job, which surprises people. The AI Agent is the orchestrator — it holds the system prompt, runs the request, and can use tools. The OpenAI Chat Model is the brain you plug into it: the actual model that reads the text and writes the answer.",
              "You connect the model underneath the agent, not in the main flow. Think of it as giving the agent an engine. Later you could swap the engine for a different model without changing anything else.",
            ],
          },
          {
            title: "Anatomy of a good scoring prompt",
            body: [
              "Who you are and what you want. The first line names the role, the focus areas, and the location, so every score is judged against you and not a generic candidate.",
              "Hard filters first. These are the deal-breakers that should always score 1 — wrong level, wrong location, wrong audience. Listing them up top stops the model from being charitable about a job that is clearly not for you.",
              "Soft signals next. The things that push a score up rather than disqualify it. This is where your real preferences live, so spend your editing time here.",
              "A strict output shape. Ending with the exact JSON, and the word ONLY, is what lets the next step parse the answer. Without it the model adds chatty text and the parse downstream breaks.",
            ],
          },
          {
            title: "Keep the cost (and surprises) down",
            tone: "emerald",
            body: [
              "Scoring is cheap, but a few habits keep it that way. Pick a small, fast model like gpt-4o-mini on the Chat Model node — it scores job postings well for a fraction of the price of the largest models.",
              "Set the model's temperature low, near 0. You want consistent scores for the same job, not creativity, so a low temperature makes the agent answer the same way each run.",
              "Test on a single job before you run the whole list. Scoring one posting costs a fraction of a cent, so iterate the prompt there first, then let it loose on the full batch.",
            ],
          },
        ],
        tryIt:
          "Adapt the example prompt to {role} — your identity line, your hard filters, your higher-score signals — keeping the strict JSON at the end. Run it and read three of the reasons to see if you agree.",
        check:
          "Each job comes out with a score and a one-sentence reason in the output field.",
        pitfall: {
          title: "The output is a string, not an object",
          body: "The model returns JSON as text. To read a field downstream you parse it first with JSON.parse(...). Reading it as if it were already an object gives you undefined.",
        },
      },
      {
        id: "l6-2-save",
        moduleId: "m6-ai-score",
        title: "Save the scored jobs",
        estMinutes: 15,
        device: "laptop",
        why: "Now write each scored job into your table so the workflow remembers it. Because the previous node handed you JSON as text, you parse it as you map each field.",
        steps: [
          "Add a Supabase node set to Create a Row in job_alerts. Name it Create a row.",
          "Map each column from the parsed AI output, as in the snippet.",
          "For the caveat fields, look them up from your gate by matching the url, since the AI node does not carry that data through.",
          "Run the whole workflow, then run it a second time. This time the dedup step finds nothing new, because the jobs are now saved.",
        ],
        images: [
          {
            src: "/images/supabase-create-row-mapping.png",
            caption:
              "The Create Row mapping: Operation Create, Table job_alerts, and every Field Value an expression. title, url and score parse the AI answer with JSON.parse; the caveat fields (below the fold) pull from the Remote Gate node instead.",
            afterStep: 2,
          },
        ],
        snippets: [
          {
            label: "Map each column from the parsed output",
            code: String.raw`title           = {{ JSON.parse($json.output).title }}
url             = {{ JSON.parse($json.output).url }}
score           = {{ Number(JSON.parse($json.output).score) }}
reason          = {{ JSON.parse($json.output).reason }}
location_caveat = {{ $('Remote Gate').all().find(g => g.json.url === JSON.parse($json.output).url)?.json.location_caveat }}
caveat_reason   = {{ $('Remote Gate').all().find(g => g.json.url === JSON.parse($json.output).url)?.json.caveat_reason }}`,
          },
        ],
        asides: [
          {
            title: "Two kinds of value: parse it, or fetch it from another node",
            body: [
              "Look at the mapping and you will see two shapes of expression. The first kind, like {{ JSON.parse($json.output).title }}, pulls a field out of the AI node's answer. The agent returns its result as a JSON string in output, so you JSON.parse that text before you can read a field from it.",
              "The second kind, like {{ $('Remote Gate')...location_caveat }}, fetches a value the AI never saw. location_caveat and caveat_reason were worked out earlier in the Remote Gate node, not by the model, so they are simply not in the AI output. Instead of parsing, you reach back to that node by name with $('Remote Gate') and read the field directly — it is already real data there, no JSON.parse needed.",
              "Rule of thumb: JSON.parse when the value arrives as text (the AI output); reference the node by name when the value lives on another node as ordinary data. Here we also match by url, with find(g => g.json.url === ...), rather than by item position — so the right caveat always sticks to the right job even after the AI node.",
            ],
          },
        ],
        tryIt:
          "Run the workflow twice. Confirm the first run saves rows in job_alerts, and the second run's dedup step returns nothing new.",
        check:
          "Your scored jobs appear as rows in job_alerts, and a second run adds no duplicates.",
        pitfall: {
          title: "No backticks around an expression",
          body: "Wrapping a value in backticks stores literal backtick characters in the database. The expression is the whole value. Type it without decoration.",
        },
      },
    ],
  },
  {
    id: "m7-deliver",
    title: "Send it somewhere useful",
    outcome: "After this you can deliver one result to several places at once.",
    lessons: [
      {
        id: "l7-1-telegram",
        moduleId: "m7-deliver",
        title: "Send the alert to your phone",
        estMinutes: 13,
        device: "laptop",
        why: "A saved row helps no one if you never see it. A Telegram bot can ping your phone the moment a new job is scored, with the score, the reason, and a link.",
        steps: [
          "In Telegram, open a chat with BotFather (the official bot). Send /newbot, give it a name and a username ending in bot, and BotFather replies with your bot token. Copy it.",
          "Add a Telegram credential in n8n. Paste the token into Access Token and leave Base URL as the default. n8n shows Connection tested successfully when the token is valid.",
          "Find your chat id — the note below shows the two quickest ways. This is the id the bot sends your alerts to.",
          "Add a Telegram Send a Text Message node after Create a row. Set Chat ID to your id, and write the message below with expressions for the title, score, and url.",
          "Run it and watch the alert arrive on your phone.",
        ],
        images: [
          {
            src: "/images/telegram-auth.png",
            caption:
              "The Telegram credential in n8n: paste the BotFather token into Access Token, leave Base URL as https://api.telegram.org. Connection tested successfully means the token works.",
            afterStep: 2,
          },
        ],
        links: [
          { label: "Open Telegram Web", href: "https://web.telegram.org/" },
          { label: "Open BotFather", href: "https://t.me/botfather" },
        ],
        snippets: [
          {
            label: "The alert message",
            code: String.raw`New match: {{ $json.title }}
Score: {{ $json.score }}
{{ $json.url }}`,
          },
        ],
        asides: [
          {
            title: "Getting your token and your chat id",
            body: [
              "The token comes from BotFather. In Telegram, open BotFather, send /newbot, and answer two questions — a display name and a username ending in bot. BotFather replies with a long token like 123456:ABC..., and that token is what goes in Access Token.",
              "The chat id is who the bot sends to: you. The quickest way is to message @userinfobot in Telegram, which replies with your numeric id. If you prefer, send any message to your own bot first, then open https://api.telegram.org/bot<your token>/getUpdates in a browser and read the chat.id field.",
              "The token is a password for your bot — keep it only in the n8n credential, never in a screenshot or a shared file.",
            ],
          },
        ],
        tryIt:
          "Wire the alert to your own bot and chat. Trigger the workflow and confirm a real message lands on your phone.",
        check:
          "A job alert with a score and a working link arrives in your Telegram.",
        pitfall: {
          title: "One node can feed many",
          body: "Create a row feeds the alert, the backup sheet, and the cover-letter branch at once. A single output can fan out to several nodes that all run.",
        },
      },
      {
        id: "l7-2-sheet",
        moduleId: "m7-deliver",
        title: "Keep a backup in a sheet",
        estMinutes: 12,
        device: "laptop",
        why: "A spreadsheet copy gives you a place to scan, sort, and share your matches for {role} outside the database.",
        steps: [
          "Add a Google Sheets credential, signed in with your Google account.",
          "Create a Google Sheet with a header row: Title, URL, Score, Reason (add Date Found and the caveat columns too if you want them).",
          "Add a Google Sheets node after Create a row. Set Resource to Sheet Within Document and Operation to Append Row.",
          "Point it at your sheet: set Document to By ID and paste your sheet's id (the note below shows where to find it), then set Sheet to By Name and pick your tab, like Sheet1.",
          "Set Mapping Column Mode to Map Each Column Manually. n8n lists your sheet's columns; set each one's value to an expression, as in the snippet.",
          "Run the workflow and confirm a new row appears in the sheet.",
        ],
        images: [
          {
            src: "/images/google-sheets-config.png",
            caption:
              "The Append Row node: Document By ID, Sheet by name, and Mapping Column Mode set to Map Each Column Manually — one box per sheet column, each filled with an expression from the saved row.",
            afterStep: 5,
          },
        ],
        snippets: [
          {
            label: "Values for each column (Map Each Column Manually)",
            code: String.raw`Title           = {{ $json.title }}
URL             = {{ $json.url }}
Score           = {{ $json.score }}
Reason          = {{ $json.reason }}
Date Found      = {{ $json.found_at }}
location_caveat = {{ $json.location_caveat }}
Why?            = {{ $json.caveat_reason }}`,
          },
        ],
        asides: [
          {
            title: "Finding the sheet id, and mapping columns by hand",
            body: [
              "Document is set By ID, and the id is in your sheet's web address. Open the sheet in a browser and look at the URL: docs.google.com/spreadsheets/d/THIS_PART/edit. The long string between /d/ and /edit is the id. Copy it into the Document field.",
              "Mapping Column Mode set to Map Each Column Manually means you decide what goes in each column instead of letting n8n guess. n8n reads your sheet's header row and shows one box per column; you fill each with an expression that pulls the matching field from the saved row, like {{ $json.score }} for the Score column.",
              "The column labels come from your sheet's first row, so they only need to match your own headers, not the database column names. That is why a column you label Why? can hold {{ $json.caveat_reason }} — the label is yours, the value is the field.",
            ],
          },
        ],
        tryIt:
          "Add your own columns if you want more detail, run it, and confirm the row lands in your sheet.",
        check: "Each scored job also appears as a row in your Google Sheet.",
        pitfall: {
          title: "Three Google services, one login",
          body: "Sheets, Docs, and Drive share a single Google sign-in in n8n. You do not set them up separately.",
        },
      },
    ],
  },
  {
    id: "m8-cover-letter",
    title: "Generate a real artifact",
    outcome:
      "After this you can generate a document grounded only in real data, with nothing invented.",
    lessons: [
      {
        id: "l8-1-resume",
        moduleId: "m8-cover-letter",
        title: "Bring in your resume",
        estMinutes: 8,
        device: "laptop",
        why: "A strong match for {role} deserves a tailored letter, and a good letter is grounded in your real experience. So the workflow needs your resume. You add it near the start of the chain so later steps can reach back to it.",
        steps: [
          "Put your resume in a Google Doc.",
          "Add a Google Docs node right after your trigger, near the top of the workflow. Set Resource to Document and Operation to Get, and name the node Read Resume.",
          "In Doc ID or URL, paste your resume doc's id or its full link (the note below shows where the id is). Turn Simplify on so the node returns clean text.",
          "Execute and confirm your resume text shows up in the content field — no parsing needed.",
        ],
        images: [
          {
            src: "/images/google-docs-get-resume.png",
            caption:
              "The Read Resume node: Resource Document, Operation Get, your resume's id in Doc ID or URL, and Simplify on so it returns the full text in a clean content field.",
            afterStep: 3,
          },
        ],
        snippets: [
          {
            label: "How you will reference it later",
            code: String.raw`{{ $('Read Resume').first().json.content }}`,
          },
        ],
        asides: [
          {
            title: "Where the doc id is, and why this node sits at the top",
            body: [
              "The id is in your document's web address. Open the resume in a browser: docs.google.com/document/d/THIS_PART/edit. The long string between /d/ and /edit is the id. You can paste either that id or the whole URL into Doc ID or URL.",
              "Why put this near the start? A node can only read another node's output with $('Node Name') when that node sits earlier on the same path. By reading the resume right after the trigger, every later step can reach back to it with {{ $('Read Resume').first().json.content }}, no matter how far down the chain it is.",
              "If you read the resume on a side branch or late in the flow instead, the cover-letter node would have nothing to reference, and the letter would fall back to invented experience.",
            ],
          },
        ],
        tryIt:
          "Add your own resume doc and confirm its full text shows up in the content field.",
        check: "Your resume text is available in the workflow, in content.",
        pitfall: {
          title: "You can only reference what is upstream",
          body: "A node can read another node's output with $('Name') only when that node sits earlier on the same path. That is why the resume is read near the start, not on a side branch.",
        },
      },
      {
        id: "l8-2-write",
        moduleId: "m8-cover-letter",
        title: "Write a grounded cover letter",
        estMinutes: 15,
        device: "laptop",
        why: "For the strong matches, a model writes a first-person letter using only your real resume and the real job description. Grounding it this way keeps it honest, with no invented experience.",
        steps: [
          "Add an IF node off Create a row, alongside your alert. Add one condition: {{ $json.score }} is greater than or equal to 7. The true branch carries the strong matches that earn a cover letter.",
          "On the true branch, add an OpenAI node. Set Resource to Text and Operation to Message a Model, and pick a model.",
          "Add Message 1 with Role System, and paste the system prompt below — it sets the rules for the letter.",
          "Add Message 2 with Role User, and paste the user prompt below. It feeds the job title, company, and description (looked up from your gate by url) plus your resume, and tells the model how to sign off — swap the signature for your own.",
          "Execute and read the letter.",
        ],
        images: [
          {
            src: "/images/if-score-gate.png",
            caption:
              "The score gate: {{ $json.score }} is greater than or equal to 7, as a number comparison. Only jobs scoring 7 or higher take the true branch into the cover-letter step.",
            afterStep: 1,
          },
          {
            src: "/images/openai-message-model.png",
            caption:
              "The OpenAI node: Resource Text, Operation Message a Model, and two messages — Message 1 with Role System, Message 2 with Role User.",
            afterStep: 4,
          },
        ],
        snippets: [
          {
            label: "Message 1 — System prompt",
            code: String.raw`You are an expert career writer. Write concise, specific, genuine cover letters grounded ONLY in the candidate's real resume and the job description. No clichés, no generic filler, no invented experience. 250–350 words, first person, plain text (no markdown headings).`,
          },
          {
            label: "Message 2 — User prompt (grounded in real data)",
            code: String.raw`Write a tailored cover letter for this job, using only real details from my resume.

JOB TITLE: {{ $('Remote Gate').all().find(g => g.json.url === $json.url)?.json.title }}
COMPANY: {{ $('Remote Gate').all().find(g => g.json.url === $json.url)?.json.company }}

JOB DESCRIPTION:
{{ $('Remote Gate').all().find(g => g.json.url === $json.url)?.json.description }}

MY RESUME:
{{ $('Read Resume').first().json.content }}

Write it in first person, 250–350 words, specific to this role, ending with a short call to action. Plain text only.

ALWAYS sign the letter as:
Cristina Rodriguez
[LinkedIn](https://www.linkedin.com/in/crissrodriguez/) | [Portfolio](https://www.yosola.co/) | [GitHub](https://github.com/Yosolita1978)
yosola@gmail.com | 628-236-7431`,
          },
        ],
        tryIt:
          "Use your own resume and a real strong-match posting. Read the letter and check that every claim in it traces back to something real in your resume.",
        check: "A letter comes out grounded in your resume, with nothing invented.",
        pitfall: {
          title: "Ground it or it guesses",
          body: "Without the resume and description in the prompt, the model fills gaps with plausible invented experience. Passing the real text is what keeps the letter true.",
        },
      },
      {
        id: "l8-3-doc",
        moduleId: "m8-cover-letter",
        title: "Save it to a Google Doc",
        estMinutes: 12,
        device: "laptop",
        why: "Now you turn the letter into a document you can open, edit, and send, and you get a link to it on your phone. This works while only one job qualifies per run. You will see what happens with two, and fix it, in the next module.",
        steps: [
          "Add an Edit Fields (Set) node, Mode Manual Mapping, and name it Prep Doc. It holds two String fields the next nodes reuse.",
          "Add a field named letter and set its value to the model's output: {{ $json.output[0].content[0].text }}.",
          "Add a field named doc_title for the document's name, built from the job title as in the snippet.",
          "Add a Google Docs node, Resource Document, Operation Create. Set Title to {{ $json.doc_title }} and the Folder to your Cover Letters folder by id, in expression mode. Name it Create a document. Create makes an empty document and returns its id.",
          "Add a second Google Docs node, Operation Update. Set Doc ID or URL to {{ $json.id }} — the id Create just returned — then add an Insert action that puts the letter, {{ $('Prep Doc').first().json.letter }}, into the document body.",
          "Add a Telegram node to send yourself a link to the finished doc.",
        ],
        images: [
          {
            src: "/images/google-docs-create-folder.png",
            caption:
              "Step one of two: Google Docs Create. It makes an empty document — Title from {{ $json.doc_title }}, Folder set by id in expression mode — and returns the new document's id.",
            afterStep: 4,
          },
          {
            src: "/images/google-docs-update-insert.png",
            caption:
              "Step two of two: Google Docs Update. Doc ID or URL is {{ $json.id }} from Create, and an Insert action drops the letter ({{ $('Prep Doc').first().json.letter }}) into the document body.",
            afterStep: 5,
          },
        ],
        snippets: [
          {
            label: "Hold the letter and the title (Set node)",
            code: String.raw`letter    = {{ $json.output[0].content[0].text }}
doc_title = {{ "Cover Letter - " + $('Create a row').first().json.title }}`,
          },
          {
            label: "Link to the finished doc (Telegram)",
            code: String.raw`Cover letter ready for {{ $json.title }}
https://docs.google.com/document/d/{{ $('Create a document').first().json.id }}/edit`,
          },
        ],
        asides: [
          {
            title: "You cannot make and fill a doc in one step",
            body: [
              "You might expect a single node that creates a Google Doc with your letter already inside. There is not one. Google Docs Create only makes an empty document and hands back its id; a second node, Update, is what writes the letter into it.",
              "That is why these two always come as a pair: Create makes the empty file and returns its id, and Update takes that id (Doc ID or URL = {{ $json.id }}) and inserts the text. Create's output feeds Update's input.",
              "It is the same shape as a lot of real integrations — make the empty thing first, then populate it. Whenever a Create node will not accept your content, look for an Update or Insert node to follow it.",
            ],
          },
        ],
        tryIt:
          "Run it on one strong match and confirm a real document appears in your Drive folder, with a working link in your Telegram.",
        check:
          "A finished cover letter sits in your Drive, and its link arrives on your phone.",
        pitfall: {
          title: "Create returns id, not documentId",
          body: "Google Docs Create hands back the new document's id under the key id. Reach for documentId and you get an undefined link. Also, to set the folder by id you must switch that field to expression mode, since the dropdown rejects a pasted id.",
        },
      },
    ],
  },
  {
    id: "m9-loop",
    title: "The hard lesson",
    outcome:
      "After this you can explain why pairing and order break across an AI node, and fix it with a loop.",
    lessons: [
      {
        id: "l9-1-break",
        moduleId: "m9-loop",
        title: "Watch it break",
        estMinutes: 18,
        device: "laptop",
        why: "Build it once and it looks fine. The trap shows up the first morning two strong matches for {role} arrive together: both cover letters come out with the first job's title. This lesson asks you to do one thing — make that bug happen on purpose, so you see it with your own eyes. You fix it in the next lesson, not this one.",
        steps: [
          "Force two jobs to qualify in one run. Quickest way: open your score gate IF and lower it from 7 to 1 for a moment, so several jobs pass. (Or delete two rows from job_alerts so they count as new and get scored again.)",
          "Run the whole workflow once. Two jobs now reach the cover-letter step in the same run.",
          "Open both Google Docs it created, and look only at their titles.",
          "See the bug: both documents show the SAME title — the first job's — even though the letter inside each one is the correct, different letter.",
          "Put the score gate back to 7 when you are done. The bug is reproduced; you fix it in the next lesson.",
        ],
        snippets: [
          {
            label: "What you should see",
            code: String.raw`Two strong matches in ONE run:

  Job A  ┐
         ├──►  Write Cover Letter  ──►  Doc 1  →  "Cover Letter - Job A"   (wrong)
  Job B  ┘                              Doc 2  →  "Cover Letter - Job A"   (wrong)

  The letters inside are right (A and B).
  Only the TITLES collapse to the first job, because doc_title uses .first().`,
          },
          {
            label: "Why these both fail after an AI node",
            code: String.raw`// .first() always returns the first job, so every letter gets its title
$('Create a row').first().json.title

// $itemIndex looks right, but order is not preserved across the AI node either
$('Create a row').all()[$itemIndex].json.title`,
          },
        ],
        tryIt:
          "Force two strong matches in one run and confirm for yourself that both documents share the first job's title. Leave it broken — fixing it is the next lesson.",
        check: "You reproduced the bug: two letters, one shared wrong title.",
        pitfall: {
          title: "AI nodes break pairing and order",
          body: "Anything you reference across an AI node by position or by paired item can map to the wrong row. The fix is a different approach, not a cleverer index.",
        },
      },
      {
        id: "l9-2-loop",
        moduleId: "m9-loop",
        title: "Fix it with a loop",
        estMinutes: 22,
        device: "laptop",
        why: "The fix is to stop processing jobs in parallel and handle exactly one at a time. With a single job in flight, every reference is unambiguous again.",
        steps: [
          "Add a Loop Over Items node right after your score gate, set to batch size 1. Name it Loop Over Items.",
          "Move the cover-letter chain inside the loop, so it runs once per job.",
          "Change the document title to read from the current job in the loop, using $('Loop Over Items').first().json.url, not .first() of the saved rows. The snippet below also appends the company to the title.",
          "Wire the last node in the chain back to the Loop Over Items node so it iterates. Run two strong matches and confirm each gets its own correct title.",
        ],
        images: [
          {
            src: "/images/set-field-coverletter.png",
            caption:
              "The Set node after the fix. doc_title now looks up the current job by url from $('Loop Over Items'), so each iteration gets its own title and company — no more shared wrong title.",
            afterStep: 3,
          },
        ],
        snippets: [
          {
            label: "Reference the one job in the loop",
            code: String.raw`doc_title = {{ "Cover Letter - " + ($('Remote Gate').all().find(g => g.json.url === $('Loop Over Items').first().json.url)?.json.title || "Job") + " - " + ($('Remote Gate').all().find(g => g.json.url === $('Loop Over Items').first().json.url)?.json.company || "") }}`,
          },
        ],
        tryIt:
          "Run the same two strong matches again, now inside the loop, and confirm the titles match the letters.",
        check:
          "Two qualifying jobs produce two documents, each with its own correct title.",
        pitfall: {
          title: "The loop-back wire is what iterates",
          body: "Loop Over Items only repeats if the end of the chain wires back to it. Without that wire it runs once and stops.",
        },
      },
    ],
  },
  {
    id: "m10-operate",
    title: "Set it running",
    outcome: "After this it runs on its own, on a daily schedule — hands off.",
    lessons: [
      {
        id: "l10-1-schedule",
        moduleId: "m10-operate",
        title: "Set it loose on a schedule",
        estMinutes: 10,
        device: "laptop",
        why: "The workflow is built. Now it should run on its own each morning, hunting for {role} without you. The Schedule Trigger you started with is where you set that.",
        steps: [
          "Open your Schedule Trigger and set it to run once a day at a time that suits you.",
          "Save the workflow.",
          "Activate it with the toggle at the top.",
          "Confirm it shows as active. From now on it runs on its own.",
        ],
        tryIt:
          "Set your daily time, activate the workflow, and check back tomorrow for an alert.",
        check: "The workflow is active and scheduled to run on its own.",
        pitfall: {
          title: "Active is not the same as saved",
          body: "Saving keeps your edits. Activating is what makes the schedule actually fire. A saved but inactive workflow never runs on its own.",
        },
      },
    ],
  },
  {
    id: "m11-template",
    title: "Working from a template",
    outcome:
      "After this you can import the finished course workflow into your own n8n and make it yours.",
    lessons: [
      {
        id: "import-workflow",
        moduleId: "m11-template",
        title: "Import the finished workflow",
        estMinutes: 10,
        device: "laptop",
        why: "This is the finished workflow from the course, exported to a single file for you. You do not build or export anything here — you download this provided file, import it into your own n8n, and point it at your accounts. Use it as a ready-made template, a clean copy to compare against what you built, or a safety net if yours broke. n8n imports the structure and settings, but never the secrets, so you reconnect your own credentials after.",
        steps: [
          "Download the workflow file below. This is the complete course workflow, already exported for you — you do not export anything yourself.",
          "In your own n8n, open the Workflows list, click the three-dot menu at the top right, and choose Import from File. Pick the file you just downloaded.",
          "The whole workflow appears on your canvas, exactly like the picture. Open each node that shows a credential warning and reconnect it to your own credential: SerpApi on the HTTP Request, Supabase, OpenAI, Telegram, and Google.",
          "Swap in your own details: the search query, your scoring prompt, your resume doc id, your Cover Letters folder id, and your Telegram chat id.",
          "Run it once end to end and confirm a job flows through to a saved row and an alert.",
        ],
        images: [
          {
            src: "/images/complete-worlflow.png",
            caption:
              "The whole job hunter on one canvas — what you get after importing. Every node from the course, wired end to end.",
            afterStep: 2,
          },
        ],
        links: [
          { label: "SerpApi — job search API key", href: "https://serpapi.com/" },
          {
            label: "Supabase — database URL + service key",
            href: "https://supabase.com/",
          },
          {
            label: "OpenAI — API key for scoring and the letter",
            href: "https://platform.openai.com/api-keys",
          },
          {
            label: "Telegram BotFather — bot token",
            href: "https://t.me/botfather",
          },
          {
            label: "Google — Docs, Sheets, and Drive",
            href: "https://docs.google.com/",
          },
        ],
        asides: [
          {
            title: "The five credentials you reconnect",
            body: [
              "The imported workflow needs five connections, each set up once in n8n. The links above open each service; the lesson named in brackets is where the course walks it in full.",
              "SerpApi — the job search. Sign up, then copy your API key into the HTTP Request node's api_key. (Call a search API.)",
              "Supabase — the memory table. Create a project, run the table SQL, and add a Supabase credential with your project URL as Host and your service_role key. (Make a place to remember.)",
              "OpenAI — the scoring and the cover letter. Create an API key and add one OpenAI credential; both AI nodes share it. (Score each job with AI.)",
              "Telegram — the phone alert. Make a bot with BotFather, add a Telegram credential with the token, and put your chat id on the send nodes. (Send the alert to your phone.)",
              "Google — Docs, Sheets, and Drive share a single Google sign-in. Add one Google credential and all three nodes use it. (Keep a backup in a sheet.)",
            ],
          },
        ],
        download: {
          label:
            "The finished course workflow, ready to import into your own n8n. Reconnect your own credentials after. Use it as a template, a reference, or a fresh start.",
          href: "/job-hunter.workflow.json",
          filename: "job-hunter.workflow.json",
        },
        tryIt:
          "Import this provided file into your own n8n, reconnect your credentials, and get one job all the way through to an alert.",
        check:
          "The provided workflow runs in your own n8n, on your credentials and role.",
        pitfall: {
          title: "Import brings settings, not secrets",
          body: "An exported workflow carries every node and its settings, but not your API keys or tokens — those stay in your n8n credentials. After importing, each node that needs a credential shows a warning until you point it at your own. That is expected, not a broken file.",
        },
      },
    ],
  },
  {
    id: "m12-advanced",
    title: "For advanced builders",
    outcome:
      "Optional. Come back for this when you want to re-test and debug a live automation like a builder.",
    lessons: [
      {
        id: "l10-2-debug",
        moduleId: "m12-advanced",
        title: "Test and debug like a builder",
        estMinutes: 15,
        device: "laptop",
        why: "Live automations need testing tricks, because you cannot wait a day to see if a change worked. A few habits let you re-run any part on demand and find faults fast.",
        steps: [
          "To re-test a job end to end, delete its row from job_alerts so the dedup treats it as new again. Run the query below in your Supabase project's SQL editor — not in n8n.",
          "To test the cover-letter branch without waiting for a real high score, lower the score gate for a moment, then put it back.",
          "When something looks wrong during a manual run, open the output panel of each node in turn and read what actually came out.",
          "For a workflow that is already active, open the Executions tab: n8n records every automatic run there, success or error.",
          "Click any execution to open it and see the exact data that flowed through each node on that run — how you debug a run that already happened, without re-triggering it.",
        ],
        snippets: [
          {
            label: "Force a job to run again — run this in the Supabase SQL editor, not in n8n",
            code: String.raw`delete from public.job_alerts where url = '<job url>';`,
          },
        ],
        asides: [
          {
            title: "Debugging a live workflow with Executions",
            body: [
              "Once a workflow is active, you are not watching it run — it fires on its schedule while you are away. n8n keeps a record of every run under Executions, so you can look back at exactly what happened.",
              "Open the Executions tab, in the workflow or the global list. Each row is one run, marked success or error, with its time. A red error row is where to start.",
              "Click a run to open it frozen in time. The canvas shows that run's data: open any node's output and you see what it actually produced then, not now. Walk forward from the trigger until a node's output looks wrong — that is your fault.",
              "To iterate on a fix, pin a run's data onto a node with the pin icon, so re-running uses that exact input until you unpin it. You debug against the real data that broke, not a guess.",
            ],
          },
        ],
        tryIt:
          "Delete one row in Supabase, run the workflow, and confirm that job flows all the way through again. Then open Executions, click into a past run, and read its data node by node.",
        check:
          "You can re-run any part of the workflow on demand, and read a past run's data in Executions to find a fault.",
        pitfall: {
          title: "Read the panel, do not guess",
          body: "Most bugs are a value in a shape you did not expect. Opening the node output and looking is faster than reasoning about what should be there.",
        },
      },
    ],
  },
];

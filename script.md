Hi everyone, I’m Cristina Rodriguez.

I’m a full stack software engineer, a learning designer, and the founder of ComadreLab.dev, a bilingual web and AI studio.

Most of my work lives in the middle of technology and education. I like building tools, but I also care a lot about helping people understand how those tools work.

And this workflow is very personal for me.

I’m currently in my 2026 job search, and that is exactly why I built this.

This is not a fake demo. It is not a toy project that I made only for a presentation. This is a real automation that helps me check job boards, filter what matters, and send good matches directly to my phone.

Today I’m going to walk you through it end to end.

Not as a course. We are not building together today.

Today is about seeing it work, understanding the basic ideas behind n8n, and hopefully leaving with enough confidence to say, “Okay, I could build something like this too.”

<!-- Pause Move to next slide -->

Every morning, a small robot checks a job board for me.

It searches for roles, filters the results, remembers what it has already seen, scores the best matches, and sends me a Telegram alert when something looks interesting.

Here it is.

Pause and click Execute.

Its very fast, and I want you to notice the shape of the workflow.

It starts by searching.

Then it filters.

Then it remembers.

Then it scores.

And finally, it delivers the result to my phone.

Search. Filter. Remember. Score. Deliver.

That is the whole pipeline we are going to follow today.

And here is the payoff.

The job alert lands in Telegram.

That is the whole thing. For the next 40 minutes, I’ll show you how it works, step by step, using one real workflow from beginning to end.

<!-- Pause Move to next slide -->

Let’s start with the first basic idea in n8n.

A workflow does absolutely nothing until the first node fires.

That first node is called the trigger.

The trigger answers one question:

How does this workflow start?

There are many types of triggers, but today I want to focus on three common ones.

First, a schedule trigger.

That means the workflow runs automatically at a specific time. For example, every morning at 8 AM.

Second, a webhook trigger.

That means another app or website can call your workflow and start it.

And third, a manual trigger.

That is the button I just used so we can run the workflow together live in this room.

In production, this job search workflow runs on a schedule. That is why I can wake up and already have job alerts on my phone.

But today, because we are doing a live walkthrough, I’m using the manual trigger.

The important idea is this:

Pick how the workflow starts, and the rest of the workflow is just steps wired after the trigger.

That is the beginning of almost every n8n workflow.

Trigger first. Then the steps.

<!-- Pause Move to next slide -->

Now let’s talk about the mental model that makes n8n easier to understand, especially if you are an engineer.

Everything moving through this workflow is a list of items.

Each item has JSON inside it.

So when one node finishes, it does not just say, “I’m done.”

It passes data forward.

Usually, it passes a list of items, and every item looks something like this:

json, with values inside.

Here, for example, you can see the data coming from this node.

This is the part I love about n8n.

You are not guessing what happened.

You can click a node and read the actual data that came out of it.

Most nodes run once per item.

So if the search gives me ten jobs, the next steps can process those ten jobs one by one.

The second basic idea is expressions.

Expressions are the little pieces of code inside double curly braces.

They let you pull values from the current item.

For example, if the current job has a URL, I can use an expression like:

current item dot url.

In n8n, we usually read that as dollar json dot url.

Dollar json means: the current item I’m working with right now.

And if I need to reach back to an earlier node, I can reference that node by name.

So these two ideas are the vocabulary of the whole workflow:

The data is a list of items.

And expressions let each node read values from those items.

If you understand list of items and expressions, you can start reading almost any n8n workflow.

Quick word on JSON, because it is everywhere in n8n.

JSON stands for JavaScript Object Notation. It is just a simple, text based way to write data as labels and values, like the label "title" paired with the job's title, and it is easy for both people and machines to read.

Fun fact: the original JSON license adds one very human rule, "The Software shall be used for Good, not Evil." IBM actually had to write and ask for permission to use it for evil.

And this is why JSON is basically the official language of n8n. Every item that moves between nodes is JSON. It is the common language every node speaks, so once you can read JSON, you can read the data anywhere in the workflow.

<!-- Pause Move to next slide -->

Now let’s walk through the five stages.

The first stage is Search.

This workflow starts by making a real job search request.

Here I’m using an HTTP Request node connected to SerpApi.

The job board search happens outside n8n, and n8n receives the results back as data.

Open the HTTP Request node output.

Here you can see the search results coming back.

This is real data. Not a mocked response. Not a pretty demo file.

These are the results from the job board search.

The important field here is organic results.

You might be wondering why I use SerpApi instead of just scraping Google myself.

Scraping Google directly is fragile, and it also goes against their terms of service.

Google blocks bots, throws CAPTCHAs, and changes its page layout all the time, so scraper code breaks constantly.

SerpApi does the search for me and hands back clean, structured results I can use right away.

It handles the proxies, the blocking, and the parsing, so I do not have to fight Google just to get my data.

That is the list of jobs that came back from the search.

At this point, the workflow does not know yet which jobs are good, which ones are remote, which ones are duplicates, or which ones are worth my time.

It only knows:

Here are the results I found.

That is the job of the Search stage.

Bring in the data.

<!-- Pause Move to next slide -->

The second stage is Filter.

And this is the part where I want to slow down a little, because this is where the workflow becomes more realistic.

In a perfect world, every job posting would have a nice clean field that says:

remote equals true.

But real data is usually not that clean.

Sometimes the page says remote, but then inside the description it says you must live in a specific city or state.

Sometimes the information is visible to humans, but not easy for a machine to read.

Sometimes the page gives us structured data, like JSON-LD.

And sometimes we have to read the label from the page itself.

That is what this Remote Gate node is doing.

Open Remote Gate output.

This is a Code node.

It checks what the job posting actually says about location and remote work.

But here is the important part:

I am not automatically deleting jobs that are complicated.

If a job looks remote but has a local requirement, I flag it.

I do not drop it silently.

Because in a job search, nuance matters.

A job can say remote, but only for people in the United States.

Or remote, but only near New York.

Or remote, but you have to come to the office once a month.

That is not the same as fully remote.

So the workflow flags that difference.

This is one of the lessons I want you to take from today:

Real data has no neat flag.

You scrape what is on the page, not what you wish was there.

And this is why n8n’s visual data panel is so helpful.

You can see what the workflow is actually reading, and you can adjust your logic based on real output, not assumptions.

So now we have searched.

And we have filtered more honestly.

<!-- Pause Move to next slide -->

The third stage is Remember.

This is the difference between a script and an automation I can actually trust every morning.

If this workflow sent me the same ten jobs every day, I would stop using it immediately.

So the workflow needs memory.

It needs to know:

Have I already seen this job before?

Open Get Many Rows or database node.

Here, the workflow checks the database.

Every job that has already been sent to me is saved with its URL.

So when a new search result comes in, the workflow compares that URL with the ones already stored.

If the URL already exists, the workflow does not alert me again.

If the URL is new, it keeps moving.

Show Check for New Alerts output.

Here you can see a new job passing the check.

This is the part that makes the workflow feel useful in real life.

I do not want more noise.

I want fewer, better alerts.

So this Remember step protects me from duplicates.

Search finds the jobs.

Filter checks the remote logic.

Remember makes sure I only get new things.

<!-- Pause Move to next slide -->

The fourth stage is Score.

This is where the AI comes in.

The AI Agent reads the job posting and compares it with the kind of role I’m looking for.

In this workflow, the AI Agent is the orchestrator.

The OpenAI Chat Model is the brain connected to it.

The agent sends the job information to the model and asks for a structured response.

Not just, “This looks good.”

I want a score and a reason.

Open AI Agent output.

Here you can see the response.

The workflow asks the model to return JSON with fields like score and reason.

That way, I can use the output in the rest of the automation.

For example, if the score is high enough, send it to Telegram.

If the score is too low, do not interrupt me.

There is one small technical gotcha here that is worth mentioning.

Sometimes the AI response comes back as a string of JSON.

It looks like JSON, but the workflow cannot use it as an object yet.

So before I can check the score, I parse it with JSON dot parse.

That turns the text into real data the workflow can use.

This is a very normal automation lesson:

AI is helpful, but you still need to shape the output.

You need structure.

You need checks.

And you need the workflow to be able to read the result.

So now we have searched, filtered, remembered, and scored.

Pause.

<!-- Pause Move to next slide -->

The last stage is Deliver.

At this point, the workflow has found a job that is new and interesting enough to send.

Now one output fans out into two actions.

First, the workflow creates a row in the database.

That means the job is saved, and tomorrow it will not be sent again.

Second, the workflow sends a Telegram message to my phone.

Show Create Row output.

Here is the saved row.

Point to Telegram.

And here is the alert.

This is the payoff.

The good job is on my phone before I have had coffee.

And for me, that matters.

Because when you are job searching, it is very easy to spend a lot of emotional energy refreshing job boards, saving links, wondering what you already applied to, and trying not to miss something.

This workflow does not solve the whole job search.

But it removes one piece of repetitive work.

And that is exactly where automation is useful.

Not replacing all the human judgment.

Just taking away the part that a robot can do better than me at 8 in the morning.

<!-- Pause Move to next slide -->

So let’s recap the whole flow in one breath.

Search.

Filter honestly.

Remember what you have already seen.

Score the matches.

And deliver the good ones somewhere you will actually look.

In my case, that place is Telegram.

The bigger idea is that n8n lets you connect small steps into a workflow that has a real outcome.

A trigger starts it.

Data moves as a list of items.

Expressions let each node read the data.

And every step transforms the workflow a little more.

By the end, we do not just have a search result.

We have an alert that is useful.

<!-- Pause Move to next slide -->

If you want to build this yourself, the course is already live.

Open course.

The link is:

n8njobsearch.vercel.app

The course walks through every node step by step, with screenshots.

It is self paced, and it is designed for people who are new to n8n.

There is also a section called Working from a template.

That means you do not have to build the whole workflow from zero.

You can import the finished workflow, reconnect your own credentials, and start from there.

You will need your own SerpApi, Supabase, OpenAI, and Telegram credentials.

But the workflow structure is already there.

And yes, the full course goes beyond what we covered today.

This talk was only the core pipeline:

Search to filter to remember to score to deliver.

The course also shows the bigger version of the system.

But I wanted today to stay focused on the basics, because once the basics click, the rest is much easier to understand.

You are engineers.

You will probably build this faster than I did.

My hope is that after seeing it run, n8n feels less like a mysterious automation tool and more like something you can read, debug, and adapt.

Thank you.

I’m happy to take questions.

---

# If the live demo stalls

If something gets stuck, say this calmly:

This is a real live demo, so I’m going to do what we all do when production is not cooperating.

I’m going to switch to the recorded run, and I’ll keep walking through the same stages.

The important thing is not the drama of the live click.

The important thing is understanding how the workflow moves data from search to alert.

---

# Short answers for Q&A

## Why n8n and not just a script?

You could absolutely script this. The reason I like n8n here is that I get the schedule, credentials, retries, visual debugging, and the data panel without building all of that myself. Also, someone who is not deep in the code can still open the workflow and understand the shape of it.

## How does it avoid sending the same jobs every day?

The Remember step. Every URL that gets sent is saved in the database. Tomorrow, the workflow checks the new search results against the saved URLs. If it has already seen the job, it does not send it again.

## Is scraping fragile?

Yes. And I wanted to show that honestly. Job boards do not always give us clean data. That is why I flag nuance instead of pretending everything is perfect. The course teaches how to read the output panel and adjust based on what the data really looks like.

## Can I just get the workflow?

Yes. The course has a Working from a template section. You can import the finished workflow and reconnect your own credentials.

## Where do the API keys live?

They live in your own n8n credentials. They are not inside the workflow file and they are not inside the course.

## Does it also write cover letters?

Yes, the bigger workflow can do that, and the course covers it. Today I’m skipping that part because I wanted us to focus on the core search to alert pipeline.

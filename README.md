# TODO:

** NOTE: I can always go to `/api/lastTenMatches/<summonerName>` if I want to see what my backend's returning me

* Backend
  * split up server.js into smaller classes
  * don't hardcode api_key into code

* Frontend
  * actually render nice html

* Other
  * Get rid of all the node modules you're not actually using
  * deploy somewhere (heroku, azure)


# CHALLENGES

* Took time hooking up a node.js backend to a react front-end
  * Have only used react to serve static sites before. Haven't hooked it up to a server before
* I'm spoiled by RestSharp
  * Tried a lot of different Javascript rest clients, not very happy with any of them
* Spent lots of time trying to do async/await, failed
  * Would love to learn/implement if I had more time
* server.js is getting very spaghetti-y
  * My general coding style is to brute-force first, refactor later
  * For larger projects like this, it's only handicapping me. Need more JS experience so I can write nice code sooner
* I really haven't done css/html
  * I know the basics, but haven't really made anything that looks nice
    * I've only made small changes to an existing css, or troubleshoot an existing one


# DEPLOYMENT (theory)

* Replace the `proxy` element of `/client/package.json` with the deployment site and port.
* Configure azure (or heroku) to use the correct version of Node.js
* Since there are 2 entry points (`server.js` for the express server, `/client/src/App.js` for the client app), I'd have to configure the site to handle this
* Just to make life easier, I'd probably FTP the files up manually first. Future deployments may call for a script, or I could set the site up to detect changes in github
  * I'll definitely need to make sure I don't hard-code the API key in my code, instead using the application setting to set it.
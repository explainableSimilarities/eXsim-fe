# neXSim Web Interface

This is a the web-based user interface for neXSim

For running it on your local machine (requiring [node](https://nodejs.org/en) and [npm](https://www.npmjs.com/) )

It requires a running instance of [neXSim-be](https://github.com/explainableSimilarities/neXSim-be) for connecting to the corresponding APIs

Download or clone this repository, then move into the neXSim folder and type:

```bash
npm i
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) and start using it 

## User guide

While running, you can access some guide and tips within the tour section, by typing 

```http://localhost:3000```

or by clicking the question mark (?) icon on the top of the page.


## Online Availability

An online version of this tool is available [here](https://n9.cl/6ghqj)

## Usage

Please be sure that you are pointing to a (local or remote) valid and alive instance of [neXSim-be](https://github.com/explainableSimilarities/neXSim-be) when you start the project.
You can check this property in the following files
[next.config.mjs](next.config.mjs) (line 7)
[middleware/api.ts](app/middleware/api.ts) (line 1)



# SciLand — Public Website

This public repository hosts the **published static SciLand website**.

**Website address:** https://to-kepler452b.github.io/SciLand/  
**Private source repository:** https://github.com/To-Kepler452b/SciLand_Source

## Deployment

The complete V2 website is built and maintained privately in `SciLand_Source`. A GitHub Actions workflow there copies only `index.html`, `styles.css`, `app.js`, `site-content.js`, `.nojekyll`, and the `assets/` directory to this repository.

The site is not yet live: first import the provided V2 ZIP into `SciLand_Source`, then configure its GitHub Actions secret `PAGES_DEPLOY_TOKEN` (a fine-grained token restricted to this public repo with Contents Read and Write), and variable `PUBLISH_ENABLED=true`. Run the Publish SciLand workflow. Configure this repository's **Settings → Pages → Deploy from a branch → main / (root)**.

The V2 website contains the SciLand project and Technical Reports with a dark animated hero, light academic content, and responsive visual design. It excludes Sci-RSI and CivilizedVLA. Public websites expose delivered HTML, CSS, JS and images to visitors.

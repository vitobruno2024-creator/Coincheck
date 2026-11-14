You're right, that's the most important part, and it's only half there. VarietyVista was in the list, but Coppercoins wasn't, and the prompt treated variety checking as a side step. I'm fixing both so the reference sites are searched first, for the specific year of your coin.

I updated `server.mjs`, and the variety check is now the main job. I only syntax-checked it, since I can't run the live search from here.

**What changed**
- **Coppercoins added.** `coppercoins.com` is now in the search list next to VarietyVista and CONECA.
- **The reference sites come first.** For your coin's exact year and mintmark, the AI now looks up which varieties exist (doubled dies, repunched mintmarks, small vs large date). It then compares each one's markers to your photos and names the variety the way the site lists it.
- **More searches allowed.** The limit went from 8 to 12 per scan, so it has room to cover both reference sites and the price sites.

**Limits**
- The AI reads the text on those sites, such as descriptions of where the doubling appears, but it can't see their reference photos. It's good at pointing out what to check, but you should still compare your coin to the pictures on VarietyVista yourself.
- Some pages on those sites may not come up in search results, since a lot of the content is image-based. If a scan misses a variety you think is there, tell me the year and variety name and I'll help adjust the prompt.

Replace `server.mjs` in your GitHub repo, let Render redeploy, and test with the 1960-D.

# naren7.me

hey, this is my little corner of the internet. it lives at [naren7.me](https://naren7.me).

it's a portfolio, a blog, and a pixel-art knight resting in a meadow. there's also a raven that delivers an email whenever i post something new. that's pretty much it.

## what's in here

it's plain react + typescript on vite, styled mostly with hand-written css. it's not a framework app. every page is just its own little html entry, which keeps things fast and simple.

some fun bits:

- a light / dark theme that crossfades smoothly
- a ⌘K menu if you're a keyboard person
- a completely different layout on phones, not just a squished desktop one
- blog likes, backed by a tiny supabase table
- blog email subscriptions through resend, with a confirm email so nobody gets added without saying yes
- a live github contributions calendar

## running it

```sh
npm install
npm run dev
```

that gets you the site at `127.0.0.1:5173`. the `/api` stuff (likes and subscriptions) only runs under `vercel dev`, and it needs a few env vars:

- `BLOG_LIKES_DATABASE_URL` for supabase
- `RESEND_API_KEY` for email
- `BLOG_NOTIFY_SECRET` for the notify command

without them, the site still works and those bits just politely say they're unavailable.

`npm run build` typechecks and builds everything into `dist/`. there's no test suite, so the build is the check.

## wanna use it?

go for it, it's free. fork it, rip it apart, make it yours. the code's under the [MIT license](./LICENSE), so the only real ask is that you keep the license file around.

one thing though: the personal stuff is mine, so swap it out for your own. that means my photos, blog posts, resume, the knight banners and the raven. most of it lives in `src/data/` and `public/images/`, and `CLAUDE.md` has a pretty thorough map of how everything fits together.

## shoutouts

- huge thanks to my friend **Ashutosh**. the overall design is heavily inspired by his portfolio, and the phone layout is a nod to his [portfolio v1](https://github.com/Ashutoshx7/Portfoliov1). go say hi:
  - website: [ashutoshx7.me](https://www.ashutoshx7.me/)
  - github: [@Ashutoshx7](https://github.com/Ashutoshx7)
  - x: [@Ashutosh_7x7](https://x.com/Ashutosh_7x7)
- the buttons are from [VengeanceUI](https://github.com/Ashutoshx7/VengeanceUI), also built by Ashutosh: the glowing resume button, the liquid-metal download button, and the shine on "get notified"
- fonts are [Geist](https://vercel.com/font) and [Instrument Serif / Sans](https://fonts.google.com/specimen/Instrument+Serif), all open-licensed

that's all. if you build something cool off this, i'd love to see it ✌️

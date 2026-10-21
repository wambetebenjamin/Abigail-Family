# Image credits

All photography on this site comes from Pexels and is used under the Pexels licence: free to use, no attribution required, no watermarks. We credit the photographers anyway, because their work is the warmth in this design.

Every photo is of African subjects, with an emphasis on East Africa (Uganda, Rwanda, Kenya) wherever a matching free photo existed. Portraits were chosen for dignity and warmth, not for stock-photo cheerfulness.

## How the images are served

The build sandbox for this project could reach `www.pexels.com` for research but not the `images.pexels.com` CDN, so image binaries could not be downloaded into `/public/images/`. Instead:

- All photos are referenced from `lib/images.ts` as Pexels CDN URLs.
- `next.config.ts` keeps `images.remotePatterns` for `images.pexels.com` (as required by the build brief) and sets `unoptimized: true` so the browser fetches the original file directly, which works without the sandbox ever touching the CDN.
- Every image uses `next/image` with `fill` plus an explicit `sizes` attribute, never a raw `<img>` tag.

To localise the images later, run the app once with a normal internet connection, save the files into `/public/images/`, and change `lib/images.ts` to return `/images/<file>` paths. Nothing else needs to change.

## Photos in use

| File key | Pexels ID | Photographer | Used on | Source |
| --- | --- | --- | --- | --- |
| `heroFamily` | 4262410 | August de Richelieu | Homepage hero | https://www.pexels.com/photo/family-gathering-for-a-group-hug-4262410/ |
| `motherChild` | 30110240 | Boko Shots | Home values, login panel | https://www.pexels.com/photo/mother-and-child-in-traditional-african-attire-30110240/ |
| `generations` | 36409051 | Abubakar Mamman | Home child-first, about | https://www.pexels.com/photo/generational-portrait-of-african-women-36409051/ |
| `parentLaptop` | 6953924 | George Milton | Features, shared calendar | https://www.pexels.com/photo/smiling-black-woman-working-on-laptop-at-home-6953924/ |
| `planningTable` | 3769021 | Andrea Piacquadio | Features, expense tracker | https://www.pexels.com/photo/happy-ethnic-woman-sitting-at-table-with-laptop-3769021/ |
| `handoverHug` | 4587155 | Michele Ferrari | Features, handover logs | https://www.pexels.com/photo/woman-in-white-and-black-shirt-holding-a-boy-in-white-shirt-4587155/ |
| `familySunlight` | 33763166 | Speak Media Uganda | Features intro, register panel | https://www.pexels.com/photo/portrait-of-african-family-in-sunlit-landscape-33763166/ |
| `motherBaby` | 33900412 | AB Pixels NG | Features, secure messaging | https://www.pexels.com/photo/nigerian-women-in-traditional-attire-with-child-33900412/ |
| `deskWork` | 5999845 | Ono Kosuki | Features, document vault | https://www.pexels.com/photo/smiling-black-businesswoman-using-laptop-and-drinking-coffee-5999845/ |
| `familyHome` | 29801855 | Ario Stories | Features, progress journal | https://www.pexels.com/photo/happy-african-family-in-traditional-attire-29801855/ |
| `testimonialAmina` | 20209020 | Khris Kunta kUkU | Homepage testimonial | https://www.pexels.com/photo/femme-au-bureau-20209020/ |
| `testimonialBrian` | 19379640 | Pierre Habumuremyi | Homepage testimonial | https://www.pexels.com/photo/portrait-of-an-african-man-smiling-19379640/ |
| `testimonialJoseph` | 18587652 | Isaac Naph | Homepage testimonial | https://www.pexels.com/photo/a-smiling-african-man-with-a-big-smile-18587652/ |
| `teamEmmanuel` | 8543078 | Marvin Hope | About team | https://www.pexels.com/photo/smiling-man-in-white-crew-neck-shirt-8543078/ |
| `teamGrace` | 3894377 | PICHA Stock | About team | https://www.pexels.com/photo/woman-sitting-in-front-of-a-computer-while-talking-on-the-phone-3894377/ |
| `teamSamuel` | 30386124 | Boko Shots | About team | https://www.pexels.com/photo/confident-african-male-in-red-shirt-portrait-30386124/ |
| `childPortrait` | 19039168 | Almeida Retratos | Reserved for future story pages | https://www.pexels.com/photo/portrait-of-an-african-man-19039168/ |

## Images that are deliberately not used

- No AI-generated imagery anywhere on the site.
- No images with watermarks, and no paid or rights-managed libraries.
- No photos of identifiable children used as testimonials or team portraits.

## Product mockups

The UI mockups on `/features` and the dashboard previews are built entirely with Tailwind CSS and Lucide icons. They contain no external images, no screenshots and no device frames borrowed from another design system.

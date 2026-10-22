/**
 * Pexels photo registry.
 *
 * Every photo is a free Pexels licence photo of East African or African
 * subjects, used here for Abigail Family. Full attribution, photo IDs and
 * source pages live in image-credits.md at the repository root.
 *
 * The Pexels CDN cannot be reached from the build sandbox, so the images are
 * delivered straight from images.pexels.com to the browser (next/image with
 * unoptimized output). The host is allow-listed in next.config.ts so the
 * optimizer can take over on Vercel without any code change.
 */

export type Photo = {
  id: number
  src: string
  alt: string
  width: number
  height: number
  photographer: string
  page: string
}

const cdn = (id: number, w: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

const photo = (
  id: number,
  alt: string,
  photographer: string,
  width = 1600,
  height = 1067,
): Photo => ({
  id,
  src: cdn(id, width),
  alt,
  width,
  height,
  photographer,
  page: `https://www.pexels.com/photo/${id}/`,
})

export const photos = {
  heroFamily: photo(
    4262410,
    'A parent and two children holding each other in a warm family embrace indoors',
    'August de Richelieu',
  ),
  motherChild: photo(
    30110240,
    'A mother holding her young child close, both dressed in vibrant African prints',
    'Boko Shots',
    1200,
    1600,
  ),
  generations: photo(
    36409051,
    'Four African women of different generations standing together in profile',
    'Abubakar Mamman',
    1600,
    1067,
  ),
  parentLaptop: photo(
    6953924,
    'A parent smiling while working on a laptop from an armchair at home',
    'George Milton',
    1600,
    1067,
  ),
  planningTable: photo(
    3769021,
    'A parent planning the week at a table with a laptop and notebook',
    'Andrea Piacquadio',
    1600,
    1067,
  ),
  handoverHug: photo(
    4587155,
    'A parent holding two children in a quiet, warm moment at home',
    'Michele Ferrari',
    1600,
    1067,
  ),
  familySunlight: photo(
    33763166,
    'A family standing together outdoors in bright afternoon sunlight',
    'Speak Media Uganda',
    1600,
    1067,
  ),
  motherBaby: photo(
    33900412,
    'Two women in bright traditional attire holding a baby outdoors',
    'AB Pixels NG',
    1600,
    1067,
  ),
  deskWork: photo(
    5999845,
    'A parent working on a laptop with a cup of coffee nearby',
    'Ono Kosuki',
    1600,
    1067,
  ),
  familyHome: photo(
    29801855,
    'A smiling family in colourful clothing sharing a joyful moment outdoors',
    'Ario Stories',
    1600,
    1067,
  ),
  testimonialAmina: photo(
    20209020,
    'Portrait of a smiling woman in a bright office',
    'Khris Kunta kUkU',
    900,
    1200,
  ),
  testimonialBrian: photo(
    19379640,
    'Portrait of a smiling man photographed in a studio in Kigali',
    'Pierre Habumuremyi',
    900,
    1200,
  ),
  testimonialJoseph: photo(
    18587652,
    'A smiling father outdoors with trees behind him',
    'Isaac Naph',
    900,
    1200,
  ),
  teamEmmanuel: photo(
    8543078,
    'Portrait of a smiling young man in a white shirt outdoors in Uganda',
    'Marvin Hope',
    900,
    1200,
  ),
  teamGrace: photo(
    3894377,
    'Portrait of a smiling woman at her desk in a bright office',
    'PICHA Stock',
    900,
    1200,
  ),
  teamSamuel: photo(
    30386124,
    'Portrait of a smiling man in a red shirt against a plain background',
    'Boko Shots',
    900,
    1200,
  ),
  childPortrait: photo(
    19039168,
    'Studio portrait of a smiling young man under warm light',
    'Almeida Retratos',
    900,
    1200,
  ),
} satisfies Record<string, Photo>

export type PhotoKey = keyof typeof photos

export const heroSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1280px'
export const cardSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px'
export const portraitSizes = '(max-width: 640px) 45vw, 200px'

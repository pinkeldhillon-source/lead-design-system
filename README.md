# LEAD Design System

The single source of truth for how LEAD looks, reads and behaves.

LEAD is a leadership consultancy for founder led agencies. It takes founders out of day to
day delivery, lifts client capacity and improves delivery margins through an eight week
programme and ongoing one to one consulting. The audience is agency founders with teams of
five or more: busy, capable operators who read fast, decide fast and have no patience for
fluff.

The brand should feel like calm authority. Warm, not corporate. Structured, not stiff. The
most organised person in the room speaking plainly, with the confidence of someone who has
actually run the floor.

## Files

| File | What it holds |
| --- | --- |
| `tokens.json` | Every token, with usage notes and contrast ratios |
| `src/theme.css` | CSS custom properties, type scale, layout and signature devices |
| `tailwind.config.js` | The same system as a Tailwind theme |
| `src/components/` | React components: Button, Card, StatBlock, Testimonial, FormField, CtaBand, Eyebrow, Highlight, DotGrid |
| `preview.html` | A finished page using the system, open it in a browser |

## Colour

| Token | Hex | Where it goes |
| --- | --- | --- |
| Ink | `#00232F` | Headlines, text on light, dark bands, footers |
| Ink deep | `#001A23` | Hover and pressed on ink surfaces |
| Ink body | `#22383F` | Body copy |
| Ink muted | `#5F7278` | Captions and labels |
| Accent | `#E97132` | Primary buttons, highlights, key numbers |
| Accent light | `#F5A472` | Tints and subtle fills |
| Accent text | `#A84A16` | The only orange safe for text |
| Cream | `#E9DDC7` | Quiet surfaces, tags, cards on dark |
| Canvas | `#F7F2E8` | Default page background |
| Surface | `#FFFFFF` | Cards |
| Line | `#DCD3C2` | Borders and dividers |

Status: success `#1F7A5C`, warning `#E9A13B`, error `#B3341F`, info `#2E6F8E`.

Hold **60 percent light, 30 percent ink, 10 percent accent** on every view.

Contrast: ink on canvas 14.7 to 1, white on ink 16.4 to 1, ink body on cream 9.2 to 1,
ink on accent 5.4 to 1. Accent on canvas is 2.7 to 1 and fails, so use accent text at
5.2 to 1. White on accent is 3.1 to 1 and is display sizes only.

## Typography

Montserrat throughout. No second typeface.

| Role | Size / line | Weight | Case |
| --- | --- | --- | --- |
| Display | 64 / 66 | 900 | UPPERCASE, -1px |
| H1 | 44 / 48 | 900 | UPPERCASE, -0.5px |
| H2 | 32 / 38 | 700 | UPPERCASE |
| H3 | 22 / 28 | 700 | Sentence case |
| Eyebrow | 12 / 16 | 700 | UPPERCASE, 1.8px, accent text |
| Lead | 20 / 32 | 500 | Sentence case |
| Body | 16 / 28 | 400 | Sentence case |
| Small | 14 / 22 | 400 | Sentence case |
| Label | 12 / 18 | 600 | UPPERCASE, 1.2px |
| Stat | 72 / 72 | 900 | Numerals, -2px |
| Button | 15 / 16 | 700 | Sentence case, 0.3px |

Mobile: display 40 / 42, H1 32 / 36, H2 24 / 30, lead 18 / 28, body 16 / 26. Nothing below 14.

Headlines run three lines maximum. Body measure 60 to 75 characters. Left align by default.
Never justify. Never letter space body copy.

## Layout and shape

Base unit 8. Steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Nothing off scale.

12 columns, 24px gutters, 1200px maximum content width, 24px page margin on mobile.
Section padding 96px top and bottom on desktop, 56px on mobile.

Radius: 8px on buttons and inputs, 16px on cards and images, fully rounded on tags and
pills, square on full bleed bands.

Shadows are warm and soft, never black. Two levels only:
`0 2px 4px rgba(0,35,47,.08)` and `0 12px 30px rgba(0,35,47,.16)`.

Alternate light and dark. Never run more than two light sections in a row without a teal
band to break it.

## Signature devices

Use one or two per view, never all five.

1. **Dot grid.** 22px spacing, ink at 13 percent. Behind heroes and dark bands.
2. **Highlighter.** Solid accent block or a 9px underline swipe behind the single most
   important phrase. Animates left to right on load. One per screen.
3. **Big number.** Black weight, ink numeral, accent unit. One per section.
4. **Warm glow.** Soft accent halo behind portraits on ink. Never behind text.
5. **Proof row.** Client marks in ink at 55 percent opacity, one quiet line under the hero.

## Voice

Copy is part of the design.

- British English spelling throughout.
- Short sentences. One idea per line. Line breaks over commas.
- Plain verbs and concrete nouns. Name the outcome.
- **No em dashes anywhere.** Full stops, commas or brackets instead.
- No emojis, no exclamation marks, no hype language.
- No false urgency. No countdowns, no fake scarcity.
- Buttons say what happens: Book a call, Send the toolkit, Start the audit.
- Errors explain the fix in one sentence and never apologise.

Headline patterns that work: the outcome as a statement of fact ("Your agency should run
without you"), a number plus a constraint ("Three times the capacity. Same team."), or the
reframe ("Your job is to set the direction").

## Ten rules for generating anything under this brand

1. Montserrat only. Black or Bold for all caps headlines, Regular or Medium for body.
2. Colours come from the tokens above. No new colours, no gradients, no pure black.
3. Hold the 60 light, 30 ink, 10 accent split on every view.
4. One accent element per view. Usually the call to action.
5. Everything sits on the 8px spacing scale. 8px radius on controls, 16px on cards.
6. Left align. Generous white space. Body measure 60 to 75 characters.
7. One or two signature devices per view, never all five.
8. British English. Short lines. No em dashes, no emojis, no hype.
9. Every page and deck closes with the ink call to action band.
10. Design mobile first. Most of this is read on a phone.

## Avoid

Corporate blue, purple, gradients, pure black, stock handshake photography, cluttered
layouts, more than one accent element per view, a second typeface, centred body copy.

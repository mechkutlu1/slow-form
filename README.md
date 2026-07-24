# Slow Form — a tai chi coach that shows you the posture

Eight postures of the Yang-style short form. An ink-brush coach demonstrates each
one, your camera traces your own outline directly over it, and every posture is
scored on shape, weight placement, tempo and stillness. A report at the end names
the one thing worth working on next.

Single file, no build step, no dependencies to install. Runs entirely on the
device: the video never leaves the phone and nothing is recorded or uploaded.

## The sequence

| | Posture | Pinyin |
|---|---|---|
| 起 | Commencing | Qǐ Shì |
| 野 | Parting the Wild Horse's Mane | Yě Mǎ Fēn Zōng |
| 鶴 | White Crane Spreads its Wings | Bái Hè Liàng Chì |
| 摟 | Brush Knee and Twist Step | Lōu Xī Ǎo Bù |
| 雲 | Cloud Hands | Yún Shǒu |
| 鞭 | Single Whip | Dān Biān |
| 雞 | Golden Rooster Stands on One Leg | Jīn Jī Dú Lì |
| 收 | Closing | Shōu Shì |

## Two modes

**Study a posture** loops one posture slowly with its coaching points written
out. Nothing is scored. This is where a new posture should be learned.

**Run the form** plays the whole sequence. Each posture is sampled while the
coach holds it, and the session ends with a report.

## How it works

Everything comes from one specification. Each posture is stored as a set of
targets rather than as joint angles: where each **wrist** should sit relative to
the shoulders, how much each arm is **foreshortened** (tai chi reaches towards
the camera constantly, and a front-facing camera sees a forward reach as a short
straight arm, not a bent one), and where each **ankle** sits relative to the
hips. Arms and legs are then solved by two-link inverse kinematics.

Specifying the feet relative to the pelvis rather than the other way round is
what makes weight legible: moving both feet to the right of the hips *is* the
act of settling onto the left leg, so the coach figure and the score agree about
it by construction.

That same solved figure is measured to produce the scoring targets, so the coach
you are copying and the standard you are marked against can never drift apart.

### What is measured

Fourteen quantities, all normalised by your own torso length so that your
distance from the camera does not affect anything:

- arm direction and elbow bend, each side
- hand height and hand separation
- knee bend, each side
- stance width, how far you have sunk, and how much either foot is lifted
- **weight placement** — where the hips sit between the feet, weighted most
  heavily of all, because it is what beginners most often skip
- spine angle away from vertical

Each is scored as a Gaussian on the error, so being close counts for something
and being far counts for nothing. Four whole-session qualities are added: tempo
(measured against the coach's own speed, so pausing at a posture reads as
correct stillness and choosing a brisker pace costs nothing), stillness (head
bobbing and hip sway), continuity, and uprightness.

MediaPipe landmarks jitter from frame to frame, so every signal that gets
differentiated is smoothed first — otherwise the noise, not the person, decides
the continuity score.

## Using it

1. Choose a mode, a posture (for study), and a pace.
2. Tap **Start camera**. The first launch downloads the pose model; after that
   it is cached and works offline.
3. Prop the phone up, stand **facing it**, and step back until your whole body
   including your feet is in the frame. About two metres usually does it.
4. Follow the coach. Your outline in green sits over the coach in red, hips
   aligned and scaled to match, so the gap between you is literal.

If your feet are not visible the app says so and stops scoring the leg
quantities rather than marking you down for something it cannot see.


## Honest limits

- One camera, one plane. Depth is not measured, so the app cannot tell a correct
  forward push from a hand held at the same height nearer the body. The
  foreshortening term in each posture is a drawing convention that keeps the
  coach honest about this rather than a depth measurement.
- Scores describe the shape you made against one particular rendering of the
  form. Lineages differ, and a teacher's eye sees things no landmark does.
- The thresholds are reasoned rather than validated. A first session will
  probably suggest tightening or loosening some of them; they are all in the
  `CHECKS` table near the top of the script, one line each.
- Not a medical device and not exercise prescription. If balancing on one leg is
  a risk for you, keep a chair within reach.

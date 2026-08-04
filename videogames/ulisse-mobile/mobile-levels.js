(function (root) {
  "use strict";

  function copy(target, source) {
    var key;
    if (!source) return target;
    for (key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
    }
    return target;
  }

  function platform(x, y, w, h, options) {
    return copy({ x: x, y: y, w: w, h: h }, options);
  }

  function spike(x, y, w, options) {
    return copy({ type: "spike", x: x, y: y, w: w, h: 15 }, options);
  }

  function enemy(x, y, w, h, min, max, speed, options) {
    return copy({ type: "enemy", x: x, y: y, w: w, h: h, min: min, max: max, speed: speed }, options);
  }

  function drop(x, y, w, h, trigger, options) {
    return copy({ type: "drop", x: x, y: y, w: w, h: h, trigger: trigger }, options);
  }

  function boulder(x, y, radius, trigger, speed, options) {
    return copy({ type: "boulder", x: x, y: y, radius: radius, trigger: trigger, speed: speed }, options);
  }

  function water(x, y, w, h) {
    return { type: "water", x: x, y: y, w: w, h: h };
  }

  function zone(x, y, w, h, effect, strength) {
    return { type: "zone", x: x, y: y, w: w, h: h, effect: effect, strength: strength };
  }

  var palettes = {
    fire: ["#3a2521", "#9e4732", "#342c28", "#dc8a55", "#f5ca72"],
    coast: ["#b9d9d0", "#4d8f8d", "#2e4f4b", "#d8bc78", "#fff2bf"],
    lotus: ["#d9d4df", "#8a7192", "#4c4052", "#f0a9bd", "#fff0ac"],
    cave: ["#171e1d", "#2e3a36", "#3b413b", "#978b68", "#e8c56b"],
    wind: ["#a9d9df", "#5f9ea5", "#365c5b", "#f1d79b", "#f8ffcf"],
    stone: ["#b9aea0", "#75685b", "#403a34", "#c79d69", "#f1d18c"],
    circe: ["#b5c7a1", "#597653", "#344733", "#d1ad75", "#e7f89b"],
    underworld: ["#101415", "#222a2b", "#323536", "#717b75", "#b8d6c7"],
    sirens: ["#afcfda", "#517d8e", "#334c50", "#dcb46f", "#ffefb0"],
    storm: ["#78969b", "#35555c", "#293c3e", "#bba26f", "#eaf5db"],
    sun: ["#efd5a0", "#bf7a43", "#4b3a2c", "#f2c86d", "#fff3b0"],
    island: ["#b4ded5", "#4c9a89", "#315f51", "#e4c984", "#f2ffbe"],
    phaeacia: ["#bcdfe6", "#6198a4", "#36575a", "#d7bd7c", "#f6f3c1"],
    ithaca: ["#d8d0ba", "#6b8170", "#313e34", "#bca06c", "#d7f66f"]
  };

  root.ULISSE_MOBILE_LEVELS = [
    {
      id: "troy",
      numeral: "I",
      place: "Troy",
      title: "The Wooden Horse",
      story: "Leave the burning city before victory becomes another prison.",
      hint: "Do not trust the quiet floor.",
      scene: "troy",
      palette: palettes.fire,
      spawn: { x: 28, y: 278 },
      goal: { x: 602, y: 268, w: 26, h: 40, label: "Fleet" },
      platforms: [platform(0, 308, 180, 52), platform(215, 308, 180, 52), platform(430, 308, 210, 52)],
      hazards: [spike(135, 293, 30, { hidden: true, trigger: 90 }), drop(357, 45, 28, 28, 312, { shape: "beam" })]
    },
    {
      id: "cicones",
      numeral: "II",
      place: "Ismarus",
      title: "Leave Before Dawn",
      story: "The Cicones return with the morning. Reach the ship.",
      hint: "Speed is wiser than plunder.",
      scene: "coast",
      palette: palettes.coast,
      spawn: { x: 26, y: 278 },
      goal: { x: 602, y: 268, w: 26, h: 40, label: "Ship" },
      platforms: [platform(0, 308, 138, 52), platform(170, 286, 124, 74), platform(330, 308, 140, 52), platform(505, 308, 135, 52)],
      hazards: [
        enemy(195, 262, 18, 24, 183, 267, 50, { kind: "soldier" }),
        enemy(370, 284, 18, 24, 346, 440, 62, { kind: "soldier" }),
        spike(432, 293, 28, { hidden: true, trigger: 390 })
      ]
    },
    {
      id: "lotus",
      numeral: "III",
      place: "Lotus shore",
      title: "Do Not Taste It",
      story: "The lotus offers the end of every reason to go home.",
      hint: "The flowers slow both feet and purpose.",
      scene: "lotus",
      palette: palettes.lotus,
      spawn: { x: 27, y: 278 },
      goal: { x: 602, y: 268, w: 26, h: 40, label: "Remember" },
      platforms: [platform(0, 308, 200, 52), platform(235, 308, 175, 52), platform(450, 308, 190, 52)],
      hazards: [
        zone(95, 258, 310, 50, "slow", 0.58),
        spike(170, 293, 25, { hidden: true, trigger: 125 }),
        spike(365, 293, 31),
        enemy(480, 284, 17, 24, 470, 548, 38, { kind: "dreamer" })
      ]
    },
    {
      id: "cyclops",
      numeral: "IV",
      place: "Cyclops cave",
      title: "My Name Is Nobody",
      story: "Blind Polyphemus and escape beneath the giant's reach.",
      hint: "Move when the giant turns away.",
      scene: "cave",
      palette: palettes.cave,
      spawn: { x: 27, y: 278 },
      goal: { x: 603, y: 268, w: 25, h: 40, label: "Cave mouth" },
      platforms: [
        platform(0, 308, 138, 52),
        platform(165, 276, 98, 18),
        platform(290, 239, 88, 18),
        platform(405, 276, 98, 18),
        platform(530, 308, 110, 52)
      ],
      hazards: [
        enemy(548, 251, 30, 57, 538, 594, 29, { kind: "cyclops" }),
        boulder(493, 292, 16, 345, -104),
        drop(355, 48, 24, 24, 310, { shape: "rock" })
      ]
    },
    {
      id: "aeolus",
      numeral: "V",
      place: "Aeolia",
      title: "The Unfastened Bag",
      story: "Every wind wakes while Ithaca waits on the horizon.",
      hint: "Jump into the gust, then release direction.",
      scene: "wind",
      palette: palettes.wind,
      spawn: { x: 26, y: 278 },
      goal: { x: 602, y: 268, w: 26, h: 40, label: "West" },
      platforms: [
        platform(0, 308, 114, 52),
        platform(148, 276, 101, 18),
        platform(287, 243, 95, 18),
        platform(425, 277, 98, 18),
        platform(557, 308, 83, 52)
      ],
      hazards: [
        zone(116, 80, 166, 228, "windRight", 92),
        zone(282, 70, 163, 238, "windLeft", 103),
        zone(445, 70, 120, 238, "windRight", 113),
        spike(477, 262, 28)
      ]
    },
    {
      id: "laestrygonians",
      numeral: "VI",
      place: "Telepylos",
      title: "The Crushing Harbour",
      story: "Giants rain stone on the fleet. Clear the harbour.",
      hint: "Move after the rolling rock has passed.",
      scene: "stone",
      palette: palettes.stone,
      spawn: { x: 27, y: 278 },
      goal: { x: 602, y: 268, w: 26, h: 40, label: "Open sea" },
      platforms: [platform(0, 308, 640, 52)],
      hazards: [
        boulder(620, 290, 19, 110, -142),
        boulder(630, 292, 16, 350, -172, { delay: 0.3 }),
        drop(240, 44, 32, 32, 190, { shape: "rock" }),
        drop(470, 40, 36, 36, 410, { shape: "rock" }),
        spike(530, 293, 27, { hidden: true, trigger: 487 })
      ]
    },
    {
      id: "circe",
      numeral: "VII",
      place: "Aeaea",
      title: "The Enchanted Table",
      story: "Cross Circe's spell and recover your transformed crew.",
      hint: "The bridge vanishes from the far side first.",
      scene: "circe",
      palette: palettes.circe,
      spawn: { x: 27, y: 278 },
      goal: { x: 601, y: 268, w: 27, h: 40, label: "Break spell" },
      platforms: [
        platform(0, 308, 154, 52),
        platform(180, 286, 98, 74, { vanish: true, trigger: 250, delay: 0.36 }),
        platform(305, 260, 104, 100),
        platform(438, 286, 82, 74, { fall: true, delay: 0.42 }),
        platform(548, 308, 92, 52)
      ],
      hazards: [
        enemy(320, 236, 21, 24, 315, 380, 54, { kind: "boar" }),
        enemy(565, 284, 21, 24, 560, 600, 57, { kind: "boar" }),
        spike(382, 245, 23)
      ]
    },
    {
      id: "underworld",
      numeral: "VIII",
      place: "Underworld",
      title: "Speak with the Dead",
      story: "Ask Tiresias how a broken voyage can end.",
      hint: "Cross between the shadows' steps.",
      scene: "underworld",
      palette: palettes.underworld,
      spawn: { x: 27, y: 278 },
      goal: { x: 603, y: 268, w: 25, h: 40, label: "Light" },
      platforms: [
        platform(0, 308, 138, 52),
        platform(165, 279, 94, 81),
        platform(287, 248, 84, 112),
        platform(400, 279, 96, 81, { fall: true, delay: 0.56 }),
        platform(527, 308, 113, 52)
      ],
      hazards: [
        enemy(184, 255, 17, 24, 175, 235, 45, { kind: "shade" }),
        enemy(302, 224, 17, 24, 298, 345, 56, { kind: "shade" }),
        enemy(550, 284, 17, 24, 542, 594, 59, { kind: "shade" }),
        spike(462, 264, 27, { hidden: true, trigger: 421 })
      ]
    },
    {
      id: "sirens",
      numeral: "IX",
      place: "The Sirens",
      title: "Bound to the Mast",
      story: "Hear the song and still steer home.",
      hint: "The song reverses left and right.",
      scene: "sirens",
      palette: palettes.sirens,
      spawn: { x: 27, y: 278 },
      goal: { x: 602, y: 268, w: 26, h: 40, label: "Silence" },
      platforms: [platform(0, 308, 185, 52), platform(218, 308, 202, 52), platform(454, 308, 186, 52)],
      hazards: [
        zone(202, 170, 245, 138, "reverse", 1),
        spike(255, 293, 29),
        spike(355, 293, 29, { hidden: true, trigger: 315 }),
        enemy(480, 284, 17, 24, 470, 545, 43, { kind: "siren" })
      ]
    },
    {
      id: "scylla",
      numeral: "X",
      place: "The strait",
      title: "Between Two Monsters",
      story: "Pass between Scylla and Charybdis. No route is harmless.",
      hint: "The current pulls down and left.",
      scene: "storm",
      palette: palettes.storm,
      spawn: { x: 26, y: 278 },
      goal: { x: 603, y: 268, w: 25, h: 40, label: "Beyond" },
      platforms: [
        platform(0, 308, 114, 52),
        platform(150, 279, 88, 18),
        platform(273, 247, 84, 18),
        platform(393, 280, 87, 18),
        platform(523, 308, 117, 52)
      ],
      hazards: [
        water(114, 335, 409, 25),
        zone(226, 170, 240, 165, "whirlpool", 85),
        enemy(202, 182, 20, 70, 160, 230, 55, { kind: "scylla", axis: "y" }),
        enemy(445, 180, 20, 74, 168, 255, 65, { kind: "scylla", axis: "y" }),
        spike(323, 232, 27)
      ]
    },
    {
      id: "helios",
      numeral: "XI",
      place: "Thrinacia",
      title: "The Forbidden Herd",
      story: "The crew is hungry. The Sun sees every sacred animal.",
      hint: "Wait for the fire to reveal itself.",
      scene: "sun",
      palette: palettes.sun,
      spawn: { x: 27, y: 278 },
      goal: { x: 601, y: 268, w: 27, h: 40, label: "Flee" },
      platforms: [platform(0, 308, 640, 52)],
      hazards: [
        enemy(165, 282, 29, 26, 130, 240, 46, { kind: "cattle" }),
        enemy(375, 282, 29, 26, 335, 455, 55, { kind: "cattle" }),
        spike(275, 293, 37, { hidden: true, trigger: 232, kind: "fire" }),
        spike(500, 293, 37, { hidden: true, trigger: 457, kind: "fire" }),
        drop(556, 38, 26, 54, 520, { shape: "lightning" })
      ]
    },
    {
      id: "calypso",
      numeral: "XII",
      place: "Ogygia",
      title: "Seven Years Still",
      story: "Choose a mortal home over an immortal island.",
      hint: "The island falls away behind you.",
      scene: "island",
      palette: palettes.island,
      spawn: { x: 27, y: 278 },
      goal: { x: 601, y: 268, w: 27, h: 40, label: "Raft" },
      platforms: [
        platform(0, 308, 137, 52),
        platform(165, 277, 91, 83, { vanish: true, trigger: 232, delay: 0.28 }),
        platform(284, 247, 85, 113, { fall: true, delay: 0.5 }),
        platform(396, 277, 91, 83, { vanish: true, trigger: 462, delay: 0.25 }),
        platform(517, 308, 123, 52)
      ],
      hazards: [water(137, 338, 380, 22), spike(339, 232, 24), enemy(548, 284, 18, 24, 535, 595, 48, { kind: "wave" })]
    },
    {
      id: "phaeacia",
      numeral: "XIII",
      place: "Scheria",
      title: "The Last Crossing",
      story: "The Phaeacians give you a final ship and ask for your story.",
      hint: "Let the moving deck carry you before jumping.",
      scene: "phaeacia",
      palette: palettes.phaeacia,
      spawn: { x: 27, y: 278 },
      goal: { x: 601, y: 268, w: 27, h: 40, label: "Ithaca" },
      platforms: [
        platform(0, 308, 118, 52),
        platform(157, 277, 88, 18, { move: "x", min: 138, max: 220, speed: 39 }),
        platform(294, 244, 84, 18, { move: "y", min: 220, max: 286, speed: 35 }),
        platform(430, 277, 88, 18, { move: "x", min: 402, max: 486, speed: 44 }),
        platform(550, 308, 90, 52)
      ],
      hazards: [water(118, 338, 432, 22), spike(468, 262, 24)]
    },
    {
      id: "ithaca",
      numeral: "XIV",
      place: "Ithaca",
      title: "String the Bow",
      story: "Enter your own hall. The bow and Penelope will know you.",
      hint: "Home is the final trap.",
      scene: "ithaca",
      palette: palettes.ithaca,
      spawn: { x: 27, y: 278 },
      goal: { x: 602, y: 268, w: 26, h: 40, label: "Home" },
      platforms: [
        platform(0, 308, 150, 52),
        platform(177, 286, 90, 74),
        platform(295, 260, 82, 100),
        platform(405, 286, 90, 74, { fall: true, delay: 0.46 }),
        platform(527, 308, 113, 52)
      ],
      hazards: [
        enemy(193, 262, 18, 24, 185, 242, 58, { kind: "suitor" }),
        enemy(314, 236, 18, 24, 305, 351, 64, { kind: "suitor" }),
        enemy(550, 284, 18, 24, 542, 594, 70, { kind: "suitor" }),
        spike(453, 271, 28, { hidden: true, trigger: 416 }),
        drop(500, 47, 25, 44, 465, { shape: "beam" })
      ],
      final: true
    }
  ];
}(window));

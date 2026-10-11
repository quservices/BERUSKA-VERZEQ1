// Výřezy fotografií z oficiálních ceníků.
// Souřadnice [x1, y1, x2, y2] jsou v "zobrazených" pixelech; scale je převádí na originál.
// inset ořízne okraje (zaoblené rohy a texty z ceníku), také v zobrazených pixelech.
export const CROPS = [
  {
    src: '405_kolace_nabidka-vsechny-druhy_webovky-01.jpg', scale: 1.786, inset: 14, dir: 'products',
    items: [
      ['kolac-tvarohovy', 213, 92, 455, 335],
      ['kolac-makovy', 275, 398, 452, 632],
      ['kolac-orechovy', 212, 773, 455, 1012],
      ['kolac-povidlovy', 212, 1085, 455, 1325],
      ['kolac-povidlo-tvaroh', 213, 1400, 455, 1640],
      ['kolac-povidlo-mak', 213, 1715, 455, 1955],
    ],
  },
  {
    src: '436_zakusky_-2025-01.jpg', scale: 1.403, inset: 14, dir: 'products',
    items: [
      ['mini-trubicka', 25, 105, 310, 390],
      ['mini-venecek-sleh', 322, 105, 607, 390],
      ['mini-venecek-polevany', 620, 105, 905, 390],
      ['mini-vetrnik', 25, 573, 310, 858],
      ['mini-puncova-koule', 322, 573, 607, 858],
      ['mini-spicka', 620, 573, 905, 858],
      ['mini-indianek', 60, 1055, 310, 1340],
      ['mini-ovocny-kosicek', 322, 1055, 607, 1340],
      ['mini-puncovy-rez', 25, 1500, 310, 1785],
      ['mini-misa-rez', 322, 1500, 607, 1785],
      ['mini-boruvka-rez', 620, 1500, 905, 1785],
    ],
  },
  {
    src: '437_zakusky_-2025-02.jpg', scale: 1.363, inset: 14, dir: 'products',
    items: [
      ['spicka-likerova', 22, 105, 315, 398],
      ['spicka-bila', 337, 105, 630, 398],
      ['indian', 640, 105, 933, 398],
      ['punc-koule', 22, 553, 315, 846],
      ['tiramisu', 337, 553, 630, 846],
      ['ovocna-kostka', 640, 553, 933, 846],
      ['trubicky', 22, 1003, 315, 1296],
      ['mrkvovy-dort-rez', 337, 1003, 630, 1296],
      ['kavove-zrno', 640, 1003, 933, 1296],
      ['jadrovy-rohlicek', 337, 1530, 630, 1823],
      ['muzikal', 640, 1530, 933, 1823],
    ],
  },
  {
    src: '438_zakusky_-2025-04.jpg', scale: 1.434, inset: 14, dir: 'products',
    items: [
      ['kremovy-rez', 22, 40, 300, 318],
      ['puncovy-rez', 318, 40, 596, 318],
      ['strecha', 606, 40, 884, 318],
      ['prazska-koule', 22, 543, 300, 821],
      ['puncovy-tunel', 318, 543, 596, 821],
      ['kremes', 606, 543, 884, 821],
      ['venecek-srdicko', 22, 1045, 300, 1323],
      ['venecek-polevany', 318, 1045, 596, 1323],
      ['venecek-sleh', 606, 1045, 884, 1323],
      ['bananek', 22, 1548, 300, 1826],
      ['vetrnik', 318, 1548, 596, 1826],
      ['vetrnik-maxi', 606, 1548, 884, 1826],
    ],
  },
  {
    src: '444_zakusky_-2025-05.jpg', scale: 1.07, inset: 18, dir: 'products',
    items: [
      ['ovocny-kosicek', 422, 50, 795, 422],
      ['kubansky-rez', 810, 50, 1185, 422],
      ['pariz-malina', 28, 705, 402, 1078],
      ['pariz-rez', 430, 705, 802, 1078],
      ['pistacie-rez', 812, 705, 1185, 1078],
      ['karamel-rez', 28, 1380, 402, 1752],
      ['misa-malina', 430, 1380, 802, 1752],
      ['misa-rez', 812, 1380, 1185, 1752],
    ],
  },
  {
    src: '440_zakusky_-2025_kreslici-platno-14.jpg', scale: 1, inset: 22, dir: 'products',
    items: [
      ['boruvka-rez', 35, 30, 435, 432],
      ['laskonka', 452, 30, 852, 432],
      ['brabrant', 868, 30, 1268, 432],
    ],
  },
  {
    src: '431_zakusky_-2026-03.jpg', scale: 1, inset: 24, dir: 'products',
    items: [
      ['rolada-polovina', 457, 145, 857, 545],
      ['rolada-cela', 878, 145, 1278, 545],
      ['rolada-mini', 40, 890, 440, 1245],
    ],
  },
  {
    src: '460_ostatni-vyrobky_-2025-01.jpg', scale: 1.334, inset: 14, dir: 'products',
    items: [
      ['mrkvanek', 28, 20, 328, 320],
      ['hreben', 653, 20, 953, 320],
      ['zavin', 28, 515, 328, 815],
      ['frgal', 340, 515, 640, 815],
      ['vanocka', 653, 515, 953, 815],
      ['babovka', 28, 1010, 328, 1310],
      ['biskupsky-chlebicek', 340, 1010, 640, 1310],
      ['citronova-babeta', 653, 1010, 953, 1310],
      ['makovec', 28, 1505, 328, 1805],
      ['linecke-trene', 340, 1505, 640, 1805],
      ['vdolek', 653, 1505, 953, 1805],
    ],
  },
  {
    src: '462_ostatni-vyrobky_-2025-02.jpg', scale: 1.352, inset: 14, dir: 'products',
    items: [
      ['bulka', 28, 105, 323, 400],
      ['zapekana-klobasa', 340, 105, 635, 400],
      ['zapekany-parek', 648, 105, 943, 400],
      ['pizza-kapsa', 28, 590, 323, 885],
      ['pagace', 340, 590, 635, 885],
      ['pagacky', 28, 1085, 323, 1380],
      ['focaccia', 340, 1085, 635, 1380],
      ['chleb-kvaskovy', 178, 1525, 473, 1820],
      ['skvarkova-pomazanka', 652, 1525, 947, 1820],
    ],
  },
  {
    src: '461_ostatni-vyrobky_-2025-03.jpg', scale: 1.273, inset: 14, dir: 'products',
    items: [
      ['orechovy-rohlicek', 697, 18, 1010, 330],
      ['kremrole', 40, 535, 352, 848],
      ['koblihy', 517, 535, 830, 848],
      ['pistaciovy-kolac', 32, 1018, 345, 1330],
      ['kolac-tvaroh-jahoda', 367, 1018, 680, 1330],
      ['pusinky', 35, 1537, 348, 1850],
      ['piskoty', 683, 1537, 996, 1850],
    ],
  },
  {
    src: '446_chlebicky-01.jpg', scale: 1.24, inset: 16, dir: 'products',
    items: [
      ['chlebicek-sunka-salat', 48, 142, 638, 532],
      ['chlebicek-sunka-syr', 48, 683, 638, 1073],
      ['chlebicek-ruske-vejce', 52, 1228, 642, 1618],
    ],
  },
  {
    src: '447_chlebicky-02.jpg', scale: 1.24, inset: 16, dir: 'products',
    items: [
      ['chlebicek-pochoutkovy', 50, 127, 640, 517],
      ['chlebicek-vysocina', 48, 646, 638, 1036],
    ],
  },
  {
    src: '448_chlebicky-03.jpg', scale: 1.394, inset: 14, dir: 'products',
    items: [
      ['chlebicek-kureci', 42, 95, 567, 440],
      ['chlebicek-syrova-variace', 47, 572, 572, 918],
    ],
  },
  {
    src: '449_chlebicky-04.jpg', scale: 2.091, inset: 10, dir: 'products',
    items: [
      ['chlebicek-redkvicka', 28, 378, 377, 608],
      ['chlebicek-mozzarella', 28, 1340, 377, 1570],
    ],
  },
  {
    src: '445_velikonoce-01.jpg', scale: 2.13, inset: 8, dir: 'products',
    items: [
      ['velikonocni-venec', 8, 12, 192, 197],
      ['mazanec', 8, 222, 192, 392],
      ['beranek-pernikovy', 8, 410, 192, 597],
      ['beranek-slehany', 8, 1205, 192, 1392],
      ['linecky-balicek', 8, 1800, 192, 1985],
    ],
  },
  {
    src: '478_cukrovi-2026.jpg', scale: 1, inset: 14, dir: 'products',
    items: [
      ['cukrovi-mix', 68, 473, 462, 838],
      ['cukrovi-marmeladove', 537, 473, 930, 838],
      ['cukrovi-darkova-krabicka', 1005, 473, 1398, 838],
    ],
  },
  {
    src: '240_marcipanove-srdicka.jpg', scale: 1.141, inset: 4, dir: 'products',
    items: [
      ['srdicko-zlate', 533, 125, 947, 505],
      ['srdicko-kremove', 1052, 722, 1465, 1102],
    ],
  },
  {
    src: '290_modelovaci-hmota-01.jpg', scale: 1.281, inset: 4, dir: 'products',
    items: [
      ['ozdoby-sada-4', 55, 890, 550, 1115],
      ['ozdoby-sada-5', 55, 1167, 738, 1393],
    ],
  },
  {
    src: '466_kopie-navrhu-kopie-navrhu-pomozte.jpeg', scale: 1, inset: 16, dir: 'gallery',
    items: [
      ['vysluzka-celofan', 65, 37, 397, 428],
      ['vysluzka-krabicka', 422, 37, 754, 428],
      ['vysluzka-srdicko', 794, 37, 1120, 428],
      ['vysluzka-okenko', 1157, 43, 1475, 437],
      ['sweetbar-kolace', 67, 475, 393, 867],
      ['kolacky-pivonky', 422, 475, 750, 865],
      ['eclairy', 422, 910, 752, 1243],
      ['kolace-boruvka', 794, 667, 1117, 1037],
      ['svatebni-dort-srdce', 794, 1080, 1112, 1440],
      ['sweetbar-stul', 67, 1080, 400, 1497],
      ['sweetbar-zakusky', 67, 1540, 400, 1975],
      ['dezerty-pohary', 422, 1468, 752, 1975],
      ['svatebni-dort-fiky', 785, 1468, 1112, 1975],
      ['svatebni-dort-ruze', 1155, 1468, 1478, 1975],
    ],
  },
  {
    src: '468_kopie-navrhu-kopie-navrhu-pomozte.jpeg', scale: 1, inset: 16, dir: 'gallery',
    items: [
      ['dort-srdce-malina', 65, 37, 343, 367],
      ['dort-cokoladovy-drip', 372, 37, 650, 367],
      ['dort-jednorozec', 680, 37, 953, 367],
      ['dort-karamelovy', 57, 390, 343, 737],
      ['dort-macesky', 372, 762, 660, 1047],
      ['dort-fiky-patrovy', 995, 597, 1478, 1047],
      ['dort-auticko', 65, 1077, 340, 1360],
      ['dort-ovocny', 372, 1077, 660, 1360],
      ['dort-mrkvovy', 690, 1077, 948, 1360],
      ['dort-srdce-ovoce', 65, 1387, 340, 1660],
      ['dort-cislo-60', 372, 1385, 660, 1665],
      ['dort-ruze-patrovy', 993, 1087, 1452, 1585],
      ['dort-cokoladovy', 65, 1690, 340, 1975],
      ['dort-kiwi', 372, 1690, 650, 1975],
      ['dort-jahodovy', 990, 1600, 1452, 1975],
    ],
  },
];

// Logo „mlsná Beruška“ z letáku vánočního cukroví (černé na bílém) → průhledné PNG.
export const LOGO = { src: '478_cukrovi-2026.jpg', box: [560, 40, 935, 215] };

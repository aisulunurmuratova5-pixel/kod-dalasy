/* ====================== Ойын қозғалтқышы (таза функциялар) ====================== */
const COLS = 9, ROWS = 6;

const CHAPTERS = [
  { n:1, title:'Сызықтық алгоритм', short:'Сызықтық', levels:[0,5],
    goal:'Алгоритм ұғымы, орындаушы және оның командалар жүйесі, алгоритм қасиеттері, блок-схема. Python-дағы сызықтық бағдарлама.',
    codes:'5–6 сынып тақырыптары' },
  { n:2, title:'Тармақталған алгоритм', short:'Тармақталған', levels:[6,9],
    goal:'Шарт, толық және толымсыз тармақталу, кірістірілген және құрамды шарттар.',
    codes:'7.3.2.1 · 7.3.3.2' },
  { n:3, title:'Циклдік алгоритм', short:'Циклдік', levels:[10,13],
    goal:'Қайталану саны белгілі цикл (for) және шартты цикл (while), цикл ішіндегі тармақталу.',
    codes:'8.3.3.2 · 8.3.3.1' }
];

const OBJ = {
  '7.3.2.1':'Python программалау тілінде тармақталған алгоритмдерді жазу',
  '7.3.3.2':'Python программалау тіліндегі кірістірілген шарттарды қолдану',
  '8.3.3.2':'For цикл операторын пайдалану',
  '8.3.3.1':'While цикл операторын пайдалану'
};

const LEVELS = [
  /* ---------- 1-тарау: Сызықтық ---------- */
  { id:'a1', ch:1, title:'Орындаушы', concept:'Алгоритм', target:4,
    variants:[{map:['.........','..#...#..','.H...Y...','.........','....#....','.........']}],
    starter:'# {c:a1}\nhero.move_right()\n',
    palette:['move_right'],
    intro:'Сәлем! Мен Қыранмын. Батыр — орындаушы: ол тек өзі білетін командаларды орындайды. Сен оған алгоритм жазасың. Шаңыраққа жету үшін оңға жүр.',
    hint:'Батыр мен шаңырақтың арасындағы шаршыларды сана. Әр hero.move_right() — бір қадам, әр команда жеке жолда.',
    solution:'hero.move_right()\nhero.move_right()\nhero.move_right()\nhero.move_right()',
    quiz:{q:'Алгоритм дегеніміз не?', opts:['Нәтижеге жету үшін орындаушыға берілетін командалардың реттелген тізбегі','Компьютердің ішкі құрылғысы','Бағдарламалау тілінің атауы','Кез келген сурет'], a:0,
      explain:'Алгоритм — белгілі бір нәтижеге жету үшін орындалатын әрекеттердің реттелген тізбегі. Бұл ойында орындаушы — батыр.'} },
  { id:'a2', ch:1, title:'Тас бөгет', concept:'Дискреттілік', target:8,
    variants:[{map:['.........','......Y..','..####...','.........','.H#......','.........']}],
    starter:'# {c:a2}\nhero.move_up()\n',
    palette:['move_right','move_up','move_down','move_left'],
    intro:'Тастар тура жолды бөгеп тұр. Командалар жазылған ретімен, біртіндеп орындалады: алдымен жоғары көтеріл, сосын оңға жүр. Блок-схемада әр команда жеке блок болып тұрғанын қара.',
    hint:'hero.move_up() батырды жоғары, hero.move_right() оңға жүргізеді. Жоғары 3 рет, оңға 5 рет.',
    solution:'hero.move_up()\nhero.move_up()\nhero.move_up()\nhero.move_right()\nhero.move_right()\nhero.move_right()\nhero.move_right()\nhero.move_right()',
    quiz:{q:'Алгоритм жеке қадамдардан тұрады, әр қадам кезекпен орындалады. Бұл қай қасиет?', opts:['Нәтижелілік','Дискреттілік','Жалпылық','Түсініктілік'], a:1,
      explain:'Дискреттілік — алгоритмнің жеке-жеке қадамдарға бөлінуі. Келесі қадам алдыңғысы біткен соң басталады.'} },
  { id:'a3', ch:1, title:'Өзен жағасы', concept:'Түсініктілік', target:3,
    variants:[{map:['~~~~~~~~~','~H.....~~','~#####.~~','~~~~~~.~~','~~Y....~~','~~~~~~~~~']}],
    starter:'# {c:a3}\nhero.move_right(5)\n',
    palette:['move_right','move_up','move_down','move_left'],
    intro:'Өзен бойындағы жіңішке соқпақ. Командаға сан бер: hero.move_right(5) батырды бес қадам жүргізеді. Үш жолмен шаңыраққа жет!',
    hint:'Үш бөлік: оңға 5, төмен 3, солға 4. Әр бөлікке бір команда және жақшадағы сан.',
    solution:'hero.move_right(5)\nhero.move_down(3)\nhero.move_left(4)',
    quiz:{q:'Батыр hero.fly() командасын орындай алмайды. Алгоритмнің қай қасиеті бұзылды?', opts:['Түсініктілік: команда орындаушының командалар жүйесінде болуы керек','Дискреттілік','Нәтижелілік','Жалпылық'], a:0,
      explain:'Орындаушының командалар жүйесі (ОКЖ) — ол орындай алатын командалар жиыны. Алгоритм тек осы командалардан құралады.'} },
  { id:'a4', ch:1, title:'Алтын тамғалар', concept:'Нәтижелілік', target:4,
    variants:[{map:['.........','.H.g...#.','.#####.#.','...g..g..','.Y###....','.........']}],
    starter:'# {c:a4}\nhero.move_right(5)\n',
    palette:['move_right','move_up','move_down','move_left'],
    intro:'Үш алтын тамға шашылып жатыр. Үстінен өтсең, батыр өзі жинап алады. Бәрін жинап, шаңыраққа бар.',
    hint:'Жолды бөліктерге бөл: оңға, төмен, солға, тағы төмен. Төрт команда жеткілікті.',
    solution:'hero.move_right(5)\nhero.move_down(2)\nhero.move_left(5)\nhero.move_down()',
    quiz:{q:'Алгоритм шектеулі қадамнан кейін міндетті түрде нәтижеге жетуі керек. Бұл қай қасиет?', opts:['Анықтылық','Нәтижелілік','Дискреттілік','Түсініктілік'], a:1,
      explain:'Нәтижелілік — алгоритм шектеулі қадамнан кейін аяқталып, күткен нәтижені береді.'} },
  { id:'a5', ch:1, title:'Сиқырлы сөз', concept:'Шығару', target:3, password:'open',
    variants:[{map:['....#....','....#....','.H..G..Y.','....#....','....#....','....#....']}],
    starter:'# {c:a5}\nhero.move_right(2)\n',
    palette:['move_right','move_up','move_down','move_left','say'],
    intro:'Тас қақпаның бетінде «Ашыл» деп жазылған. Қақпаның көрші шаршысына кел де, hero.say("Ашыл") деп айт. Блок-схемада сөйлеу — шығару блогы, ол параллелограммен сызылады.',
    hint:'Сөзді тырнақшаға ал: hero.say("Ашыл"). Қате сөз айтсаң, қақпа ашылмайды.',
    solution:'hero.move_right(2)\nhero.say("{w:open}")\nhero.move_right(4)',
    quiz:{q:'Блок-схемада мәлімет шығару (hero.say) қандай фигурамен белгіленеді?', opts:['Ромб','Тіктөртбұрыш','Параллелограмм','Сопақша'], a:2,
      explain:'Параллелограмм — енгізу және шығару, тіктөртбұрыш — әрекет, ромб — шарт, сопақша — басы мен соңы.'} },
  { id:'a6', ch:1, title:'Екі қақпа', concept:'Айнымалы', target:6, password:'baiterek', require:{var:true},
    variants:[{map:['...#..#..','...#..#..','.H.G..G.Y','...#..#..','...#..#..','...#..#..']}],
    starter:'kilt = "{w:baiterek}"\nhero.move_right()\nhero.say(kilt)\n',
    palette:['move_right','move_up','move_down','move_left','say','var'],
    intro:'Екі қақпа бір сөзбен ашылады: «Бәйтерек». Сөзді kilt айнымалысына сақтадым. Енді hero.say(kilt) деп жаз — тырнақшасыз.',
    hint:'Әр қақпаның алдында тоқта да, hero.say(kilt) жаз. Айнымалының атын тырнақшаға алма.',
    solution:'kilt = "{w:baiterek}"\nhero.move_right()\nhero.say(kilt)\nhero.move_right(3)\nhero.say(kilt)\nhero.move_right(3)',
    quiz:{q:'kilt = "Бәйтерек" жолы блок-схемада қандай блок болады?', opts:['Әрекет блогы (тіктөртбұрыш): айнымалыға мән меншіктеу','Шарт блогы (ромб)','Басы блогы (сопақша)','Цикл блогы (алтыбұрыш)'], a:0,
      explain:'Меншіктеу — әрекет. Айнымалы мәннің атын сақтайды, кейін оны атымен шақырамыз.'} },

  /* ---------- 2-тарау: Тармақталған ---------- */
  { id:'b1', ch:2, title:'Жол айрығы', concept:'if / else', code:'7.3.2.1', target:8, require:{if:true},
    variants:[
      {map:['~~~~~~~~~','~~~...~~~','H...#...Y','~~~~~~~~~','.........','.........']},
      {map:['~~~~~~~~~','~~~...~~~','H.......Y','~~~~~~~~~','.........','.........']}
    ],
    starter:'hero.move_right(3)\nif hero.can_move("right"):\n    hero.move_right(5)\nelse:\n    # {c:b1}\n    hero.move_up()\n',
    palette:['move_right','move_up','move_down','if_can','else'],
    intro:'Бұл деңгейдің екі картасы бар: біреуінде жолда тас жатыр, екіншісінде жоқ. Алгоритмің екеуінде де жұмыс істеуі керек. hero.can_move("right") — оңға жол бос болса True, бөгет болса False қайтарады.',
    hint:'else бөлігінде тасты жоғарыдан айналып өт: жоғары 1, оңға 2, төмен 1, оңға 3. Картаның нұсқаларын ауыстырып, екеуін де қара.',
    solution:'hero.move_right(3)\nif hero.can_move("right"):\n    hero.move_right(5)\nelse:\n    hero.move_up()\n    hero.move_right(2)\n    hero.move_down()\n    hero.move_right(3)',
    quiz:{q:'Тармақталған алгоритм дегеніміз не?', opts:['Шартқа байланысты әртүрлі командалар орындалатын алгоритм','Командалар бірінен соң бірі орындалатын алгоритм','Бір әрекет қайта-қайта орындалатын алгоритм','Командасы жоқ алгоритм'], a:0,
      explain:'Тармақталған алгоритмде шарт тексеріледі: ақиқат болса бір тармақ, жалған болса екінші тармақ орындалады.'} },
  { id:'b2', ch:2, title:'Шұңқыр бар ма?', concept:'Толымсыз тармақталу', code:'7.3.2.1', target:10, require:{if:true},
    variants:[
      {map:['~~~~~~~~~','.........','H.s...s.Y','#########','.........','.........']},
      {map:['~~~~~~~~~','.........','H...s...Y','#########','.........','.........']},
      {map:['~~~~~~~~~','.........','H.s.s.s.Y','#########','.........','.........']}
    ],
    starter:'hero.move_right(2)\nif hero.on_hole():\n    hero.plant()\n',
    palette:['move_right','if_hole','plant'],
    intro:'Үш картада шұңқырлар әр жерде. Шұңқыр жоқ жерге отырғызуға болмайды. hero.on_hole() батыр шұңқыр үстінде тұрса True қайтарады. Мұнда else керек емес: шарт жалған болса, батыр ештеңе істемей әрі жүре береді.',
    hint:'Үш рет қайтала: оңға 2 қадам → if hero.on_hole(): hero.plant(). Соңында оңға 2 қадам. Бір бөлік үш рет қайталанғанын байқадың ба? 3-тарауда оны циклмен қысқартамыз.',
    solution:'hero.move_right(2)\nif hero.on_hole():\n    hero.plant()\nhero.move_right(2)\nif hero.on_hole():\n    hero.plant()\nhero.move_right(2)\nif hero.on_hole():\n    hero.plant()\nhero.move_right(2)',
    quiz:{q:'else бөлігі жоқ if қалай жұмыс істейді?', opts:['Шарт жалған болса, ештеңе орындалмай, келесі командаға өтеді','Қате шығады','Шарт ақиқат болса да орындалмайды','Бағдарлама тоқтайды'], a:0,
      explain:'Бұл — толымсыз тармақталу. Шарт ақиқат болғанда ғана if ішіндегі командалар орындалады.'} },
  { id:'b3', ch:2, title:'Тақтадағы сан', concept:'Салыстыру', code:'7.3.2.1', target:7, require:{if:true},
    rule:n => n > 10 ? 'sun' : 'moon', ruleText:'Сан 10-нан үлкен болса — «Күн», әйтпесе — «Ай».',
    variants:[
      {sign:7,  map:['....#....','....#....','.H..G..Y.','....#....','....#....','....#....']},
      {sign:15, map:['....#....','....#....','.H..G..Y.','....#....','....#....','....#....']},
      {sign:10, map:['....#....','....#....','.H..G..Y.','....#....','....#....','....#....']}
    ],
    starter:'hero.move_right(2)\nn = hero.read()\nif n > 10:\n    hero.say("{w:sun}")\n',
    palette:['move_right','read','if_n','else','say'],
    intro:'Қақпаның тақтасында сан жазылған, ол әр картада әртүрлі. Ереже: сан 10-нан үлкен болса «Күн», әйтпесе «Ай» деп айт. n = hero.read() тақтадағы санды n айнымалысына жазады. Қате сөз айтсаң, қақпа ашылмайды!',
    hint:'else: бөлігін қос, онда hero.say("Ай"). Соңында, шегініссіз, hero.move_right(4). 3-картадағы 10 саны 10-нан үлкен емес!',
    solution:'hero.move_right(2)\nn = hero.read()\nif n > 10:\n    hero.say("{w:sun}")\nelse:\n    hero.say("{w:moon}")\nhero.move_right(4)',
    quiz:{q:'n = 10 болғанда, n > 10 шартының мәні қандай?', opts:['True (ақиқат)','False (жалған)','10','Қате шығады'], a:1,
      explain:'10 саны 10-нан үлкен емес, сондықтан шарт жалған (False). Шекарадағы мәндерді әрқашан тексер.'} },
  { id:'b4', ch:2, title:'Үш жол', concept:'elif · құрамды шарт', code:'7.3.3.2', target:9, require:{if:true},
    rule:n => n < 10 ? 'moon' : n <= 20 ? 'sun' : 'star', ruleText:'10-нан кіші — «Ай», 10-нан 20-ға дейін (20 де кіреді) — «Күн», 20-дан үлкен — «Жұлдыз».',
    variants:[
      {sign:4,  map:['.........','....Y....','.........','####G####','.........','....H....']},
      {sign:20, map:['.........','....Y....','.........','####G####','.........','....H....']},
      {sign:27, map:['.........','....Y....','.........','####G####','.........','....H....']}
    ],
    starter:'hero.move_up()\nn = hero.read()\nif n < 10:\n    hero.say("{w:moon}")\n',
    palette:['move_up','read','if_n','elif','else','say'],
    intro:'Енді үш жауап бар: n < 10 болса «Ай», 10 ≤ n ≤ 20 болса «Күн», n > 20 болса «Жұлдыз». Үш тармақ үшін elif қолдан немесе шартты and арқылы құрастыр.',
    hint:'if n < 10: … elif n <= 20: … else: … Соңында шегініссіз hero.move_up(3). Немесе: if n >= 10 and n <= 20.',
    solution:'hero.move_up()\nn = hero.read()\nif n < 10:\n    hero.say("{w:moon}")\nelif n <= 20:\n    hero.say("{w:sun}")\nelse:\n    hero.say("{w:star}")\nhero.move_up(3)',
    quiz:{q:'elif не үшін керек?', opts:['Алдыңғы шарт жалған болғанда, жаңа шартты тексеру үшін','Циклді тоқтату үшін','Айнымалы жариялау үшін','Мәтінді экранға шығару үшін'], a:0,
      explain:'elif — «әйтпесе, егер». Шарттар жоғарыдан төмен тексеріледі; бірінші ақиқат шарттың тармағы ғана орындалады.'} },

  /* ---------- 3-тарау: Циклдік ---------- */
  { id:'c1', ch:3, title:'Тау баспалдағы', concept:'for циклі', code:'8.3.3.2', target:3, require:{for:true},
    variants:[{map:['......#Y.','.....#.g.','....#.g..','...#.g...','..#.g....','..Hg.....']}],
    starter:'for i in range(5):\n    hero.move_right()\n    # {c:c1}\n',
    palette:['move_right','move_up','for'],
    intro:'Тау баспалдағы: оңға, жоғары, оңға, жоғары… Бір командаларды қайта-қайта жазба: for циклін қолдан. Қайталану саны алдын ала белгілі — 5 рет. Блок-схемада цикл алтыбұрышпен сызылады.',
    hint:'Цикл ішінде екі команда: hero.move_right() және hero.move_up(). Екеуі де 4 бос орыннан басталады.',
    solution:'for i in range(5):\n    hero.move_right()\n    hero.move_up()',
    quiz:{q:'for i in range(5): ішіндегі командалар неше рет орындалады?', opts:['4 рет','5 рет','6 рет','1 рет'], a:1,
      explain:'range(5) — 0, 1, 2, 3, 4 сандары. Барлығы бес айналым.'} },
  { id:'c2', ch:3, title:'Белгісіз қашықтық', concept:'while циклі', code:'8.3.3.1', target:2, require:{while:true},
    variants:[
      {map:['~~~~~~~~~','.........','H...Y####','#########','.........','.........']},
      {map:['~~~~~~~~~','.........','H.....Y##','#########','.........','.........']},
      {map:['~~~~~~~~~','.........','H.......Y','#########','.........','.........']}
    ],
    starter:'# {c:c2}\nhero.move_right(4)\n',
    palette:['move_right','while'],
    intro:'Бұл код 1-картада жұмыс істейді, бірақ қалған екеуінде шаңырақ алысырақ. Қанша қадам керегі алдын ала белгісіз. Мұндайда while циклі қолданылады: шарт ақиқат болғанша қайталайды.',
    hint:'while not hero.at_yurt(): ішінде бір ғана команда — hero.move_right(). Барлығы екі жол.',
    solution:'while not hero.at_yurt():\n    hero.move_right()',
    quiz:{q:'for мен while циклінің айырмашылығы қандай?', opts:['for — қайталану саны алдын ала белгілі; while — шарт ақиқат болғанша қайталайды','Айырмашылығы жоқ','while тек бір рет орындалады','for шартты тексереді, while санайды'], a:0,
      explain:'Қадам саны белгілі болса — for, белгісіз болса (шартқа тәуелді болса) — while.'} },
  { id:'c3', ch:3, title:'Цикл мен шарт', concept:'Цикл + тармақталу', code:'8.3.3.2', target:4, require:{for:true, if:true},
    variants:[
      {map:['~~~~~~~~~','.........','Hs.s..s.Y','#########','.........','.........']},
      {map:['~~~~~~~~~','.........','H.s..s.sY','#########','.........','.........']},
      {map:['~~~~~~~~~','.........','Hss.s..sY','#########','.........','.........']}
    ],
    starter:'for i in range(8):\n    hero.move_right()\n',
    palette:['move_right','if_hole','plant','for'],
    intro:'«Шұңқыр бар ма?» деңгейін есіңе түсір. Енді шұңқырлар кез келген жерде болуы мүмкін. Әр қадамнан кейін тексер: шұңқыр болса — отырғыз. Циклдің ішіне тармақталу саламыз.',
    hint:'for ішінде: hero.move_right(), сосын if hero.on_hole(): және оның ішінде (8 бос орын) hero.plant().',
    solution:'for i in range(8):\n    hero.move_right()\n    if hero.on_hole():\n        hero.plant()',
    quiz:{q:'for i in range(8): ішіндегі if неше рет тексеріледі?', opts:['8 рет — әр айналымда бір рет','1 рет','Шұңқыр саны қанша болса, сонша рет','16 рет'], a:0,
      explain:'Цикл денесі 8 рет орындалады, сондықтан шарт та 8 рет тексеріледі. Ал plant() — тек шарт ақиқат болғанда.'} },
  { id:'c4', ch:3, title:'Шаңыраққа оралу', concept:'Қорытынды', code:'8.3.3.1', target:9, require:{while:true, if:true},
    rule:n => n % 2 === 0 ? 'even' : 'odd', ruleText:'Тақтадағы сан жұп болса — «Жұп», тақ болса — «Тақ».',
    variants:[
      {sign:14, map:['...#.....','...#.....','H..G....Y','...#.....','...#.....','...#.....']},
      {sign:7,  map:['.....#...','.....#...','H....G..Y','.....#...','.....#...','.....#...']},
      {sign:21, map:['..#......','..#......','H.G.....Y','..#......','..#......','..#......']}
    ],
    starter:'while not hero.at_yurt():\n    if hero.can_move("right"):\n        hero.move_right()\n    else:\n        n = hero.read()\n',
    palette:['move_right','read','if_n','else','say','while','if_can'],
    intro:'Соңғы сынақ! Қақпа әр картада әр жерде, тақтадағы сан да әртүрлі. Ереже: сан жұп болса «Жұп», тақ болса «Тақ». Жұп санды тексеру: n % 2 == 0 (2-ге бөлгендегі қалдық нөл).',
    hint:'else ішінде, n = hero.read() жолынан кейін: if n % 2 == 0: hero.say("Жұп") else: hero.say("Тақ"). Шегіністерге мұқият бол: 8 және 12 бос орын.',
    solution:'while not hero.at_yurt():\n    if hero.can_move("right"):\n        hero.move_right()\n    else:\n        n = hero.read()\n        if n % 2 == 0:\n            hero.say("{w:even}")\n        else:\n            hero.say("{w:odd}")',
    quiz:{q:'while шарты ешқашан жалған болмаса не болады?', opts:['Шексіз цикл: бағдарлама тоқтамайды','Цикл бір рет орындалады','Python шартты өзі түзетеді','Цикл мүлде орындалмайды'], a:0,
      explain:'while шарт ақиқат болғанша қайталайды. Цикл ішінде шартты өзгертетін әрекет болуы керек — мұнда батырдың алға жылжуы.'} }
];

/* ---------- Лексер ---------- */
const METHODS = { move_right:[0,1], move_left:[0,1], move_up:[0,1], move_down:[0,1], say:[1,1], plant:[0,0],
                  can_move:[1,1], on_hole:[0,0], at_yurt:[0,0], read:[0,0] };
const SENSORS = new Set(['can_move','on_hole','at_yurt','read']);
const FUNCS = { print:[0,9], str:[1,1], int:[1,1], len:[1,1], abs:[1,1] };
const MOVE_DIR = { move_right:[1,0], move_left:[-1,0], move_up:[0,-1], move_down:[0,1] };
const KW = new Set(['if','elif','else','while','for','in','not','and','or','True','False','None','pass','break']);
const KNOWN = new Set([...KW, 'hero', 'range', ...Object.keys(METHODS), ...Object.keys(FUNCS)]);
const ID_START = /[\p{L}_]/u, ID_PART = /[\p{L}\p{N}_]/u;

class CodeError { constructor(line, msg){ this.line = line; this.msg = msg; } }

function levelInfo(map){
  const info = { start:null, yurt:null, gems:[], spots:[], gates:[] };
  map.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === 'H') info.start = [x, y];
    if (c === 'Y') info.yurt = [x, y];
    if (c === 'g') info.gems.push([x, y]);
    if (c === 's') info.spots.push([x, y]);
    if (c === 'G') info.gates.push([x, y]);
  }));
  return info;
}

function stripComment(line){
  let q = null;
  for (let i = 0; i < line.length; i++){
    const c = line[i];
    if (q){ if (c === q) q = null; }
    else if (c === '"' || c === "'") q = c;
    else if (c === '#') return line.slice(0, i);
  }
  return line;
}
function codeLines(src){
  return src.replace(/\t/g, '    ').split('\n').filter(l => stripComment(l).trim() !== '').length;
}

const LOOK = {'а':'a','е':'e','о':'o','р':'p','с':'c','х':'x','у':'y','і':'i','һ':'h','к':'k','м':'m','т':'t','в':'b','н':'h','Н':'H','Е':'E','О':'O','Р':'P','С':'C','Т':'T','К':'K','М':'M','В':'B','А':'A','Ү':'Y','І':'I'};
function delook(s){ return s.replace(/[аеорсхуіһкмтвнНЕОРСТКМВАҮІ]/g, c => LOOK[c]); }

function lev(a, b){
  const d = Array.from({length:a.length + 1}, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return d[a.length][b.length];
}
function suggest(name, list){
  const flat = s => s.toLowerCase().replace(/_/g, '');
  let best = null, bestD = 99;
  for (const m of list){
    if (flat(m) === flat(name)) return m;
    const d = lev(flat(m), flat(name));
    if (d < bestD){ bestD = d; best = m; }
  }
  return bestD <= 2 ? best : null;
}

function lexLine(s, n){
  const toks = []; let i = 0;
  while (i < s.length){
    const c = s[i];
    if (c === ' '){ i++; continue; }
    if (/\d/.test(c)){
      let j = i; while (j < s.length && /\d/.test(s[j])) j++;
      if (s[j] === '.' && /\d/.test(s[j+1] || '')){ j++; while (j < s.length && /\d/.test(s[j])) j++; }
      toks.push({t:'num', v:+s.slice(i, j), p:i, e:j}); i = j; continue;
    }
    if (c === '"' || c === "'"){
      let j = i + 1; while (j < s.length && s[j] !== c) j++;
      if (j >= s.length) throw new CodeError(n, t('e.quoteOpen', {q:c}));
      toks.push({t:'str', v:s.slice(i + 1, j), p:i, e:j + 1}); i = j + 1; continue;
    }
    if ('«»“”„'.includes(c)) throw new CodeError(n, t('e.quoteType'));
    if (ID_START.test(c)){
      let j = i; while (j < s.length && ID_PART.test(s[j])) j++;
      const w = s.slice(i, j);
      if (/[Ѐ-ӿ]/.test(w)){
        const d = delook(w);
        if (d !== w && KNOWN.has(d)) throw new CodeError(n, t('e.cyrillic', {w, d}));
      }
      toks.push({t:KW.has(w) ? 'kw' : 'id', v:w, p:i, e:j}); i = j; continue;
    }
    const two = s.slice(i, i + 2);
    if (['==','!=','<=','>=','//','+=','-='].includes(two)){ toks.push({t:'op', v:two, p:i, e:i + 2}); i += 2; continue; }
    if ('+-*/%<>=(),:.'.includes(c)){ toks.push({t:'op', v:c, p:i, e:i + 1}); i++; continue; }
    if (c === ' ') { i++; continue; }
    throw new CodeError(n, t('e.badChar', {c}));
  }
  return toks;
}

/* ---------- Парсер ---------- */
let SID = 0;
function parseExprToks(toks, n, text){
  let p = 0;
  const peek = (o = 0) => toks[p + o];
  const isOp = (v, o = 0) => peek(o) && peek(o).t === 'op' && peek(o).v === v;
  const isKw = (v, o = 0) => peek(o) && peek(o).t === 'kw' && peek(o).v === v;
  const srcOf = (a, b) => text.slice(toks[a].p, toks[b - 1].e);
  function expect(v, msg){ if (!isOp(v)) throw new CodeError(n, msg); p++; }
  function orE(){ let l = andE(); while (isKw('or')){ p++; l = {k:'or', l, r:andE()}; } return l; }
  function andE(){ let l = notE(); while (isKw('and')){ p++; l = {k:'and', l, r:notE()}; } return l; }
  function notE(){ if (isKw('not')){ p++; return {k:'not', e:notE()}; } return cmpE(); }
  function cmpE(){
    const first = arith(); const ops = [], items = [first];
    while (peek() && peek().t === 'op' && ['==','!=','<','>','<=','>='].includes(peek().v)){ ops.push(toks[p++].v); items.push(arith()); }
    if (isOp('=')) throw new CodeError(n, t('e.cmpEq'));
    return ops.length ? {k:'cmp', ops, items} : first;
  }
  function arith(){ let l = term(); while (isOp('+') || isOp('-')){ const op = toks[p++].v; l = {k:'bin', op, l, r:term()}; } return l; }
  function term(){ let l = unary(); while (isOp('*') || isOp('/') || isOp('//') || isOp('%')){ const op = toks[p++].v; l = {k:'bin', op, l, r:unary()}; } return l; }
  function unary(){ if (isOp('-')){ p++; return {k:'neg', e:unary()}; } if (isOp('+')){ p++; return unary(); } return primary(); }
  function args(){
    expect('(', t('e.parenOpen'));
    const list = [], srcs = [];
    if (isOp(')')){ p++; return {list, srcs}; }
    while (true){
      const a0 = p;
      list.push(orE()); srcs.push(srcOf(a0, p));
      if (isOp(',')){ p++; continue; }
      if (isOp(')')){ p++; break; }
      if (!peek()) throw new CodeError(n, t('e.parenEnd'));
      throw new CodeError(n, t('e.argsComma'));
    }
    return {list, srcs};
  }
  function primary(){
    const t = toks[p];
    if (!t) throw new CodeError(n, tr('e.exprIncomplete'));
    if (t.t === 'num'){ p++; return {k:'num', v:t.v}; }
    if (t.t === 'str'){ p++; return {k:'str', v:t.v}; }
    if (t.t === 'kw'){
      if (t.v === 'True' || t.v === 'False'){ p++; return {k:'bool', v:t.v === 'True'}; }
      if (t.v === 'None'){ p++; return {k:'none'}; }
      throw new CodeError(n, tr('e.kwHere', {w:t.v}));
    }
    if (t.t === 'op' && t.v === '('){ p++; const e = orE(); expect(')', tr('e.parenClose')); return e; }
    if (t.t === 'id'){
      p++;
      if (t.v === 'hero'){
        if (!isOp('.')) throw new CodeError(n, tr('e.heroDot'));
        p++;
        const m = peek();
        if (!m || m.t !== 'id') throw new CodeError(n, tr('e.dotName'));
        p++;
        if (!METHODS[m.v]){
          const s = suggest(m.v, Object.keys(METHODS));
          throw new CodeError(n, s ? tr('e.noCmdS', {m:m.v, s}) : tr('e.noCmd', {m:m.v}));
        }
        if (!isOp('(')) throw new CodeError(n, tr('e.needParen', {m:m.v}));
        const a = args();
        const [mn, mx] = METHODS[m.v];
        if (a.list.length > mx) throw new CodeError(n, mx === 0 ? tr('e.noArgs', {m:m.v}) : tr('e.oneArg', {m:m.v}));
        if (a.list.length < mn) throw new CodeError(n, m.v === 'say' ? tr('e.sayArg') : tr('e.dirArg'));
        return {k:'hcall', name:m.v, args:a.list, argSrc:a.srcs};
      }
      if (isOp('(')){
        if (!FUNCS[t.v]){
          if (METHODS[t.v]) throw new CodeError(n, tr('e.needHero', {m:t.v}));
          if (t.v === 'range') throw new CodeError(n, tr('e.rangeOnly'));
          const s = suggest(t.v, Object.keys(FUNCS));
          throw new CodeError(n, s ? tr('e.noFnS', {f:t.v, s}) : tr('e.noFn', {f:t.v}));
        }
        const a = args();
        const [mn, mx] = FUNCS[t.v];
        if (a.list.length < mn || a.list.length > mx) throw new CodeError(n, tr('e.fnArgs', {f:t.v}));
        return {k:'fcall', name:t.v, args:a.list, argSrc:a.srcs};
      }
      if (t.v === 'Hero' || t.v === 'HERO') throw new CodeError(n, tr('e.heroLower'));
      return {k:'var', name:t.v};
    }
    if (t.t === 'op' && t.v === ':') throw new CodeError(n, tr('e.colonExtra'));
    throw new CodeError(n, tr('e.extraInExpr', {v:t.v}));
  }
  const e = orE();
  if (p < toks.length){
    const t = toks[p];
    if (t.t === 'op' && t.v === ':') throw new CodeError(n, tr('e.colonOnly'));
    if (t.t === 'op' && t.v === ')') throw new CodeError(n, tr('e.parenExtra'));
    throw new CodeError(n, tr('e.extraWord', {v:t.v}));
  }
  return e;
}

function parseLine(ln){
  const n = ln.line, text = ln.text;
  const toks = lexLine(text, n);
  const t0 = toks[0], last = toks[toks.length - 1];
  const colon = last.t === 'op' && last.v === ':';
  const base = {id:'s' + (++SID), line:n, src:text.replace(/\s*:\s*$/, '')};
  if (t0.t === 'id' && ['If','Elif','Else','While','For','IF','WHILE','FOR','ELSE'].includes(t0.v))
    throw new CodeError(n, t('e.kwLower', {w:t0.v.toLowerCase()}));
  if (t0.t === 'id' && ['else','esle','eles','elsе'].includes(t0.v)) throw new CodeError(n, t('e.elseForm'));
  if (t0.t === 'kw' && ['if','elif','while'].includes(t0.v)){
    if (!colon) throw new CodeError(n, t('e.colonEnd', {w:t0.v}));
    const inner = toks.slice(1, -1);
    if (!inner.length) throw new CodeError(n, t('e.condAfter', {w:t0.v}));
    const cond = parseExprToks(inner, n, text);
    return {...base, type:t0.v, cond, condSrc:text.slice(inner[0].p, inner[inner.length - 1].e)};
  }
  if (t0.t === 'kw' && t0.v === 'else'){
    if (toks.length === 1) throw new CodeError(n, t('e.colonEnd', {w:'else'}));
    if (!colon || toks.length !== 2) throw new CodeError(n, t('e.elseNoCond'));
    return {...base, type:'else'};
  }
  if (t0.t === 'kw' && t0.v === 'for'){
    if (!colon) throw new CodeError(n, t('e.colonEnd', {w:'for'}));
    const v = toks[1];
    if (!v || v.t !== 'id') throw new CodeError(n, t('e.forForm'));
    if (!toks[2] || toks[2].v !== 'in') throw new CodeError(n, t('e.forIn'));
    if (!toks[3] || toks[3].v !== 'range') throw new CodeError(n, t('e.forRange'));
    const inner = toks.slice(4, -1);
    if (!inner.length || inner[0].v !== '(' || inner[inner.length - 1].v !== ')') throw new CodeError(n, t('e.rangeParen'));
    const wrapped = [{t:'id', v:'print', p:inner[0].p, e:inner[0].p}].concat(inner);
    const call = parseExprToks(wrapped, n, text);
    if (call.args.length < 1 || call.args.length > 3) throw new CodeError(n, t('e.rangeCount'));
    return {...base, type:'for', v:v.v, args:call.args, argSrc:call.argSrc};
  }
  if (t0.t === 'kw' && (t0.v === 'pass' || t0.v === 'break')){
    if (toks.length > 1) throw new CodeError(n, t('e.nothingAfter', {w:t0.v}));
    return {...base, type:t0.v};
  }
  if (colon) throw new CodeError(n, t('e.colonOnly'));
  if (t0.t === 'id' && toks[1] && toks[1].t === 'op' && ['=','+=','-='].includes(toks[1].v)){
    if (t0.v === 'hero') throw new CodeError(n, t('e.heroAssign'));
    if (KNOWN.has(t0.v)) throw new CodeError(n, t('e.kwVar', {w:t0.v}));
    const rest = toks.slice(2);
    if (!rest.length) throw new CodeError(n, t('e.assignEmpty'));
    const expr = parseExprToks(rest, n, text);
    return {...base, type:'assign', name:t0.v, op:toks[1].v, expr, valSrc:text.slice(rest[0].p, rest[rest.length - 1].e)};
  }
  if (t0.t === 'id' && /^\d/.test(toks[0].v)) throw new CodeError(n, t('e.varDigit'));
  const e = parseExprToks(toks, n, text);
  if (e.k === 'hcall' || (e.k === 'fcall' && e.name === 'print')) return {...base, type:'expr', e};
  if (e.k === 'var' && METHODS[e.name]) throw new CodeError(n, t('e.needHero', {m:e.name}));
  if (e.k === 'var') throw new CodeError(n, t('e.varNoop', {n:e.name}));
  if (e.k === 'cmp' && e.ops[0] === '==') throw new CodeError(n, t('e.assignOneEq'));
  throw new CodeError(n, t('e.noop'));
}

function parseProgram(src){
  SID = 0;
  const lines = [];
  src.replace(/\t/g, '    ').split('\n').forEach((raw, i) => {
    const code = stripComment(raw).replace(/\s+$/, '');
    if (!code.trim()) return;
    lines.push({line:i + 1, indent:code.match(/^ */)[0].length, text:code.trim()});
  });
  let pos = 0;
  const head = t => t.split(/[\s:(]/)[0];
  function body(ln, indent, kw){
    const nx = lines[pos];
    if (!nx || nx.indent <= indent) throw new CodeError(ln.line, t('e.needBody', {w:kw}));
    return block(nx.indent);
  }
  function block(indent){
    const out = [];
    while (pos < lines.length){
      const ln = lines[pos];
      if (ln.indent < indent) break;
      if (ln.indent > indent) throw new CodeError(ln.line, t('e.extraIndent'));
      pos++;
      const st = parseLine(ln);
      if (st.type === 'elif' || st.type === 'else') throw new CodeError(ln.line, t('e.elseNoIf', {w:st.type}));
      if (st.type === 'if' || st.type === 'while' || st.type === 'for') st.body = body(ln, indent, st.type);
      if (st.type === 'if'){
        let cur = st;
        while (pos < lines.length && lines[pos].indent === indent){
          const nx = lines[pos], h = head(nx.text);
          if (h === 'elif'){ pos++; const e = parseLine(nx); e.type = 'if'; e.isElif = true; e.body = body(nx, indent, 'elif'); cur.orelse = [e]; cur = e; }
          else if (h === 'else'){ pos++; parseLine(nx); cur.orelse = body(nx, indent, 'else'); break; }
          else break;
        }
      }
      out.push(st);
    }
    return out;
  }
  return block(0);
}

function walk(list, fn){ for (const s of list || []){ fn(s); walk(s.body, fn); walk(s.orelse, fn); } }
function structure(prog){
  const r = {if:false, for:false, while:false, sayVar:false};
  const hasVar = e => !!e && (e.k === 'var' || ['bin','and','or'].includes(e.k) && (hasVar(e.l) || hasVar(e.r)) || (e.k === 'not' || e.k === 'neg') && hasVar(e.e) || e.k === 'cmp' && e.items.some(hasVar) || (e.k === 'fcall') && e.args.some(hasVar));
  walk(prog, s => {
    if (s.type === 'if') r.if = true;
    if (s.type === 'for') r.for = true;
    if (s.type === 'while') r.while = true;
    if (s.type === 'expr' && s.e.k === 'hcall' && s.e.name === 'say' && hasVar(s.e.args[0])) r.sayVar = true;
  });
  return r;
}
function algoType(prog){
  const s = structure(prog), loop = s.for || s.while;
  if (loop && s.if) return t('type.mixed');
  if (loop) return t('type.loop');
  if (s.if) return t('type.branch');
  return t('type.linear');
}

/* ---------- Интерпретатор ---------- */
const norm = s => String(s).trim().toLocaleLowerCase('kk');
const DIRS = { right:[1,0], 'оңға':[1,0], 'оң':[1,0], left:[-1,0], 'солға':[-1,0], 'сол':[-1,0], up:[0,-1], 'жоғары':[0,-1], down:[0,1], 'төмен':[0,1] };
function pyStr(v){
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (v === null || v === undefined) return 'None';
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(+v.toFixed(6));
  return String(v);
}
function pyRepr(v){ return typeof v === 'string' ? '"' + v + '"' : pyStr(v); }
const truthy = v => !(v === false || v === 0 || v === '' || v === null || v === undefined);
const passwordFor = (L, V) => L.rule ? L.rule(V.sign) : L.password;
/* Сөз кез келген тілде айтылса да қабылданады: «Күн», «Солнце» немесе «Sun» */
const isWord = (key, text) => !!key && (WORDS[key] || [key]).some(w => norm(w) === norm(text));

function simulate(prog, L, vi){
  const V = L.variants[vi], map = V.map, info = levelInfo(map);
  const st = { x:info.start[0], y:info.start[1], gems:new Set(), planted:new Set(), open:new Set() };
  const acts = [], vars = new Map(); let steps = 0, ops = 0;
  const key = (x, y) => x + ',' + y;
  const tile = (x, y) => (x < 0 || y < 0 || x >= COLS || y >= ROWS) ? null : (map[y][x] === 'H' ? '.' : map[y][x]);
  const walkable = (x, y) => { const c = tile(x, y); return c !== null && c !== '#' && c !== '~' && !(c === 'G' && !st.open.has(key(x, y))); };
  const BRK = {};
  function fail(line, msg, dir){ acts.push({type:'bump', line, msg, dx:dir[0], dy:dir[1]}); const e = new CodeError(line, msg); e.logged = true; throw e; }
  function step(dx, dy, s){
    if (++steps > 300) throw new CodeError(s.line, t('e.tooManySteps'));
    const nx = st.x + dx, ny = st.y + dy, c = tile(nx, ny);
    if (c === null) fail(s.line, t('e.edge'), [dx, dy]);
    if (c === '#') fail(s.line, t('e.rock'), [dx, dy]);
    if (c === '~') fail(s.line, t('e.water'), [dx, dy]);
    if (c === 'G' && !st.open.has(key(nx, ny))) fail(s.line, t('e.gateClosed'), [dx, dy]);
    acts.push({type:'move', fx:st.x, fy:st.y, x:nx, y:ny, line:s.line, id:s.id});
    st.x = nx; st.y = ny;
    if (c === 'g' && !st.gems.has(key(nx, ny))){ st.gems.add(key(nx, ny)); acts.push({type:'collect', x:nx, y:ny, line:s.line}); }
  }
  const nearGates = () => info.gates.filter(([gx, gy]) => Math.abs(gx - st.x) + Math.abs(gy - st.y) === 1);
  function hcall(e, s){
    const vals = e.args.map(a => ev(a, s));
    const name = e.name;
    if (MOVE_DIR[name]){
      const n = vals.length ? vals[0] : 1;
      if (typeof n !== 'number') throw new CodeError(s.line, t('e.stepsNum', {m:name}));
      if (!Number.isInteger(n) || n < 1 || n > 20) throw new CodeError(s.line, t('e.stepsRange'));
      for (let i = 0; i < n; i++) step(MOVE_DIR[name][0], MOVE_DIR[name][1], s);
      return null;
    }
    if (name === 'say'){
      const text = pyStr(vals[0]);
      acts.push({type:'say', text, line:s.line, id:s.id});
      const pw = passwordFor(L, V);
      const near = nearGates().filter(([gx, gy]) => !st.open.has(key(gx, gy)));
      if (near.length && pw !== undefined){
        if (isWord(pw, text)) near.forEach(([gx, gy]) => { st.open.add(key(gx, gy)); acts.push({type:'gate', x:gx, y:gy, line:s.line}); });
        else throw new CodeError(s.line, t('e.wrongWord', {t:text}) + (L.rule ? t('e.rereadRule') : ''));
      } else if (pw !== undefined && isWord(pw, text) && info.gates.some(([gx, gy]) => !st.open.has(key(gx, gy)))){
        acts.push({type:'note', line:s.line, msg:t('e.wordFar')});
      }
      return null;
    }
    if (name === 'plant'){
      const k = key(st.x, st.y);
      if (tile(st.x, st.y) !== 's') throw new CodeError(s.line, t('e.noHole'));
      if (st.planted.has(k)) throw new CodeError(s.line, t('e.planted'));
      st.planted.add(k); acts.push({type:'plant', x:st.x, y:st.y, line:s.line, id:s.id});
      return null;
    }
    if (name === 'can_move'){
      const d = DIRS[norm(vals[0])];
      if (!d) throw new CodeError(s.line, t('e.dirBad'));
      return walkable(st.x + d[0], st.y + d[1]);
    }
    if (name === 'on_hole') return tile(st.x, st.y) === 's' && !st.planted.has(key(st.x, st.y));
    if (name === 'at_yurt') return st.x === info.yurt[0] && st.y === info.yurt[1];
    if (name === 'read'){
      if (!nearGates().length) throw new CodeError(s.line, t('e.noSign'));
      return V.sign !== undefined ? V.sign : word(passwordFor(L, V));
    }
  }
  function fcall(e, s){
    const vals = e.args.map(a => ev(a, s));
    switch (e.name){
      case 'print': { const text = vals.map(pyStr).join(' '); acts.push({type:'print', text, line:s.line, id:s.id}); return null; }
      case 'str': return pyStr(vals[0]);
      case 'int': {
        const v = vals[0];
        if (typeof v === 'number') return Math.trunc(v);
        if (typeof v === 'boolean') return v ? 1 : 0;
        const k = parseInt(String(v).trim(), 10);
        if (!/^\s*-?\d+\s*$/.test(String(v))) throw new CodeError(s.line, t('e.intBad', {v}));
        return k;
      }
      case 'len': if (typeof vals[0] !== 'string') throw new CodeError(s.line, t('e.lenBad')); return [...vals[0]].length;
      case 'abs': if (typeof vals[0] !== 'number') throw new CodeError(s.line, t('e.absBad')); return Math.abs(vals[0]);
    }
  }
  function cmp(op, a, b, line){
    if (op === '==') return a === b;
    if (op === '!=') return a !== b;
    const num = x => typeof x === 'number' || typeof x === 'boolean';
    if (!(num(a) && num(b)) && !(typeof a === 'string' && typeof b === 'string'))
      throw new CodeError(line, t('e.cmpTypes'));
    if (op === '<') return a < b; if (op === '>') return a > b;
    if (op === '<=') return a <= b; return a >= b;
  }
  function ev(e, s){
    const line = s.line;
    switch (e.k){
      case 'num': case 'str': case 'bool': return e.v;
      case 'none': return null;
      case 'var':
        if (!vars.has(e.name)) throw new CodeError(line, t('e.noVar', {n:e.name}));
        return vars.get(e.name);
      case 'neg': { const v = ev(e.e, s); if (typeof v !== 'number') throw new CodeError(line, t('e.negText')); return -v; }
      case 'not': return !truthy(ev(e.e, s));
      case 'and': { const l = ev(e.l, s); return truthy(l) ? ev(e.r, s) : l; }
      case 'or': { const l = ev(e.l, s); return truthy(l) ? l : ev(e.r, s); }
      case 'cmp': {
        let a = ev(e.items[0], s);
        for (let i = 0; i < e.ops.length; i++){ const b = ev(e.items[i + 1], s); if (!cmp(e.ops[i], a, b, line)) return false; a = b; }
        return true;
      }
      case 'bin': {
        const l = ev(e.l, s), r = ev(e.r, s), op = e.op;
        if (op === '+'){
          if (typeof l === 'number' && typeof r === 'number') return l + r;
          if (typeof l === 'string' && typeof r === 'string') return l + r;
          throw new CodeError(line, t('e.addMix'));
        }
        if (op === '*' && typeof l === 'string' && typeof r === 'number') return l.repeat(Math.max(0, Math.min(r, 30)));
        if (typeof l !== 'number' || typeof r !== 'number') throw new CodeError(line, t('e.opText', {op}));
        if ((op === '/' || op === '//' || op === '%') && r === 0) throw new CodeError(line, t('e.divZero'));
        if (op === '-') return l - r;
        if (op === '*') return l * r;
        if (op === '/') return l / r;
        if (op === '//') return Math.floor(l / r);
        if (op === '%') return ((l % r) + r) % r;
      }
      case 'hcall': return hcall(e, s);
      case 'fcall': return fcall(e, s);
    }
  }
  function tick(s){ if (++ops > 3000) throw new CodeError(s.line, t('e.infinite')); }
  function exec(list){
    for (const s of list){
      tick(s);
      switch (s.type){
        case 'expr': {
          const r = s.e.k === 'hcall' ? hcall(s.e, s) : fcall(s.e, s);
          if (s.e.k === 'hcall' && SENSORS.has(s.e.name)) acts.push({type:'sense', line:s.line, id:s.id, value:pyStr(r)});
          break;
        }
        case 'assign': {
          let v = ev(s.expr, s);
          if (s.op !== '='){
            if (!vars.has(s.name)) throw new CodeError(s.line, t('e.varUnset', {n:s.name}));
            const old = vars.get(s.name);
            if (typeof old !== typeof v || (typeof v !== 'number' && s.op === '-=')) throw new CodeError(s.line, t('e.opType'));
            v = s.op === '+=' ? old + v : old - v;
          }
          vars.set(s.name, v);
          acts.push({type:'set', line:s.line, id:s.id, name:s.name, value:pyRepr(v)});
          break;
        }
        case 'if': {
          const r = truthy(ev(s.cond, s));
          acts.push({type:'eval', line:s.line, id:s.id, result:r});
          if (r) exec(s.body); else if (s.orelse) exec(s.orelse);
          break;
        }
        case 'while': {
          while (true){
            tick(s);
            const r = truthy(ev(s.cond, s));
            acts.push({type:'eval', line:s.line, id:s.id, result:r});
            if (!r) break;
            try { exec(s.body); } catch (x){ if (x === BRK) break; throw x; }
          }
          break;
        }
        case 'for': {
          const a = s.args.map(x => ev(x, s));
          if (a.some(v => typeof v !== 'number' || !Number.isInteger(v))) throw new CodeError(s.line, t('e.rangeInt'));
          let [from, to, stp] = a.length === 1 ? [0, a[0], 1] : [a[0], a[1], a.length === 3 ? a[2] : 1];
          if (stp === 0) throw new CodeError(s.line, t('e.rangeStep0'));
          let ran = 0;
          for (let i = from; stp > 0 ? i < to : i > to; i += stp){
            if (++ran > 200) throw new CodeError(s.line, t('e.rangeBig'));
            vars.set(s.v, i);
            acts.push({type:'iter', line:s.line, id:s.id, name:s.v, value:pyStr(i), result:true});
            try { exec(s.body); } catch (x){ if (x === BRK){ ran = -1; break; } throw x; }
          }
          if (ran !== -1) acts.push({type:'eval', line:s.line, id:s.id, result:false});
          break;
        }
        case 'break': throw BRK;
        case 'pass': break;
      }
    }
  }
  let error = null;
  try { exec(prog); }
  catch (e){
    if (e === BRK) error = new CodeError(1, t('e.breakOut'));
    else if (!(e instanceof CodeError)) throw e;
    else error = e;
    if (!error.logged) acts.push({type:'error', line:error.line, msg:error.msg});
  }
  const atYurt = st.x === info.yurt[0] && st.y === info.yurt[1];
  return { actions:acts, state:st, error, info, atYurt };
}

function evaluate(L, sims, src, prog){
  const nv = L.variants.length;
  const sfx = c => nv > 1 ? t('g.maps', {c, n:nv}) : '';
  const goals = [];
  const has = sims && sims.length;
  const cnt = f => has ? sims.filter(s => !s.error && f(s)).length : 0;
  const info0 = levelInfo(L.variants[0].map);
  const reach = cnt(s => s.atYurt);
  goals.push({ text:t('g.reach') + (has ? sfx(reach) : ''), done:has && reach === nv, req:true, fail:t('g.reachF') });
  if (L.variants.some(V => levelInfo(V.map).gems.length)){
    const c = cnt(s => s.state.gems.size === s.info.gems.length);
    goals.push({ text:t('g.gems') + (has ? sfx(c) : ''), done:has && c === nv, req:true, fail:t('g.gemsF') });
  }
  if (L.variants.some(V => levelInfo(V.map).spots.length)){
    const c = cnt(s => s.state.planted.size === s.info.spots.length);
    goals.push({ text:t('g.plant') + (has ? sfx(c) : ''), done:has && c === nv, req:true, fail:t('g.plantF') });
  }
  if (info0.gates.length){
    const c = cnt(s => s.state.open.size === s.info.gates.length);
    goals.push({ text:t('g.gate') + (has ? sfx(c) : ''), done:has && c === nv, req:true, fail:t('g.gateF') });
  }
  const R = L.require || {}, S = prog ? structure(prog) : {};
  if (R.if) goals.push({ text:t('g.if'), done:!!S.if, req:true, fail:t('g.ifF') });
  if (R.for) goals.push({ text:t('g.for'), done:!!S.for, req:true, fail:t('g.forF') });
  if (R.while) goals.push({ text:t('g.while'), done:!!S.while, req:true, fail:t('g.whileF') });
  if (R.var) goals.push({ text:t('g.var'), done:!!S.sayVar, req:true, fail:t('g.varF') });
  const lines = codeLines(src);
  goals.push({ text:t('g.short', {t:L.target, n:lines}), done:lines <= L.target, req:false });
  const ok = !!has && sims.every(s => !s.error) && goals.filter(g => g.req).every(g => g.done);
  return { goals, ok, lines, eff:lines <= L.target, firstFail:goals.find(g => g.req && !g.done) };
}
function variantOk(L, sim){
  return !sim.error && sim.atYurt && sim.state.gems.size === sim.info.gems.length &&
    sim.state.planted.size === sim.info.spots.length && sim.state.open.size === sim.info.gates.length;
}
function variantReason(L, sim){
  if (sim.error) return sim.error.msg;
  if (sim.state.planted.size < sim.info.spots.length) return t('r.holes');
  if (sim.state.gems.size < sim.info.gems.length) return t('r.gems');
  if (sim.state.open.size < sim.info.gates.length) return t('r.gate');
  if (!sim.atYurt) return t('r.yurt');
  return '';
}


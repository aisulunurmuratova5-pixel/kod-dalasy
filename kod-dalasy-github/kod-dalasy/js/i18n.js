/* ====================== Тілдер: қазақ, орыс, ағылшын ====================== */
const LANGS = { kk:'ҚАЗ', ru:'РУС', en:'ENG' };
const LANG_IDX = { kk:0, ru:1, en:2 };
let LANG = 'kk';

/* Әр жол: [қазақша, орысша, ағылшынша]. {x} — орнына мән қойылады. */
const S = {
  /* ---- жалпы ---- */
  'app.lang': ['Тіл', 'Язык', 'Language'],
  'top.home': ['Картаға оралу', 'Вернуться к карте', 'Back to the map'],
  'top.teacher': ['Мұғалімге', 'Учителю', 'Teacher'],
  'snd.on': ['Дыбыс', 'Звук', 'Sound'],
  'snd.off': ['Дыбыс өшік', 'Звук выкл.', 'Sound off'],
  'snd.aOn': ['Дыбысты өшіру', 'Выключить звук', 'Turn sound off'],
  'snd.aOff': ['Дыбысты қосу', 'Включить звук', 'Turn sound on'],
  'mus.on': ['Әуен', 'Музыка', 'Music'],
  'mus.off': ['Әуен өшік', 'Музыка выкл.', 'Music off'],
  'mus.aOn': ['Фондық әуенді өшіру', 'Выключить фоновую музыку', 'Turn background music off'],
  'mus.aOff': ['Фондық әуенді қосу', 'Включить фоновую музыку', 'Turn background music on'],
  'guest': ['Қонақ', 'Гость', 'Guest'],
  'user.switch': ['шығу немесе басқа оқушыны таңдау', 'выйти или выбрать другого ученика', 'log out or choose another student'],
  'user.switchT': ['Шығу немесе басқа оқушыны таңдау', 'Выйти или выбрать другого ученика', 'Log out or choose another student'],

  /* ---- карта ---- */
  'map.eyebrow': ['Информатика · «Алгоритм» бөлімі · Python', 'Информатика · раздел «Алгоритмы» · Python', 'Computer science · Algorithms · Python'],
  'map.title': ['Алгоритм жолы', 'Путь алгоритма', 'The Algorithm Road'],
  'map.lede': ['Ұлы Даланың алтын тамғалары шашылып, қақпалары жабылып қалды. Батыр — орындаушы, ал сен оған алгоритм жазасың. Сызықтық алгоритмнен бастап, тармақталу мен циклге дейін жетесің. Әр кодыңның блок-схемасы бірден сызылады.',
    'Золотые тамги Великой степи рассыпаны, а ворота закрыты. Герой — исполнитель, а ты пишешь для него алгоритм. Ты пройдёшь путь от линейного алгоритма до ветвлений и циклов. Блок-схема каждого твоего кода рисуется сразу.',
    'The gold coins of the Great Steppe are scattered and the gates are closed. The hero is the executor, and you write the algorithm for him. You go from linear algorithms to branching and loops. The game draws a flowchart of your code at once.'],
  'map.level': ['{n}-деңгей', 'Уровень {n}', 'Level {n}'],
  'map.locked': ['жабық', 'закрыт', 'locked'],
  'map.chapter': ['{n}-тарау', 'Глава {n}', 'Chapter {n}'],
  'side.progress': ['Барыс', 'Прогресс', 'Progress'],
  'side.stars': ['жұлдыз', 'звёзд', 'stars'],
  'side.levels': ['деңгей', 'уровней', 'levels'],
  'side.allDone': ['Бөлім аяқталды! Барлық 14 деңгей өтілді. Жетіспейтін жұлдыздарды жинап көр.', 'Раздел пройден! Все 14 уровней завершены. Попробуй собрать недостающие звёзды.', 'You finished the section! All 14 levels are done. Try to collect the missing stars.'],
  'side.replay': ['Соңғы деңгейді қайталау', 'Повторить последний уровень', 'Play the last level again'],
  'side.continue': ['Жалғастыру: {n}-деңгей', 'Продолжить: уровень {n}', 'Continue: level {n}'],
  'side.start': ['Бастау: {n}-деңгей', 'Начать: уровень {n}', 'Start: level {n}'],
  'side.chapters': ['Тараулар', 'Главы', 'Chapters'],
  'side.chInfo': ['{a}–{b} деңгей · {d}/{t} өтілді', 'уровни {a}–{b} · пройдено {d}/{t}', 'levels {a}–{b} · {d}/{t} done'],
  'side.wipe': ['Барысты өшіру', 'Сбросить прогресс', 'Reset progress'],
  'side.wipeSure': ['Иә, бәрін өшір', 'Да, сбросить всё', 'Yes, reset all'],

  /* ---- деңгей ---- */
  'lvl.map': ['Карта', 'Карта', 'Map'],
  'lvl.objective': ['Оқу мақсаты {c}', 'Цель обучения {c}', 'Learning objective {c}'],
  'lvl.stars': ['Жұлдыздар', 'Звёзды', 'Stars'],
  'lvl.maps': ['Карта нұсқалары:', 'Варианты карты:', 'Map versions:'],
  'lvl.hint': ['Кеңес', 'Подсказка', 'Hint'],
  'lvl.goals': ['Мақсаттар', 'Цели', 'Goals'],
  'lvl.rule': ['Ереже:', 'Правило:', 'Rule:'],
  'lvl.mentor': ['Қыран', 'Кыран', 'Kyran'],
  'lvl.world': ['Ойын әлемі', 'Игровой мир', 'Game world'],
  'ed.ref': ['Анықтама', 'Справка', 'Help'],
  'ed.code': ['Python коды', 'Код Python', 'Python code'],
  'ed.algo': ['Алгоритм түрі: {t}', 'Тип алгоритма: {t}', 'Algorithm type: {t}'],
  'ed.palette': ['Басып, кодқа қос:', 'Нажми, чтобы вставить в код:', 'Click to add to the code:'],
  'ed.vars': ['Айнымалылар:', 'Переменные:', 'Variables:'],
  'ed.run': ['Іске қос', 'Запустить', 'Run'],
  'ed.stop': ['Тоқтат', 'Стоп', 'Stop'],
  'ed.speed': ['Жылдамдық {s}×', 'Скорость {s}×', 'Speed {s}×'],
  'ed.reset': ['Бастапқы код', 'Начальный код', 'Starting code'],
  'ed.resetSure': ['Кодты өшіру — тағы бас', 'Стереть код — нажми ещё раз', 'Erase code? Click again'],
  'tab.flow': ['Блок-схема', 'Блок-схема', 'Flowchart'],
  'tab.log': ['Хабарлар', 'Сообщения', 'Messages'],
  'lg.term': ['басы / соңы', 'начало / конец', 'start / end'],
  'lg.proc': ['әрекет', 'действие', 'action'],
  'lg.io': ['енгізу / шығару', 'ввод / вывод', 'input / output'],
  'lg.dec': ['шарт', 'условие', 'condition'],
  'lg.loop': ['цикл (for)', 'цикл (for)', 'loop (for)'],
  'fc.stale': ['{n}-жолда қате бар, сондықтан блок-схема жаңартылмады.', 'В строке {n} есть ошибка, поэтому блок-схема не обновлена.', 'Line {n} has an error, so the flowchart was not updated.'],
  'log.line': ['{n}-жол', 'стр. {n}', 'line {n}'],
  'log.start': ['Кодты жаз да, «Іске қос» батырмасын бас. Пернетақтадан: Ctrl + Enter.', 'Напиши код и нажми «Запустить». С клавиатуры: Ctrl + Enter.', 'Write the code and click "Run". Keyboard: Ctrl + Enter.'],
  'log.reset': ['Бастапқы код қайтарылды.', 'Начальный код восстановлен.', 'The starting code is back.'],
  'log.stopped': ['Тоқтатылды.', 'Остановлено.', 'Stopped.'],
  'log.go': ['Батыр жолға шықты…', 'Герой отправился в путь…', 'The hero sets off…'],
  'log.goMap': ['{n}-карта: батыр жолға шықты…', 'Карта {n}: герой отправился в путь…', 'Map {n}: the hero sets off…'],
  'log.otherMap': ['{a}-картада алгоритм жұмыс істеді, бірақ {b}-картада: {r}', 'На карте {a} алгоритм сработал, но на карте {b}: {r}', 'The algorithm worked on map {a}, but on map {b}: {r}'],
  'log.win': ['Деңгей өтілді! Батыр шаңыраққа жетті.', 'Уровень пройден! Герой дошёл до юрты.', 'Level complete! The hero reached the yurt.'],
  'log.winMaps': ['Деңгей өтілді! Алгоритм барлық {n} картада жұмыс істеді.', 'Уровень пройден! Алгоритм сработал на всех {n} картах.', 'Level complete! The algorithm worked on all {n} maps.'],
  'm.errLine': ['{n}-жол: {m}', 'Строка {n}: {m}', 'Line {n}: {m}'],
  'm.otherMap': ['{n}-картаны қарап шығайық. Алгоритм барлық жағдайда жұмыс істеуі керек — бұл оның жалпылық қасиеті.', 'Давай посмотрим карту {n}. Алгоритм должен работать во всех случаях — это его свойство массовости.', 'Let’s look at map {n}. An algorithm must work in all cases. This is called generality.'],
  'm.win': ['Керемет! Шаңырақ саған есігін ашты.', 'Отлично! Юрта открыла тебе двери.', 'Great! The yurt opened its door for you.'],
  'm.fixGoals': ['{m} Мақсаттар тізімін қарап, кодты толықтыр.', '{m} Посмотри список целей и дополни код.', '{m} Look at the goals and finish the code.'],
  'goal.bonus': ['+1 жұлдыз', '+1 звезда', '+1 star'],

  /* ---- жеңіс ---- */
  'win.passed': ['{n}-деңгей өтілді', 'Уровень {n} пройден', 'Level {n} complete'],
  'win.chDone': [' · {n}-тарау аяқталды', ' · глава {n} пройдена', ' · chapter {n} done'],
  'win.title': ['Жарайсың, батыр!', 'Молодец, батыр!', 'Well done, hero!'],
  'win.titleCh': ['«{c}» меңгерілді!', '«{c}» освоен!', '"{c}" mastered!'],
  'win.titleAll': ['Бөлім аяқталды, батыр!', 'Раздел пройден, батыр!', 'You finished the section, hero!'],
  'win.s1': ['Деңгей өтілді', 'Уровень пройден', 'Level complete'],
  'win.s2': ['Үнемді код: {t} жолға дейін', 'Короткий код: до {t} строк', 'Short code: up to {t} lines'],
  'win.s2you': [' (сенде {n})', ' (у тебя {n})', ' (you have {n})'],
  'win.s3': ['Тұжырымды тексеру', 'Проверка понимания', 'Check your understanding'],
  'win.check': ['Тұжырымды тексер', 'Проверь себя', 'Check yourself'],
  'win.right': ['Дұрыс! ', 'Верно! ', 'Correct! '],
  'win.wrong': ['Дұрыс жауап белгіленді. ', 'Правильный ответ отмечен. ', 'The right answer is marked. '],
  'win.stay': ['Деңгейде қалу', 'Остаться на уровне', 'Stay on this level'],
  'win.toMap': ['Картаға', 'К карте', 'To the map'],
  'win.next': ['Келесі деңгей', 'Следующий уровень', 'Next level'],
  'win.backMap': ['Картаға оралу', 'Вернуться к карте', 'Back to the map'],
  'close': ['Жабу', 'Закрыть', 'Close'],

  /* ---- мұғалім ---- */
  't.title': ['Мұғалімге', 'Учителю', 'For the teacher'],
  't.intro': ['Деңгейлер «Алгоритм» тақырыбы бойынша үш тарауға бөлінген. 2 және 3-тараулардағы кодтарда тиісті оқу мақсатының коды көрсетілген. Сабақта интерактивті тақтада көрсету үшін барлық деңгейді бірден ашуға болады.',
    'Уровни разделены на три главы по теме «Алгоритмы». У уровней 2-й и 3-й глав указан код цели обучения. Чтобы показать игру на интерактивной доске, можно открыть все уровни сразу.',
    'The levels are in three chapters on the topic "Algorithms". Levels in chapters 2 and 3 show the learning objective code. To show the game on the board, you can open all levels at once.'],
  't.unlockAll': ['Барлық деңгейді ашу', 'Открыть все уровни', 'Open all levels'],
  't.unlockSeq': ['Деңгейлерді ретімен ашу', 'Открывать уровни по порядку', 'Open levels in order'],
  't.colN': ['№', '№', 'No.'],
  't.colLevel': ['Деңгей', 'Уровень', 'Level'],
  't.colType': ['Алгоритм түрі', 'Тип алгоритма', 'Algorithm type'],
  't.colObj': ['Оқу мақсаты', 'Цель обучения', 'Learning objective'],
  't.colSol': ['Шешім', 'Решение', 'Solution'],
  't.solution': ['Шешімі ({n} жол)', 'Решение ({n} стр.)', 'Solution ({n} lines)'],
  't.mapsN': [' · {n} карта нұсқасы', ' · {n} варианта карты', ' · {n} map versions'],
  't.ch1obj': ['Алгоритм, орындаушы, қасиеттері', 'Алгоритм, исполнитель, свойства', 'Algorithm, executor, properties'],
  't.students': ['Оқушылар · осы компьютер', 'Ученики · этот компьютер', 'Students · this computer'],
  't.class': ['Сынып:', 'Класс:', 'Class:'],
  't.all': ['Барлығы', 'Все', 'All'],
  't.csv': ['Excel-ге жүктеу (CSV)', 'Скачать для Excel (CSV)', 'Download for Excel (CSV)'],
  't.none': ['Бұл компьютерде әлі ешбір оқушы тіркелмеген.', 'На этом компьютере ещё нет учеников.', 'No students are registered on this computer yet.'],
  't.cStudent': ['Оқушы', 'Ученик', 'Student'],
  't.cClass': ['Сынып', 'Класс', 'Class'],
  't.cLevels': ['Деңгей', 'Уровни', 'Levels'],
  't.cStars': ['Жұлдыз', 'Звёзды', 'Stars'],
  't.cLast': ['Соңғы кіру', 'Последний вход', 'Last visit'],
  't.cAct': ['Әрекет', 'Действия', 'Actions'],
  't.del': ['Өшіру', 'Удалить', 'Delete'],
  't.delSure': ['Иә, өшір', 'Да, удалить', 'Yes, delete'],
  't.pinSure': ['Иә, тастау', 'Да, сбросить', 'Yes, reset'],
  't.deleted': ['{n} өшірілді.', '{n} удалён(а).', '{n} was deleted.'],
  't.pinDone': ['{n}: PIN енді 0000.', '{n}: PIN теперь 0000.', '{n}: the PIN is now 0000.'],
  't.saved': ['Файл сақталды.', 'Файл сохранён.', 'The file is saved.'],
  't.declined': ['Жүктеу тоқтатылды.', 'Скачивание отменено.', 'Download cancelled.'],
  't.copied': ['Жүктеу мүмкін болмады, кесте көшірілді: Excel-ге қойыңыз (Ctrl + V).', 'Скачать не удалось, таблица скопирована: вставьте её в Excel (Ctrl + V).', 'Download is not possible here. The table is copied: paste it into Excel (Ctrl + V).'],
  't.failed': ['Жүктеу мүмкін болмады.', 'Скачать не удалось.', 'Download failed.'],
  'csv.name': ['Аты-жөні', 'Имя и фамилия', 'Name'],
  'csv.class': ['Сынып', 'Класс', 'Class'],
  'csv.done': ['Өтілген деңгей', 'Пройдено уровней', 'Levels done'],
  'csv.stars': ['Жұлдыз (барлығы)', 'Звёзды (всего)', 'Stars (total)'],
  'csv.last': ['Соңғы кіру', 'Последний вход', 'Last visit'],
  't.tips': ['<li>Компьютер жетпесе — жұппен жұмыс: біреуі код жазады, екіншісі блок-схемадан тексереді, әр деңгейден кейін ауысады.</li><li>Карта нұсқалары (1, 2, 3) — алгоритмнің жалпылық қасиетін түсіндіруге ыңғайлы: код барлық жағдайда жұмыс істеуі керек.</li><li>Оқушы PIN кодын ұмытса, «PIN → 0000» батырмасымен тастаңыз. Оқушы 0000 кодымен кіреді.</li><li>Оқу мақсаттарының кодтары 7 және 8-сыныптарға арналған ҚМЖ үлгілерінен алынған. Өз оқу жоспарыңызбен салыстырып алыңыз.</li>',
    '<li>Если компьютеров мало — работа в парах: один пишет код, другой проверяет по блок-схеме, после каждого уровня меняются.</li><li>Варианты карты (1, 2, 3) помогают объяснить свойство массовости: код должен работать во всех случаях.</li><li>Если ученик забыл PIN, сбросьте его кнопкой «PIN → 0000». Ученик войдёт с кодом 0000.</li><li>Коды целей обучения взяты из образцов КСП для 7 и 8 классов. Сверьте их со своим учебным планом.</li>',
    '<li>If there are not enough computers, students work in pairs: one writes the code, the other checks it with the flowchart. They change after each level.</li><li>The map versions (1, 2, 3) help to explain generality: the code must work in all cases.</li><li>If a student forgets the PIN, reset it with "PIN → 0000". The student logs in with 0000.</li><li>The learning objective codes come from sample lesson plans for grades 7 and 8. Please check them with your own plan.</li>'],

  /* ---- тіркелу ---- */
  'a.eyebrow': ['Код Даласы · тіркелу', 'Код Даласы · регистрация', 'Kod Dalasy · sign up'],
  'a.title': ['Кім ойнайды?', 'Кто играет?', 'Who is playing?'],
  'a.lede': ['Атыңды таңда немесе жаңадан тіркел. Әр оқушының жұлдыздары мен жазған коды бөлек сақталады, сондықтан бір компьютерде бірнеше оқушы ойнай алады.', 'Выбери своё имя или зарегистрируйся. Звёзды и код каждого ученика хранятся отдельно, поэтому на одном компьютере могут играть несколько учеников.', 'Choose your name or sign up. Each student’s stars and code are saved separately, so several students can play on one computer.'],
  'a.points': ['<li><span>1</span>Тіркелу үшін аты-жөнің, сыныбың және 4 саннан тұратын PIN код керек.</li><li><span>2</span>PIN кодты ешкімге айтпа: ол сенің барысыңды басқалардан қорғайды.</li><li><span>3</span>Деректер осы компьютердің браузерінде ғана сақталады. Басқа компьютерде қайта тіркелу керек.</li>',
    '<li><span>1</span>Для регистрации нужны имя, фамилия, класс и PIN из 4 цифр.</li><li><span>2</span>Никому не говори свой PIN: он защищает твой прогресс.</li><li><span>3</span>Данные хранятся только в браузере этого компьютера. На другом компьютере нужно зарегистрироваться заново.</li>',
    '<li><span>1</span>To sign up, you need your name, surname, class and a 4-digit PIN.</li><li><span>2</span>Do not tell anyone your PIN: it protects your progress.</li><li><span>3</span>The data is saved only in this computer’s browser. On another computer, you need to sign up again.</li>'],
  'a.login': ['Кіру', 'Вход', 'Log in'],
  'a.register': ['Тіркелу', 'Регистрация', 'Sign up'],
  'a.search': ['Атыңды ізде', 'Найди своё имя', 'Find your name'],
  'a.hello': ['Сәлем, <b id="pinName"></b>!<br><span class="sub">PIN кодыңды енгіз</span>', 'Привет, <b id="pinName"></b>!<br><span class="sub">Введи свой PIN</span>', 'Hi, <b id="pinName"></b>!<br><span class="sub">Enter your PIN</span>'],
  'a.pin': ['PIN код', 'PIN-код', 'PIN'],
  'a.back': ['Артқа', 'Назад', 'Back'],
  'a.enter': ['Кіру', 'Войти', 'Log in'],
  'a.name': ['Аты', 'Имя', 'Name'],
  'a.surname': ['Тегі', 'Фамилия', 'Surname'],
  'a.grade': ['Сынып', 'Класс', 'Grade'],
  'a.letter': ['Әрпі', 'Буква', 'Letter'],
  'a.pin1': ['PIN код (4 сан)', 'PIN-код (4 цифры)', 'PIN (4 digits)'],
  'a.pin2': ['PIN кодты қайтала', 'Повтори PIN-код', 'Repeat the PIN'],
  'a.color': ['Белгіңнің түсі', 'Цвет значка', 'Badge colour'],
  'a.colorN': ['{n}-түс', 'Цвет {n}', 'Colour {n}'],
  'a.submit': ['Тіркелу және ойнау', 'Зарегистрироваться и играть', 'Sign up and play'],
  'a.guest': ['Тіркелмей, қонақ ретінде ойнау', 'Играть как гость, без регистрации', 'Play as a guest without signing up'],
  'a.empty': ['Бұл компьютерде әлі ешкім тіркелмеген. «Тіркелу» бетіне өтіп, өзіңді тірке.', 'На этом компьютере ещё никто не зарегистрирован. Открой вкладку «Регистрация».', 'Nobody has signed up on this computer yet. Open the "Sign up" tab.'],
  'a.notFound': ['Ондай оқушы табылмады.', 'Такой ученик не найден.', 'No such student.'],
  'a.classOf': ['{c} сынып', '{c} класс', 'Class {c}'],
  'a.errPin4': ['PIN код 4 саннан тұрады.', 'PIN состоит из 4 цифр.', 'The PIN has 4 digits.'],
  'a.errPin': ['PIN код қате. Қайта көр.', 'Неверный PIN. Попробуй ещё раз.', 'Wrong PIN. Try again.'],
  'a.errName': ['Атың мен тегіңді жаз.', 'Напиши имя и фамилию.', 'Write your name and surname.'],
  'a.errLetters': ['Аты мен тегінде тек әріптер болуы керек.', 'В имени и фамилии должны быть только буквы.', 'Use only letters in the name and surname.'],
  'a.errPinLen': ['PIN код дәл 4 саннан тұруы керек.', 'PIN должен состоять ровно из 4 цифр.', 'The PIN must have exactly 4 digits.'],
  'a.errPinMatch': ['Екі PIN код сәйкес келмейді.', 'PIN-коды не совпадают.', 'The two PINs do not match.'],
  'a.errDup': ['Мұндай оқушы бұл компьютерде бұрыннан тіркелген. «Кіру» бетінен атыңды таңда.', 'Такой ученик уже зарегистрирован. Выбери своё имя во вкладке «Вход».', 'This student is already registered. Choose your name in the "Log in" tab.'],


  /* ---- Қыран ЖИ ---- */
  'ai.tab': ['Қыран ЖИ', 'Кыран ИИ', 'Kyran AI'],
  'ai.ask': ['Қыраннан сұра', 'Спросить Кырана', 'Ask Kyran'],
  'ai.hello': ['Сәлем! Мен Қыран ЖИ. Кодың туралы сұрақ қой немесе төмендегі батырмалардың бірін бас. Дайын жауапты айтпаймын, бірақ өзің табуыңа көмектесемін.', 'Привет! Я Кыран ИИ. Задай вопрос о своём коде или нажми одну из кнопок. Я не скажу готовый ответ, но помогу найти его самому.', 'Hi! I am Kyran AI. Ask me about your code or click a button. I will not tell you the answer, but I will help you find it.'],
  'ai.cError': ['Неге қате?', 'Почему ошибка?', 'Why the error?'],
  'ai.cHint': ['Келесі қадам', 'Следующий шаг', 'Next step'],
  'ai.cConcept': ['Ұғымды түсіндір', 'Объясни тему', 'Explain the topic'],
  'ai.cReview': ['Кодымды тексер', 'Проверь мой код', 'Check my code'],
  'ai.qError': ['Кодым неге жұмыс істемейді? Қатені түсіндірші.', 'Почему мой код не работает? Объясни ошибку.', 'Why doesn’t my code work? Explain the error.'],
  'ai.qHint': ['Келесі қадамға кеңес берші, бірақ дайын жауапты айтпа.', 'Подскажи следующий шаг, но не говори готовый ответ.', 'Give me a hint for the next step, but don’t tell me the answer.'],
  'ai.qConcept': ['«{c}» дегеніміз не? Қарапайым мысалмен түсіндірші.', 'Что такое «{c}»? Объясни на простом примере.', 'What is "{c}"? Explain it with a simple example.'],
  'ai.qReview': ['Кодымды тексерші: оны қалай жақсартуға немесе қысқартуға болады?', 'Проверь мой код: как его улучшить или сократить?', 'Check my code: how can I make it better or shorter?'],
  'ai.placeholder': ['Сұрағыңды жаз…', 'Напиши свой вопрос…', 'Type your question…'],
  'ai.send': ['Сұрау', 'Спросить', 'Ask'],
  'ai.stop': ['Тоқтат', 'Стоп', 'Stop'],
  'ai.thinking': ['Қыран ойланып жатыр…', 'Кыран думает…', 'Kyran is thinking…'],
  'ai.note': ['Қыран ЖИ кейде қателесуі мүмкін. Жауабын өзің тексеріп ал.', 'Кыран ИИ иногда ошибается. Проверяй его ответы.', 'Kyran AI can make mistakes. Check its answers.'],
  'ai.unavailable': ['ЖИ бұл жерде қолжетімсіз. «Кеңес» батырмасын пайдалан.', 'ИИ здесь недоступен. Пользуйся кнопкой «Подсказка».', 'AI is not available here. Use the Hint button.'],
  'ai.checking': ['Қыран ЖИ іске қосылып жатыр…', 'Кыран ИИ запускается…', 'Kyran AI is starting…'],
  'ai.unavailableLong': ['Қыран ЖИ тек ойын Claude ішінде ашылғанда жұмыс істейді: claude.ai сайтында немесе Claude қосымшасында, аккаунтқа кірген күйде. Қазір ол бұл жерде қолжетімсіз, сондықтан Қыранның «Кеңес» батырмасын пайдалан.', 'Кыран ИИ работает, только когда игра открыта внутри Claude: на сайте claude.ai или в приложении Claude, после входа в аккаунт. Сейчас он здесь недоступен, поэтому пользуйся кнопкой «Подсказка» у Кырана.', 'Kyran AI works only when the game is open inside Claude: on claude.ai or in the Claude app, signed in to an account. It is not available here now, so use Kyran\u2019s Hint button.'],
  'ai.busy': ['Қыран сәл демалып жатыр. Біраздан кейін қайта сұра.', 'Кыран немного отдыхает. Спроси чуть позже.', 'Kyran is taking a short rest. Ask again a bit later.'],
  'ai.failed': ['Жауап келмеді. Қайта сұрап көр.', 'Ответ не пришёл. Попробуй спросить ещё раз.', 'No answer came. Try asking again.'],
  'ai.refused': ['Бұл сұраққа жауап бере алмаймын. Басқаша сұрап көр.', 'На этот вопрос я ответить не могу. Спроси по-другому.', 'I cannot answer that. Try asking in another way.'],
  'ai.cut': [' (жауап қысқартылды)', ' (ответ обрезан)', ' (the answer was cut)'],
  'ai.off': ['Мұғалім Қыран ЖИ-ді өшірді.', 'Учитель выключил Кырана ИИ.', 'The teacher turned Kyran AI off.'],
  'ai.you': ['Сен', 'Ты', 'You'],
  't.aiOn': ['Қыран ЖИ: қосулы', 'Кыран ИИ: включён', 'Kyran AI: on'],
  't.aiOff': ['Қыран ЖИ: өшірулі', 'Кыран ИИ: выключен', 'Kyran AI: off'],
  /* ---- анықтама ---- */
  'ref.title': ['Анықтама', 'Справка', 'Help'],

  /* ---- алгоритм түрлері ---- */
  'type.linear': ['сызықтық', 'линейный', 'linear'],
  'type.branch': ['тармақталған', 'разветвляющийся', 'branching'],
  'type.loop': ['циклдік', 'циклический', 'loop'],
  'type.mixed': ['аралас: цикл + тармақталу', 'смешанный: цикл + ветвление', 'mixed: loop + branching'],

  /* ---- мақсаттар ---- */
  'g.maps': [' — {c}/{n} картада', ' — на {c}/{n} картах', ' — on {c}/{n} maps'],
  'g.reach': ['Шаңыраққа жет', 'Дойди до юрты', 'Reach the yurt'],
  'g.reachF': ['Батыр әлі шаңыраққа жеткен жоқ.', 'Герой ещё не дошёл до юрты.', 'The hero has not reached the yurt yet.'],
  'g.gems': ['Барлық алтын тамғаны жина', 'Собери все золотые тамги', 'Collect all gold coins'],
  'g.gemsF': ['Әлі жиналмаған тамғалар қалды.', 'Остались несобранные тамги.', 'Some coins are still on the map.'],
  'g.plant': ['Әр шұңқырға сексеуіл отырғыз', 'Посади саксаул в каждую ямку', 'Plant a tree in every hole'],
  'g.plantF': ['Бос шұңқырлар қалды.', 'Остались пустые ямки.', 'Some holes are still empty.'],
  'g.gate': ['Қақпаны дұрыс сөзбен аш', 'Открой ворота верным словом', 'Open the gate with the right word'],
  'g.gateF': ['Қақпа әлі жабық.', 'Ворота ещё закрыты.', 'The gate is still closed.'],
  'g.if': ['Тармақталу қолдан: if', 'Используй ветвление: if', 'Use branching: if'],
  'g.ifF': ['Бұл деңгейде if шарты міндетті.', 'На этом уровне нужно условие if.', 'This level needs an if condition.'],
  'g.for': ['Цикл қолдан: for', 'Используй цикл: for', 'Use a loop: for'],
  'g.forF': ['Бұл деңгейде for циклі міндетті.', 'На этом уровне нужен цикл for.', 'This level needs a for loop.'],
  'g.while': ['Цикл қолдан: while', 'Используй цикл: while', 'Use a loop: while'],
  'g.whileF': ['Бұл деңгейде while циклі міндетті.', 'На этом уровне нужен цикл while.', 'This level needs a while loop.'],
  'g.var': ['hero.say ішінде айнымалыны қолдан', 'Используй переменную внутри hero.say', 'Use a variable inside hero.say'],
  'g.varF': ['Сөзді тырнақшамен емес, айнымалы арқылы айт: hero.say(kilt)', 'Скажи слово через переменную, а не в кавычках: hero.say(kilt)', 'Say the word with a variable, not in quotes: hero.say(kilt)'],
  'g.short': ['Үнемді код: {t} жолдан аспасын (қазір {n})', 'Короткий код: не больше {t} строк (сейчас {n})', 'Short code: {t} lines or fewer (now {n})'],
  'r.holes': ['бос шұңқыр қалды.', 'осталась пустая ямка.', 'an empty hole is left.'],
  'r.gems': ['тамға жиналмай қалды.', 'не собрана тамга.', 'a coin was not collected.'],
  'r.gate': ['қақпа ашылмады.', 'ворота не открылись.', 'the gate did not open.'],
  'r.yurt': ['батыр шаңыраққа жетпеді.', 'герой не дошёл до юрты.', 'the hero did not reach the yurt.'],

  /* ---- интерпретатор қателері ---- */
  'e.quoteOpen': ['Тырнақша жабылмаған: мәтіннің соңына {q} қой.', 'Кавычка не закрыта: поставь {q} в конце текста.', 'The quote is not closed: put {q} at the end of the text.'],
  'e.quoteType': ['Python-да тек " немесе \' тырнақшалары қолданылады.', 'В Python используются только кавычки " или \'.', 'Python uses only " or \' quotes.'],
  'e.cyrillic': ['«{w}» сөзіне кирилл әрпі араласып кетті. Оны ағылшын әріптерімен қайта тер: {d}', 'В слово «{w}» попала кириллическая буква. Перепечатай его латиницей: {d}', 'The word "{w}" has a Cyrillic letter in it. Type it again with English letters: {d}'],
  'e.badChar': ['Түсініксіз таңба: {c}', 'Непонятный символ: {c}', 'Unknown symbol: {c}'],
  'e.cmpEq': ['Салыстыру үшін екі теңдік белгісін жаз: ==', 'Для сравнения пиши два знака равенства: ==', 'To compare, write two equal signs: =='],
  'e.parenEnd': ['Жақша жабылмаған: жолдың соңына ) қой.', 'Скобка не закрыта: поставь ) в конце строки.', 'The bracket is not closed: put ) at the end of the line.'],
  'e.parenOpen': ['Жақша ашылмаған.', 'Скобка не открыта.', 'The bracket is not opened.'],
  'e.parenClose': ['Жақша жабылмаған: ) қой.', 'Скобка не закрыта: поставь ).', 'The bracket is not closed: put ).'],
  'e.argsComma': ['Жақшаның ішінде мәндердің арасына үтір қой немесе артық таңбаны өшір.', 'Внутри скобок поставь запятую между значениями или удали лишний символ.', 'Inside the brackets, put a comma between values or delete the extra symbol.'],
  'e.exprIncomplete': ['Өрнек толық емес: бір мән жетіспейді.', 'Выражение неполное: не хватает значения.', 'The expression is not complete: a value is missing.'],
  'e.kwHere': ['«{w}» сөзі бұл жерде тұра алмайды.', 'Слово «{w}» не может стоять здесь.', 'The word "{w}" cannot be here.'],
  'e.heroDot': ['hero-дан кейін нүкте мен команда жаз: hero.move_right()', 'После hero напиши точку и команду: hero.move_right()', 'After hero, write a dot and a command: hero.move_right()'],
  'e.dotName': ['Нүктеден кейін команданың атын жаз: hero.move_right()', 'После точки напиши имя команды: hero.move_right()', 'After the dot, write the command name: hero.move_right()'],
  'e.noCmdS': ['hero.{m} деген команда жоқ. Мүмкін, hero.{s}() деп жазғың келді?', 'Команды hero.{m} нет. Может быть, ты хотел написать hero.{s}()?', 'There is no command hero.{m}. Maybe you mean hero.{s}()?'],
  'e.noCmd': ['hero.{m} деген команда жоқ. Анықтамадағы командаларды қара.', 'Команды hero.{m} нет. Посмотри команды в справке.', 'There is no command hero.{m}. Look at the commands in Help.'],
  'e.needParen': ['Команданың соңына жақша қос: hero.{m}()', 'Добавь скобки в конце команды: hero.{m}()', 'Add brackets at the end of the command: hero.{m}()'],
  'e.noArgs': ['{m} командасына мән керек емес: hero.{m}()', 'Команде {m} не нужно значение: hero.{m}()', 'The command {m} needs no value: hero.{m}()'],
  'e.oneArg': ['{m} командасына бір ғана мән жаз.', 'Команде {m} нужно только одно значение.', 'Write only one value for {m}.'],
  'e.sayArg': ['Жақшаның ішіне сөз жаз: hero.say("Сәлем")', 'Напиши слово в скобках: hero.say("Привет")', 'Write a word in the brackets: hero.say("Hello")'],
  'e.dirArg': ['Жақшаның ішіне бағытты жаз: hero.can_move("right")', 'Напиши направление в скобках: hero.can_move("right")', 'Write a direction in the brackets: hero.can_move("right")'],
  'e.needHero': ['Команданың алдына hero. жаз: hero.{m}()', 'Перед командой напиши hero.: hero.{m}()', 'Write hero. before the command: hero.{m}()'],
  'e.rangeOnly': ['range тек for жолында қолданылады: for i in range(3):', 'range используется только в строке for: for i in range(3):', 'range is used only in a for line: for i in range(3):'],
  'e.noFnS': ['{f} деген функция жоқ. Мүмкін, {s}() деп жазғың келді?', 'Функции {f} нет. Может быть, ты хотел написать {s}()?', 'There is no function {f}. Maybe you mean {s}()?'],
  'e.noFn': ['{f} деген функция жоқ.', 'Функции {f} нет.', 'There is no function {f}.'],
  'e.fnArgs': ['{f}() функциясына мәндер саны дұрыс емес.', 'У функции {f}() неверное число значений.', 'The function {f}() has the wrong number of values.'],
  'e.heroLower': ['hero кіші әріппен жазылады.', 'hero пишется маленькими буквами.', 'hero is written in small letters.'],
  'e.colonExtra': ['Бұл жерде қос нүкте артық.', 'Здесь двоеточие лишнее.', 'The colon is not needed here.'],
  'e.extraInExpr': ['Өрнекте артық таңба тұр: {v}', 'В выражении лишний символ: {v}', 'There is an extra symbol in the expression: {v}'],
  'e.colonOnly': ['Қос нүкте тек if, elif, else, for, while жолдарының соңында қойылады.', 'Двоеточие ставится только в конце строк if, elif, else, for, while.', 'A colon is used only at the end of if, elif, else, for and while lines.'],
  'e.parenExtra': ['Артық жабылатын жақша тұр.', 'Лишняя закрывающая скобка.', 'There is an extra closing bracket.'],
  'e.extraWord': ['Артық таңба немесе сөз: {v}', 'Лишний символ или слово: {v}', 'Extra symbol or word: {v}'],
  'e.kwLower': ['{w} кіші әріппен жазылады.', '{w} пишется маленькими буквами.', '{w} is written in small letters.'],
  'e.elseForm': ['else былай жазылады: else:', 'else пишется так: else:', 'Write else like this: else:'],
  'e.colonEnd': ['{w} жолының соңына қос нүкте (:) қой.', 'Поставь двоеточие (:) в конце строки {w}.', 'Put a colon (:) at the end of the {w} line.'],
  'e.condAfter': ['{w} сөзінен кейін шарт жаз.', 'После {w} напиши условие.', 'Write a condition after {w}.'],
  'e.elseNoCond': ['else-ден кейін шарт жазылмайды: тек else:', 'После else условие не пишется: только else:', 'No condition after else: just else:'],
  'e.forForm': ['Цикл былай жазылады: for i in range(3):', 'Цикл пишется так: for i in range(3):', 'Write the loop like this: for i in range(3):'],
  'e.forIn': ['Айнымалыдан кейін in сөзін жаз: for i in range(3):', 'После переменной напиши in: for i in range(3):', 'Write in after the variable: for i in range(3):'],
  'e.forRange': ['in-нен кейін range(...) жаз: for i in range(3):', 'После in напиши range(...): for i in range(3):', 'Write range(...) after in: for i in range(3):'],
  'e.rangeParen': ['range-ден кейін жақша ішіне сан жаз: range(3)', 'После range напиши число в скобках: range(3)', 'Write a number in brackets after range: range(3)'],
  'e.rangeCount': ['range ішіне 1, 2 немесе 3 сан жаз: range(5), range(1, 6)', 'Внутри range пиши 1, 2 или 3 числа: range(5), range(1, 6)', 'Write 1, 2 or 3 numbers in range: range(5), range(1, 6)'],
  'e.nothingAfter': ['{w} сөзінен кейін ештеңе жазылмайды.', 'После {w} ничего не пишется.', 'Nothing comes after {w}.'],
  'e.heroAssign': ['hero — батырдың аты, оған жаңа мән беруге болмайды.', 'hero — имя героя, ему нельзя присвоить новое значение.', 'hero is the hero’s name. You cannot give it a new value.'],
  'e.kwVar': ['{w} — арнайы сөз, оны айнымалы аты етуге болмайды.', '{w} — особое слово, его нельзя использовать как имя переменной.', '{w} is a special word. You cannot use it as a variable name.'],
  'e.assignEmpty': ['Теңдік белгісінен кейін мән жаз: n = 5', 'После знака равенства напиши значение: n = 5', 'Write a value after the equal sign: n = 5'],
  'e.varDigit': ['Айнымалы аты цифрдан басталмайды.', 'Имя переменной не может начинаться с цифры.', 'A variable name cannot start with a digit.'],
  'e.varNoop': ['«{n}» жолы ештеңе істемейді. Команда жаз немесе айнымалыға мән бер: {n} = ...', 'Строка «{n}» ничего не делает. Напиши команду или присвой значение: {n} = ...', 'The line "{n}" does nothing. Write a command or give a value: {n} = ...'],
  'e.assignOneEq': ['Мән беру үшін бір теңдік белгісі жеткілікті: n = 5', 'Для присваивания нужен один знак равенства: n = 5', 'To give a value, use one equal sign: n = 5'],
  'e.noop': ['Бұл жол ештеңе істемейді. Команда немесе меншіктеу жаз.', 'Эта строка ничего не делает. Напиши команду или присваивание.', 'This line does nothing. Write a command or an assignment.'],
  'e.needBody': ['{w} жолынан кейін шегініспен (4 бос орын) жазылған команда болуы керек.', 'После строки {w} нужна команда с отступом (4 пробела).', 'After the {w} line, write a command with an indent (4 spaces).'],
  'e.extraIndent': ['Артық шегініс. Бұл жолдың алдындағы бос орындарды тексер.', 'Лишний отступ. Проверь пробелы в начале строки.', 'Extra indent. Check the spaces at the start of this line.'],
  'e.elseNoIf': ['{w} алдында дәл осындай шегініспен жазылған if болуы керек.', 'Перед {w} должен быть if с таким же отступом.', 'Before {w} there must be an if with the same indent.'],
  'e.tooManySteps': ['Батыр тым көп қадам жасады. Сандар мен циклді тексер.', 'Герой сделал слишком много шагов. Проверь числа и цикл.', 'The hero made too many steps. Check the numbers and the loop.'],
  'e.edge': ['Дала осы жерде бітеді — батыр шетке шыға алмайды.', 'Здесь степь заканчивается — герой не может выйти за край.', 'The steppe ends here. The hero cannot go off the edge.'],
  'e.rock': ['Батыр жартасқа соқтығысты. Басқа жолмен жүр.', 'Герой врезался в скалу. Иди другим путём.', 'The hero hit a rock. Go another way.'],
  'e.water': ['Батыр өзеннен өте алмайды. Айналып өт.', 'Герой не может перейти реку. Обойди её.', 'The hero cannot cross the river. Go around it.'],
  'e.gateClosed': ['Қақпа жабық. Алдымен оның жанына барып, дұрыс сөзді айт.', 'Ворота закрыты. Сначала подойди к ним и скажи верное слово.', 'The gate is closed. First go next to it and say the right word.'],
  'e.stepsNum': ['Қадам саны мәтін емес, сан болуы керек: hero.{m}(3)', 'Число шагов должно быть числом, а не текстом: hero.{m}(3)', 'The number of steps must be a number, not text: hero.{m}(3)'],
  'e.stepsRange': ['Қадам саны 1-ден 20-ға дейінгі бүтін сан болуы керек.', 'Число шагов должно быть целым от 1 до 20.', 'The number of steps must be a whole number from 1 to 20.'],
  'e.wrongWord': ['Қате сөз: «{t}». Қақпа ашылмады.', 'Неверное слово: «{t}». Ворота не открылись.', 'Wrong word: "{t}". The gate did not open.'],
  'e.rereadRule': [' Ережені қайта оқы.', ' Перечитай правило.', ' Read the rule again.'],
  'e.wordFar': ['Сөз дұрыс, бірақ қақпа алыста тұр. Оның көрші шаршысына кел.', 'Слово верное, но ворота далеко. Подойди к соседней клетке.', 'The word is right, but the gate is far. Go to the square next to it.'],
  'e.noHole': ['Мұнда шұңқыр жоқ. Сексеуілді тек шұңқырға отырғызуға болады.', 'Здесь нет ямки. Саксаул можно сажать только в ямку.', 'There is no hole here. You can plant a tree only in a hole.'],
  'e.planted': ['Бұл шұңқырға сексеуіл отырғызылып қойған.', 'В эту ямку саксаул уже посажен.', 'A tree is already planted in this hole.'],
  'e.dirBad': ['Бағытты тырнақшада жаз: "right", "left", "up" немесе "down".', 'Напиши направление в кавычках: "right", "left", "up" или "down".', 'Write the direction in quotes: "right", "left", "up" or "down".'],
  'e.noSign': ['Жақын жерде тақта жоқ. Қақпаның көрші шаршысына кел де, сосын оқы.', 'Рядом нет таблички. Подойди к воротам и потом читай.', 'There is no sign nearby. Go next to the gate, then read.'],
  'e.intBad': ['«{v}» мәтінін санға айналдыру мүмкін емес.', 'Текст «{v}» нельзя превратить в число.', 'The text "{v}" cannot become a number.'],
  'e.lenBad': ['len() тек мәтіннің ұзындығын табады.', 'len() находит только длину текста.', 'len() finds only the length of text.'],
  'e.absBad': ['abs() тек санмен жұмыс істейді.', 'abs() работает только с числами.', 'abs() works only with numbers.'],
  'e.cmpTypes': ['Санды мәтінмен салыстыруға болмайды.', 'Нельзя сравнивать число с текстом.', 'You cannot compare a number with text.'],
  'e.noVar': ['«{n}» деген айнымалы жоқ. Егер бұл сөз болса, тырнақшаға ал: "{n}"', 'Переменной «{n}» нет. Если это слово, возьми его в кавычки: "{n}"', 'There is no variable "{n}". If it is a word, put it in quotes: "{n}"'],
  'e.negText': ['Мәтіннің алдына минус қоюға болмайды.', 'Нельзя ставить минус перед текстом.', 'You cannot put a minus before text.'],
  'e.addMix': ['Мәтін мен санды қосуға болмайды. Санды мәтінге айналдыр: str(n)', 'Нельзя складывать текст и число. Преврати число в текст: str(n)', 'You cannot add text and a number. Change the number to text: str(n)'],
  'e.opText': ['Мәтінмен {op} амалын жасауға болмайды.', 'С текстом нельзя делать операцию {op}.', 'You cannot use {op} with text.'],
  'e.divZero': ['Нөлге бөлуге болмайды.', 'На ноль делить нельзя.', 'You cannot divide by zero.'],
  'e.infinite': ['Цикл тоқтамай айналып жатыр — бұл шексіз цикл. Цикл шарты қашан жалған болатынын тексер.', 'Цикл не останавливается — это бесконечный цикл. Проверь, когда условие станет ложным.', 'The loop never stops. This is an infinite loop. Check when the condition becomes False.'],
  'e.varUnset': ['«{n}» айнымалысына әлі мән берілмеген.', 'Переменной «{n}» ещё не присвоено значение.', 'The variable "{n}" has no value yet.'],
  'e.opType': ['Бұл амал мәннің түріне сай емес.', 'Эта операция не подходит для этого типа значения.', 'This operation does not fit this type of value.'],
  'e.rangeInt': ['range ішіне бүтін сандар жаз.', 'Пиши в range целые числа.', 'Write whole numbers in range.'],
  'e.rangeStep0': ['range қадамы нөл бола алмайды.', 'Шаг range не может быть нулём.', 'The step of range cannot be zero.'],
  'e.rangeBig': ['Цикл тым көп рет айналады. range ішіндегі санды кішірейт.', 'Цикл повторяется слишком много раз. Уменьши число в range.', 'The loop repeats too many times. Make the number in range smaller.'],
  'e.breakOut': ['break тек цикл ішінде жазылады.', 'break пишется только внутри цикла.', 'break is used only inside a loop.'],

  /* ---- блок-схема ---- */
  'f.move': ['{d} {n} қадам', '{d} на {n}', '{n} steps {d}'],
  'f.right': ['оңға', 'вправо', 'right'], 'f.left': ['солға', 'влево', 'left'], 'f.up': ['жоғары', 'вверх', 'up'], 'f.down': ['төмен', 'вниз', 'down'],
  'f.say': ['айт: {x}', 'сказать: {x}', 'say: {x}'],
  'f.plant': ['сексеуіл отырғыз', 'посадить саксаул', 'plant a tree'],
  'f.read': ['тақтаны оқы', 'прочитать табличку', 'read the sign'],
  'f.print': ['экранға: {x}', 'вывод: {x}', 'print: {x}'],
  'f.input': ['енгізу: {n} = тақтадағы мән', 'ввод: {n} = значение с таблички', 'input: {n} = value on the sign'],
  'f.break': ['циклден шығу', 'выход из цикла', 'exit the loop'],
  'f.can': ['{D} жол бар ма?', '{D} свободно?', 'Can go {d}?'],
  'f.cannot': ['{D} жол жоқ па?', '{D} занято?', 'Blocked {d}?'],
  'f.Dright': ['Оңға', 'Справа', 'right'], 'f.Dleft': ['Солға', 'Слева', 'left'], 'f.Dup': ['Жоғары', 'Сверху', 'up'], 'f.Ddown': ['Төмен', 'Снизу', 'down'],
  'f.hole': ['Шұңқыр бар ма?', 'Есть ямка?', 'Is there a hole?'],
  'f.noHole': ['Шұңқыр жоқ па?', 'Нет ямки?', 'No hole?'],
  'f.yurt': ['Шаңырақта ма?', 'У юрты?', 'At the yurt?'],
  'f.notYurt': ['Шаңыраққа жетпеді ме?', 'Ещё не у юрты?', 'Not at the yurt yet?'],
  'f.step': [', қадам {s}', ', шаг {s}', ', step {s}'],
  'f.yes': ['иә', 'да', 'yes'], 'f.no': ['жоқ', 'нет', 'no'],
  'f.repeat': ['қайтала', 'повтор', 'repeat'], 'f.done': ['бітті', 'конец', 'done'],
  'f.start': ['Басы', 'Начало', 'Start'], 'f.end': ['Соңы', 'Конец', 'End'],
  'f.aria': ['Алгоритмнің блок-схемасы', 'Блок-схема алгоритма', 'Algorithm flowchart'],

  /* ---- бастапқы кодтағы түсініктемелер ---- */
  'c.a1': ['Батырды шаңыраққа апар', 'Отведи героя к юрте', 'Take the hero to the yurt'],
  'c.a2': ['Тастар жолды бөгеп тұр. Айналып өт!', 'Камни загородили дорогу. Обойди их!', 'Rocks block the road. Go around them!'],
  'c.a3': ['Жақшаға сан жазсаң, батыр бірнеше қадам жүреді', 'Если написать число в скобках, герой сделает несколько шагов', 'Write a number in the brackets, and the hero makes several steps'],
  'c.a4': ['Барлық тамғаны жина, сосын шаңыраққа бар', 'Собери все тамги, потом иди к юрте', 'Collect all coins, then go to the yurt'],
  'c.a5': ['Қақпаға жақындап, сиқырлы сөзді айт', 'Подойди к воротам и скажи волшебное слово', 'Go to the gate and say the magic word'],
  'c.b1': ['тасты айналып өт', 'обойди камень', 'go around the rock'],
  'c.c1': ['мұнда тағы бір команда жаз', 'напиши здесь ещё одну команду', 'write one more command here'],
  'c.c2': ['Шаңыраққа дейінгі қашықтық әр картада әртүрлі', 'Расстояние до юрты на каждой карте разное', 'The distance to the yurt is different on each map']
};

/* Қақпа сөздері: оқушы кез келген тілдегі нұсқасын айта алады */
const WORDS = {
  open:['Ашыл', 'Откройся', 'Open'], baiterek:['Бәйтерек', 'Байтерек', 'Baiterek'],
  sun:['Күн', 'Солнце', 'Sun'], moon:['Ай', 'Луна', 'Moon'], star:['Жұлдыз', 'Звезда', 'Star'],
  even:['Жұп', 'Чёт', 'Even'], odd:['Тақ', 'Нечет', 'Odd']
};
const tr = (...a) => t(...a);
const word = k => (WORDS[k] ? WORDS[k][LANG_IDX[LANG]] : k);

function t(key, vars){
  const row = S[key];
  let s = row ? (row[LANG_IDX[LANG]] ?? row[0]) : key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
  return s;
}
/* Бастапқы кодтағы {w:сөз} және {c:түсініктеме} белгілерін ағымдағы тілге ауыстырады */
function localCode(src){
  return String(src).replace(/\{w:(\w+)\}/g, (m, k) => word(k)).replace(/\{c:(\w+)\}/g, (m, k) => t('c.' + k));
}

/* ---- деңгейлер мен тараулардың аудармасы (қазақшасы LEVELS ішінде) ---- */
const LT = {
  ru: {
    a1:{ title:'Исполнитель', concept:'Алгоритм',
      intro:'Привет! Я Кыран. Герой — исполнитель: он выполняет только те команды, которые знает. Ты пишешь для него алгоритм. Чтобы дойти до юрты, иди вправо.',
      hint:'Посчитай клетки между героем и юртой. Каждая hero.move_right() — один шаг, каждая команда на отдельной строке.',
      quiz:{ q:'Что такое алгоритм?', opts:['Упорядоченная последовательность команд для исполнителя, чтобы получить результат','Внутреннее устройство компьютера','Название языка программирования','Любая картинка'],
        explain:'Алгоритм — упорядоченная последовательность действий для достижения результата. В этой игре исполнитель — герой.' } },
    a2:{ title:'Каменная преграда', concept:'Дискретность',
      intro:'Камни загородили прямой путь. Команды выполняются по очереди, в том порядке, как написаны: сначала поднимись, потом иди вправо. Посмотри: в блок-схеме каждая команда — отдельный блок.',
      hint:'hero.move_up() ведёт героя вверх, hero.move_right() — вправо. Вверх 3 раза, вправо 5 раз.',
      quiz:{ q:'Алгоритм состоит из отдельных шагов, которые выполняются по очереди. Какое это свойство?', opts:['Результативность','Дискретность','Массовость','Понятность'],
        explain:'Дискретность — алгоритм разбит на отдельные шаги. Следующий шаг начинается после окончания предыдущего.' } },
    a3:{ title:'На берегу реки', concept:'Понятность',
      intro:'Узкая тропа вдоль реки. Дай команде число: hero.move_right(5) ведёт героя на пять шагов. Дойди до юрты за три строки!',
      hint:'Три части: вправо 5, вниз 3, влево 4. Для каждой части — одна команда и число в скобках.',
      quiz:{ q:'Герой не может выполнить команду hero.fly(). Какое свойство алгоритма нарушено?', opts:['Понятность: команда должна быть в системе команд исполнителя','Дискретность','Результативность','Массовость'],
        explain:'Система команд исполнителя (СКИ) — это команды, которые он умеет выполнять. Алгоритм состоит только из них.' } },
    a4:{ title:'Золотые тамги', concept:'Результативность',
      intro:'На земле лежат три золотые тамги. Если пройти по ним, герой сам их соберёт. Собери все и иди к юрте.',
      hint:'Раздели путь на части: вправо, вниз, влево и снова вниз. Хватит четырёх команд.',
      quiz:{ q:'Алгоритм должен за конечное число шагов дать результат. Какое это свойство?', opts:['Определённость','Результативность','Дискретность','Понятность'],
        explain:'Результативность — алгоритм заканчивается за конечное число шагов и даёт нужный результат.' } },
    a5:{ title:'Волшебное слово', concept:'Вывод',
      intro:'На каменных воротах написано «Откройся». Подойди к соседней клетке и скажи hero.say("Откройся"). В блок-схеме слова героя — это блок вывода, он рисуется параллелограммом.',
      hint:'Возьми слово в кавычки: hero.say("Откройся"). Если сказать неверное слово, ворота не откроются.',
      quiz:{ q:'Какой фигурой в блок-схеме обозначается вывод (hero.say)?', opts:['Ромб','Прямоугольник','Параллелограмм','Овал'],
        explain:'Параллелограмм — ввод и вывод, прямоугольник — действие, ромб — условие, овал — начало и конец.' } },
    a6:{ title:'Двое ворот', concept:'Переменная',
      intro:'Двое ворот открываются одним словом: «Байтерек». Я сохранил слово в переменной kilt (по-казахски «ключ»). Теперь напиши hero.say(kilt) — без кавычек.',
      hint:'Остановись перед каждыми воротами и напиши hero.say(kilt). Имя переменной не бери в кавычки.',
      quiz:{ q:'Каким блоком в блок-схеме будет строка kilt = "Байтерек"?', opts:['Блок действия (прямоугольник): присваивание значения','Блок условия (ромб)','Блок начала (овал)','Блок цикла (шестиугольник)'],
        explain:'Присваивание — это действие. Переменная хранит имя значения, потом мы обращаемся к нему по имени.' } },
    b1:{ title:'Развилка', concept:'if / else',
      intro:'У этого уровня две карты: на одной путь загородил камень, на другой — нет. Алгоритм должен работать на обеих. hero.can_move("right") возвращает True, если справа свободно, и False, если там преграда.',
      hint:'В части else обойди камень сверху: вверх 1, вправо 2, вниз 1, вправо 3. Переключай карты и смотри обе.',
      quiz:{ q:'Что такое разветвляющийся алгоритм?', opts:['Алгоритм, где в зависимости от условия выполняются разные команды','Алгоритм, где команды идут друг за другом','Алгоритм, где одно действие повторяется','Алгоритм без команд'],
        explain:'В разветвляющемся алгоритме проверяется условие: если оно истинно, выполняется одна ветка, если ложно — другая.' } },
    b2:{ title:'Есть ли ямка?', concept:'Неполное ветвление',
      intro:'На трёх картах ямки в разных местах. Сажать туда, где нет ямки, нельзя. hero.on_hole() возвращает True, если герой стоит над ямкой. Здесь else не нужен: если условие ложно, герой просто идёт дальше.',
      hint:'Повтори три раза: вправо 2 шага → if hero.on_hole(): hero.plant(). В конце вправо 2 шага. Заметил, что одна часть повторилась три раза? В главе 3 сократим её циклом.',
      quiz:{ q:'Как работает if без части else?', opts:['Если условие ложно, ничего не выполняется и программа идёт к следующей команде','Возникает ошибка','Не выполняется даже при истинном условии','Программа останавливается'],
        explain:'Это неполное ветвление. Команды внутри if выполняются только тогда, когда условие истинно.' } },
    b3:{ title:'Число на табличке', concept:'Сравнение', ruleText:'Если число больше 10 — «Солнце», иначе — «Луна».',
      intro:'На табличке ворот написано число, на каждой карте разное. Правило: если число больше 10, скажи «Солнце», иначе — «Луна». n = hero.read() записывает число с таблички в переменную n. Скажешь неверное слово — ворота не откроются!',
      hint:'Добавь часть else: и в ней hero.say("Луна"). В конце, без отступа, hero.move_right(4). На 3-й карте число 10 — оно не больше 10!',
      quiz:{ q:'Чему равно условие n > 10, если n = 10?', opts:['True (истина)','False (ложь)','10','Будет ошибка'],
        explain:'10 не больше 10, поэтому условие ложно (False). Всегда проверяй граничные значения.' } },
    b4:{ title:'Три пути', concept:'elif · составное условие', ruleText:'Меньше 10 — «Луна», от 10 до 20 (включая 20) — «Солнце», больше 20 — «Звезда».',
      intro:'Теперь ответов три: если n < 10 — «Луна», если 10 ≤ n ≤ 20 — «Солнце», если n > 20 — «Звезда». Для трёх веток используй elif или составь условие через and.',
      hint:'if n < 10: … elif n <= 20: … else: … В конце без отступа hero.move_up(3). Или: if n >= 10 and n <= 20.',
      quiz:{ q:'Зачем нужен elif?', opts:['Чтобы проверить новое условие, когда предыдущее ложно','Чтобы остановить цикл','Чтобы объявить переменную','Чтобы вывести текст'],
        explain:'elif — «иначе, если». Условия проверяются сверху вниз; выполняется ветка первого истинного условия.' } },
    c1:{ title:'Горная лестница', concept:'Цикл for',
      intro:'Горная лестница: вправо, вверх, вправо, вверх… Не пиши одно и то же много раз — используй цикл for. Число повторений известно заранее — 5 раз. В блок-схеме цикл рисуется шестиугольником.',
      hint:'В цикле две команды: hero.move_right() и hero.move_up(). Обе начинаются с 4 пробелов.',
      quiz:{ q:'Сколько раз выполнятся команды внутри for i in range(5):?', opts:['4 раза','5 раз','6 раз','1 раз'],
        explain:'range(5) — это числа 0, 1, 2, 3, 4. Всего пять повторений.' } },
    c2:{ title:'Неизвестное расстояние', concept:'Цикл while',
      intro:'Этот код работает на 1-й карте, но на других двух юрта дальше. Сколько нужно шагов, заранее неизвестно. Для этого есть цикл while: он повторяет, пока условие истинно.',
      hint:'Внутри while not hero.at_yurt(): одна команда — hero.move_right(). Всего две строки.',
      quiz:{ q:'Чем отличаются циклы for и while?', opts:['for — число повторений известно заранее; while — повторяет, пока условие истинно','Ничем','while выполняется только один раз','for проверяет условие, while считает'],
        explain:'Если число шагов известно — for, если оно зависит от условия — while.' } },
    c3:{ title:'Цикл и условие', concept:'Цикл + ветвление',
      intro:'Вспомни уровень «Есть ли ямка?». Теперь ямки могут быть где угодно. После каждого шага проверяй: если есть ямка — сажай. Помещаем ветвление внутрь цикла.',
      hint:'Внутри for: hero.move_right(), потом if hero.on_hole(): и внутри него (8 пробелов) hero.plant().',
      quiz:{ q:'Сколько раз проверяется if внутри for i in range(8):?', opts:['8 раз — по разу на каждом повторе','1 раз','Столько, сколько ямок','16 раз'],
        explain:'Тело цикла выполняется 8 раз, значит, и условие проверяется 8 раз. А plant() — только когда условие истинно.' } },
    c4:{ title:'Возвращение к юрте', concept:'Итог', ruleText:'Если число на табличке чётное — «Чёт», если нечётное — «Нечет».',
      intro:'Последнее испытание! Ворота на каждой карте в разном месте, и число на табличке тоже разное. Правило: чётное число — «Чёт», нечётное — «Нечет». Проверка чётности: n % 2 == 0 (остаток от деления на 2 равен нулю).',
      hint:'В else после n = hero.read(): if n % 2 == 0: hero.say("Чёт") else: hero.say("Нечет"). Следи за отступами: 8 и 12 пробелов.',
      quiz:{ q:'Что будет, если условие while никогда не станет ложным?', opts:['Бесконечный цикл: программа не остановится','Цикл выполнится один раз','Python сам исправит условие','Цикл не выполнится'],
        explain:'while повторяет, пока условие истинно. Внутри цикла должно быть действие, меняющее условие, — здесь это шаг героя.' } }
  },
  en: {
    a1:{ title:'The Executor', concept:'Algorithm',
      intro:'Hi! I am Kyran. The hero is the executor: he can do only the commands he knows. You write an algorithm for him. Go right to reach the yurt.',
      hint:'Count the squares between the hero and the yurt. Each hero.move_right() is one step. Write each command on a new line.',
      quiz:{ q:'What is an algorithm?', opts:['An ordered list of commands for an executor to get a result','A part inside the computer','The name of a programming language','Any picture'],
        explain:'An algorithm is an ordered list of steps to get a result. In this game, the executor is the hero.' } },
    a2:{ title:'Stone Wall', concept:'Discreteness',
      intro:'Rocks block the straight road. Commands run one by one, in the order you write them: first go up, then go right. Look: in the flowchart, each command is a separate block.',
      hint:'hero.move_up() moves the hero up, hero.move_right() moves him right. Up 3 times, right 5 times.',
      quiz:{ q:'An algorithm has separate steps that run one after another. What is this property?', opts:['Effectiveness','Discreteness','Generality','Clarity'],
        explain:'Discreteness means the algorithm is made of separate steps. The next step starts after the last one ends.' } },
    a3:{ title:'River Bank', concept:'Clarity',
      intro:'A narrow path by the river. Give the command a number: hero.move_right(5) moves the hero five steps. Reach the yurt in three lines!',
      hint:'Three parts: right 5, down 3, left 4. One command with a number in brackets for each part.',
      quiz:{ q:'The hero cannot do hero.fly(). Which property of the algorithm is broken?', opts:['Clarity: the command must be in the executor’s command set','Discreteness','Effectiveness','Generality'],
        explain:'The executor’s command set is the list of commands he can do. An algorithm uses only these commands.' } },
    a4:{ title:'Gold Coins', concept:'Effectiveness',
      intro:'There are three gold coins on the ground. Walk over them and the hero picks them up. Collect them all and go to the yurt.',
      hint:'Cut the road into parts: right, down, left and down again. Four commands are enough.',
      quiz:{ q:'An algorithm must give a result after a limited number of steps. What is this property?', opts:['Definiteness','Effectiveness','Discreteness','Clarity'],
        explain:'Effectiveness means the algorithm ends after a limited number of steps and gives the result.' } },
    a5:{ title:'Magic Word', concept:'Output',
      intro:'The stone gate says "Open". Go to the square next to it and write hero.say("Open"). In the flowchart, speech is an output block. It is drawn as a parallelogram.',
      hint:'Put the word in quotes: hero.say("Open"). If you say a wrong word, the gate stays closed.',
      quiz:{ q:'Which shape shows output (hero.say) in a flowchart?', opts:['Diamond','Rectangle','Parallelogram','Oval'],
        explain:'Parallelogram is input and output, rectangle is an action, diamond is a condition, oval is start and end.' } },
    a6:{ title:'Two Gates', concept:'Variable',
      intro:'Two gates open with one word: "Baiterek". I saved the word in the variable kilt ("key" in Kazakh). Now write hero.say(kilt) without quotes.',
      hint:'Stop in front of each gate and write hero.say(kilt). Do not put the variable name in quotes.',
      quiz:{ q:'Which flowchart block is the line kilt = "Baiterek"?', opts:['An action block (rectangle): giving a value to a variable','A condition block (diamond)','A start block (oval)','A loop block (hexagon)'],
        explain:'Giving a value is an action. A variable is a name for a value, and later we use the value by its name.' } },
    b1:{ title:'The Fork', concept:'if / else',
      intro:'This level has two maps: on one, a rock blocks the road; on the other, the road is free. Your algorithm must work on both. hero.can_move("right") gives True if the right side is free and False if something blocks it.',
      hint:'In the else part, go around the rock from above: up 1, right 2, down 1, right 3. Switch the maps and look at both.',
      quiz:{ q:'What is a branching algorithm?', opts:['An algorithm that runs different commands depending on a condition','An algorithm where commands go one after another','An algorithm where one action repeats','An algorithm with no commands'],
        explain:'A branching algorithm checks a condition: if it is True, one branch runs; if it is False, the other branch runs.' } },
    b2:{ title:'Is There a Hole?', concept:'If without else',
      intro:'On the three maps, the holes are in different places. You cannot plant where there is no hole. hero.on_hole() gives True if the hero stands on a hole. You do not need else here: if the condition is False, the hero just goes on.',
      hint:'Repeat three times: right 2 steps → if hero.on_hole(): hero.plant(). At the end, right 2 steps. Did you see that one part repeats three times? In chapter 3 we make it shorter with a loop.',
      quiz:{ q:'How does if work without else?', opts:['If the condition is False, nothing runs and the program goes to the next command','There is an error','It does not run even if the condition is True','The program stops'],
        explain:'This is an if without else. The commands inside if run only when the condition is True.' } },
    b3:{ title:'Number on the Sign', concept:'Comparison', ruleText:'If the number is greater than 10, say "Sun". Otherwise, say "Moon".',
      intro:'There is a number on the gate sign, and it is different on each map. Rule: if the number is greater than 10, say "Sun"; otherwise, say "Moon". n = hero.read() puts the number from the sign into the variable n. If you say a wrong word, the gate stays closed!',
      hint:'Add an else: part with hero.say("Moon"). At the end, without an indent, write hero.move_right(4). On map 3, the number is 10, and 10 is not greater than 10!',
      quiz:{ q:'If n = 10, what is the value of n > 10?', opts:['True','False','10','An error'],
        explain:'10 is not greater than 10, so the condition is False. Always check the border values.' } },
    b4:{ title:'Three Roads', concept:'elif · compound condition', ruleText:'Less than 10: "Moon". From 10 to 20 (20 included): "Sun". More than 20: "Star".',
      intro:'Now there are three answers: if n < 10, say "Moon"; if 10 ≤ n ≤ 20, say "Sun"; if n > 20, say "Star". Use elif for three branches, or build a condition with and.',
      hint:'if n < 10: … elif n <= 20: … else: … At the end, without an indent, hero.move_up(3). Or: if n >= 10 and n <= 20.',
      quiz:{ q:'Why do we need elif?', opts:['To check a new condition when the one before is False','To stop a loop','To make a variable','To print text'],
        explain:'elif means "else if". Conditions are checked from top to bottom; only the branch of the first True condition runs.' } },
    c1:{ title:'Mountain Stairs', concept:'for loop',
      intro:'Mountain stairs: right, up, right, up… Do not write the same commands again and again. Use a for loop. We know the number of repeats: 5 times. In a flowchart, a for loop is a hexagon.',
      hint:'Two commands inside the loop: hero.move_right() and hero.move_up(). Both start with 4 spaces.',
      quiz:{ q:'How many times do the commands inside for i in range(5): run?', opts:['4 times','5 times','6 times','1 time'],
        explain:'range(5) is the numbers 0, 1, 2, 3, 4. That is five repeats.' } },
    c2:{ title:'Unknown Distance', concept:'while loop',
      intro:'This code works on map 1, but on the other two maps the yurt is further away. We do not know the number of steps. For this we use a while loop: it repeats while the condition is True.',
      hint:'Inside while not hero.at_yurt(): write one command: hero.move_right(). Two lines in total.',
      quiz:{ q:'What is the difference between for and while?', opts:['for: we know the number of repeats; while: it repeats while the condition is True','There is no difference','while runs only once','for checks a condition, while counts'],
        explain:'If you know the number of steps, use for. If it depends on a condition, use while.' } },
    c3:{ title:'Loop and Condition', concept:'Loop + branching',
      intro:'Remember the level "Is There a Hole?". Now the holes can be anywhere. After each step, check: if there is a hole, plant a tree. We put branching inside a loop.',
      hint:'Inside for: hero.move_right(), then if hero.on_hole(): and inside it (8 spaces) hero.plant().',
      quiz:{ q:'How many times is the if checked inside for i in range(8):?', opts:['8 times, once in each repeat','1 time','As many times as there are holes','16 times'],
        explain:'The loop body runs 8 times, so the condition is checked 8 times. plant() runs only when the condition is True.' } },
    c4:{ title:'Back to the Yurt', concept:'Final test', ruleText:'If the number on the sign is even, say "Even". If it is odd, say "Odd".',
      intro:'The last test! The gate is in a different place on each map, and the number on the sign is different too. Rule: an even number is "Even", an odd number is "Odd". To check if a number is even: n % 2 == 0 (the remainder after dividing by 2 is zero).',
      hint:'In else, after n = hero.read(): if n % 2 == 0: hero.say("Even") else: hero.say("Odd"). Watch the indents: 8 and 12 spaces.',
      quiz:{ q:'What happens if the while condition is never False?', opts:['An infinite loop: the program never stops','The loop runs once','Python fixes the condition','The loop does not run'],
        explain:'while repeats while the condition is True. Something inside the loop must change the condition. Here it is the hero’s step.' } }
  }
};
const CHT = {
  ru: { 1:{ title:'Линейный алгоритм', short:'Линейный', goal:'Понятие алгоритма, исполнитель и его система команд, свойства алгоритма, блок-схема. Линейная программа на Python.', codes:'Темы 5–6 классов' },
        2:{ title:'Разветвляющийся алгоритм', short:'Ветвление', goal:'Условие, полное и неполное ветвление, вложенные и составные условия.' },
        3:{ title:'Циклический алгоритм', short:'Циклы', goal:'Цикл с известным числом повторений (for) и цикл с условием (while), ветвление внутри цикла.' } },
  en: { 1:{ title:'Linear algorithm', short:'Linear', goal:'What an algorithm is, the executor and its command set, properties of algorithms, flowcharts. A linear program in Python.', codes:'Grades 5–6 topics' },
        2:{ title:'Branching algorithm', short:'Branching', goal:'Conditions, if with and without else, nested and compound conditions.' },
        3:{ title:'Loop algorithm', short:'Loops', goal:'A loop with a known number of repeats (for) and a loop with a condition (while), branching inside a loop.' } }
};
const OBJT = {
  ru: { '7.3.2.1':'Писать разветвляющиеся алгоритмы на языке программирования Python', '7.3.3.2':'Использовать вложенные условия в языке программирования Python', '8.3.3.2':'Использовать оператор цикла For', '8.3.3.1':'Использовать оператор цикла While' },
  en: { '7.3.2.1':'Write branching algorithms in Python', '7.3.3.2':'Use nested conditions in Python', '8.3.3.2':'Use the for loop statement', '8.3.3.1':'Use the while loop statement' }
};
/* Деңгейдің мәтінін ағымдағы тілде береді */
function lv(L, f){
  if (LANG === 'kk') return L[f];
  const tr = LT[LANG] && LT[LANG][L.id];
  return tr && tr[f] !== undefined ? tr[f] : L[f];
}
function chT(c, f){
  if (LANG === 'kk') return c[f];
  const tr = CHT[LANG] && CHT[LANG][c.n];
  return tr && tr[f] !== undefined ? tr[f] : c[f];
}
const objT = code => (LANG === 'kk' ? OBJ[code] : (OBJT[LANG] || {})[code] || OBJ[code]);

/* ---- анықтама ---- */
const REF = {
  kk: `<p class="ref-sec">Орындаушының командалары</p><dl class="ref-list">
<div><dt>hero.move_right(n)</dt><dd>Батыр оңға <code>n</code> қадам жүреді. Жақша бос болса — бір қадам. Сондай-ақ: <code>move_left</code>, <code>move_up</code>, <code>move_down</code>.</dd></div>
<div><dt>hero.say("сөз")</dt><dd>Батыр сөз айтады. Қақпаның көрші шаршысында дұрыс сөз айтса, қақпа ашылады.</dd></div>
<div><dt>hero.plant()</dt><dd>Батыр тұрған шұңқырға сексеуіл отырғызады.</dd></div></dl>
<p class="ref-sec">Сезгіштер: мән қайтарады</p><dl class="ref-list">
<div><dt>hero.can_move("right")</dt><dd>Сол бағытта жол бос болса <code>True</code>, тас, су немесе жабық қақпа болса <code>False</code>. Бағыттар: "right", "left", "up", "down".</dd></div>
<div><dt>hero.on_hole()</dt><dd>Батыр бос шұңқырдың үстінде тұрса <code>True</code>.</dd></div>
<div><dt>hero.at_yurt()</dt><dd>Батыр шаңыраққа жетсе <code>True</code>.</dd></div>
<div><dt>n = hero.read()</dt><dd>Көрші қақпаның тақтасындағы мәнді оқып, <code>n</code> айнымалысына жазады.</dd></div></dl>
<p class="ref-sec">Python</p><dl class="ref-list">
<div><dt>kilt = "Бәйтерек"</dt><dd>Айнымалыға мән меншіктеу.</dd></div>
<div><dt>if шарт: … elif шарт: … else: …</dt><dd>Тармақталу. Шарт ақиқат болса — оның астындағы шегініспен жазылған жолдар орындалады.</dd></div>
<div><dt>==  !=  &lt;  &gt;  &lt;=  &gt;=</dt><dd>Салыстыру. Назар аудар: салыстыру <code>==</code>, ал меншіктеу <code>=</code>.</dd></div>
<div><dt>and  or  not</dt><dd>Құрамды шарт: <code>n &gt;= 10 and n &lt;= 20</code>. <code>not</code> — шартты керісінше өзгертеді.</dd></div>
<div><dt>n % 2 == 0</dt><dd><code>%</code> — бөлгендегі қалдық. Қалдық нөл болса, сан жұп.</dd></div>
<div><dt>for i in range(3):</dt><dd>Параметрлі цикл: денесі 3 рет қайталанады (i = 0, 1, 2).</dd></div>
<div><dt>while шарт:</dt><dd>Шартты цикл: шарт ақиқат болғанша қайталанады.</dd></div>
<div><dt>print(...)</dt><dd>Мәнді «Хабарлар» бетіне шығарады.</dd></div>
<div><dt># түсініктеме · Ctrl + Enter</dt><dd><code>#</code>-тен кейінгі мәтін орындалмайды. Ctrl + Enter — кодты іске қосу.</dd></div></dl>`,
  ru: `<p class="ref-sec">Команды исполнителя</p><dl class="ref-list">
<div><dt>hero.move_right(n)</dt><dd>Герой идёт вправо на <code>n</code> шагов. Если скобки пустые — на один шаг. Также: <code>move_left</code>, <code>move_up</code>, <code>move_down</code>.</dd></div>
<div><dt>hero.say("слово")</dt><dd>Герой говорит слово. Если сказать верное слово рядом с воротами, они откроются.</dd></div>
<div><dt>hero.plant()</dt><dd>Герой сажает саксаул в ямку, где он стоит.</dd></div></dl>
<p class="ref-sec">Датчики: возвращают значение</p><dl class="ref-list">
<div><dt>hero.can_move("right")</dt><dd><code>True</code>, если в этом направлении свободно, <code>False</code>, если там камень, вода или закрытые ворота. Направления: "right", "left", "up", "down".</dd></div>
<div><dt>hero.on_hole()</dt><dd><code>True</code>, если герой стоит над пустой ямкой.</dd></div>
<div><dt>hero.at_yurt()</dt><dd><code>True</code>, если герой дошёл до юрты.</dd></div>
<div><dt>n = hero.read()</dt><dd>Читает значение с таблички соседних ворот и записывает его в переменную <code>n</code>.</dd></div></dl>
<p class="ref-sec">Python</p><dl class="ref-list">
<div><dt>kilt = "Байтерек"</dt><dd>Присваивание значения переменной.</dd></div>
<div><dt>if условие: … elif условие: … else: …</dt><dd>Ветвление. Если условие истинно, выполняются строки с отступом под ним.</dd></div>
<div><dt>==  !=  &lt;  &gt;  &lt;=  &gt;=</dt><dd>Сравнение. Внимание: сравнение — <code>==</code>, а присваивание — <code>=</code>.</dd></div>
<div><dt>and  or  not</dt><dd>Составное условие: <code>n &gt;= 10 and n &lt;= 20</code>. <code>not</code> меняет условие на противоположное.</dd></div>
<div><dt>n % 2 == 0</dt><dd><code>%</code> — остаток от деления. Если остаток ноль, число чётное.</dd></div>
<div><dt>for i in range(3):</dt><dd>Цикл с параметром: тело повторяется 3 раза (i = 0, 1, 2).</dd></div>
<div><dt>while условие:</dt><dd>Цикл с условием: повторяется, пока условие истинно.</dd></div>
<div><dt>print(...)</dt><dd>Выводит значение во вкладку «Сообщения».</dd></div>
<div><dt># комментарий · Ctrl + Enter</dt><dd>Текст после <code>#</code> не выполняется. Ctrl + Enter — запуск кода.</dd></div></dl>`,
  en: `<p class="ref-sec">The hero’s commands</p><dl class="ref-list">
<div><dt>hero.move_right(n)</dt><dd>The hero goes <code>n</code> steps right. Empty brackets mean one step. Also: <code>move_left</code>, <code>move_up</code>, <code>move_down</code>.</dd></div>
<div><dt>hero.say("word")</dt><dd>The hero says a word. If he says the right word next to a gate, the gate opens.</dd></div>
<div><dt>hero.plant()</dt><dd>The hero plants a saxaul tree in the hole where he stands.</dd></div></dl>
<p class="ref-sec">Sensors: they give a value</p><dl class="ref-list">
<div><dt>hero.can_move("right")</dt><dd><code>True</code> if the way is free, <code>False</code> if there is a rock, water or a closed gate. Directions: "right", "left", "up", "down".</dd></div>
<div><dt>hero.on_hole()</dt><dd><code>True</code> if the hero stands on an empty hole.</dd></div>
<div><dt>hero.at_yurt()</dt><dd><code>True</code> if the hero has reached the yurt.</dd></div>
<div><dt>n = hero.read()</dt><dd>Reads the value on the sign of the gate next to the hero and puts it in the variable <code>n</code>.</dd></div></dl>
<p class="ref-sec">Python</p><dl class="ref-list">
<div><dt>kilt = "Baiterek"</dt><dd>Gives a value to a variable.</dd></div>
<div><dt>if condition: … elif condition: … else: …</dt><dd>Branching. If the condition is True, the indented lines under it run.</dd></div>
<div><dt>==  !=  &lt;  &gt;  &lt;=  &gt;=</dt><dd>Comparison. Note: compare with <code>==</code>, give a value with <code>=</code>.</dd></div>
<div><dt>and  or  not</dt><dd>Compound condition: <code>n &gt;= 10 and n &lt;= 20</code>. <code>not</code> turns a condition the other way.</dd></div>
<div><dt>n % 2 == 0</dt><dd><code>%</code> is the remainder after division. If the remainder is zero, the number is even.</dd></div>
<div><dt>for i in range(3):</dt><dd>A loop with a counter: the body repeats 3 times (i = 0, 1, 2).</dd></div>
<div><dt>while condition:</dt><dd>A loop with a condition: it repeats while the condition is True.</dd></div>
<div><dt>print(...)</dt><dd>Shows a value in the "Messages" tab.</dd></div>
<div><dt># comment · Ctrl + Enter</dt><dd>Text after <code>#</code> does not run. Ctrl + Enter runs the code.</dd></div></dl>`
};


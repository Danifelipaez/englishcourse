// Free-English library. Links only (no copyrighted media is hosted here).
const yt = q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
const sp = q => `https://open.spotify.com/search/${encodeURIComponent(q)}`
const nf = q => `https://www.netflix.com/search?q=${encodeURIComponent(q)}`
const jw = q => `https://www.justwatch.com/us/search?q=${encodeURIComponent(q)}`

// level = minimum level where it becomes enjoyable; link = grammar module it trains
export const LIBRARY = [
  // Series & films — romance, New York, the 2000s, marketing
  { kind: 'series', title: 'Emily in Paris', level: 'A2', link: 'm4', url: nf('Emily in Paris'), why: 'A marketing strategist abroad — literally your future job, with captions and campaigns.', mission: 'Watch 1 episode with English subtitles. Write down 3 marketing words Emily uses.' },
  { kind: 'film', title: 'How to Lose a Guy in 10 Days', level: 'A2', link: 'm7', url: jw('How to Lose a Guy in 10 Days'), why: 'A magazine writer vs. an ad executive in 2000s New York. Pitches everywhere!', mission: 'Find 2 sentences with "going to" or "will" in the pitch scenes.' },
  { kind: 'film', title: '13 Going on 30', level: 'A2', link: 'm5', url: jw('13 Going on 30'), why: 'NYC, a fashion magazine and a creative relaunch — pure 2000s.', mission: 'Pause when Jenna remembers her past. Say one sentence with "used to" or past simple.' },
  { kind: 'film', title: 'The Devil Wears Prada', level: 'B1', link: 'm9', url: jw('The Devil Wears Prada'), why: 'Fashion, communication and the toughest boss in New York.', mission: 'Listen for rules and obligations: must, have to, don’t.' },
  { kind: 'film', title: "You've Got Mail", level: 'B1', link: 'm10', url: jw("You've Got Mail"), why: 'Letters, a little bookshop and New York in autumn. Very Meri.', mission: 'Pick one email from the film and rewrite it in your own words.' },
  { kind: 'film', title: 'The Intern', level: 'A2', link: 'm8', url: jw('The Intern'), why: 'A fashion startup in Brooklyn; slow, clear dialogue.', mission: 'Find 3 sentences with "have you ever / I’ve…".' },
  { kind: 'series', title: 'Friends', level: 'A2', link: 'm2', url: jw('Friends'), why: 'The classic for learners: short scenes, everyday English, New York.', mission: 'Watch one episode and list 5 routines the characters mention.' },
  { kind: 'series', title: 'Ugly Betty', level: 'B1', link: 'm6', url: jw('Ugly Betty'), why: 'A Latina in a NYC fashion magazine, 2000s. Comparatives everywhere!', mission: 'Write 3 comparisons between Betty and the other editors.' },
  { kind: 'series', title: 'Gilmore Girls', level: 'B1', link: 'm11', url: jw('Gilmore Girls'), why: 'Fast, witty and full of books. A great challenge at B1.', mission: 'Use English subtitles. Catch one "if" sentence and write it down.' },
  { kind: 'film', title: 'Midnight in Paris', level: 'B1', link: 'm11', url: jw('Midnight in Paris'), why: 'A writer meets the artists of 1920s Paris. Art + poetry + nostalgia.', mission: 'Answer: if you could visit any decade, which one would it be and why?' },
  { kind: 'film', title: 'Little Women (2019)', level: 'B1', link: 'm12', url: jw('Little Women 2019'), why: 'Sisters, writing and letters — like Rosa.', mission: 'Retell one scene using "she said that…".' },

  // Songs — if you love Camilo & Morat, try…
  { kind: 'song', title: "Jason Mraz — I'm Yours", level: 'A1', link: 'm7', url: yt("Jason Mraz I'm Yours lyrics"), why: 'Sunny acoustic pop — if you love Camilo’s warmth.', mission: 'Count how many times you hear "you". Then sing the chorus once.' },
  { kind: 'song', title: 'The Lumineers — Ho Hey', level: 'A1', link: 'm1', url: yt('The Lumineers Ho Hey lyrics'), why: 'Banjo and claps — the closest English cousin of Morat.', mission: 'Write 3 words you recognize.' },
  { kind: 'song', title: 'Ed Sheeran — Perfect', level: 'A2', link: 'm4', url: yt('Ed Sheeran Perfect lyrics'), why: 'Slow and clear; a wedding classic.', mission: 'Find the -ing verbs (present continuous).' },
  { kind: 'song', title: 'Vance Joy — Riptide', level: 'A2', link: 'm2', url: yt('Vance Joy Riptide lyrics'), why: 'Ukulele folk-pop with a story.', mission: 'Write down 2 sentences in present simple.' },
  { kind: 'song', title: 'Norah Jones — Don’t Know Why', level: 'A2', link: 'm5', url: yt('Norah Jones Dont Know Why lyrics'), why: 'Soft jazz for evening study.', mission: 'Find the past simple verbs.' },
  { kind: 'song', title: 'Laufey — From The Start', level: 'B1', link: 'm8', url: yt('Laufey From The Start lyrics'), why: 'Bossa nova + poetry. Very you.', mission: 'Listen with lyrics. Find one present perfect or used to.' },
  { kind: 'song', title: 'John Legend — All of Me', level: 'A2', link: 'm6', url: yt('John Legend All of Me lyrics'), why: 'Piano ballad with clear pronunciation.', mission: 'Shadow the first verse: listen, pause, repeat.' },
  { kind: 'song', title: 'Jack Johnson — Better Together', level: 'A2', link: 'm6', url: yt('Jack Johnson Better Together lyrics'), why: 'Lazy Sunday guitar.', mission: 'Find the comparative in the title and 2 more in the song.' },
  { kind: 'song', title: 'Bruno Mars — Just the Way You Are', level: 'A1', link: 'm1', url: yt('Bruno Mars Just the Way You Are lyrics'), why: 'Sweet pop full of to be.', mission: 'Count the times you hear "is" or "are".' },
  { kind: 'playlist', title: 'Acoustic love songs (Spotify)', level: 'A1', link: 'm2', url: sp('acoustic love songs'), why: 'Background English while you tidy your desk.', mission: 'Play it for 10 minutes. Write 1 line you understood.' },
  { kind: 'tool', title: 'LyricsTraining', level: 'A1', link: 'm4', url: 'https://lyricstraining.com/', why: 'Fill-in-the-lyrics game with real music videos. Addictive.', mission: 'Play one song in Beginner mode.' },

  // Podcasts & listening
  { kind: 'podcast', title: 'BBC 6 Minute English', level: 'A2', link: 'm2', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', why: 'Six minutes, two hosts, one topic. Perfect length.', mission: 'Listen once without the transcript, once with it.' },
  { kind: 'podcast', title: 'VOA Learning English', level: 'A1', link: 'm1', url: 'https://learningenglish.voanews.com/', why: 'Slow, clear American English news.', mission: 'Read and listen to one short story.' },
  { kind: 'podcast', title: 'BBC The English We Speak', level: 'B1', link: 'm10', url: 'https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak', why: 'One modern expression in three minutes.', mission: 'Learn the expression and use it in a message today.' },
  { kind: 'podcast', title: 'All Ears English', level: 'B1', link: 'm9', url: sp('All Ears English'), why: 'Natural American conversation, careers and connection.', mission: 'Listen to one episode about work or interviews.' },
  { kind: 'video', title: 'Vogue — 73 Questions', level: 'B1', link: 'm8', url: yt('Vogue 73 Questions'), why: 'Celebrities answer quick questions at home. Beauty, homes, style.', mission: 'Answer 5 of the questions about yourself, out loud.' },
  { kind: 'video', title: 'Vogue — Beauty Secrets', level: 'A2', link: 'm6', url: yt('Vogue Beauty Secrets'), why: 'Skincare routines = imperatives + quantities. Your future industry.', mission: 'List 5 products and one quantity word (some, a little…).' },
  { kind: 'video', title: 'English with Lucy', level: 'A2', link: 'm3', url: yt('English with Lucy'), why: 'Elegant British teacher; grammar and pronunciation.', mission: 'Watch one grammar video connected to your current module.' },
  { kind: 'video', title: "Rachel's English", level: 'A2', link: 'm5', url: yt("Rachel's English"), why: 'American pronunciation, step by step.', mission: 'Practice the -ed endings (/t/ /d/ /ɪd/).' },
  { kind: 'video', title: 'Isabel Allende on TED', level: 'B1', link: 'm10', url: 'https://www.ted.com/search?q=Isabel+Allende', why: 'Your favorite author speaks English with a Latin American accent — like you will.', mission: 'Watch with English subtitles. Write 2 sentences she said, reported: "She said that…".' },

  // Reading
  { kind: 'book', title: 'Isabel Allende — Eva Luna (English)', level: 'B1', link: 'm10', url: 'https://www.google.com/search?tbm=bks&q=Eva+Luna+Isabel+Allende+English', why: 'Read a chapter you already know in Spanish — now in English.', mission: 'Read 2 pages. Underline every past continuous.' },
  { kind: 'book', title: 'Rupi Kaur — milk and honey', level: 'A2', link: 'm1', url: 'https://www.google.com/search?tbm=bks&q=Rupi+Kaur+milk+and+honey', why: 'Short, simple modern poems.', mission: 'Copy your favorite poem in your notebook and translate it.' },
  { kind: 'book', title: 'The Little Prince (English)', level: 'A2', link: 'm5', url: 'https://www.google.com/search?tbm=bks&q=The+Little+Prince+English', why: 'A story you know by heart — perfect bridge.', mission: 'Read one chapter a day.' },
  { kind: 'book', title: 'Graded readers (Oxford Bookworms / Penguin Readers)', level: 'A2', link: 'm5', url: 'https://www.google.com/search?q=Oxford+Bookworms+level+2', why: 'Classic novels rewritten for your level.', mission: 'Choose one romance at level 2.' },
  { kind: 'site', title: 'Poetry Foundation', level: 'B1', link: 'm12', url: 'https://www.poetryfoundation.org/', why: 'Thousands of poems with audio.', mission: 'Find one poem by Mary Oliver and read it aloud.' },
  { kind: 'site', title: 'Google Arts & Culture', level: 'A2', link: 'm3', url: 'https://artsandculture.google.com/', why: 'Museum tours with English descriptions.', mission: 'Describe one painting: "There is… / There are…".' },
]

export const KINDS = ['all', 'series', 'film', 'song', 'podcast', 'video', 'book', 'tool', 'site', 'playlist']

export const TOOLS = [
  { title: 'Cambridge Dictionary', url: 'https://dictionary.cambridge.org/dictionary/english-spanish/', why: 'English–Spanish with audio (UK & US).' },
  { title: 'YouGlish', url: 'https://youglish.com/', why: 'Hear any word in real YouTube videos.' },
  { title: 'Reverso Context', url: 'https://context.reverso.net/translation/english-spanish/', why: 'See words inside real sentences.' },
  { title: 'DeepL', url: 'https://www.deepl.com/translator', why: 'The most natural translator.' },
  { title: 'LanguageTool', url: 'https://languagetool.org/', why: 'Grammar checker for emails and posts.' },
  { title: 'Forvo', url: 'https://forvo.com/', why: 'Pronunciation by native speakers.' },
  { title: 'British Council LearnEnglish', url: 'https://learnenglish.britishcouncil.org/', why: 'Free graded lessons and exercises.' },
  { title: 'LyricsTraining', url: 'https://lyricstraining.com/', why: 'Learn with songs, as a game.' },
]

export const TIPS = [
  'Change your phone language to English for one week. Your brain will adapt.',
  'Write tomorrow’s to-do list in English tonight.',
  'Shadowing: play one sentence, pause, repeat it with the same melody.',
  'Watch with English subtitles, not Spanish. Spanish subtitles = reading, not listening.',
  'Talk to yourself while you cook: "Now I’m cutting the onion…"',
  'Keep a "beautiful words" page in your notebook.',
  'Read your favorite Allende chapter in English — you already know the story.',
  'Record a 30-second voice note in English. Listen to it in a month.',
  'Follow 3 beauty or marketing accounts that post in English.',
  'Learn sentences, not words. "I’d like to…" is worth more than "like".',
  'When you don’t know a word, describe it: "the thing you use to…".',
  'Mistakes are proof you are trying. Celebrate them.',
  'Sing in the shower. Seriously — it trains rhythm and pronunciation.',
  'Rewrite a LinkedIn post from a brand you admire in your own words.',
]

// Public-domain poems (all published before 1929). link = the lesson they illuminate
export const POEMS = [
  { title: 'What Is Pink?', author: 'Christina Rossetti', year: 1872, level: 'A1', link: 'm1l1', spotlight: 'Questions and answers with to be: What is pink? A rose is pink.',
    text: `What is pink? a rose is pink\nBy the fountain's brink.\nWhat is red? a poppy's red\nIn its barley bed.\nWhat is blue? the sky is blue\nWhere the clouds float thro'.\nWhat is white? a swan is white\nSailing in the light.\nWhat is yellow? pears are yellow,\nRich and ripe and mellow.\nWhat is green? the grass is green,\nWith small flowers between.\nWhat is violet? clouds are violet\nIn the summer twilight.\nWhat is orange? Why, an orange,\nJust an orange!`,
    glossary: [['brink', 'borde'], ['poppy', 'amapola'], ['swan', 'cisne'], ['ripe', 'maduro'], ['twilight', 'crepúsculo']] },
  { title: "I'm Nobody! Who are you?", author: 'Emily Dickinson', year: 1891, level: 'A2', link: 'm1l2', spotlight: 'Questions with to be — and a joke about advertising!',
    text: `I'm Nobody! Who are you?\nAre you – Nobody – too?\nThen there's a pair of us!\nDon't tell! they'd advertise – you know!\n\nHow dreary – to be – Somebody!\nHow public – like a Frog –\nTo tell one's name – the livelong June –\nTo an admiring Bog!`,
    glossary: [['a pair of us', 'un par'], ['advertise', 'anunciar / publicitar'], ['dreary', 'aburrido, triste'], ['livelong', 'entero'], ['bog', 'pantano']] },
  { title: 'Who Has Seen the Wind?', author: 'Christina Rossetti', year: 1872, level: 'A2', link: 'm4l1', spotlight: 'Present continuous: the wind is passing through.',
    text: `Who has seen the wind?\nNeither I nor you:\nBut when the leaves hang trembling,\nThe wind is passing through.\n\nWho has seen the wind?\nNeither you nor I:\nBut when the trees bow down their heads,\nThe wind is passing by.`,
    glossary: [['neither… nor', 'ni… ni'], ['trembling', 'temblando'], ['bow down', 'inclinarse']] },
  { title: 'I Wandered Lonely as a Cloud (stanza 1)', author: 'William Wordsworth', year: 1807, level: 'A2', link: 'm5l3', spotlight: 'Past simple: I wandered, I saw.',
    text: `I wandered lonely as a cloud\nThat floats on high o'er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils;\nBeside the lake, beneath the trees,\nFluttering and dancing in the breeze.`,
    glossary: [['wander', 'vagar'], ["o'er", 'over (sobre)'], ['vale', 'valle'], ['host', 'multitud'], ['daffodil', 'narciso'], ['breeze', 'brisa']] },
  { title: 'Barter', author: 'Sara Teasdale', year: 1917, level: 'B1', link: 'm4l4', spotlight: 'Imperatives: Spend all you have for loveliness, buy it…',
    text: `Life has loveliness to sell,\nAll beautiful and splendid things,\nBlue waves whitened on a cliff,\nSoaring fire that sways and sings,\nAnd children's faces looking up\nHolding wonder like a cup.\n\nLife has loveliness to sell,\nMusic like a curve of gold,\nScent of pine trees in the rain,\nEyes that love you, arms that hold,\nAnd for your spirit's still delight,\nHoly thoughts that star the night.\n\nSpend all you have for loveliness,\nBuy it and never count the cost;\nFor one white singing hour of peace\nCount many a year of strife well lost,\nAnd for a breath of ecstasy\nGive all you have been, or could be.`,
    glossary: [['loveliness', 'belleza'], ['cliff', 'acantilado'], ['sway', 'mecerse'], ['scent', 'aroma'], ['strife', 'lucha'], ['barter', 'trueque']] },
  { title: 'There Will Come Soft Rains', author: 'Sara Teasdale', year: 1918, level: 'B1', link: 'm7l2', spotlight: 'Future with will: there will come, robins will wear.',
    text: `There will come soft rains and the smell of the ground,\nAnd swallows circling with their shimmering sound;\n\nAnd frogs in the pools singing at night,\nAnd wild plum trees in tremulous white;\n\nRobins will wear their feathery fire,\nWhistling their whims on a low fence-wire;\n\nAnd not one will know of the war, not one\nWill care at last when it is done.\n\nNot one would mind, neither bird nor tree,\nIf mankind perished utterly;\n\nAnd Spring herself, when she woke at dawn\nWould scarcely know that we were gone.`,
    glossary: [['swallow', 'golondrina'], ['shimmering', 'resplandeciente'], ['plum tree', 'ciruelo'], ['robin', 'petirrojo'], ['whim', 'capricho'], ['scarcely', 'apenas']] },
  { title: '"Hope" is the thing with feathers', author: 'Emily Dickinson', year: 1891, level: 'B1', link: 'm8l1', spotlight: "Present perfect: I've heard it in the chillest land.",
    text: `"Hope" is the thing with feathers -\nThat perches in the soul -\nAnd sings the tune without the words -\nAnd never stops - at all -\n\nAnd sweetest - in the Gale - is heard -\nAnd sore must be the storm -\nThat could abash the little Bird\nThat kept so many warm -\n\nI've heard it in the chillest land -\nAnd on the strangest Sea -\nYet - never - in Extremity,\nIt asked a crumb - of me.`,
    glossary: [['feathers', 'plumas'], ['perch', 'posarse'], ['tune', 'melodía'], ['gale', 'vendaval'], ['abash', 'avergonzar / acallar'], ['crumb', 'migaja']] },
  { title: 'Sonnet 18', author: 'William Shakespeare', year: 1609, level: 'B1', link: 'm6l3', spotlight: 'Comparatives: more lovely and more temperate.',
    text: `Shall I compare thee to a summer's day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer's lease hath all too short a date;\nSometime too hot the eye of heaven shines,\nAnd often is his gold complexion dimm'd;\nAnd every fair from fair sometime declines,\nBy chance or nature's changing course untrimm'd;\nBut thy eternal summer shall not fade,\nNor lose possession of that fair thou ow'st;\nNor shall Death brag thou wander'st in his shade,\nWhen in eternal lines to time thou grow'st:\nSo long as men can breathe or eyes can see,\nSo long lives this, and this gives life to thee.`,
    glossary: [['thee / thou', 'te / tú (antiguo)'], ['art', 'are (antiguo)'], ['temperate', 'templado'], ['buds', 'capullos'], ['lease', 'arriendo, plazo'], ['fade', 'desvanecerse']] },
]

// Writing prompts for the studio
export const PROMPTS = [
  { level: 'A1', text: 'Introduce yourself in 5 sentences: name, city, job, two things you love.' },
  { level: 'A1', text: 'Describe your favorite room. Use there is / there are.' },
  { level: 'A2', text: 'Write your morning routine with always, usually and sometimes.' },
  { level: 'A2', text: 'Write an Instagram caption for a new perfume. Include a call to action.' },
  { level: 'A2', text: 'Tell a childhood memory with your grandmother (past simple).' },
  { level: 'A2', text: 'Compare two beauty products you use. Which is better and why?' },
  { level: 'B1', text: 'Write a short LinkedIn "About" section for a communication strategist.' },
  { level: 'B1', text: 'Answer the interview question: "Have you ever handled a difficult situation at work?"' },
  { level: 'B1', text: 'Write a polite email asking to reschedule a meeting.' },
  { level: 'B1', text: 'If you worked at a beauty brand, what campaign would you create?' },
  { level: 'B1', text: 'Write a 4-line poem about New York in autumn.' },
]

// Painting of the day — public-domain works on Wikimedia Commons. link = lesson the describing task trains
const wm = file => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=800`
export const ART = [
  { title: 'Woman with a Parasol', artist: 'Claude Monet', year: 1875, img: wm('Claude Monet - Woman with a Parasol - Madame Monet and Her Son - Google Art Project.jpg'), link: 'm4l1', task: 'What is she doing? What is the wind doing? Use the present continuous.' },
  { title: 'Luncheon of the Boating Party', artist: 'Pierre-Auguste Renoir', year: 1881, img: wm('Pierre-Auguste Renoir - Luncheon of the Boating Party - Google Art Project.jpg'), link: 'm4l2', task: 'Choose three people. What are they doing right now?' },
  { title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', year: 1665, img: wm('1665 Girl with a Pearl Earring.jpg'), link: 'm1l3', task: 'Describe her: her eyes, her scarf, her earring (possessives!).' },
  { title: "The Child's Bath", artist: 'Mary Cassatt', year: 1893, img: wm("Mary Cassatt - The Child's Bath - Google Art Project.jpg"), link: 'm3l1', task: 'There is… / There are… — list everything you can see.' },
  { title: 'Interior, Strandgade 30', artist: 'Vilhelm Hammershøi', year: 1900, img: wm('Vilhelm Hammershøi, Interiør fra Strandgade 30, 1900.jpg'), link: 'm3l2', task: 'Where is everything? Use in, on, next to, behind.' },
  { title: 'Almond Blossom', artist: 'Vincent van Gogh', year: 1890, img: wm('Amandelbloesem - s0176V1962 - Van Gogh Museum.jpg'), link: 'm5l3', task: 'Van Gogh painted this for his baby nephew. Write 3 sentences in the past.' },
  { title: 'The Bedroom', artist: 'Vincent van Gogh', year: 1888, img: wm('La Chambre à Arles, by Vincent van Gogh, from C2RMF.jpg'), link: 'm3l3', task: 'Describe the room with adjectives in the right order.' },
  { title: 'The Kiss', artist: 'Gustav Klimt', year: 1908, img: wm('The Kiss - Gustav Klimt - Google Cultural Institute.jpg'), link: 'm6l4', task: 'Is it the most romantic painting you know? Use superlatives.' },
  { title: 'Water Lilies', artist: 'Claude Monet', year: 1906, img: wm('Claude Monet - Water Lilies - 1906, Ryerson.jpg'), link: 'm11l3', task: 'If you were in this garden, what would you do?' },
  { title: 'The Cradle', artist: 'Berthe Morisot', year: 1872, img: wm('Berthe Morisot - The Cradle - Google Art Project.jpg'), link: 'm10l1', task: 'Tell the scene: what was happening when the artist painted it?' },
  { title: 'Carnation, Lily, Lily, Rose', artist: 'John Singer Sargent', year: 1886, img: wm('John Singer Sargent - Carnation, Lily, Lily, Rose - Google Art Project.jpg'), link: 'm4l1', task: 'What are the girls doing? What time of day is it?' },
  { title: 'The Swing', artist: 'Jean-Honoré Fragonard', year: 1767, img: wm('Joean Honoré Fragonard - The Swing.jpg'), link: 'm6l3', task: 'Compare this painting with The Kiss. Which is more…?' },
  { title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai', year: 1831, img: wm('Great Wave off Kanagawa2.jpg'), link: 'm7l2', task: 'What will happen next? Make 3 predictions with will.' },
  { title: 'Paris Street; Rainy Day', artist: 'Gustave Caillebotte', year: 1877, img: wm('Gustave Caillebotte - Paris Street; Rainy Day - Google Art Project.jpg'), link: 'm10l2', task: 'Write a story: they were walking when…' },
  { title: 'The Milkmaid', artist: 'Johannes Vermeer', year: 1658, img: wm('Johannes Vermeer - Het melkmeisje - Google Art Project.jpg'), link: 'm2l1', task: 'Imagine her daily routine. Use the present simple.' },
  { title: 'A Bar at the Folies-Bergère', artist: 'Édouard Manet', year: 1882, img: wm('Edouard Manet, A Bar at the Folies-Bergère.jpg'), link: 'm8l1', task: 'Have you ever been to a place like this? What has she seen tonight?' },
  { title: 'I Am Half-Sick of Shadows', artist: 'John William Waterhouse', year: 1915, img: wm('John William Waterhouse - I am half-sick of shadows, said the lady of shalott.JPG'), link: 'm9l3', task: 'Give her advice: she should… / she shouldn’t…' },
]

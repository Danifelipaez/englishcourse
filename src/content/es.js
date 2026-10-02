// "Antes de empezar": explicación en español antes de cada lección.
// idea = la regla en palabras simples · forms = [forma correcta, error típico, por qué] · ojo = la trampa más común
export const BRIEF = {
  // ---------- Módulo 1 ----------
  m1l1: {
    idea: 'En inglés "ser" y "estar" son un solo verbo: **to be**. Tiene tres formas en presente y cada persona usa la suya: **I → am**, **he/she/it → is**, **you/we/they → are**. Además, en inglés el sujeto casi **nunca se omite**.',
    forms: [
      ['I am Colombian.', 'Am Colombian.', 'En español decimos "soy colombiana" sin "yo", pero en inglés el sujeto (I) es obligatorio.'],
      ['She is in Paris.', 'She are in Paris.', 'Con he, she e it siempre va is.'],
      ['We are tired.', 'We is tired.', 'Con we, you y they siempre va are.'],
      ["I'm Meri.", 'Im Meri.', "La contracción lleva apóstrofo: I'm = I am. Es como se habla de verdad."],
    ],
    ojo: 'Ese / esa / eso también necesita sujeto: "Es bonito" = **It is** beautiful (no "Is beautiful").',
  },
  m1l2: {
    idea: 'Para negar con to be, pon **not** después del verbo (is not, are not). Para preguntar, el verbo pasa **al principio** de la frase, delante del sujeto. No se usa "**do**".',
    forms: [
      ["She isn't married.", 'She not is married.', 'El not va después del verbo: is not → isn’t.'],
      ['Are you tired?', 'You are tired?', 'En la pregunta el verbo se adelanta: Are + you.'],
      ['Yes, I am.', "Yes, I'm.", 'En las respuestas cortas afirmativas nunca se contrae.'],
      ["I'm not late.", "I amn't late.", '"Amn’t" no existe. Se dice I’m not.'],
    ],
    ojo: 'Nunca mezcles **do** con **to be**: Are you ready? (no "Do you are ready?").',
  },
  m1l3: {
    idea: 'Los posesivos (my, your, his, her, our, their) van **antes del sustantivo** y **no cambian en plural**. Para decir "de alguien" se usa **’s** pegado al dueño. Y las profesiones siempre llevan **a o an**.',
    forms: [
      ['Laura has a sister. Her sister is a designer.', 'Laura has a sister. His sister is a designer.', 'His es "de él" y her es "de ella": depende de quién es el dueño (Laura), no de la cosa.'],
      ["Meri's perfume", 'the perfume of Meri', 'En inglés el dueño va primero con ’s: el perfume de Meri = Meri’s perfume.'],
      ["She's a journalist.", "She's journalist.", 'Las profesiones necesitan a/an: "soy periodista" = I’m a journalist.'],
      ["He's an artist.", "He's a artist.", 'Se usa an cuando la palabra siguiente empieza con sonido de vocal.'],
    ],
    ojo: 'My books (no "mys books"): el posesivo **nunca va en plural**.',
  },
  m1l4: {
    idea: '**This** (este) y **these** (estos) son para lo que está cerca; **that** (ese) y **those** (esos) para lo lejano. El plural suele ser **-s**, pero hay reglas de ortografía y algunos irregulares. Los adjetivos **nunca van en plural**.',
    forms: [
      ['These candles are white.', 'This candles are white.', 'Si son varias cosas: these (cerca) o those (lejos).'],
      ['Those chairs are old.', 'Those chairs are olds.', 'Los adjetivos en inglés no tienen plural.'],
      ['two diaries', 'two diarys', 'Consonante + y → -ies.'],
      ['three women', 'three womans', 'Hay plurales irregulares: woman → women, person → people.'],
    ],
    ojo: 'El adjetivo va **antes** del sustantivo: **red flowers** (no "flowers red").',
  },
  m1l5: {
    idea: 'Este es el capítulo 1 de la historia. No hay gramática nueva: es para ver todo el módulo 1 funcionando junto en un texto real. Fíjate en **am/is/are**, en los posesivos (**my, her**) y en **this**.',
    forms: [
      ["I'm from Colombia.", 'I from Colombia.', 'El verbo to be nunca se puede omitir.'],
      ['My friend Laura is a teacher.', 'My friend Laura is teacher.', 'Profesión → a / an.'],
      ['This is my notebook.', 'This is me notebook.', '"Mi" se dice my. Me es "me / a mí".'],
    ],
    ojo: 'Lee primero sin audio, después escucha y lee al mismo tiempo. Entender **sin traducir** palabra por palabra es la meta.',
  },

  // ---------- Módulo 2 ----------
  m2l1: {
    idea: 'El presente simple sirve para rutinas, hábitos y verdades. El verbo queda igual para todos, **EXCEPTO con he, she e it**: ahí lleva **-s**. Es el error número uno de los hispanohablantes.',
    forms: [
      ['She works in marketing.', 'She work in marketing.', 'Con he/she/it el verbo lleva -s.'],
      ['He watches series.', 'He watchs series.', 'Si termina en -sh, -ch, -s, -x u -o se agrega -es.'],
      ['Meri studies English.', 'Meri studys English.', 'Consonante + y → -ies.'],
      ['Laura has a cat.', 'Laura haves a cat.', 'Have es irregular: con he/she/it es has.'],
    ],
    ojo: 'Cualquier persona en singular cuenta como **she/he**: "My mother goes…", "The office opens…".',
  },
  m2l2: {
    idea: 'Para negar y preguntar en presente simple se usa un ayudante: **do** (I, you, we, they) o **does** (he, she, it). Cuando aparece does, la **-s se va para does** y el verbo principal queda **limpio**.',
    forms: [
      ["She doesn't like coffee.", "She doesn't likes coffee.", 'La -s ya está en does; el verbo va sin -s.'],
      ['Do you live here?', 'You live here?', 'La pregunta necesita do al principio.'],
      ['Does he work on Sundays?', 'Does he works on Sundays?', 'Después de does, verbo en forma base.'],
      ['Are you ready?', 'Do you are ready?', 'Con to be NO se usa do (módulo 1).'],
    ],
    ojo: 'Respuestas cortas: **Yes, I do.** / **No, she doesn’t.**',
  },
  m2l3: {
    idea: 'Los adverbios de frecuencia (always, usually, often, sometimes, rarely, never) dicen qué tan seguido haces algo. Su posición es fija: van **antes del verbo principal**, pero **después de to be**.',
    forms: [
      ['I always drink tea.', 'I drink always tea.', 'Antes del verbo principal: always drink.'],
      ['She is never late.', 'She never is late.', 'Con to be, el adverbio va después: is never.'],
      ['He usually takes the bus.', 'He takes usually the bus.', 'Nunca entre el verbo y su objeto.'],
      ['I never eat meat.', "I don't never eat meat.", 'Never ya es negativo: no se usa doble negación.'],
    ],
    ojo: '"Nunca" con **never** va con verbo **afirmativo**: **I never cook** (no "I don’t never cook").',
  },
  m2l4: {
    idea: 'Para el tiempo hay tres preposiciones: **at** para horas exactas, **on** para días y fechas, **in** para meses, años y partes del día. Las preguntas de tiempo usan **do/does**, como en la lección 2.2.',
    forms: [
      ['at seven o’clock', 'in seven o’clock', 'Hora exacta → at.'],
      ['on Monday', 'in Monday', 'Días → on.'],
      ['in May / in the morning', 'on May / at the morning', 'Meses y partes del día → in.'],
      ['What time do you wake up?', 'What time you wake up?', 'Las preguntas en presente simple necesitan do.'],
    ],
    ojo: 'Excepción: **at night** (no "in the night").',
  },
  m2l5: {
    idea: 'Capítulo 2: la rutina de Meri. Repasa todo el módulo 2: presente simple con **-s**, **do/does**, adverbios de frecuencia y **at/on/in**.',
    forms: [
      ['She takes the bus at eight.', 'She take the bus at eight.', 'She → -s.'],
      ['I always read on the bus.', 'I read always on the bus.', 'El adverbio va antes del verbo.'],
      ['On Saturdays I walk…', 'In Saturdays I walk…', 'Días → on.'],
    ],
    ojo: 'Al leer, subraya mentalmente cada **-s** de tercera persona. Entrenar el ojo entrena la boca.',
  },

  // ---------- Módulo 3 ----------
  m3l1: {
    idea: '"Hay" se dice **there is** (una cosa) y **there are** (varias). Funciona como to be: para negar, **there isn’t / there aren’t**, y para preguntar, **Is there…? / Are there…?** **Some** va en frases afirmativas; **any** en negativas y preguntas.',
    forms: [
      ['There is a lamp.', 'Have a lamp.', 'En español decimos "hay", pero en inglés "hay" nunca es have.'],
      ['There are two chairs.', 'There is two chairs.', 'Plural → there are.'],
      ['Are there any plants?', 'Are there some plants?', 'En preguntas y negativas se usa any.'],
      ["There aren't any curtains.", "There aren't some curtains.", 'Negativo → any.'],
    ],
    ojo: '"En mi cuarto hay…" = **In my room there is…** (no "In my room have…").',
  },
  m3l2: {
    idea: 'Las preposiciones de lugar dicen dónde está cada cosa: **in** (dentro), **on** (encima, sobre una superficie), **under** (debajo), **next to** (al lado), **between** (entre), **behind** (detrás) e **in front of** (delante).',
    forms: [
      ['The painting is on the wall.', 'The painting is in the wall.', 'Sobre una superficie → on, aunque en español digamos "en".'],
      ['next to the window', 'next the window', 'Next to siempre lleva to.'],
      ['in front of the mirror', 'in front the mirror', 'In front of siempre lleva of.'],
      ['Where is my notebook?', 'Where are my notebook?', 'Una sola cosa → is.'],
    ],
    ojo: '"En" en español puede ser in, on o at. Pregúntate: ¿dentro (**in**) o encima (**on**)?',
  },
  m3l3: {
    idea: '**Have** significa tener; con he, she e it es **has**. Para negar se usa **don’t have / doesn’t have**. Los adjetivos van antes del sustantivo y, si hay varios, siguen un orden: **opinión → tamaño → edad → color → material**.',
    forms: [
      ['She has a balcony.', 'She have a balcony.', 'She → has.'],
      ["He doesn't have a car.", "He doesn't has a car.", 'Después de doesn’t, forma base: have.'],
      ['a brass lamp', 'a lamp brass', 'El adjetivo (o el material) va antes del sustantivo.'],
      ['a lovely small wooden chair', 'a wooden small lovely chair', 'Orden: opinión, tamaño, material.'],
    ],
    ojo: '**Very** y **really** van antes del adjetivo: really cozy.',
  },
  m3l4: {
    idea: '**Can** expresa habilidad (sé / puedo hacer algo), posibilidad o permiso. Es igual para todas las personas, sin **-s**, y el verbo que le sigue va sin **to**. Para preguntar, **can** se pone al principio.',
    forms: [
      ['She can dance.', 'She cans dance.', 'Can nunca lleva -s.'],
      ['I can speak English.', 'I can to speak English.', 'Después de can no va to.'],
      ['Can you sing?', 'Do you can sing?', 'Can forma sus preguntas solo, sin do.'],
      ["I can't sew.", "I don't can sew.", 'El negativo es can’t (cannot).'],
    ],
    ojo: '"Sé nadar" = **I can swim** (no "I know swim").',
  },
  m3l5: {
    idea: 'Capítulo 3: el escritorio antiguo. Fíjate en cómo se describe una habitación con **there is/are**, preposiciones de lugar, adjetivos en orden y **can’t**.',
    forms: [
      ['There are some candles on it.', 'There is some candles on it.', 'Plural → there are.'],
      ['a small wooden desk', 'a desk wooden small', 'Tamaño y material antes del sustantivo.'],
      ["Tonight I can't sleep.", "Tonight I don't can sleep.", 'Negativo de can → can’t.'],
    ],
    ojo: 'Intenta dibujar el cuarto de Meri mientras lees: si lo puedes dibujar, lo entendiste.',
  },

  // ---------- Módulo 4 ----------
  m4l1: {
    idea: 'El presente continuo dice lo que está pasando **ahora mismo**. Se forma con **am/is/are + verbo con -ing**. Equivale a "estoy leyendo".',
    forms: [
      ["I'm studying now.", 'I studying now.', 'No olvides am/is/are: el -ing solo no basta.'],
      ['She is writing.', 'She is writeing.', 'Si el verbo termina en -e, la -e se va: write → writing.'],
      ['They are sitting.', 'They are siting.', 'Verbo corto consonante-vocal-consonante → doble consonante: sit → sitting.'],
      ['Are you listening?', 'You are listening?', 'La pregunta se forma como con to be: verbo al principio.'],
    ],
    ojo: '"Está lloviendo" = **It’s raining**. El sujeto it es **obligatorio**.',
  },
  m4l2: {
    idea: 'El presente simple es para **hábitos** (siempre, todos los días). El presente continuo es para **lo que pasa ahora o es temporal** (hoy, esta semana). Las **palabras clave** te dicen cuál usar.',
    forms: [
      ['I drink coffee every morning.', 'I am drinking coffee every morning.', 'Every morning es un hábito → presente simple.'],
      ["Shh! The baby is sleeping.", 'Shh! The baby sleeps.', 'Está pasando ahora → continuo.'],
      ["This week I'm working from home.", 'This week I work from home.', 'Algo temporal → continuo.'],
      ['My team meets on Mondays.', 'My team is meeting on Mondays.', 'Una rutina → simple.'],
    ],
    ojo: 'Palabras de hábito: **always, usually, every day**. Palabras de ahora: **now, right now, at the moment, today**.',
  },
  m4l3: {
    idea: 'Algunos verbos describen **estados** (sentir, pensar, tener) y no acciones, así que casi nunca van con **-ing**, aunque hables de ahora mismo: like, love, want, need, know, understand, believe, remember, belong, seem.',
    forms: [
      ["I don't understand.", "I'm not understanding.", 'Understand es un estado mental → simple.'],
      ['I want a coffee.', "I'm wanting a coffee.", 'Want no se usa en continuo.'],
      ['This desk belongs to me.', 'This desk is belonging to me.', 'La posesión es un estado.'],
      ['It smells like roses.', "It's smelling like roses.", 'Smell (tener olor) es un estado.'],
    ],
    ojo: '"I’m lovin’ it" es publicidad que rompe la regla a propósito. En tus textos usa **I love it**.',
  },
  m4l4: {
    idea: 'El imperativo da instrucciones o invitaciones con el verbo en **forma base, sin sujeto**. El negativo es **Don’t + verbo**. **Let’s + verbo** = "vamos a…". Es el lenguaje de los llamados a la acción en marketing.',
    forms: [
      ['Try it today!', 'Tries it today!', 'El imperativo es el verbo base, sin -s.'],
      ["Don't touch the paintings.", 'Not touch the paintings.', 'El negativo siempre es Don’t.'],
      ["Let's go!", "Let's to go!", 'Después de let’s no va to.'],
      ['Discover your glow.', 'To discover your glow.', 'Un llamado a la acción empieza con el verbo.'],
    ],
    ojo: '**Please** suaviza el imperativo: Sit down, please.',
  },
  m4l5: {
    idea: 'Capítulo 4: dos cartas. Mira el presente continuo (lo que pasa ahora), los verbos de estado (love, know, want) y los imperativos (Apply now, Don’t worry).',
    forms: [
      ["I'm holding the letter.", 'I hold the letter (ahora mismo).', 'Acción en este momento → continuo.'],
      ["I don't know who Rosa is.", "I'm not knowing who Rosa is.", 'Know es un estado.'],
      ["Don't miss this opportunity.", 'No miss this opportunity.', 'Imperativo negativo → Don’t.'],
    ],
    ojo: '"Dear…" se usa para empezar cartas y correos, incluso formales.',
  },

  // ---------- Módulo 5 ----------
  m5l1: {
    idea: 'El pasado de to be tiene dos formas: **was** (I, he, she, it) y **were** (you, we, they). Funciona igual que en presente: el negativo es **wasn’t/weren’t** y en la pregunta el verbo va al principio. "Hace dos años" = **two years ago**, con **ago** después del tiempo.',
    forms: [
      ['They were happy.', 'They was happy.', 'They → were.'],
      ['Was it expensive?', 'Did it was expensive?', 'Con was/were no se usa did.'],
      ['two years ago', 'ago two years', 'Ago va después del período.'],
      ['I was born in 1995.', 'I born in 1995.', '"Nací" = I was born. Siempre con was/were.'],
    ],
    ojo: '"Nací en Cali" = **I was born in Cali**. Es un error muy común olvidar el was.',
  },
  m5l2: {
    idea: 'Para el pasado de los verbos regulares se agrega **-ed**, y es igual para todas las personas (¡no hay -s!). La -ed tiene tres sonidos: **/t/**, **/d/** y **/ɪd/**. Solo suena "id" después de **t o d**.',
    forms: [
      ['She worked in Paris.', 'She works in Paris (ayer).', 'Si es pasado, necesitas -ed.'],
      ['I studied English.', 'I studyed English.', 'Consonante + y → -ied.'],
      ['We stopped.', 'We stoped.', 'Verbo corto CVC → se dobla la consonante.'],
      ['walked = /wɔːkt/', 'walked = /wɔːkɪd/', 'No pronuncies "id" en todos: solo después de t o d (wanted, decided).'],
    ],
    ojo: 'Ayer = **yesterday**, anoche = **last night**, la semana pasada = **last week** (sin "the").',
  },
  m5l3: {
    idea: 'Los verbos más comunes son **irregulares**: tienen su propia forma de pasado y hay que aprenderlos. La buena noticia: siguen siendo **iguales para todas las personas**. Agruparlos por sonido ayuda: **bought / brought / thought**.',
    forms: [
      ['I went to Paris.', 'I goed to Paris.', 'Go → went.'],
      ['She wrote a letter.', 'She writed a letter.', 'Write → wrote.'],
      ['I bought flowers.', 'I buyed flowers.', 'Buy → bought.'],
      ['We saw the painting.', 'We seed the painting.', 'See → saw.'],
    ],
    ojo: 'Aprende los irregulares en frases cortas con sentido: "I bought an antique desk" se recuerda mejor que "buy-bought".',
  },
  m5l4: {
    idea: 'En pasado, el ayudante de las preguntas y negativas es **did**, para todas las personas. Cuando aparece did, el verbo principal vuelve a su **forma base**: did ya marca el pasado.',
    forms: [
      ["She didn't go.", "She didn't went.", 'Con didn’t, verbo base: go.'],
      ['Did you see it?', 'Did you saw it?', 'Después de did, verbo base: see.'],
      ['Were you at home?', 'Did you were at home?', 'Con was/were no se usa did.'],
      ['Where did you meet?', 'Where you met?', 'La pregunta necesita did.'],
    ],
    ojo: 'El pasado se marca **una sola vez**: o did, o -ed/irregular, nunca los dos.',
  },
  m5l5: {
    idea: 'Capítulo 5: la abuela recuerda. Todo el pasado del módulo: **was/were**, verbos regulares e irregulares, y **did/didn’t**.',
    forms: [
      ['Rosa was my aunt.', 'Rosa were my aunt.', 'She → was.'],
      ['She left Colombia in 1966.', 'She leaved Colombia in 1966.', 'Leave es irregular: left.'],
      ['Did she come back?', 'Did she came back?', 'Después de did, verbo base.'],
    ],
    ojo: 'Al leer, cuenta cuántos verbos irregulares hay en el texto: es un buen ejercicio de repaso.',
  },

  // ---------- Módulo 6 ----------
  m6l1: {
    idea: 'Algunos sustantivos no se pueden contar (**incontables**): information, advice, makeup, water, furniture. No tienen plural ni llevan **a/an**. Para contarlos usa un recipiente: **a bottle of**, **a piece of**.',
    forms: [
      ['some information', 'some informations', 'Information es incontable: nunca lleva -s.'],
      ['a piece of advice', 'an advice', 'Advice no lleva a/an.'],
      ['a bottle of perfume', 'a perfume (frasco)', 'Para contarlo se nombra el recipiente.'],
      ["We don't have any samples.", "We don't have some samples.", 'Negativo → any (como en el módulo 3).'],
    ],
    ojo: 'Furniture (muebles) es incontable: **a piece of furniture**, no "a furniture".',
  },
  m6l2: {
    idea: '**Many** va con lo contable (many products) y **much** con lo incontable (much time). Se usan sobre todo en preguntas y negativas. En frases afirmativas lo natural es **a lot of**, que sirve para ambos.',
    forms: [
      ['How much money?', 'How many money?', 'Money es incontable → much.'],
      ['How many followers?', 'How much followers?', 'Followers se cuentan → many.'],
      ['She has a lot of friends.', 'She has much friends.', 'En afirmativo lo natural es a lot of.'],
      ['a few ideas / a little water', 'a little ideas / a few water', 'a few para contables, a little para incontables.'],
    ],
    ojo: '"¿Cuánto cuesta?" = **How much is it?** / How much does it cost?',
  },
  m6l3: {
    idea: 'Para comparar dos cosas: si el adjetivo es corto se agrega **-er + than**; si es largo, **more + adjetivo + than**. Hay irregulares: **good → better**, **bad → worse**.',
    forms: [
      ['softer than', 'more soft than', 'Adjetivo corto → -er.'],
      ['more elegant than', 'eleganter than', 'Adjetivo largo → more.'],
      ['better than', 'more good than', 'Good es irregular: better.'],
      ['cheaper than the original', 'cheaper that the original', '"Que" en una comparación es than, no that.'],
    ],
    ojo: 'Adjetivos que terminan en -y: **pretty → prettier**, **easy → easier**.',
  },
  m6l4: {
    idea: 'El superlativo destaca una cosa entre todas: **the + -est** (cortos) o **the most + adjetivo** (largos). Siempre lleva **the**. Para igualdad se usa **as … as** ("tan … como").',
    forms: [
      ['the softest', 'the most soft', 'Adjetivo corto → -est.'],
      ['the most iconic', 'the iconicest', 'Adjetivo largo → the most.'],
      ['the best day', 'the better day', 'Superlativo de good: the best.'],
      ['as good as the original', 'as good than the original', 'Igualdad → as … as.'],
    ],
    ojo: '"Del mundo" en un superlativo es **in the world** (no "of the world").',
  },
  m6l5: {
    idea: 'Capítulo 6: Meri analiza la marca como estratega. Busca cantidades (**a lot of, many, some**), comparativos y superlativos.',
    forms: [
      ['There were many brands.', 'There were much brands.', 'Brands se cuentan → many.'],
      ['The packaging was simpler than the others.', 'more simple than', 'Simple funciona como adjetivo corto: simpler.'],
      ['the most elegant counter', 'the more elegant counter', 'Superlativo → the most.'],
    ],
    ojo: '**Fewer** (menos) es para contables y **less** para incontables: fewer stories, less emotion.',
  },

  // ---------- Módulo 7 ----------
  m7l1: {
    idea: '**Be going to + verbo** sirve para planes que ya decidiste ("voy a…") y para predicciones con evidencia visible. Necesita **am/is/are**.',
    forms: [
      ["I'm going to apply.", 'I going to apply.', 'No olvides am/is/are.'],
      ["She's going to prepare the slides.", "She's going to prepares the slides.", 'Después de to, verbo base.'],
      ["Look at the clouds! It's going to rain.", 'Look! It will rain.', 'Hay evidencia → going to.'],
      ['What are you going to wear?', 'What you going to wear?', 'La pregunta necesita are al principio.'],
    ],
    ojo: 'En conversación suena "gonna", pero escríbelo **going to**.',
  },
  m7l2: {
    idea: '**Will + verbo base** es para decisiones que tomas en el momento, promesas, ofrecimientos y predicciones de opinión. Es igual para todas las personas; el negativo es **won’t**.',
    forms: [
      ["The phone is ringing — I'll answer it!", "I'm going to answer it! (decidido ahora)", 'Si decides en el momento → will.'],
      ['She will help you.', 'She wills help you.', 'Will no lleva -s.'],
      ["I'll call you.", "I'll to call you.", 'Después de will no va to.'],
      ["I won't forget.", "I willn't forget.", 'El negativo es won’t.'],
    ],
    ojo: 'Plan ya hecho → **going to**. Decisión en el momento → **will**.',
  },
  m7l3: {
    idea: 'Para citas y planes fijos con fecha y hora (lo que está en tu agenda) se usa el **presente continuo**. Para horarios oficiales (trenes, vuelos, eventos), el **presente simple**.',
    forms: [
      ["I'm meeting the director on Friday.", 'I meet the director on Friday.', 'Cita fija en la agenda → continuo.'],
      ['The flight leaves at 6:40.', 'The flight is going to leave at 6:40.', 'Horario oficial → presente simple.'],
      ['What are you doing this weekend?', 'What do you do this weekend?', 'Para preguntar por planes → continuo.'],
      ['the day after tomorrow', 'after tomorrow', '"Pasado mañana" = the day after tomorrow.'],
    ],
    ojo: 'Es el mismo continuo del módulo 4, pero con una expresión de **futuro**.',
  },
  m7l4: {
    idea: 'Algunos verbos van seguidos de **to + verbo**: want, would like, hope, plan, decide, need, learn. **Would like** es la forma educada de **want**, ideal para el trabajo y las entrevistas.',
    forms: [
      ["I'd like to join your team.", 'I would like join your team.', 'Would like + to + verbo.'],
      ['She wants to grow.', 'She wants grow.', 'Want + to.'],
      ["I'd like a coffee.", 'I like a coffee.', 'Me gustaría (ahora) = I’d like. I like = me gusta en general.'],
      ['I hope to work abroad.', 'I hope work abroad.', 'Hope + to.'],
    ],
    ojo: 'I want… puede sonar brusco en un correo. Usa **I would like to…**',
  },
  m7l5: {
    idea: 'Capítulo 7: la invitación a la entrevista. Hay cuatro futuros juntos: **going to** (planes), **will** (promesas), **presente continuo** (cita fija) y **would like**.',
    forms: [
      ["I'm having an interview on Thursday.", 'I have an interview on Thursday (cita).', 'Cita fija → continuo.'],
      ["I'll help you.", "I'm helping you (promesa).", 'Promesa → will.'],
      ["I'd like to find you.", 'I would like find you.', 'Would like + to.'],
    ],
    ojo: 'Available = disponible. "¿Está disponible el jueves?" = Are you available on Thursday?',
  },

  // ---------- Módulo 8 ----------
  m8l1: {
    idea: 'El present perfect (**have/has + participio**) habla de experiencias de vida sin decir cuándo. Equivale a "he visitado". **Ever** = alguna vez, **never** = nunca.',
    forms: [
      ["I've seen that movie.", 'I have saw that movie.', 'Se usa el participio (seen), no el pasado (saw).'],
      ['She has led campaigns.', 'She have led campaigns.', 'She → has.'],
      ['Have you ever been to Paris?', 'Did you ever go to Paris?', 'Experiencia sin fecha → present perfect.'],
      ["I've never been there.", "I haven't never been there.", 'Never ya es negativo.'],
    ],
    ojo: '**Been** = fue y volvió. **Gone** = se fue y sigue allá.',
  },
  m8l2: {
    idea: 'Con el present perfect: **just** = acabo de (hace un momento), **already** = ya (antes de lo esperado), **yet** = todavía / ya, solo en negativas y preguntas, y siempre al final.',
    forms: [
      ["I've just sent it.", 'I just have sent it.', 'Just va entre have y el participio.'],
      ["I haven't decided yet.", "I didn't decide yet.", 'Yet (hasta ahora) conecta con el presente → present perfect.'],
      ["I haven't finished yet.", "I haven't finished already.", 'Negativo → yet, al final.'],
      ['Have you replied yet?', 'Have you yet replied?', 'Yet va al final de la pregunta.'],
    ],
    ojo: '"Acabo de llegar" = **I’ve just arrived** (no "I finish of arrive").',
  },
  m8l3: {
    idea: 'Para algo que empezó en el pasado y sigue ahora se usa el **present perfect**. En español usamos el presente ("trabajo aquí desde 2021"), pero en inglés no: **I have worked here since 2021**. **For** va con un período y **since** con un punto de inicio.',
    forms: [
      ["I've worked here since 2021.", 'I work here since 2021.', 'Si sigue hasta ahora → present perfect.'],
      ['for three years', 'since three years', 'Período → for.'],
      ['since May', 'for May', 'Punto de inicio → since.'],
      ['How long have you known her?', 'How long do you know her?', '"¿Hace cuánto…?" = How long have you…?'],
    ],
    ojo: '"Hace 3 años que estudio" = I have studied **for three years**.',
  },
  m8l4: {
    idea: 'Si dices **CUÁNDO** (yesterday, in 2023, last year, ago), usa el **pasado simple**. Si solo hablas de la experiencia sin fecha, usa el **present perfect**. Es la clave de las entrevistas de trabajo.',
    forms: [
      ['I met the CEO yesterday.', 'I have met the CEO yesterday.', 'Con yesterday → pasado simple.'],
      ["I've worked with brands for five years.", 'I worked with brands for five years. (y aún lo haces)', 'Si sigue siendo verdad hoy → present perfect. El pasado simple diría que ya terminó.'],
      ['two years ago', 'have … two years ago', 'Ago siempre va con el pasado simple.'],
      ['Have you ever worked with influencers?', 'Did you ever work with influencers?', 'Ever (sin fecha) → present perfect.'],
    ],
    ojo: 'Patrón ganador en entrevista: "I’ve worked with… Last year I…".',
  },
  m8l5: {
    idea: 'Capítulo 8: la entrevista. Meri mezcla **present perfect** (experiencias) y **pasado simple** (detalles con fecha). Ese es el patrón que vas a usar en tus entrevistas reales.',
    forms: [
      ['Last year I led a campaign.', 'Last year I have led a campaign.', 'Con last year → pasado simple.'],
      ["No, I haven't (lived abroad).", "No, I didn't (sin fecha).", 'La pregunta era con have → respuesta con haven’t.'],
      ["I've wanted to live in New York for a long time.", 'I want to live there since a long time.', 'Hasta ahora + for → present perfect.'],
    ],
    ojo: 'Handwriting = letra (la forma de escribir de alguien).',
  },

  // ---------- Módulo 9 ----------
  m9l1: {
    idea: 'Para pedir algo con educación: **Can you…?** (amigable), **Could you…?** (educado), **Would you mind + -ing?** (muy educado). Para pedir permiso: **Can I…?** / **Could I…?** / **May I…?** (formal).',
    forms: [
      ['Could you send me the file, please?', 'Send me the file.', 'En el trabajo, could + please suena profesional.'],
      ['Would you mind opening the window?', 'Would you mind to open the window?', 'Would you mind + verbo con -ing.'],
      ['Could you lend me your pen?', 'Could you borrow me your pen?', 'Lend = prestar (dar). Borrow = pedir prestado.'],
      ['Could you repeat that?', 'Could you to repeat that?', 'Después de could, verbo sin to.'],
    ],
    ojo: 'Para decir que no con amabilidad: **I’m afraid I can’t.**',
  },
  m9l2: {
    idea: '**Must** y **have to** expresan obligación. Pero OJO con el negativo: **mustn’t** = está prohibido, y **don’t have to** = no es necesario (eres libre de elegir). Have to se conjuga: **she has to**, **I had to**.',
    forms: [
      ["You mustn't share the password.", "You don't have to share the password.", 'Si está prohibido → mustn’t.'],
      ["You don't have to wear a suit.", "You mustn't wear a suit.", 'Si es opcional → don’t have to.'],
      ['She has to leave.', 'She have to leave.', 'She → has to.'],
      ['You must sign here.', 'You must to sign here.', 'Después de must no va to.'],
    ],
    ojo: 'El pasado de must / have to es **had to**: Yesterday I had to work late.',
  },
  m9l3: {
    idea: '**Should** = deberías (es un consejo, más suave que **must**). Es igual para todas las personas y va sin **to**. Para opinar en reuniones: **I think we should…** / I don’t think we should…',
    forms: [
      ['You should rest.', 'You should to rest.', 'Después de should no va to.'],
      ['She should call.', 'She shoulds call.', 'Should nunca lleva -s.'],
      ['I think we should post at 7.', 'I think we should to post at 7.', 'En reuniones: I think we should + verbo base.'],
      ["Why don't you try a carousel?", 'Why you don’t try a carousel?', 'Otra forma de aconsejar: Why don’t you…?'],
    ],
    ojo: '**Should I…?** = ¿Debería…? Ideal para pedir consejo a tu jefa.',
  },
  m9l4: {
    idea: '**Might** y **may** + verbo base = "puede que…" (algo posible, sin certeza). En los correos profesionales hay frases fijas que vale la pena memorizar completas.',
    forms: [
      ['It might rain.', 'It might to rain.', 'Sin to.'],
      ['I look forward to hearing from you.', 'I look forward to hear from you.', 'Look forward to + -ing (aquí to es preposición).'],
      ['Please find attached my CV.', 'I attach you my CV.', 'Frase estándar de correo para adjuntar.'],
      ['Best regards,', 'Best regard,', 'Regards siempre en plural.'],
    ],
    ojo: 'Escala de certeza: **will (100 %)** → **might (50 %)** → **won’t (0 %)**.',
  },
  m9l5: {
    idea: 'Capítulo 9: primer día en Nueva York. Están todos los modales del módulo: **must, have to, mustn’t, don’t have to, should, could** y **might**.',
    forms: [
      ["You mustn't post about new products.", "You don't have to post… (= prohibido)", 'Prohibido → mustn’t.'],
      ["You don't have to wear heels.", "You mustn't wear heels (= opcional).", 'Opcional → don’t have to.'],
      ['Could you sit down?', 'Can you to sit down?', 'Pedido educado: could + verbo base.'],
    ],
    ojo: '"You must be Meri" = deduces algo con seguridad ("tú debes ser Meri").',
  },

  // ---------- Módulo 10 ----------
  m10l1: {
    idea: 'El pasado continuo (**was/were + -ing**) describe una acción **en progreso** en el pasado: "estaba caminando". Los escritores lo usan para pintar el fondo de una escena.',
    forms: [
      ['I was walking.', 'I was walk.', 'Necesita -ing.'],
      ['They were waiting.', 'They was waiting.', 'They → were.'],
      ['What were you doing at 8?', 'What did you doing at 8?', 'La pregunta va con were, no con did.'],
      ['The sun was shining.', 'The sun shining.', 'No olvides was.'],
    ],
    ojo: 'Es el "-aba / -ía" de una acción en curso: estaba lloviendo = **it was raining**.',
  },
  m10l2: {
    idea: 'Cuando una acción larga (**pasado continuo**) es interrumpida por una corta (**pasado simple**): I was reading when the phone rang. **When** va con la acción corta; **while** con la larga.',
    forms: [
      ['I was cooking when she arrived.', 'I cooked when she was arriving.', 'Acción larga → continuo; interrupción → simple.'],
      ['While I was walking, it started to rain.', 'While I walked, it was starting to rain.', 'While + acción larga.'],
      ['My heel broke while I was crossing.', 'My heel was breaking while I crossed.', 'Lo instantáneo va en simple.'],
      ['What were you doing when it happened?', 'What did you do when it was happening?', 'Fondo (continuo) + evento (simple).'],
    ],
    ojo: 'Piensa en una película: el **continuo** es la escena de fondo y el **simple** es el giro.',
  },
  m10l3: {
    idea: '**Used to + verbo** = "solía…". Sirve para hábitos o estados del pasado que ya no existen. En preguntas y negativas va con did y se quita la -d: **didn’t use to**.',
    forms: [
      ['I used to live in Cali.', 'I use to live in Cali.', 'En afirmativo es used.'],
      ['Did you use to dance?', 'Did you used to dance?', 'Con did, la -d se va.'],
      ["I didn't use to like coffee.", "I didn't used to like coffee.", 'Negativo → didn’t use to.'],
      ["I don't smoke anymore.", "I don't smoke no more.", '"Ya no" = not … anymore.'],
    ],
    ojo: 'Used to solo existe en pasado. Para el presente se usa **usually**: I usually read.',
  },
  m10l4: {
    idea: 'Los conectores unen ideas. Para secuencia: **first, then, after that, finally**. Para contraste: **but** (informal), **however** (formal, al inicio de la oración), **although** (aunque). Causa: **because**. Resultado: **so**.',
    forms: [
      ['Although it was expensive, we bought it.', 'Although it was expensive, but we bought it.', 'Although y but no van juntos: elige uno.'],
      ['The idea is good. However, the budget is small.', 'The idea is good, however the budget is small.', 'However suele empezar una oración nueva y lleva coma.'],
      ['It was late, so I left.', 'It was late, because I left.', 'Resultado → so. Causa → because.'],
      ['After that, we launch.', 'After, we launch.', 'Como conector se dice after that.'],
    ],
    ojo: 'En presentaciones, **First / Then / Finally** hace que te sigan sin esfuerzo.',
  },
  m10l5: {
    idea: 'Capítulo 10: la verdad sobre Rosa. Una historia con capas: **used to**, **pasado continuo con when**, **pasado simple** y conectores (**however, although, so**).',
    forms: [
      ['They were working late when a fire started.', 'They worked late when a fire was starting.', 'Fondo → continuo; evento → simple.'],
      ['Rosa used to write poems.', 'Rosa use to write poems.', 'Afirmativo → used to.'],
      ['She became a writer, although…', 'Although… but…', 'No combines although y but.'],
    ],
    ojo: 'Scent = aroma (palabra clave en perfumería).',
  },

  // ---------- Módulo 11 ----------
  m11l1: {
    idea: 'El condicional cero describe verdades generales: **if + presente, presente**. Aquí **if** y **when** significan casi lo mismo. Si la frase empieza con if, va **coma** después de esa parte.',
    forms: [
      ['If you heat ice, it melts.', 'If you will heat ice, it melts.', 'Después de if no va will.'],
      ['If customers trust a brand, they buy.', 'If customers trusts a brand…', 'Customers (plural) → trust.'],
      ['If it rains, the park closes.', 'If it rains the park, closes.', 'La coma va justo después de la parte del if.'],
      ['The park closes if it rains.', 'The park closes, if it rains.', 'Si el if va segundo, no lleva coma.'],
    ],
    ojo: 'Es la lógica de la estrategia: "If people feel emotion, they remember the brand."',
  },
  m11l2: {
    idea: 'El primer condicional habla de situaciones futuras reales o posibles: **if + presente, will + verbo**. **Nunca** se pone **will** justo después de **if**. **Unless** = "a menos que" (if … not).',
    forms: [
      ['If we post tonight, we will get more views.', 'If we will post tonight…', 'Después de if → presente.'],
      ["If you call me, I'll answer.", 'If you call me, I answer (futuro).', 'Resultado futuro → will.'],
      ["Unless you hurry, you'll miss it.", "Unless you don't hurry…", 'Unless ya significa "si no": no se niega otra vez.'],
      ['If it rains, take an umbrella.', 'If it rains, you take…', 'El resultado también puede ser un imperativo.'],
    ],
    ojo: 'En español también: "Si llueve (presente), me quedo / me quedaré". Nunca "si lloverá".',
  },
  m11l3: {
    idea: 'El segundo condicional es para situaciones imaginarias o poco probables: **if + pasado, would + verbo** ("si tuviera…, viajaría"). Con to be se usa **were** para todas las personas.',
    forms: [
      ['If I had money, I would travel.', 'If I would have money…', 'Nunca would en la parte del if.'],
      ['If I were you, I would accept.', 'If I was you…', '"Yo en tu lugar" = If I were you.'],
      ['If I won, I would buy a house.', 'If I won, I will buy a house.', 'Situación imaginaria → would.'],
      ['If I get the job, I will move.', 'If I got the job, I will move.', 'Si es posible y real → primer condicional.'],
    ],
    ojo: '**If I were you, I’d…** es la forma más elegante de dar un consejo.',
  },
  m11l4: {
    idea: 'Después de **when, as soon as, before, after** y **until** se usa el **presente** aunque hables del futuro, igual que con if.',
    forms: [
      ["I'll call you when I arrive.", "…when I will arrive.", 'Después de when → presente.'],
      ["I'll text you as soon as I land.", "…as soon as I will land.", 'Después de as soon as → presente.'],
      ['Wait until I finish.', 'Wait until I will finish.', 'Después de until → presente.'],
      ['Before you leave, close the window.', 'Before you will leave…', 'Después de before → presente.'],
    ],
    ojo: 'En español pasa algo parecido: "cuando llegue" (subjuntivo), no "cuando llegaré".',
  },
  m11l5: {
    idea: 'Capítulo 11: la idea de la campaña. Cada condicional cumple una función en el pitch: el **cero** (verdad general), el **primero** (plan posible), el **segundo** (consejo) y las oraciones de tiempo.',
    forms: [
      ['If we tell her story, people will feel…', 'If we will tell her story…', 'Primer condicional: if + presente.'],
      ['If I were you, I would start today.', 'If I was you, I will start…', 'Consejo → were + would.'],
      ["As soon as it's ready, we will present it.", 'As soon as it will be ready…', 'Oración de tiempo → presente.'],
    ],
    ojo: 'Board = junta directiva. Pitch = presentación para convencer.',
  },

  // ---------- Módulo 12 ----------
  m12l1: {
    idea: 'La voz pasiva pone el foco en el producto o el proceso, no en quién lo hace: **am/is/are + participio**. Es perfecta para marcas y reportes. Si importa quién lo hace, se agrega **by + persona**.',
    forms: [
      ['It is made in France.', 'It is make in France.', 'Necesita el participio: made.'],
      ['The bottles are filled by hand.', 'The bottles fill by hand.', 'Sin is/are no es pasiva.'],
      ['English is spoken worldwide.', 'English speaks worldwide.', 'El idioma no habla: es hablado.'],
      ['The poems are written by Rosa.', 'The poems are wrote by Rosa.', 'Participio de write: written.'],
    ],
    ojo: '"Se hace en Francia" = **It is made in France**. El "se" español suele ser pasiva en inglés.',
  },
  m12l2: {
    idea: 'La pasiva en pasado se forma con **was/were + participio**. Las marcas la usan para contar su historia (heritage): fue fundada, fue creado, fueron encontrados.',
    forms: [
      ['It was created in 1968.', 'It was create in 1968.', 'Participio: created.'],
      ['The letters were written in New York.', 'The letters was written…', 'Plural → were.'],
      ['The company was founded in 1920.', 'The company founded in 1920.', 'Fue fundada → was founded.'],
      ['The formula was lost.', 'The formula was lose.', 'Participio de lose: lost.'],
    ],
    ojo: 'Found (fundar) es regular: ****found**ed**. Find (encontrar) es irregular: found.',
  },
  m12l3: {
    idea: 'Los relativos unen ideas: **who** para personas, **which** para cosas, **where** para lugares y **that** para personas o cosas (más informal). No se repite el sujeto ni el objeto.',
    forms: [
      ['the woman who wrote the poems', 'the woman who she wrote the poems', 'Who ya es el sujeto: no repitas she.'],
      ['the city where I was born', 'the city which I was born', 'Lugar → where.'],
      ['the book that I read', 'the book that I read it', 'No repitas el objeto (it).'],
      ['a poet who loved the sea', 'a poet which loved the sea', 'Persona → who.'],
    ],
    ojo: 'Estas frases sirven para describir tu perfil: "**I’m a communicator who loves storytelling.**"',
  },
  m12l4: {
    idea: 'El estilo indirecto cuenta lo que alguien dijo. El tiempo verbal da un paso atrás: **is → was**, **will → would**, **can → could**. **Say** no lleva persona después; **tell** sí la necesita.',
    forms: [
      ['She said she was ready.', 'She said she is ready.', 'Al reportar, el presente pasa a pasado.'],
      ['She told me that…', 'She said me that…', 'Tell + persona; say sin persona.'],
      ['He said they would launch.', 'He said they will launch.', 'Will → would.'],
      ['Sam said he could help.', 'Sam said he can help.', 'Can → could.'],
    ],
    ojo: 'Los pronombres también cambian: "I love my idea" → **She said she loved her idea.**',
  },
  m12l5: {
    idea: 'Capítulo final: el pitch. Usa la pasiva, los relativos y el estilo indirecto, y hace eco de la carta de Rosa del módulo 4. Si lo entiendes, estás en B1.',
    forms: [
      ['This perfume was created in 1968.', 'This perfume created in 1968.', 'Pasado pasivo → was + participio.'],
      ['three women who believed in words', 'three women which believed…', 'Personas → who.'],
      ['The CEO said that it was beautiful.', 'The CEO said that it is beautiful.', 'Estilo indirecto → pasado.'],
    ],
    ojo: 'Al terminar, vuelve a leer el capítulo 4 (lección 4.5) y compara: es la misma carta, 58 años después.',
  },
}

// ---------- Textos de apoyo en español ----------
// Subtítulo y meta de cada módulo (se muestran en español hasta que ella va bien adelantada; ver metaEnglish en i18n.jsx)
export const MODULE_ES = {
  m1: { subtitle: 'El verbo to be · presentaciones', goal: 'Preséntate con seguridad: nombre, origen, trabajo y sentimientos.' },
  m2: { subtitle: 'Presente simple · rutinas · hora', goal: 'Describe tu rutina, tus hábitos y con qué frecuencia haces las cosas.' },
  m3: { subtitle: 'There is/are · lugar · can', goal: 'Describe una habitación hermosa, dónde está cada cosa y qué puedes hacer.' },
  m4: { subtitle: 'Presente continuo · verbos de estado · imperativos', goal: 'Describe lo que pasa ahora y escribe textos para redes con llamados a la acción.' },
  m5: { subtitle: 'Pasado simple · was/were · verbos irregulares', goal: 'Cuenta historias y recuerdos, como Isabel Allende.' },
  m6: { subtitle: 'Cantidades · comparativos · superlativos', goal: 'Compara productos, habla de cantidades y analiza una marca.' },
  m7: { subtitle: 'going to · will · planes y citas', goal: 'Habla de tus planes, predicciones, promesas y metas profesionales.' },
  m8: { subtitle: 'Presente perfecto · experiencias · for/since', goal: 'Habla de tu experiencia y tus logros: el lenguaje de las entrevistas y las hojas de vida.' },
  m9: { subtitle: 'Modales · peticiones · obligación · consejos', goal: 'Haz peticiones corteses, entiende reglas y da consejos en el trabajo.' },
  m10: { subtitle: 'Pasado continuo · used to · conectores', goal: 'Cuenta historias ricas: contexto, interrupciones, viejos hábitos y buenas conexiones.' },
  m11: { subtitle: 'Condicionales · cláusulas de tiempo · unless', goal: 'Habla de condiciones, consecuencias y situaciones imaginarias: la lógica de la estrategia.' },
  m12: { subtitle: 'Voz pasiva · cláusulas de relativo · estilo indirecto', goal: 'Presenta ideas como una profesional: procesos, descripciones y lo que dijo la gente.' },
}

// Introducción de cada lección
export const LESSON_ES = {
  m1l1: 'El verbo más importante del inglés. Ya lo conoces: vamos a dejarlo firme.',
  m1l2: 'Haz preguntas y di que no, con cortesía.',
  m1l3: 'Habla de las personas: de quién son las cosas y qué trabajo hacen.',
  m1l4: 'Señala cosas cercanas y lejanas, una o muchas.',
  m1l5: 'Capítulo 1 de la historia de Meri. Lee, escucha y mira todo lo que aprendiste en este módulo funcionando junto.',
  m2l1: 'Hábitos, rutinas y hechos. Cuidado con la famosa -s.',
  m2l2: 'Los verbos auxiliares do y does. Ellos cargan la -s por ti.',
  m2l3: '¿Con qué frecuencia? Palabras que hacen sonar real tu rutina.',
  m2l4: 'Di la hora y organiza tu semana.',
  m2l5: 'Capítulo 2: las mañanas de Meri y una tienda extraña en su calle.',
  m3l1: 'Describe la habitación de tus sueños, al estilo Pinterest.',
  m3l2: '¿Dónde está cada cosa? Organiza la habitación con palabras.',
  m3l3: 'Posesiones y descripciones, con estilo.',
  m3l4: 'Habilidades y posibilidades: habla de tus talentos.',
  m3l5: 'Capítulo 3: el escritorio antiguo y lo que hay dentro.',
  m4l1: 'Como en Emily in Paris: ¿qué está pasando ahora mismo?',
  m4l2: 'Tu rutina frente a este momento: dos tiempos, dos ideas.',
  m4l3: 'Algunos verbos describen estados, no acciones. Prefieren la forma simple.',
  m4l4: 'El lenguaje de las instrucciones, los textos para redes y los llamados a la acción.',
  m4l5: 'Capítulo 4: Meri abre la carta de Rosa y su bandeja de entrada.',
  m5l1: 'El pasado de to be: solo dos formas.',
  m5l2: 'Añade -ed y viaja en el tiempo.',
  m5l3: 'Las rebeldes. Aprendidas en familias, se vuelven fáciles.',
  m5l4: 'Preguntas y negaciones en pasado: el auxiliar es did.',
  m5l5: 'Capítulo 5: Meri visita a su abuela y el pasado responde.',
  m6l1: 'Algunas cosas se pueden contar. Otras no, y el inglés lo tiene en cuenta.',
  m6l2: 'Cantidades para presupuestos, productos y campañas.',
  m6l3: 'Compara dos cosas: el corazón de todo lanzamiento de producto.',
  m6l4: 'Lo mejor, lo más hermoso, lo más icónico: los superlativos venden.',
  m6l5: 'Capítulo 6: Meri estudia Maison Lumière como una estratega.',
  m7l1: 'Planes e intenciones que ya decidiste.',
  m7l2: 'Decisiones al instante, promesas, ofrecimientos y predicciones.',
  m7l3: 'Citas en tu calendario, con hora y lugar.',
  m7l4: 'El vocabulario de la ambición, perfecto para entrevistas.',
  m7l5: 'Capítulo 7: llega la respuesta de Maison Lumière.',
  m8l1: 'Experiencias de vida, sin decir exactamente cuándo.',
  m8l2: 'Noticias recientes y listas de pendientes: muy comunes en el trabajo.',
  m8l3: 'Cosas que empezaron en el pasado y continúan ahora.',
  m8l4: 'La diferencia más importante para una entrevista de trabajo.',
  m8l5: 'Capítulo 8: jueves, 10 a. m. Claire Dubois aparece en la pantalla.',
  m9l1: 'El inglés cortés abre puertas, literalmente.',
  m9l2: 'Reglas, obligaciones y libertad.',
  m9l3: 'Consejos y recomendaciones: el modal favorito de una estratega.',
  m9l4: 'Posibilidad y las frases corteses del correo profesional.',
  m9l5: 'Capítulo 9: una oferta, un vuelo y un primer día en Manhattan.',
  m10l1: 'El fondo de una historia: lo que estaba pasando.',
  m10l2: 'Interrupciones: el momento en que cambia una historia.',
  m10l3: 'Viejos hábitos y estados que ya no son verdad.',
  m10l4: 'Conecta ideas como una escritora y como una estratega.',
  m10l5: 'Capítulo 10: Claire cuenta la historia de las tres mujeres.',
  m11l1: 'Hechos y reglas que siempre son verdad.',
  m11l2: 'Posibilidades reales en el futuro: la gramática de los planes y las propuestas.',
  m11l3: 'Situaciones imaginarias, sueños y consejos elegantes.',
  m11l4: 'when, before, after, as soon as, until, con significado de futuro.',
  m11l5: 'Capítulo 11: Meri lleva una idea a la reunión del lunes.',
  m12l1: 'El foco está en el producto, no en quién hace la acción.',
  m12l2: 'Historia y herencia: el storytelling de marca en pasiva.',
  m12l3: 'Une ideas con elegancia: who, which, that, where.',
  m12l4: 'Cuenta lo que dijeron otras personas: en reuniones, correos e historias.',
  m12l5: 'El capítulo final. Meri presenta ante la junta, en inglés.',
}

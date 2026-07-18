import type { L } from '../types'

// ироничные комменты к итогам дня; группа выбирается движком по ситуации
export const FLAVOR: Record<string, L[]> = {
  building: [
    { ru: 'Ещё день в гараже. Пахнет кофе и техдолгом.', en: 'Another day in the garage. Smells like coffee and tech debt.', es: 'Otro día en el garaje. Huele a café y a deuda técnica.', zh: '车库里的又一天。空气里飘着咖啡味和技术债。', pt: 'Mais um dia na garagem. Cheiro de café e dívida técnica.' },
    { ru: 'Код пишется, рынок ждёт. Наверное.', en: 'Code gets written, the market waits. Probably.', es: 'El código se escribe, el mercado espera. Probablemente.', zh: '代码在写，市场在等。大概吧。', pt: 'O código vai sendo escrito, o mercado espera. Provavelmente.' },
    { ru: 'Сегодня ты был CTO, CEO и уборщиком. Зарплата у всех одинаковая: $0.', en: 'Today you were CTO, CEO and the janitor. Everyone earns the same: $0.', es: 'Hoy fuiste CTO, CEO y conserje. Todos cobran lo mismo: $0.', zh: '今天你身兼 CTO、CEO 和保洁。所有人工资一样：$0。', pt: 'Hoje você foi CTO, CEO e faxineiro. Todos ganham o mesmo: $0.' },
    { ru: 'Твой стендап с самим собой прошёл быстро. Блокеров нет, настроение среднее.', en: 'Your standup with yourself went fast. No blockers, morale mediocre.', es: 'Tu standup contigo mismo fue rápido. Sin bloqueos, ánimo regular.', zh: '你和自己开的站会很快就结束了。没有阻塞，士气一般。', pt: 'Seu standup consigo mesmo foi rápido. Sem bloqueios, moral mediana.' },
    { ru: 'Где-то в мире конкурент тоже пилит MVP. Но твой, конечно, лучше.', en: 'Somewhere a competitor is also building an MVP. Yours is better, obviously.', es: 'En algún lugar un competidor también construye su MVP. El tuyo es mejor, obvio.', zh: '世界上某个角落，竞争对手也在肝 MVP。当然还是你的更好。', pt: 'Em algum lugar um concorrente também está construindo um MVP. O seu é melhor, óbvio.' },
    { ru: 'День прошёл. Git log помнит всё.', en: 'The day is gone. Git log remembers everything.', es: 'El día se fue. El git log lo recuerda todo.', zh: '一天过去了。Git log 记得一切。', pt: 'O dia acabou. O git log lembra de tudo.' },
  ],
  zeroVisits: [
    { ru: 'Ноль визитов. Даже боты сегодня обошли стороной.', en: 'Zero visits. Even the bots skipped you today.', es: 'Cero visitas. Hasta los bots te ignoraron hoy.', zh: '零访问。今天连爬虫都绕道走了。', pt: 'Zero visitas. Até os bots pularam você hoje.' },
    { ru: 'Тишина на сайте такая, что слышно, как растёт техдолг.', en: "It's so quiet on the site you can hear the tech debt growing.", es: 'Hay tanto silencio en el sitio que se oye crecer la deuda técnica.', zh: '网站安静得能听见技术债生长的声音。', pt: 'O site está tão silencioso que dá para ouvir a dívida técnica crescendo.' },
    { ru: 'Аналитика пуста. Зато сервер отдохнул.', en: 'Analytics is empty. At least the server got some rest.', es: 'La analítica está vacía. Al menos el servidor descansó.', zh: '分析面板空空如也。至少服务器歇了一天。', pt: 'O analytics está vazio. Pelo menos o servidor descansou.' },
    { ru: 'Если продукт задеплоен в лесу и никто не зашёл — он существует?', en: 'If a product is deployed in a forest and nobody visits — does it exist?', es: 'Si un producto se despliega en el bosque y nadie lo visita — ¿existe?', zh: '如果产品部署在森林里而没人访问——它存在吗？', pt: 'Se um produto é deployado numa floresta e ninguém visita — ele existe?' },
    { ru: 'Ноль трафика. Маркетинг сам себя не сделает (проверено).', en: 'Zero traffic. Marketing won\'t do itself (verified).', es: 'Cero tráfico. El marketing no se hace solo (comprobado).', zh: '零流量。营销不会自己做自己（亲测）。', pt: 'Zero tráfego. O marketing não se faz sozinho (comprovado).' },
  ],
  visitsNoSignups: [
    { ru: 'Заходили, посмотрели, ушли. Как в музее.', en: 'They came, they looked, they left. Like a museum.', es: 'Vinieron, miraron, se fueron. Como en un museo.', zh: '来了，看了，走了。跟逛博物馆似的。', pt: 'Vieram, olharam, foram embora. Como num museu.' },
    { ru: 'Визиты есть, регистраций нет. Лендинг делает вид, что работает.', en: 'Visits yes, signups no. The landing page pretends to work.', es: 'Visitas sí, registros no. La landing finge que funciona.', zh: '有访问，没注册。落地页在假装营业。', pt: 'Visitas sim, cadastros não. A landing finge que funciona.' },
    { ru: 'Люди были. Кнопку «Sign up» не нашли или не захотели. Больно думать, что второе.', en: 'People came. They either missed the "Sign up" button or ignored it. The second option hurts.', es: 'La gente vino. O no encontró el botón de "Sign up" o no quiso. Duele pensar que fue lo segundo.', zh: '人来过。要么没找到 "Sign up" 按钮，要么不想点。想到是后者就心痛。', pt: 'As pessoas vieram. Ou não acharam o botão de "Sign up" ou não quiseram. Dói pensar que foi a segunda opção.' },
    { ru: 'Конверсия сегодня стеснялась.', en: 'Conversion was feeling shy today.', es: 'La conversión hoy estaba tímida.', zh: '今天转化率有点害羞。', pt: 'A conversão estava tímida hoje.' },
    { ru: 'Трафик прошёл сквозь сайт, как призрак сквозь стену.', en: 'Traffic passed through the site like a ghost through a wall.', es: 'El tráfico atravesó el sitio como un fantasma atraviesa la pared.', zh: '流量像幽灵穿墙一样穿过了网站。', pt: 'O tráfego atravessou o site como um fantasma atravessa a parede.' },
  ],
  signupsNoPaid: [
    { ru: 'Регистрируются, но не платят. Любовь есть, свадьбы нет.', en: 'They sign up but don\'t pay. Love without commitment.', es: 'Se registran pero no pagan. Amor sin compromiso.', zh: '注册了却不付钱。有爱情，没婚礼。', pt: 'Cadastram-se, mas não pagam. Amor sem compromisso.' },
    { ru: 'Бесплатные юзеры прибывают. Голем-платёжка скучает.', en: 'Free users keep coming. The payment golem is bored.', es: 'Los usuarios gratis siguen llegando. El gólem de pagos se aburre.', zh: '免费用户源源不断。收款魔像闲得发慌。', pt: 'Usuários grátis continuam chegando. O golem de pagamentos está entediado.' },
    { ru: 'Новые юзеры! Кошельки, правда, остались дома.', en: 'New users! Their wallets stayed home though.', es: '¡Nuevos usuarios! Aunque sus carteras se quedaron en casa.', zh: '新用户来了！不过钱包留在家里了。', pt: 'Usuários novos! Só que as carteiras ficaram em casa.' },
    { ru: 'Фримиум работает наполовину. На бесплатную.', en: 'Freemium is half working. The free half.', es: 'El freemium funciona a medias. La mitad gratis.', zh: 'Freemium 起效了一半。免费的那一半。', pt: 'O freemium está funcionando pela metade. A metade grátis.' },
  ],
  newPaid: [
    { ru: 'Кто-то заплатил настоящие деньги. За твой продукт. Вслух это ещё приятнее.', en: 'Someone paid real money. For your product. Say it out loud, it feels great.', es: 'Alguien pagó dinero de verdad. Por tu producto. Dilo en voz alta, se siente genial.', zh: '有人付了真金白银。为你的产品。大声说出来，更爽。', pt: 'Alguém pagou dinheiro de verdade. Pelo seu produto. Fala em voz alta, é ainda melhor.' },
    { ru: 'Динь! Звук, ради которого всё это.', en: 'Cha-ching! The sound this is all about.', es: '¡Ka-ching! El sonido por el que haces todo esto.', zh: '叮！一切都是为了这一声。', pt: 'Cha-ching! O som pelo qual tudo isso existe.' },
    { ru: 'Новый платящий. Скриншот дашборда сам себя не запостит (но ты запостишь).', en: 'A new paying user. The dashboard screenshot won\'t post itself (but you will).', es: 'Un nuevo usuario de pago. La captura del dashboard no se publicará sola (pero tú sí lo harás).', zh: '新的付费用户。仪表盘截图不会自己发出去（但你会）。', pt: 'Um novo usuário pagante. O print do dashboard não vai se postar sozinho (mas você vai).' },
    { ru: 'MRR подрос. Дракон-инвестор где-то одобрительно кивнул.', en: 'MRR grew. Somewhere the dragon investor nodded approvingly.', es: 'El MRR creció. En algún lugar el dragón inversor asintió con aprobación.', zh: 'MRR 涨了。某处的投资人巨龙赞许地点了点头。', pt: 'O MRR cresceu. Em algum lugar o dragão investidor acenou em aprovação.' },
    { ru: 'Платящие юзеры: лучшая метрика тщеславия из невыдуманных.', en: 'Paying users: the best vanity metric that isn\'t one.', es: 'Usuarios de pago: la mejor métrica de vanidad que no lo es.', zh: '付费用户：唯一不虚荣的虚荣指标。', pt: 'Usuários pagantes: a melhor métrica de vaidade que não é uma.' },
  ],
  churnHeavy: [
    { ru: 'Churn-демон сегодня поужинал твоими юзерами.', en: 'The churn demon dined on your users tonight.', es: 'El demonio del churn se cenó a tus usuarios esta noche.', zh: '今晚 churn 恶魔把你的用户当晚餐吃了。', pt: 'O demônio do churn jantou seus usuários hoje.' },
    { ru: 'Отписок больше, чем подписок. Ведро течёт быстрее, чем наливается.', en: 'More cancels than signups. The bucket leaks faster than it fills.', es: 'Más bajas que altas. El cubo gotea más rápido de lo que se llena.', zh: '退订比注册还多。桶漏得比灌得快。', pt: 'Mais cancelamentos do que cadastros. O balde vaza mais rápido do que enche.' },
    { ru: 'Юзеры уходят «по семейным обстоятельствам». У всех сразу.', en: 'Users are leaving "for personal reasons". All of them at once.', es: 'Los usuarios se van "por motivos personales". Todos a la vez.', zh: '用户纷纷"因个人原因"离开。还全挑同一天。', pt: 'Os usuários estão saindo "por motivos pessoais". Todos de uma vez.' },
    { ru: 'Retention сегодня был скорее концепцией, чем метрикой.', en: 'Retention today was more of a concept than a metric.', es: 'La retención hoy fue más un concepto que una métrica.', zh: '今天留存率更像一个概念，而不是指标。', pt: 'A retenção hoje foi mais um conceito do que uma métrica.' },
  ],
  moneyLow: [
    { ru: 'Баланс намекает: рамен снова в меню.', en: 'The balance hints: ramen is back on the menu.', es: 'El saldo insinúa: el ramen vuelve al menú.', zh: '余额在暗示：泡面重回菜单。', pt: 'O saldo dá a dica: o miojo está de volta ao cardápio.' },
    { ru: 'Денег мало, но зато опыта... тоже пока мало.', en: 'Low on money, but rich in experience... well, not yet either.', es: 'Poco dinero, pero rico en experiencia... bueno, eso tampoco todavía.', zh: '钱不多，但经验……暂时也不多。', pt: 'Pouco dinheiro, mas rico em experiência... bem, isso também ainda não.' },
    { ru: 'Burn rate горит ярче мотивации. Это не комплимент.', en: 'The burn rate burns brighter than your motivation. Not a compliment.', es: 'El burn rate arde más que tu motivación. No es un cumplido.', zh: 'Burn rate 烧得比你的斗志还旺。这不是夸你。', pt: 'O burn rate queima mais forte que sua motivação. Não é um elogio.' },
    { ru: 'Финансовая подушка превратилась в финансовую салфетку.', en: 'Your financial cushion is now a financial napkin.', es: 'Tu colchón financiero ahora es una servilleta financiera.', zh: '你的财务缓冲垫缩水成了财务餐巾纸。', pt: 'Seu colchão financeiro virou um guardanapo financeiro.' },
  ],
  quiet: [
    { ru: 'Обычный день соло-фаундера: всё сам, никто не заметил.', en: 'A regular solo founder day: did everything yourself, nobody noticed.', es: 'Un día normal de fundador en solitario: lo hiciste todo tú, nadie se dio cuenta.', zh: '独立创始人的平常一天：事事亲力亲为，无人注意。', pt: 'Um dia normal de fundador solo: fez tudo sozinho, ninguém notou.' },
    { ru: 'Ничего не сломалось. Подозрительно.', en: 'Nothing broke. Suspicious.', es: 'No se rompió nada. Sospechoso.', zh: '什么都没坏。可疑。', pt: 'Nada quebrou. Suspeito.' },
    { ru: 'День без драм. В ретроспективе это были лучшие дни.', en: 'A day without drama. In hindsight, those were the best days.', es: 'Un día sin dramas. En retrospectiva, esos eran los mejores días.', zh: '无风无浪的一天。回头看，这才是最好的日子。', pt: 'Um dia sem drama. Em retrospecto, esses eram os melhores dias.' },
    { ru: 'Продукт жив, ты жив. По меркам индихакинга — успех.', en: 'The product is alive, you are alive. By indie hacking standards — a success.', es: 'El producto vive, tú vives. Para los estándares del indie hacking — un éxito.', zh: '产品活着，你也活着。按独立开发的标准——这就是成功。', pt: 'O produto está vivo, você está vivo. Pelos padrões do indie hacking — um sucesso.' },
  ],
}

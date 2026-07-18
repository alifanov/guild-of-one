import type { L } from '../types'

// ироничные комменты к итогам дня; группа выбирается движком по ситуации
export const FLAVOR: Record<string, L[]> = {
  building: [
    { ru: 'Ещё день в гараже. Пахнет кофе и техдолгом.', en: 'Another day in the garage. Smells like coffee and tech debt.' },
    { ru: 'Код пишется, рынок ждёт. Наверное.', en: 'Code gets written, the market waits. Probably.' },
    { ru: 'Сегодня ты был CTO, CEO и уборщиком. Зарплата у всех одинаковая: $0.', en: 'Today you were CTO, CEO and the janitor. Everyone earns the same: $0.' },
    { ru: 'Твой стендап с самим собой прошёл быстро. Блокеров нет, настроение среднее.', en: 'Your standup with yourself went fast. No blockers, morale mediocre.' },
    { ru: 'Где-то в мире конкурент тоже пилит MVP. Но твой, конечно, лучше.', en: 'Somewhere a competitor is also building an MVP. Yours is better, obviously.' },
    { ru: 'День прошёл. Git log помнит всё.', en: 'The day is gone. Git log remembers everything.' },
  ],
  zeroVisits: [
    { ru: 'Ноль визитов. Даже боты сегодня обошли стороной.', en: 'Zero visits. Even the bots skipped you today.' },
    { ru: 'Тишина на сайте такая, что слышно, как растёт техдолг.', en: "It's so quiet on the site you can hear the tech debt growing." },
    { ru: 'Аналитика пуста. Зато сервер отдохнул.', en: 'Analytics is empty. At least the server got some rest.' },
    { ru: 'Если продукт задеплоен в лесу и никто не зашёл — он существует?', en: 'If a product is deployed in a forest and nobody visits — does it exist?' },
    { ru: 'Ноль трафика. Маркетинг сам себя не сделает (проверено).', en: 'Zero traffic. Marketing won\'t do itself (verified).' },
  ],
  visitsNoSignups: [
    { ru: 'Заходили, посмотрели, ушли. Как в музее.', en: 'They came, they looked, they left. Like a museum.' },
    { ru: 'Визиты есть, регистраций нет. Лендинг делает вид, что работает.', en: 'Visits yes, signups no. The landing page pretends to work.' },
    { ru: 'Люди были. Кнопку «Sign up» не нашли или не захотели. Больно думать, что второе.', en: 'People came. They either missed the "Sign up" button or ignored it. The second option hurts.' },
    { ru: 'Конверсия сегодня стеснялась.', en: 'Conversion was feeling shy today.' },
    { ru: 'Трафик прошёл сквозь сайт, как призрак сквозь стену.', en: 'Traffic passed through the site like a ghost through a wall.' },
  ],
  signupsNoPaid: [
    { ru: 'Регистрируются, но не платят. Любовь есть, свадьбы нет.', en: 'They sign up but don\'t pay. Love without commitment.' },
    { ru: 'Бесплатные юзеры прибывают. Голем-платёжка скучает.', en: 'Free users keep coming. The payment golem is bored.' },
    { ru: 'Новые юзеры! Кошельки, правда, остались дома.', en: 'New users! Their wallets stayed home though.' },
    { ru: 'Фримиум работает наполовину. На бесплатную.', en: 'Freemium is half working. The free half.' },
  ],
  newPaid: [
    { ru: 'Кто-то заплатил настоящие деньги. За твой продукт. Вслух это ещё приятнее.', en: 'Someone paid real money. For your product. Say it out loud, it feels great.' },
    { ru: 'Динь! Звук, ради которого всё это.', en: 'Cha-ching! The sound this is all about.' },
    { ru: 'Новый платящий. Скриншот дашборда сам себя не запостит (но ты запостишь).', en: 'A new paying user. The dashboard screenshot won\'t post itself (but you will).' },
    { ru: 'MRR подрос. Дракон-инвестор где-то одобрительно кивнул.', en: 'MRR grew. Somewhere the dragon investor nodded approvingly.' },
    { ru: 'Платящие юзеры: лучшая метрика тщеславия из невыдуманных.', en: 'Paying users: the best vanity metric that isn\'t one.' },
  ],
  churnHeavy: [
    { ru: 'Churn-демон сегодня поужинал твоими юзерами.', en: 'The churn demon dined on your users tonight.' },
    { ru: 'Отписок больше, чем подписок. Ведро течёт быстрее, чем наливается.', en: 'More cancels than signups. The bucket leaks faster than it fills.' },
    { ru: 'Юзеры уходят «по семейным обстоятельствам». У всех сразу.', en: 'Users are leaving "for personal reasons". All of them at once.' },
    { ru: 'Retention сегодня был скорее концепцией, чем метрикой.', en: 'Retention today was more of a concept than a metric.' },
  ],
  moneyLow: [
    { ru: 'Баланс намекает: рамен снова в меню.', en: 'The balance hints: ramen is back on the menu.' },
    { ru: 'Денег мало, но зато опыта... тоже пока мало.', en: 'Low on money, but rich in experience... well, not yet either.' },
    { ru: 'Burn rate горит ярче мотивации. Это не комплимент.', en: 'The burn rate burns brighter than your motivation. Not a compliment.' },
    { ru: 'Финансовая подушка превратилась в финансовую салфетку.', en: 'Your financial cushion is now a financial napkin.' },
  ],
  quiet: [
    { ru: 'Обычный день соло-фаундера: всё сам, никто не заметил.', en: 'A regular solo founder day: did everything yourself, nobody noticed.' },
    { ru: 'Ничего не сломалось. Подозрительно.', en: 'Nothing broke. Suspicious.' },
    { ru: 'День без драм. В ретроспективе это были лучшие дни.', en: 'A day without drama. In hindsight, those were the best days.' },
    { ru: 'Продукт жив, ты жив. По меркам индихакинга — успех.', en: 'The product is alive, you are alive. By indie hacking standards — a success.' },
  ],
}

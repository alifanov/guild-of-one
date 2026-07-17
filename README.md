# Guild of One

Пошаговый roguelike-симулятор запуска продукта соло-основателем: от идеи до **$10k MRR** или смерти (деньги ≤ 0 / выгорание). Требования — в [docs/](docs/README.md).

## Запуск

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # статический экспорт (out/)
pnpm sim        # авто-симуляция баланса на ботах
```

## Структура

- `lib/engine/` — движок симуляции (чистый TS, без React): `engine.ts`, `balance.ts` (все числа), `content/` (ниши, события, персонажи, действия — декларативные данные)
- `lib/store.ts` — Zustand + localStorage-автосейв
- `components/` — UI (Next.js App Router, Tailwind)
- `scripts/simulate.ts` — боты-стратегии: проверяет, что методология побеждает, а анти-паттерны наказываются

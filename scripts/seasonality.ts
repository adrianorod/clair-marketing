export type Seasonality = 'alta' | 'baixa' | 'normal'

interface MonthData {
  seasonality: Seasonality
  events: string[]
  label: string
}

const CALENDAR: Record<number, MonthData> = {
  1:  { seasonality: 'alta',  events: ['Verão', 'Carnaval'],            label: 'Janeiro' },
  2:  { seasonality: 'alta',  events: ['Carnaval'],                     label: 'Fevereiro' },
  3:  { seasonality: 'alta',  events: ['Dia da Mulher (08/03)'],        label: 'Março' },
  4:  { seasonality: 'normal', events: ['Páscoa', 'Dia do Cabeleireiro (24/04)'], label: 'Abril' },
  5:  { seasonality: 'alta',  events: ['Dia das Mães (10/05)'],         label: 'Maio' },
  6:  { seasonality: 'normal', events: ['Dia dos Namorados (14/06)'],   label: 'Junho' },
  7:  { seasonality: 'baixa', events: ['Férias', 'Dia do Cabelo (11/07)'], label: 'Julho' },
  8:  { seasonality: 'baixa', events: [],                                label: 'Agosto' },
  9:  { seasonality: 'baixa', events: ['Dia do Profissional de Beleza (15/09)'], label: 'Setembro' },
  10: { seasonality: 'normal', events: ['Aquecimento Black Friday'],    label: 'Outubro' },
  11: { seasonality: 'alta',  events: ['Black Friday (27/11)'],         label: 'Novembro' },
  12: { seasonality: 'alta',  events: ['Natal', 'Ano Novo'],            label: 'Dezembro' },
}

const DIAS_FIXOS: [number, number, string][] = [
  [3, 8, 'Dia da Mulher'],
  [4, 24, 'Dia do Cabeleireiro'],
  [7, 11, 'Dia do Cabelo'],
  [9, 15, 'Dia do Profissional de Beleza'],
]

export function getWeekSeasonality(date: Date): {
  seasonality: Seasonality
  events: string[]
  monthLabel: string
} {
  const month = date.getMonth() + 1
  const data = CALENDAR[month]

  const weekStart = new Date(date)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const weekEvents: string[] = [...data.events]

  for (const [m, d, name] of DIAS_FIXOS) {
    const eventDate = new Date(date.getFullYear(), m - 1, d)
    if (eventDate >= weekStart && eventDate <= weekEnd) {
      weekEvents.push(name)
    }
  }

  return {
    seasonality: data.seasonality,
    events: [...new Set(weekEvents)],
    monthLabel: data.label,
  }
}

export const CATEGORY_SPLIT: Record<Seasonality, Record<string, number>> = {
  alta: { autoestima: 25, dicas: 20, venda: 35, bastidores: 20 },
  baixa: { autoestima: 40, dicas: 30, venda: 10, bastidores: 20 },
  normal: { autoestima: 35, dicas: 25, venda: 20, bastidores: 20 },
}

export const TEMAS_VOCABULARY: Record<string, string[]> = {
  autoestima: [
    'transformacao', 'antes-depois', 'depoimento-cliente',
    'ritual-autocuidado', 'dia-da-mulher', 'poder-feminino', 'amor-proprio',
  ],
  dicas: [
    'hidratacao', 'escova-modeladora', 'cronograma-capilar',
    'finalizacao', 'queda-cabelo', 'oleosidade', 'quimica', 'coloracao',
  ],
  venda: [
    'clube-escova', 'clube-hidratacao', 'combo-verao',
    'gift-card', 'promocao-black-friday', 'pacote-noivas', 'vale-presente',
  ],
  bastidores: [
    'dia-no-salao', 'equipe', 'preparacao',
    'antes-da-transformacao', 'bastidores-evento', 'making-of',
  ],
}

export interface DemoUser {
  id: string
  name: string
  email: string
  initials: string
}

export interface Invitation {
  id: number
  title: string
  date: string
  time: string
  person: string
  role: string
  description: string
  spaceId: number
  slotIds: string[]
}

export const demoUser: DemoUser = {
  id: 'ivan',
  name: 'Иван Иванов',
  email: 'ivan@example.ru',
  initials: 'ИИ',
}

export const initialInvitations: Invitation[] = [
  {
    id: 1,
    title: 'Съёмки в Первомайском',
    date: '15 декабря 2023',
    time: '10:00 – 12:00',
    person: 'Иван Иванов',
    role: 'Фотограф',
    description: 'Фото- и видеосъёмка мероприятия.',
    spaceId: 1,
    slotIds: ['10-11', '11-12'],
  },
  {
    id: 2,
    title: 'Рабочая встреча',
    date: '18 декабря 2023',
    time: '13:00 – 14:00',
    person: 'Иван Иванов',
    role: 'Фотограф',
    description: 'Подготовка материалов к проекту.',
    spaceId: 2,
    slotIds: ['13-14'],
  },
]
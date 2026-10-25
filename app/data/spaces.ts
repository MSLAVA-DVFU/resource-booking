export interface TimeSlot {
  id: string
  start: string
  end: string
  occupied: boolean
}

export interface Space {
  id: number
  name: string
  image: string
  description: string
  capacity: number
  equipment: string[]
  timeSlots: TimeSlot[]
}

function createTimeSlots(
  occupiedHours: number[],
): TimeSlot[] {
  return Array.from({ length: 12 }, (_, index) => {
    const hour = index + 8

    return {
      id: `${hour}-${hour + 1}`,
      start: `${String(hour).padStart(2, '0')}:00`,
      end: `${String(hour + 1).padStart(2, '0')}:00`,
      occupied: occupiedHours.includes(hour),
    }
  })
}

export const spaces: Space[] = [
  {
    id: 1,
    name: 'Коворкинг ИРНИТУ',
    image: '/images/spaces/coworking-irnitu.jpg',
    description:
      'Пространство для индивидуальной и совместной работы.',
    capacity: 20,
    equipment: [
      'Рабочие столы',
      'Стулья',
      'Wi-Fi',
    ],
    timeSlots: createTimeSlots([10, 11, 13]),
  },
  {
    id: 2,
    name: 'Переговорная ИРНИТУ',
    image: '/images/spaces/meeting-room-irnitu.jpg',
    description:
      'Помещение для проведения переговоров и рабочих встреч.',
    capacity: 12,
    equipment: [
      'Стол для переговоров',
      'Стулья',
      'Wi-Fi',
    ],
    timeSlots: createTimeSlots([9, 14, 15]),
  },
]

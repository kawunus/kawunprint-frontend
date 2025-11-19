export const STATUS_NAMES: Record<number, { ru: string; en: string }> = {
  1: { ru: 'В процессе', en: 'In Progress' },
  2: { ru: 'Завершён', en: 'Completed' },
  3: { ru: 'Отменён', en: 'Cancelled' },
  6: { ru: 'Принят', en: 'Accepted' },
  8: { ru: 'Изменена информация', en: 'Information Changed' },
  10: { ru: 'Запрошена дополнительная информация', en: 'Additional Info Requested' },
  11: { ru: 'Распечатано', en: 'Printed' },
  12: { ru: 'Потрачен филамент', en: 'Filament Consumed' },
  13: { ru: 'В проектировании', en: 'In Design' },
};

export const getStatusName = (statusId: number, language: string = 'ru'): string => {
  const status = STATUS_NAMES[statusId];
  if (!status) {
    return language === 'ru' ? 'Неизвестно' : 'Unknown';
  }
  return language === 'en' ? status.en : status.ru;
};

export type Work = {
  id: number;
  date: string; // Формат: "YYYY-MM-DD"
    start_work: string; // Формат: "HH:MM"
    end_work: string; // Формат: "HH:MM"
    has_break: boolean;
    is_day_off: boolean
};

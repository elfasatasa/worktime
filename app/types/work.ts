

export interface Work {
  id: number;
  unique_id: string; // UUID for the work entry
  work_id: string;
  date: string; // ISO format date string
  start_work: string; // ISO format time string
  end_work: string; // ISO format time string
  has_break: boolean;
  is_day_off: boolean;
  work_type: string; // e.g., 'packer', 'driver', etc.
}
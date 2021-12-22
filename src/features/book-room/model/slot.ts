import { SlotDate } from '../../../model/room-booked.event';

export interface Slot {
  dateFrom: SlotDate;
  dateTo: SlotDate;
}

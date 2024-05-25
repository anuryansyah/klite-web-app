import { EVENT_TYPE } from "config/constant"

export function getTypeName(name: string) {
  switch (name) {
    case EVENT_TYPE.PAID:
      return 'Berbayar';
    case EVENT_TYPE.SEMI_BARTER:
      return 'Semi Barter';
    case EVENT_TYPE.FULL_BARTER:
      return 'Full Barter';
    default:
      return '';
  }
}
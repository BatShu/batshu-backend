export type ApiResponse<T = any> = {
  ok: true
  msg: string
  data?: T // UserInfo | Accident | AccidentLocationObject[] | ObserveLocationObject[]
} | {
  ok: false
  msg: string
};

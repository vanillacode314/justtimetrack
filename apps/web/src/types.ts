type Timestamp = number

export interface IProjectGroup {
  id: string
  name: string
  projects: IProject[]
}

export type IProject =
  | {
      id: string
      name: string
      description: string
      logs: IActivityLog[]
    } & Xor<
      { paid: true; hourlyRate: number; currency: string },
      { paid: false }
    >

export interface IActivityLog {
  id: string
  startedAt: Timestamp
  endedAt: Timestamp
  done: boolean
  comment: string
}

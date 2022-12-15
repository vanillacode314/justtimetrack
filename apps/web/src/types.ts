type Timestamp = number;

export interface IProjectGroup {
  name: string;
  projects: IProject[];
}

export type IProject =
  | {
      name: string;
      description: string;
      logs: IActivityLog[];
    } & Xor<
      { paid: true; hourlyRate: number; currency: string },
      { paid: false }
    >;

export interface IActivityLog {
  id: string;
  startedAt: Timestamp;
  endedAt: Timestamp;
  done: boolean;
  comment: string;
}

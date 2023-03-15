import z from 'zod'

export const activityLogSchema = z.object({
  id: z.string(),
  startedAt: z.number().default(() => Date.now()),
  endedAt: z.number().optional(),
  done: z.boolean().default(false),
  comment: z.string().default(''),
})

export const projectSchema = z.discriminatedUnion('paid', [
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    logs: activityLogSchema.array().default([]),
    paid: z.literal(true),
    hourlyRate: z.number(),
    currency: z.string(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    logs: activityLogSchema.array().default([]),
    paid: z.literal(false),
  }),
])

export const projectGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  projects: projectSchema.array().default([]),
})

declare global {
  export type TActivityLog = z.infer<typeof activityLogSchema>
  export type TProject = z.infer<typeof projectSchema>
  export type TProjectGroup = z.infer<typeof projectGroupSchema>
}

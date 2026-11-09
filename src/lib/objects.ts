import { z } from "zod";
import { GrpcTimeSchema } from "@/lib/time";

export const SimpleResponseSchema = z.object({
  message: z.string().trim(),
});
export type SimpleResponse = z.infer<typeof SimpleResponseSchema>;

export const DeleteRequestSchema = z.object({
  id: z.number(),
});
export type DeleteRequest = z.infer<typeof DeleteRequestSchema>;

export const DeleteMessageRequestSchema = z.object({
  id: z.uuidv7(),
});
export type DeleteMessageRequest = z.infer<typeof DeleteMessageRequestSchema>;

const HTTP_PROTOCOL = /^https?$/;
const httpUrl = (error?: string) =>
  z.url({ protocol: HTTP_PROTOCOL, error: error ?? "Must be an http(s) URL" });
const isHttpUrl = (value: string) => httpUrl().safeParse(value).success;

export const UserDetailsResponseSchema = z.object({
  about: z.string().trim(),
  cover_image: httpUrl().or(z.literal("")),
  chat_model: z.string().optional(),
  updated_at: GrpcTimeSchema.optional(),
});
export type UserDetailsResponse = z.infer<typeof UserDetailsResponseSchema>;

export const UserEditRequestSchema = z.object({
  about: z.string().trim(),
  cover_image: httpUrl().max(
    250,
    "Cover image url can be at most 250 characters long",
  ),
  chat_model: z.string().max(100),
});

export const GetChatModelsResponseSchema = z.object({
  models: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
});
export type GetChatModelsResponse = z.infer<typeof GetChatModelsResponseSchema>;
export type UserEditRequest = z.infer<typeof UserEditRequestSchema>;

const MessageSchema = z.object({
  id: z.string(),
  name: z.string().trim(),
  email: z.email(),
  message: z.array(z.string().trim()),
});
export type Message = z.infer<typeof MessageSchema>;

export const GetMessagesResponseSchema = z.object({
  messages: z.array(MessageSchema),
});
export type GetMessagesResponse = z.infer<typeof GetMessagesResponseSchema>;

export const TechnologyCategory = {
  Invalid: 0,
  Frontend: 1,
  Backend: 2,
  Db: 3,
  Language: 4,
  Tool: 5,
  Academics: 6,
  None: 7,
} as const;

export type TechnologyCategory =
  (typeof TechnologyCategory)[keyof typeof TechnologyCategory];

export const TechnologyCategorySchema = z.union(
  [
    z.literal(TechnologyCategory.Invalid),
    z.literal(TechnologyCategory.Frontend),
    z.literal(TechnologyCategory.Backend),
    z.literal(TechnologyCategory.Db),
    z.literal(TechnologyCategory.Language),
    z.literal(TechnologyCategory.Tool),
    z.literal(TechnologyCategory.Academics),
    z.literal(TechnologyCategory.None),
  ],
  { error: "Invalid technology category" },
);

export const getTechnologyCategoryLabel = (
  category: TechnologyCategory,
): string => {
  switch (category) {
    case TechnologyCategory.Frontend:
      return "Frontend";
    case TechnologyCategory.Backend:
      return "Backend";
    case TechnologyCategory.Db:
      return "Database";
    case TechnologyCategory.Language:
      return "Language";
    case TechnologyCategory.Tool:
      return "Tool";
    case TechnologyCategory.Academics:
      return "Academics";
    case TechnologyCategory.None:
      return "None";
    default:
      return "Invalid";
  }
};

const TechnologySummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  image_url: httpUrl(),
  fallback_image_url: httpUrl(),
});

export const TechnologySchema = z.object({
  id: z.number(),
  name: z.string(),
  image_url: httpUrl(),
  fallback_image_url: httpUrl(),
  category: TechnologyCategorySchema,
  updated_at: GrpcTimeSchema,
});
export type Technology = z.infer<typeof TechnologySchema>;

export const GetTechnologiesResponseSchema = z.object({
  technologies: z.array(TechnologySchema),
});
export type GetTechnologiesResponse = z.infer<
  typeof GetTechnologiesResponseSchema
>;

export const TechnologyCreateRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(255, "Name can be at most 255 characters long"),
  image_url: z
    .string()
    .trim()
    .min(1, { error: "Image URL is required" })
    .max(255, "Image Url can be at most 255 characters long")
    .and(httpUrl("Must be a valid http(s) URL")),
  fallback_image_url: z
    .string()
    .trim()
    .min(1, { error: "Fallback image URL is required" })
    .max(255, "Fallback Image Url can be at most 255 characters long")
    .and(httpUrl("Must be a valid http(s) URL")),
  category: TechnologyCategorySchema,
});
export type TechnologyCreateRequest = z.infer<
  typeof TechnologyCreateRequestSchema
>;

export const TechnologyUpdateRequestSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(255, "Name can be at most 255 characters long"),
  image_url: z
    .string()
    .trim()
    .min(1, { error: "Image URL is required" })
    .max(255, "Image Url can be at most 255 characters long")
    .and(httpUrl("Must be a valid http(s) URL")),
  fallback_image_url: z
    .string()
    .trim()
    .min(1, { error: "Fallback image URL is required" })
    .max(255, "Fallback Image Url can be at most 255 characters long")
    .and(httpUrl("Must be a valid http(s) URL")),
  category: TechnologyCategorySchema,
});
export type TechnologyUpdateRequest = z.infer<
  typeof TechnologyUpdateRequestSchema
>;

const ProjectSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const ProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image_url: httpUrl(),
  project_url: httpUrl().optional(),
  github_url: httpUrl().optional(),
  technologies: z.array(TechnologySummarySchema).optional(),
  featured: z.boolean(),
  updated_at: GrpcTimeSchema,
});
export type Project = z.infer<typeof ProjectSchema>;

export const GetProjectsResponseSchema = z.object({
  projects: z.array(ProjectSchema),
});
export type GetProjectsResponse = z.infer<typeof GetProjectsResponseSchema>;

export const ProjectCreateRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(255, "Name can be at most 255 characters long"),
  description: z.string().trim().min(1, { error: "Description is required" }),
  image_url: z
    .string()
    .trim()
    .min(1, { error: "Image URL is required" })
    .max(255, "Image Url can be at most 255 characters long")
    .and(httpUrl("Must be a valid http(s) URL")),
  project_url: z
    .string()
    .trim()
    .max(255, "Project Url can be at most 255 characters long")
    .refine((val) => val === "" || isHttpUrl(val), {
      message: "Must be a valid URL",
    })
    .optional(),
  github_url: z
    .string()
    .trim()
    .max(255, "Github Url can be at most 255 characters long")
    .refine((val) => val === "" || isHttpUrl(val), {
      message: "Must be a valid URL",
    })
    .optional(),
  technologies: z.array(z.number()),
  featured: z.boolean({ error: "Featured is required" }),
});
export type ProjectCreateRequest = z.infer<typeof ProjectCreateRequestSchema>;

export const ProjectUpdateRequestSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(255, "Name can be at most 255 characters long"),
  description: z.string().trim().min(1, { error: "Description is required" }),
  image_url: z
    .string()
    .trim()
    .min(1, { error: "Image URL is required" })
    .max(255, "Image Url can be at most 255 characters long")
    .and(httpUrl("Must be a valid http(s) URL")),
  project_url: z
    .string()
    .trim()
    .max(255, "Project Url can be at most 255 characters long")
    .refine((val) => val === "" || isHttpUrl(val), {
      message: "Must be a valid URL",
    })
    .optional(),
  github_url: z
    .string()
    .trim()
    .max(255, "Github Url can be at most 255 characters long")
    .refine((val) => val === "" || isHttpUrl(val), {
      message: "Must be a valid URL",
    })
    .optional(),
  technologies: z.array(z.number()),
  featured: z.boolean({ error: "Featured is required" }),
});
export type ProjectUpdateRequest = z.infer<typeof ProjectUpdateRequestSchema>;

const PositionSchema = z.object({
  id: z.number(),
  role: z.string(),
  start: z.string(),
  end: z.string().optional(),
  work_done: z.string(),
  projects: z.array(ProjectSummarySchema).optional(),
});
export type Position = z.infer<typeof PositionSchema>;

const PositionCreateSchema = z.object({
  role: z
    .string()
    .trim()
    .min(1, { error: "Role is required" })
    .max(150, "Role can be at most 150 characters long"),
  start: z
    .string()
    .trim()
    .min(1, { error: "Start date is required" })
    .max(100, "Start date can be at most 100 characters long"),
  end: z
    .string()
    .trim()
    .max(100, "End date can be at most 100 characters long")
    .optional(),
  work_done: z.string().trim().min(1, { error: "Work done is required" }),
  projects: z.array(z.number()).optional(),
});
export type PositionCreate = z.infer<typeof PositionCreateSchema>;

const PositionUpdateSchema = z.object({
  id: z.number().optional(),
  role: z
    .string()
    .trim()
    .min(1, { error: "Role is required" })
    .max(150, "Role can be at most 150 characters long"),
  start: z
    .string()
    .trim()
    .min(1, { error: "Start date is required" })
    .max(100, "Start date can be at most 100 characters long"),
  end: z
    .string()
    .trim()
    .max(100, "End date can be at most 100 characters long")
    .optional(),
  work_done: z.string().trim().min(1, { error: "Work done is required" }),
  projects: z.array(z.number()).optional(),
});
export type PositionUpdate = z.infer<typeof PositionUpdateSchema>;

export const ExperienceSchema = z.object({
  id: z.number(),
  company: z.string(),
  start: z.string(),
  end: z.string().optional(),
  tenure: z.string(),
  positions: z.array(PositionSchema),
  technologies: z.array(TechnologySummarySchema),
  updated_at: GrpcTimeSchema,
});
export type Experience = z.infer<typeof ExperienceSchema>;

export const GetExperiencesResponseSchema = z.object({
  experiences: z.array(ExperienceSchema),
});
export type GetExperiencesResponse = z.infer<
  typeof GetExperiencesResponseSchema
>;

export const ExperienceCreateRequestSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, { error: "Company is required" })
    .max(200, "Company can be at most 200 characters long"),
  positions: z
    .array(PositionCreateSchema)
    .min(1, { error: "Positions are required" }),
  technologies: z.array(z.number()).min(1, {
    message: "Technologies are required",
  }),
});
export type ExperienceCreateRequest = z.infer<
  typeof ExperienceCreateRequestSchema
>;

export const ExperienceUpdateRequestSchema = z.object({
  id: z.number(),
  company: z
    .string()
    .trim()
    .min(1, { error: "Company is required" })
    .max(200, "Company can be at most 200 characters long"),
  positions: z
    .array(PositionUpdateSchema)
    .min(1, { error: "Positions are required" }),
  technologies: z.array(z.number()).min(1, {
    message: "Technologies are required",
  }),
});
export type ExperienceUpdateRequest = z.infer<
  typeof ExperienceUpdateRequestSchema
>;

export { FetchError } from "@/lib/errors";

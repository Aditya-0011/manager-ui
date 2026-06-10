import { useState } from "react";
import { useForm } from "@tanstack/react-form";

import ReactMarkdown from "react-markdown";

import { Edit2, Plus, X, Projector } from "lucide-react";

import {
  ExperienceCreateRequestSchema,
  ExperienceUpdateRequestSchema,
  type SimpleResponse,
  type Technology,
  type Project,
  type Experience,
  type ExperienceCreateRequest,
  type ExperienceUpdateRequest,
  type PositionCreate,
} from "@/lib/objects";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type FormProps =
  | {
      technologies: Technology[];
      projects: Project[];
      experience: Experience;
      isCreatingExperience?: undefined;
      isUpdatingExperience: boolean;
      mutateExperienceAsync: (
        request: ExperienceUpdateRequest,
      ) => Promise<SimpleResponse>;
    }
  | {
      technologies: Technology[];
      projects: Project[];
      experience?: undefined;
      isCreatingExperience: boolean;
      isUpdatingExperience?: undefined;
      mutateExperienceAsync: (
        request: ExperienceCreateRequest,
      ) => Promise<SimpleResponse>;
    };

export function Form({
  technologies,
  projects,
  experience,
  isCreatingExperience,
  isUpdatingExperience,
  mutateExperienceAsync,
}: FormProps) {
  const formId = experience
    ? `experience-form-${experience.id}`
    : "experience-form-create";

  const defaultValues: ExperienceUpdateRequest | ExperienceCreateRequest =
    experience
      ? {
          id: experience.id,
          company: experience.company,
          technologies: experience.technologies.map(
            (technology) => technology.id,
          ),
          positions: experience.positions.map((position) => ({
            id: position.id,
            role: position.role,
            start: position.start,
            work_done: position.work_done,
            end: position.end === "Present" ? "" : position.end,
            projects: position.projects?.map((project) => project.id) || [],
          })),
        }
      : {
          company: "",
          technologies: [] as number[],
          positions: [] as PositionCreate[],
        };

  const {
    Field: FormField,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues,
    validators: {
      onChange: experience
        ? ExperienceUpdateRequestSchema.omit({ id: true })
        : ExperienceCreateRequestSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        positions: value.positions.map((p) => ({
          ...p,
          end: p.end === "" ? undefined : p.end,
        })),
      };

      if (experience) {
        await mutateExperienceAsync({
          ...payload,
          id: experience.id,
        } as ExperienceUpdateRequest);
      } else {
        await mutateExperienceAsync(payload as ExperienceCreateRequest);
      }
    },
  });

  const technologyListAnchor = useComboboxAnchor();
  const projectListAnchor = useComboboxAnchor();

  const [previewIndices, setPreviewIndices] = useState<Set<number>>(new Set());

  const togglePreview = (index: number) => {
    setPreviewIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <Dialog>
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        key={experience?.id || "create"}
      >
        <DialogTrigger>
          {experience ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 hover:ring hover:ring-blue-500"
            >
              <Edit2 className="size-4" />
            </Button>
          ) : (
            <Button className="bg-sky-500 hover:bg-neutral-950 hover:text-sky-500 hover:ring hover:ring-sky-500">
              Add
            </Button>
          )}
        </DialogTrigger>
        <DialogContent
          className="border-white sm:max-w-200"
          showCloseButton={false}
        >
          <DialogHeader className="backdrop-blur-sm">
            <DialogTitle>
              {experience ? (
                <>
                  Update{" "}
                  <span className="text-sky-500">{experience.company}</span>
                </>
              ) : (
                <>
                  Add <span className="text-sky-500">experience</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {experience
                ? "Let's hope you are not fixing any typos!"
                : "Try not to put any typos!"}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="no-scrollbar mt-1 max-h-[75vh] overflow-y-auto">
            <FormField
              name="company"
              children={(field) => {
                const isInvalid =
                  (field.state.meta.isTouched ||
                    field.form.state.submissionAttempts > 0) &&
                  !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      autoComplete="off"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isCreatingExperience || isUpdatingExperience}
                      type="text"
                      required
                      className="focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <FormField
              name="technologies"
              children={(field) => {
                const isInvalid =
                  (field.state.meta.isTouched ||
                    field.form.state.submissionAttempts > 0) &&
                  !field.state.meta.isValid;

                const selectedNames = field.state.value
                  .map((id) => technologies.find((t) => t.id === id)?.name)
                  .filter((name): name is string => Boolean(name));

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Technologies</FieldLabel>
                    <Combobox
                      items={technologies
                        .map((t) => t.name)
                        .sort((a, b) =>
                          a.localeCompare(b, "en", { sensitivity: "base" }),
                        )}
                      multiple
                      autoHighlight
                      value={selectedNames}
                      onValueChange={(newNames) => {
                        const newIds = newNames
                          .map((name) => {
                            const tech = technologies.find(
                              (t) =>
                                t.name.toLowerCase() === name.toLowerCase(),
                            );
                            return tech?.id;
                          })
                          .filter((id): id is number => Boolean(id));

                        field.handleChange(newIds);
                      }}
                      disabled={isCreatingExperience || isUpdatingExperience}
                    >
                      <ComboboxChips
                        ref={technologyListAnchor}
                        className="w-full focus-within:border-sky-500 focus-within:ring-0 focus-within:ring-sky-500"
                      >
                        <ComboboxValue>
                          {(names) => (
                            <div className="flex w-full flex-wrap gap-2">
                              {names.map((name: string) => (
                                <ComboboxChip key={name}>{name}</ComboboxChip>
                              ))}
                              <ComboboxChipsInput />
                            </div>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>

                      <ComboboxContent anchor={technologyListAnchor}>
                        <ComboboxEmpty>No technology found.</ComboboxEmpty>
                        <ComboboxList className="scrollbar-thin scrollbar-thumb-neutral-900 scrollbar-track-neutral-950">
                          {(name: string) => (
                            <ComboboxItem key={name} value={name}>
                              {name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <FormField
              name="positions"
              mode="array"
              children={(field) => {
                const isInvalid =
                  (field.state.meta.isTouched ||
                    field.form.state.submissionAttempts > 0) &&
                  !field.state.meta.isValid;

                return (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between pr-0.5">
                      <FieldLabel htmlFor={field.name}>Positions</FieldLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() =>
                          field.pushValue(
                            experience
                              ? {
                                  role: "",
                                  start: "",
                                  end: "",
                                  work_done: "",
                                  projects: [],
                                }
                              : {
                                  role: "",
                                  start: "",
                                  end: "",
                                  work_done: "",
                                  projects: [],
                                },
                          )
                        }
                        className="text-xs text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600 hover:ring hover:ring-emerald-500"
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}

                    <div className="flex flex-col gap-6">
                      {field.state.value.map((pos, index) => (
                        <div
                          key={
                            "id" in pos && typeof pos.id === "number"
                              ? `pos-${pos.id}`
                              : `new-${index}`
                          }
                          className="relative rounded-md border border-neutral-800 bg-neutral-900/50 p-4"
                        >
                          <div className="absolute top-2 right-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => field.removeValue(index)}
                              className="text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600 hover:ring hover:ring-red-500"
                            >
                              <X className="size-3" />
                            </Button>
                          </div>

                          <div className="grid gap-4">
                            <FormField
                              name={`positions[${index}].role`}
                              children={(subField) => {
                                const isSubFieldInvalid =
                                  (subField.state.meta.isTouched ||
                                    subField.form.state.submissionAttempts >
                                      0) &&
                                  !subField.state.meta.isValid;

                                return (
                                  <Field data-invalid={isSubFieldInvalid}>
                                    <FieldLabel htmlFor={subField.name}>
                                      Role
                                    </FieldLabel>
                                    <Input
                                      id={`${subField.name}-${index}`}
                                      name={subField.name}
                                      value={subField.state.value}
                                      autoComplete="off"
                                      onBlur={subField.handleBlur}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.value)
                                      }
                                      aria-invalid={isSubFieldInvalid}
                                      required
                                      className="focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                                    />
                                    {isSubFieldInvalid && (
                                      <FieldError
                                        errors={subField.state.meta.errors}
                                      />
                                    )}
                                  </Field>
                                );
                              }}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                name={`positions[${index}].start`}
                                children={(subField) => {
                                  const isSubFieldInvalid =
                                    (subField.state.meta.isTouched ||
                                      subField.form.state.submissionAttempts >
                                        0) &&
                                    !subField.state.meta.isValid;
                                  return (
                                    <Field data-invalid={isSubFieldInvalid}>
                                      <FieldLabel htmlFor={subField.name}>
                                        Start Date
                                      </FieldLabel>
                                      <Input
                                        id={`${subField.name}-${index}`}
                                        name={subField.name}
                                        value={subField.state.value}
                                        autoComplete="off"
                                        onBlur={subField.handleBlur}
                                        onChange={(e) =>
                                          subField.handleChange(e.target.value)
                                        }
                                        aria-invalid={isSubFieldInvalid}
                                        required
                                        type="month"
                                        className="focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                                      />
                                      {isSubFieldInvalid && (
                                        <FieldError
                                          errors={subField.state.meta.errors}
                                        />
                                      )}
                                    </Field>
                                  );
                                }}
                              />

                              <FormField
                                name={`positions[${index}].end`}
                                children={(subField) => {
                                  const isSubFieldInvalid =
                                    (subField.state.meta.isTouched ||
                                      subField.form.state.submissionAttempts >
                                        0) &&
                                    !subField.state.meta.isValid;
                                  return (
                                    <Field data-invalid={isSubFieldInvalid}>
                                      <FieldLabel htmlFor={subField.name}>
                                        End Date
                                      </FieldLabel>
                                      <Input
                                        id={`${subField.name}-${index}`}
                                        name={subField.name}
                                        value={subField.state.value}
                                        autoComplete="off"
                                        onBlur={subField.handleBlur}
                                        onChange={(e) =>
                                          subField.handleChange(e.target.value)
                                        }
                                        aria-invalid={isSubFieldInvalid}
                                        type="month"
                                        className="focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                                      />
                                      {isSubFieldInvalid && (
                                        <FieldError
                                          errors={subField.state.meta.errors}
                                        />
                                      )}
                                    </Field>
                                  );
                                }}
                              />
                            </div>

                            <FormField
                              name={`positions[${index}].work_done`}
                              children={(subField) => {
                                const isSubFieldInvalid =
                                  (subField.state.meta.isTouched ||
                                    subField.form.state.submissionAttempts >
                                      0) &&
                                  !subField.state.meta.isValid;

                                const isPreview = previewIndices.has(index);
                                return (
                                  <Field data-invalid={isSubFieldInvalid}>
                                    <div className="flex gap-2">
                                      <FieldLabel htmlFor={subField.name}>
                                        Work Done
                                      </FieldLabel>
                                      <Button
                                        variant="outline"
                                        size="icon-xs"
                                        onClick={() => togglePreview(index)}
                                      >
                                        {isPreview ? (
                                          <Edit2 className="size-3" />
                                        ) : (
                                          <Projector className="size-3" />
                                        )}
                                      </Button>
                                    </div>
                                    {isPreview ? (
                                      <div className="prose prose-invert prose-p:leading-normal prose-p:my-0 h-full min-h-30 w-full max-w-none rounded-md bg-transparent! px-3 py-2 font-mono text-sm! text-inherit! ring ring-white/10 ring-inset">
                                        <ReactMarkdown
                                          components={{
                                            ul: ({ children, className }) => (
                                              <ul
                                                className={`list-disc pl-4 ${className ?? ""}`}
                                              >
                                                {children}
                                              </ul>
                                            ),
                                            ol: ({
                                              children,
                                              className,
                                              start,
                                              type,
                                            }) => (
                                              <ol
                                                className={`list-decimal pl-4 ${className ?? ""}`}
                                                start={start ?? undefined}
                                                type={
                                                  type as
                                                    | "1"
                                                    | "a"
                                                    | "A"
                                                    | "i"
                                                    | "I"
                                                    | undefined
                                                }
                                              >
                                                {children}
                                              </ol>
                                            ),
                                            a: ({
                                              children,
                                              className,
                                              href,
                                              title,
                                              target,
                                              rel,
                                            }) => (
                                              <a
                                                className={`underline decoration-emerald-500 underline-offset-2 hover:text-emerald-500 hover:no-underline hover:decoration-white ${className ?? ""}`}
                                                href={href}
                                                title={title}
                                                target={target}
                                                rel={rel}
                                              >
                                                {children}
                                              </a>
                                            ),
                                          }}
                                        >
                                          {subField.state.value ||
                                            "Start typing markdown to see a live preview."}
                                        </ReactMarkdown>
                                      </div>
                                    ) : (
                                      <Textarea
                                        id={`${subField.name}-${index}`}
                                        name={subField.name}
                                        value={subField.state.value}
                                        autoComplete="off"
                                        onBlur={subField.handleBlur}
                                        onChange={(e) =>
                                          subField.handleChange(e.target.value)
                                        }
                                        aria-invalid={isSubFieldInvalid}
                                        required
                                        className="h-full min-h-30 focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                                      />
                                    )}
                                    {isSubFieldInvalid && (
                                      <FieldError
                                        errors={subField.state.meta.errors}
                                      />
                                    )}
                                  </Field>
                                );
                              }}
                            />

                            <FormField
                              name={`positions[${index}].projects`}
                              children={(subField) => {
                                const isSubFieldInvalid =
                                  (subField.state.meta.isTouched ||
                                    subField.form.state.submissionAttempts >
                                      0) &&
                                  !subField.state.meta.isValid;

                                const selectedNames = (
                                  subField.state.value || []
                                )
                                  .map(
                                    (id) =>
                                      projects.find((p) => p.id === id)?.name,
                                  )
                                  .filter((n): n is string => Boolean(n));

                                return (
                                  <Field data-invalid={isSubFieldInvalid}>
                                    <FieldLabel htmlFor={subField.name}>
                                      Projects
                                    </FieldLabel>
                                    <Combobox
                                      required
                                      items={projects
                                        .map((p) => p.name)
                                        .sort((a, b) =>
                                          a.localeCompare(b, "en", {
                                            sensitivity: "base",
                                          }),
                                        )}
                                      multiple
                                      value={selectedNames}
                                      onValueChange={(newNames) => {
                                        const newIds = newNames
                                          .map((name) => {
                                            const project = projects.find(
                                              (p) =>
                                                p.name.toLowerCase() ===
                                                name.toLowerCase(),
                                            );
                                            return project?.id;
                                          })
                                          .filter((id): id is number =>
                                            Boolean(id),
                                          );
                                        subField.handleChange(newIds);
                                      }}
                                      disabled={
                                        isCreatingExperience ||
                                        isUpdatingExperience
                                      }
                                    >
                                      <ComboboxChips
                                        ref={projectListAnchor}
                                        className="w-full focus-within:border-sky-500 focus-within:ring-0 focus-within:ring-sky-500"
                                      >
                                        <ComboboxValue>
                                          {(names) => (
                                            <div className="flex w-full flex-wrap gap-2">
                                              {names.map((name: string) => (
                                                <ComboboxChip key={name}>
                                                  {name}
                                                </ComboboxChip>
                                              ))}
                                              <ComboboxChipsInput />
                                            </div>
                                          )}
                                        </ComboboxValue>
                                      </ComboboxChips>
                                      <ComboboxContent
                                        anchor={projectListAnchor}
                                      >
                                        <ComboboxEmpty>
                                          No project found.
                                        </ComboboxEmpty>
                                        <ComboboxList className="scrollbar-thin scrollbar-thumb-neutral-900 scrollbar-track-neutral-950">
                                          {(name: string) => (
                                            <ComboboxItem
                                              key={name}
                                              value={name}
                                            >
                                              {name}
                                            </ComboboxItem>
                                          )}
                                        </ComboboxList>
                                      </ComboboxContent>
                                    </Combobox>
                                    {isSubFieldInvalid && (
                                      <FieldError
                                        errors={subField.state.meta.errors}
                                      />
                                    )}
                                  </Field>
                                );
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
          </FieldGroup>
          <DialogFooter>
            <Field orientation="horizontal" className="justify-end">
              <DialogClose>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => reset()}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                form={formId}
                type="submit"
                disabled={isCreatingExperience || isUpdatingExperience}
                className="bg-neutral-950 text-sky-500 hover:bg-sky-500/10 hover:text-sky-600 hover:inset-ring hover:ring-sky-500"
              >
                Save
              </Button>
            </Field>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

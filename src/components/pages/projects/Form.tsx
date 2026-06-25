import { useState } from "react";
import { useForm } from "@tanstack/react-form";

import ReactMarkdown from "react-markdown";

import { Edit2, Projector } from "lucide-react";

import {
  ProjectCreateRequestSchema,
  ProjectUpdateRequestSchema,
  type SimpleResponse,
  type Technology,
  type Project,
  type ProjectCreateRequest,
  type ProjectUpdateRequest,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type FormProps =
  | {
      technologies: Technology[];
      project: Project;
      isCreatingProject?: undefined;
      isUpdatingProject: boolean;
      mutateProjectAsync: (
        request: ProjectUpdateRequest,
      ) => Promise<SimpleResponse>;
    }
  | {
      technologies: Technology[];
      project?: undefined;
      isCreatingProject: boolean;
      isUpdatingProject?: undefined;
      mutateProjectAsync: (
        request: ProjectCreateRequest,
      ) => Promise<SimpleResponse>;
    };

export function Form({
  technologies,
  project,
  isCreatingProject,
  isUpdatingProject,
  mutateProjectAsync,
}: FormProps) {
  const formId = project ? `project-form-${project.id}` : "project-form-create";

  const defaultValues: ProjectUpdateRequest | ProjectCreateRequest = project
    ? {
        id: project.id,
        name: project.name,
        description: project.description,
        image_url: project.image_url,
        technologies:
          project.technologies?.map((technology) => technology.id) ?? [],
        project_url: project.project_url,
        github_url: project.github_url,
        featured: project.featured,
      }
    : {
        name: "",
        description: "",
        image_url:
          "https://res.cloudinary.com/dijxynt89/image/upload/v1725108832/github_zcd3cm.png",
        technologies: [] as number[],
        project_url: undefined,
        github_url: undefined,
        featured: false,
      };
  const {
    Field: FormField,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues,
    validators: {
      onSubmit: project
        ? ProjectUpdateRequestSchema.omit({ id: true })
        : ProjectCreateRequestSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        project_url: value.project_url === "" ? undefined : value.project_url,
        github_url: value.github_url === "" ? undefined : value.github_url,
      };

      if (project) {
        await mutateProjectAsync({
          ...payload,
          id: project.id,
        } as ProjectUpdateRequest);
      } else {
        await mutateProjectAsync(payload as ProjectCreateRequest);
      }
    },
  });

  const anchor = useComboboxAnchor();

  const [preview, setPreview] = useState<boolean>(false);

  return (
    <Dialog>
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        key={project?.id || "create"}
      >
        <DialogTrigger
          render={
            project ? (
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-md text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 hover:ring hover:ring-blue-500"
              />
            ) : (
              <Button className="rounded-md bg-sky-500 hover:bg-neutral-950 hover:text-sky-500 hover:ring hover:ring-sky-500" />
            )
          }
        >
          {project ? <Edit2 className="size-4" /> : "Add"}
        </DialogTrigger>
        <DialogContent
          className="border border-white bg-neutral-950 sm:max-w-200"
          showCloseButton={false}
        >
          <DialogHeader className="backdrop-blur-sm">
            <DialogTitle>
              {project ? (
                <>
                  Update <span className="text-sky-500">{project.name}</span>
                </>
              ) : (
                <>
                  Add <span className="text-sky-500">project</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {project
                ? "Let's hope you are not fixing any typos!"
                : "Try not to put any typos!"}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="no-scrollbar mt-1 max-h-[75vh] overflow-y-auto">
            <FormField
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      autoComplete="off"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isCreatingProject || isUpdatingProject}
                      type="text"
                      required
                      className="border-input rounded-md border bg-neutral-950 focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <FormField
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex gap-2">
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() => setPreview(!preview)}
                        className="rounded-md"
                      >
                        {preview ? (
                          <Edit2 className="size-3" />
                        ) : (
                          <Projector className="size-3" />
                        )}
                      </Button>
                    </div>
                    {preview ? (
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
                            ol: ({ children, className, start, type }) => (
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
                          {field.state.value ||
                            "Start typing markdown to see a live preview."}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          autoComplete="off"
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          disabled={isCreatingProject || isUpdatingProject}
                          required
                          className="border-input h-full min-h-30 rounded-md border bg-neutral-950 focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </>
                    )}
                  </Field>
                );
              }}
            />
            <FormField
              name="image_url"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      autoComplete="off"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="url"
                      disabled={isCreatingProject || isUpdatingProject}
                      required
                      className="border-input rounded-md border bg-neutral-950 focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <FormField
              name="project_url"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Project URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      autoComplete="off"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isCreatingProject || isUpdatingProject}
                      type="url"
                      required
                      className="border-input rounded-md border bg-neutral-950 focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <FormField
              name="github_url"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>GitHub URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      autoComplete="off"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isCreatingProject || isUpdatingProject}
                      type="url"
                      required
                      className="border-input rounded-md border bg-neutral-950 focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
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
                  field.state.meta.isTouched && !field.state.meta.isValid;

                const selectedIds = field.state.value ?? [];
                const selectedNames = selectedIds
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
                      disabled={isCreatingProject || isUpdatingProject}
                    >
                      <ComboboxChips
                        ref={anchor}
                        className="border-input w-full rounded-md border bg-neutral-950 py-2 focus-within:border-sky-500 focus-within:ring-0 focus-within:ring-sky-500"
                      >
                        <ComboboxValue>
                          {(names) => (
                            <div className="flex w-full flex-wrap gap-2">
                              {names.map((name: string) => (
                                <ComboboxChip key={name} className="rounded-md">
                                  {name}
                                </ComboboxChip>
                              ))}
                              <ComboboxChipsInput />
                            </div>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>

                      <ComboboxContent
                        anchor={anchor}
                        className="border-input rounded-md border px-1 py-2"
                      >
                        <ComboboxEmpty>No technology found.</ComboboxEmpty>
                        <ComboboxList className="scrollbar-thin scrollbar-thumb-neutral-900 scrollbar-track-neutral-950">
                          {(name: string) => (
                            <ComboboxItem
                              key={name}
                              value={name}
                              className="rounded-md"
                            >
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
              name="featured"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Featured</FieldLabel>
                    <RadioGroup
                      name={field.name}
                      value={String(field.state.value)}
                      onValueChange={(value) =>
                        field.handleChange(value === "true")
                      }
                      disabled={isCreatingProject || isUpdatingProject}
                      className="flex flex-row gap-6 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="true"
                          id={`${field.name}-true`}
                        />
                        <label
                          htmlFor={`${field.name}-true`}
                          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="false"
                          id={`${field.name}-false`}
                        />
                        <label
                          htmlFor={`${field.name}-false`}
                          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          No
                        </label>
                      </div>
                    </RadioGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
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
                  className="rounded-md"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                form={formId}
                type="submit"
                disabled={isCreatingProject || isUpdatingProject}
                className="rounded-md bg-neutral-950 text-sky-500 hover:bg-sky-500/10 hover:text-sky-600 hover:inset-ring hover:ring-sky-500"
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

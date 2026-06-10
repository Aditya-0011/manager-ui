import {
  type Experience,
  type SimpleResponse,
  type ExperienceUpdateRequest,
  type DeleteRequest,
  type Technology,
  type Project,
} from "@/lib/objects";
import { formatMonthYear } from "@/lib/utils";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Form } from "@/components/pages/experiences/Form";

import { UpdatedOn } from "@/components/pages/UpdatedOn";
import { Delete } from "@/components/pages/Delete";

type ListProps = {
  technologies: Technology[];
  projects: Project[];
  experiences: Experience[];
  isUpdatingExperience: boolean;
  isDeletingExperience: boolean;
  updateExperienceAsync: (
    request: ExperienceUpdateRequest,
  ) => Promise<SimpleResponse>;
  deleteExperienceAsync: (request: DeleteRequest) => Promise<SimpleResponse>;
};

export function List({
  technologies,
  projects,
  experiences,
  isUpdatingExperience,
  isDeletingExperience,
  updateExperienceAsync,
  deleteExperienceAsync,
}: ListProps) {
  if (experiences.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        No experiences found.
      </p>
    );
  }

  return (
    <div className="columns-1 gap-4 pb-4 sm:columns-2 lg:columns-4">
      {experiences.map((exp) => {
        return (
          <Card
            key={exp.id}
            className="group bg-muted/5 hover:bg-muted/50 mb-4 break-inside-avoid ring ring-white/10 backdrop-blur transition-all hover:scale-[1.01] hover:ring-white"
          >
            <CardContent className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg leading-tight font-semibold tracking-tight">
                  {exp.company}
                </h3>
                <Badge
                  variant="outline"
                  className="shrink-0 px-2 py-0.5 text-[10px] tracking-wider uppercase ring ring-white/20"
                >
                  {exp.tenure}
                </Badge>
              </div>

              <div className="divide-y divide-white/10">
                {exp.positions.map((position) => (
                  <div
                    key={position.id}
                    className="flex items-start justify-between gap-4 py-2"
                  >
                    <span className="text-sm font-medium text-white">
                      {position.role}
                    </span>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatMonthYear(position.start)}&nbsp;-&nbsp;
                      {position.end ? formatMonthYear(position.end) : "Present"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="bg-muted/5 flex items-center justify-between border-t p-3">
              <UpdatedOn value={exp.updated_at} />

              <div className="flex items-center gap-1">
                <Form
                  technologies={technologies}
                  projects={projects}
                  experience={exp}
                  isUpdatingExperience={isUpdatingExperience}
                  mutateExperienceAsync={updateExperienceAsync}
                />
                <Delete
                  id={exp.id}
                  description="This action cannot be undone. This will delete the experience"
                  name={exp.company}
                  isDeleting={isDeletingExperience}
                  mutateAsync={deleteExperienceAsync}
                />
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

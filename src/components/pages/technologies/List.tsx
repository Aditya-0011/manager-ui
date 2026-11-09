import { useState } from "react";

import {
  getTechnologyCategoryLabel,
  type Technology,
  type TechnologyUpdateRequest,
  type DeleteRequest,
} from "@/lib/objects";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Form } from "@/components/pages/technologies/Form";

import { ListSearch } from "@/components/pages/ListSearch";
import { UpdatedOn } from "@/components/pages/UpdatedOn";
import { Delete } from "@/components/pages/Delete";

type ListProps = {
  technologies: Technology[];
  isUpdating: boolean;
  isDeleting: boolean;
  updateAsync: (request: TechnologyUpdateRequest) => Promise<boolean>;
  onDelete: (request: DeleteRequest) => void;
};

export function List({
  technologies,
  isUpdating,
  isDeleting,
  updateAsync,
  onDelete,
}: ListProps) {
  const [search, setSearch] = useState("");

  const categoryStyles = (x: number): string => {
    switch (x) {
      case 1:
        return "bg-blue-500/10 text-blue-600 ring-blue-500";
      case 2:
        return "bg-purple-500/10 text-purple-600 ring-purple-500";
      case 3:
        return "bg-sky-500/10 text-sky-600 ring-sky-500";
      case 4:
        return "bg-indigo-500/10 text-indigo-600 ring-indigo-500";
      case 5:
        return "bg-orange-500/10 text-orange-600 ring-orange-500";
      case 6:
        return "bg-yellow-500/10 text-yellow-600 ring-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-600 ring-gray-500";
    }
  };

  if (technologies.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        No technologies found.
      </p>
    );
  }

  const query = search.trim().toLowerCase();
  const visible = query
    ? technologies.filter((tech) =>
        [tech.name, getTechnologyCategoryLabel(tech.category)].some((text) =>
          text.toLowerCase().includes(query),
        ),
      )
    : technologies;

  return (
    <div className="flex flex-col gap-4">
      <ListSearch
        label="Search technologies"
        placeholder="Search technologies..."
        value={search}
        onChange={setSearch}
      />
      {visible.length === 0 ? (
        <p className="text-muted-foreground py-10 text-center text-sm">
          No technologies match "{search.trim()}".
        </p>
      ) : (
        <div className="columns-1 gap-4 pb-4 sm:columns-2 lg:columns-4">
          {visible.map((tech) => {
            const categoryLabel = getTechnologyCategoryLabel(tech.category);

            return (
              <Card
                key={tech.id}
                className="group bg-muted/5 hover:bg-muted/50 mb-4 break-inside-avoid ring ring-white/10 backdrop-blur transition-all hover:scale-[1.01] hover:ring-white"
              >
                <div className="flex h-32 w-full overflow-hidden rounded-t-lg border-b">
                  <div className="bg-muted/10 flex flex-1 items-center justify-center p-6 transition-colors group-hover:bg-white/10">
                    <img
                      src={tech.image_url}
                      alt={tech.name}
                      fetchPriority="high"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <div className="bg-muted/30 flex flex-1 items-center justify-center border-r p-6 transition-colors group-hover:bg-white/5">
                    <img
                      src={tech.fallback_image_url}
                      alt={`fallback_${tech.name}`}
                      className="h-full w-full object-contain opacity-50 grayscale transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  </div>
                </div>

                <CardContent className="flex flex-1 flex-col justify-between p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg leading-tight font-semibold tracking-tight">
                      {tech.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`shrink-0 px-1.5 py-0.5 text-[10px] tracking-wider uppercase ring ${categoryStyles(tech.category)}`}
                    >
                      {categoryLabel}
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/5 flex items-center justify-between border-t p-3">
                  <UpdatedOn value={tech.updated_at} />

                  <div className="flex items-center gap-1">
                    <Form
                      data={tech}
                      isUpdating={isUpdating}
                      submit={updateAsync}
                    />

                    <Delete
                      id={tech.id}
                      description="This action cannot be undone. This will delete the technology"
                      name={tech.name}
                      isDeleting={isDeleting}
                      onDelete={onDelete}
                    />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

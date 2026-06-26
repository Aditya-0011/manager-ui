import { type Message, type SimpleResponse } from "@/lib/objects";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Delete } from "@/components/pages/Delete";

export function List({
  data,
  isDeleting,
  mutateAsync,
}: {
  data: Message[];
  isDeleting: boolean;
  mutateAsync: (request: { id: string }) => Promise<SimpleResponse>;
}) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        No messages found.
      </p>
    );
  }

  return (
    <div className="columns-1 gap-4 pb-4 sm:columns-2 lg:columns-4">
      {data.map(({ id, name, email, message }) => (
        <Card
          key={id}
          className="bg-muted/5 hover:bg-muted/50 mb-4 break-inside-avoid py-3 ring ring-white/10 backdrop-blur transition-all hover:scale-[1.01] hover:ring-white"
        >
          <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
            <div>
              <CardTitle className="text-lg leading-tight">{name}</CardTitle>
              <CardDescription className="text-xs">{email}</CardDescription>
            </div>
            <Delete
              id={id}
              description="This action cannot be undone. This will delete the message(s) from"
              name={name}
              isDeleting={isDeleting}
              mutateAsync={mutateAsync}
            />
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-[0.7rem] font-semibold tracking-wide uppercase">
              Messages
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-white/90">
              {message.map((msg, index) => (
                <li
                  key={`${id}-${index}`}
                  className="marker:text-muted-foreground"
                >
                  {msg}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

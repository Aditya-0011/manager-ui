import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type ListSearchProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function ListSearch({
  label,
  placeholder,
  value,
  onChange,
}: ListSearchProps) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search
        aria-hidden="true"
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
      />
      <Input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-input rounded-md border bg-transparent pl-8 focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
      />
    </div>
  );
}

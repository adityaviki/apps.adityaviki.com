"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getTags, createTag } from "@/app/actions/tags";

type Tag = { id: string; name: string };

export function TagInput({
  selectedTags,
  onChange,
}: {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getTags().then(setAllTags);
  }, []);

  const handleSelect = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      onChange([...selectedTags, tag]);
    }
    setOpen(false);
    setSearch("");
  };

  const handleRemove = (tagId: string) => {
    onChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleCreate = async () => {
    if (!search.trim()) return;
    const tag = await createTag(search.trim());
    setAllTags((prev) => [...prev, tag].sort((a, b) => a.name.localeCompare(b.name)));
    handleSelect(tag);
  };

  const available = allTags.filter(
    (t) => !selectedTags.find((s) => s.id === t.id)
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {selectedTags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="gap-1">
            {tag.name}
            <button
              type="button"
              onClick={() => handleRemove(tag.id)}
              className="ml-1 rounded-full outline-none hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" type="button">
            Add tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search tags..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {search.trim() ? (
                  <button
                    type="button"
                    className="w-full px-2 py-1.5 text-sm text-left hover:bg-accent"
                    onClick={handleCreate}
                  >
                    Create &quot;{search.trim()}&quot;
                  </button>
                ) : (
                  "No tags found."
                )}
              </CommandEmpty>
              <CommandGroup>
                {available.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => handleSelect(tag)}
                  >
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedTags.map((tag) => (
        <input key={tag.id} type="hidden" name="tagIds" value={tag.id} />
      ))}
    </div>
  );
}

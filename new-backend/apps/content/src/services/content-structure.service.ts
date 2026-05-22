type CourseSectionMeta = {
  key: string;
  title: string;
  description?: string | null;
  order: number;
};

type GroupableContentItem = {
  order: number;
  durationMinutes?: number | null;
  sectionKey?: string | null;
};

type GroupedSection<T> = {
  key: string;
  title: string;
  description: string | null;
  order: number;
  itemCount: number;
  durationMinutes: number;
  contentItems: T[];
};

export const GENERAL_SECTION_KEY = "general";

const normalizeSectionMeta = (
  value: CourseSectionMeta | null | undefined,
  fallbackOrder = 9999,
): CourseSectionMeta => ({
  key: value?.key?.trim() || GENERAL_SECTION_KEY,
  title: value?.title?.trim() || "General section",
  description: value?.description?.trim() || null,
  order: typeof value?.order === "number" ? value.order : fallbackOrder,
});

export const sortContentItemsBySectionOrder = <T extends GroupableContentItem>(
  items: T[],
  sections: CourseSectionMeta[] = [],
) => {
  const sectionMap = new Map(
    sections.map((section) => [section.key, normalizeSectionMeta(section)]),
  );

  return [...items].sort((left, right) => {
    const leftSection = sectionMap.get(left.sectionKey || GENERAL_SECTION_KEY) ??
      normalizeSectionMeta(undefined);
    const rightSection = sectionMap.get(right.sectionKey || GENERAL_SECTION_KEY) ??
      normalizeSectionMeta(undefined);

    return (
      leftSection.order - rightSection.order ||
      left.order - right.order
    );
  });
};

export const groupContentItemsBySection = <T extends GroupableContentItem>(
  items: T[],
  sections: CourseSectionMeta[] = [],
) => {
  const sectionMap = new Map(
    sections.map((section) => [section.key, normalizeSectionMeta(section)]),
  );
  const groups = new Map<string, { meta: CourseSectionMeta; contentItems: T[] }>();

  const orderedItems = sortContentItemsBySectionOrder(items, sections);

  for (const item of orderedItems) {
    const sectionKey = item.sectionKey || GENERAL_SECTION_KEY;
    const sectionMeta =
      sectionMap.get(sectionKey) ??
      normalizeSectionMeta({ key: sectionKey, title: "General section", order: 9999 });

    let group = groups.get(sectionMeta.key);
    if (!group) {
      group = {
        meta: sectionMeta,
        contentItems: [],
      };
      groups.set(sectionMeta.key, group);
    }

    group.contentItems.push(item);
  }

  const groupedSections: GroupedSection<T>[] = [...groups.values()]
    .sort((left, right) => left.meta.order - right.meta.order)
    .map((group) => ({
      key: group.meta.key,
      title: group.meta.title,
      description: group.meta.description ?? null,
      order: group.meta.order,
      itemCount: group.contentItems.length,
      durationMinutes: group.contentItems.reduce(
        (sum, item) => sum + (item.durationMinutes ?? 0),
        0,
      ),
      contentItems: group.contentItems,
    }));

  return { sections: groupedSections };
};

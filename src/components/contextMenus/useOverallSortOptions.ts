import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useTopSortOptions } from "@src/components/contextMenus/useTopSortOptions";
import { ICON_MAP } from "@src/types/constants/IconMap";
import { ContextMenuOption } from "../../types/ContextMenuOptions";

export const useOverallSortOptions = (): ContextMenuOption[] => {
  const { t } = useTranslation();

  const topSortOptions = useTopSortOptions();

  return useMemo<ContextMenuOption[]>(
    () => [
      ...topSortOptions,
      {
        key: "Hot",
        title: t("sort.Hot"),
        icon: ICON_MAP.FLAME,
      },
      {
        key: "Active",
        title: t("sort.Active"),
        icon: ICON_MAP.BOLT,
      },
      {
        key: "New",
        title: t("sort.New"),
        icon: ICON_MAP.ALARM,
      },
      {
        key: "MostComments",
        title: t("sort.MostComments"),
        icon: ICON_MAP.MOST_COMMENTS,
      },
      {
        key: "NewComments",
        title: t("sort.NewComments"),
        icon: ICON_MAP.NEW_COMMENTS,
      },
      {
        key: "Old",
        title: t("sort.Old"),
        icon: ICON_MAP.HOURGLASS,
      },
    ],
    [t, topSortOptions]
  );
};

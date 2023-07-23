import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "@components/common/Gluestack";
import {
  selectSettings,
  selectThemeOptions,
} from "@src/slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@root/store";
import React from "react";
import { useTranslation } from "react-i18next";
import { LayoutAnimation, StyleSheet, Switch } from "react-native";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { overallSortOptions } from "../../../../constants/SortOptions";
import { CommentSortContextMenu } from "../../../common/ContextMenu/CommentSortContextMenu";
import { FeedSortContextMenu } from "../../../common/ContextMenu/FeedSortContextMenu";
import { ListingTypeContextMenu } from "../../../common/ContextMenu/ListingTypeContextMenu";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";

function ContentScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const settings = useAppSelector(selectSettings);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectThemeOptions);

  const onChange = (key: string, value: any) => {
    dispatch(setSetting({ [key]: value }));
  };

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection header={t("Posts")}>
          <FeedSortContextMenu
            currentSelection={settings.defaultSort}
            onPress={({ nativeEvent }) => {
              dispatch(setSetting({ defaultSort: nativeEvent.actionKey }));
            }}
          >
            <CCell
              cellStyle="RightDetail"
              title={t("Default Sort")}
              detail={overallSortOptions[settings.defaultSort].display}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              accessory="DisclosureIndicator"
            />
          </FeedSortContextMenu>
          <CommentSortContextMenu
            currentSelection={settings.defaultCommentSort}
            onPress={({ nativeEvent }) => {
              dispatch(
                setSetting({ defaultCommentSort: nativeEvent.actionKey })
              );
            }}
          >
            <CCell
              cellStyle="RightDetail"
              title={t("Default Comment Sort")}
              detail={settings.defaultCommentSort}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              accessory="DisclosureIndicator"
            />
          </CommentSortContextMenu>
          <ListingTypeContextMenu
            currentSelection={settings.defaultListingType}
            onPress={({ nativeEvent }) => {
              dispatch(
                setSetting({ defaultListingType: nativeEvent.actionKey })
              );
            }}
          >
            <CCell
              cellStyle="RightDetail"
              title={t("Default Listing Type")}
              detail={settings.defaultListingType}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              accessory="DisclosureIndicator"
            />
          </ListingTypeContextMenu>
          <CCell
            title={t("Hide Read Posts")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("ReadSettings")}
          />
        </CSection>

        <CSection header={t("Comments")}>
          <CCell
            cellStyle="RightDetail"
            title={t("Show Comment Actions")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.showCommentActions}
                onValueChange={(v) => {
                  onChange("showCommentActions", v);
                }}
              />
            }
          />
        </CSection>

        <CSection
          header={t("NSFW Content")}
          footer={t("settings.content.nsfw.footer")}
        >
          <CCell
            cellStyle="RightDetail"
            title={t("settings.content.nsfw.blur")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.blurNsfw}
                onValueChange={(v) => onChange("blurNsfw", v)}
              />
            }
          />
          <CCell
            cellStyle="RightDetail"
            title={t("settings.content.nsfw.hide")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.hideNsfw}
                onValueChange={(v) => onChange("hideNsfw", v)}
              />
            }
          />
        </CSection>
        <CSection header="Web">
          <CCell
            cellStyle="Basic"
            title={t("settings.content.web.useReaderMode")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.useReaderMode}
                onValueChange={(v) => {
                  LayoutAnimation.easeInEaseOut();
                  onChange("useReaderMode", v);
                }}
              />
            }
          />
        </CSection>
      </TableView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    marginHorizontal: 15,
  },
});

export default ContentScreen;

import React, { FC } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { TimeTracker } from "@/types";
import dayjs from "dayjs";

Font.register({
  family: "MPLUSRounded1c-Regular",
  src: "/fonts/MPLUSRounded1c-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "MPLUSRounded1c-Regular",
  },
  table: {
    width: "100%",
  },
  tableRow: {
    borderBottom: "1pt solid black",
    borderLeft: "1pt solid black",
    borderTop: "1pt solid black",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableCol: {
    flex: 1,
    // @ts-ignore
    justifyContent: "stretch",
    textAlign: "left",
    fontSize: 14,
    borderRight: "1pt solid black",
    wordWrap: "break-word",
    whiteSpace: "pre-wrap",
  },
});

type PdfDocumentProps = {
  data: TimeTracker[];
};

export const PdfDocument: FC<PdfDocumentProps> = ({ data }) => {
  const caluculateWorkTime = (item: TimeTracker) => {
    if (!item.ended_at) return;
    const start = dayjs(item.started_at);
    const end = dayjs(item.ended_at);
    const diff = end.diff(start, "hour");
    return diff;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text>稼働日</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>時間</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>タスク</Text>
            </View>
          </View>
          {data.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>{dayjs(item.started_at).format("YYYY/MM/DD")}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{caluculateWorkTime(item)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

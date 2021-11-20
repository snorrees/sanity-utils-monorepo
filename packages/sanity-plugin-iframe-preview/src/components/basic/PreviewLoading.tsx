import React from "react";
import { Button, Flex, Spinner, Stack } from "@sanity/ui";
import styles from "./PreviewLoading.css";

interface LoadingProps {
  documentId?: string;
  loading: boolean;
  reload: () => void;
}

export function PreviewLoading({ loading, documentId, reload }: LoadingProps) {
  return loading ? (
    <Flex align="center" justify="center" className={styles.loader}>
      {!documentId ? (
        <Stack space={2}>
          <div>Document is not saved yet.</div>
          <div>Make an edit to enabled preview.</div>
        </Stack>
      ) : (
        <div className={styles.spinner}>
          <Spinner size={4} />
          <div className={styles.reload}>
            <Button text={"Retry"} onClick={reload} size={3} />
          </div>
        </div>
      )}
    </Flex>
  ) : null;
}

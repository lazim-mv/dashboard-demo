import React, { ReactNode } from "react";
import styles from "../../styles/bordercontainer.module.css";

type BorderContainerProps = {
  children?: ReactNode;
  mt?: string;
  mb?: string;
  bg?: string;
  pd?: string;
  brdrRd?: string;
  border?: string;
};

const BorderContainer: React.FC<BorderContainerProps> = ({ children, mt, mb, bg, pd, brdrRd, border }) => {
  return <div style={{ marginTop: mt, marginBottom: mb, backgroundColor: bg, padding: pd, borderRadius: brdrRd, border: border }} className={styles.borderContainer}>{children}</div>;
};

export default BorderContainer;

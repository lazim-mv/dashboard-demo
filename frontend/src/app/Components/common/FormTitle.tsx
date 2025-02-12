import React from "react";

type FormTitleProps = {
  title: string;
  bg?: string;
  borderBottom?: string;
  padding?: string;
  mb?: string;
  fontSize?: string;
};

const FormTitle: React.FC<FormTitleProps> = ({
  title,
  bg = "#f0f0f0",
  borderBottom,
  padding,
  mb,
  fontSize
}) => {
  return (
    <div
      className="formTitle"
      style={{ backgroundColor: bg, borderBottom: borderBottom, padding: padding, marginBottom: mb }}
    >
      <h3 style={{ fontSize: fontSize || "20px" }}>{title}</h3>
    </div>
  );
};

export default FormTitle;

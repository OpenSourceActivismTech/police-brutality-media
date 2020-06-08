import React from "react";
import { Link } from "gatsby";
import GlobalWrapper from "./GlobalLayout";
import { rhythm, scale } from "../utils/typography";

const PageLayout = ({ children, title }) => {
  return (
    <GlobalWrapper>
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
          color: "white",
        }}
      >
        <Link
          style={{
            boxShadow: "none",
            textDecoration: "none",
            color: "inherit"
          }}
          to={"/"}
        >
          {title}
        </Link>
      </h1>
      {children}
    </GlobalWrapper>
  );
};

export default PageLayout;

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
          margin: `${rhythm(0.5)} ${rhythm(0.75)}`,
          color: "black",
          textShadow: "2px 2px red",
          position: "absolute",
          zIndex: 1,
        }}
      >
        <Link
          style={{
            boxShadow: "none",
            textDecoration: "none",
            color: "inherit",

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

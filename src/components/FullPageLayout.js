import React from "react";
import { Link } from "gatsby";
import GlobalWrapper from "./GlobalLayout";
import { rhythm, scale } from "../utils/typography";

const PageLayout = ({ children, title }) => {
  return (
    <GlobalWrapper title={title}>
      <h1 className="logo"
          style={{
            ...scale(1.5),
            margin: `${rhythm(0.5)} ${rhythm(0.75)}`,
            color: "black",
            textShadow: "2px 2px red",
          }}
        >
        <Link to={"/"}>
          {title}
        </Link>
      </h1>
      <nav className="bottom" style={{
        ...scale(0.75),
        margin: `${rhythm(0.5)} ${rhythm(0.75)}`,
        color: "red",
        fontWeight: "bold",
      }}>
        <Link to={'/about'}>About</Link>
      </nav>
      {children}
    </GlobalWrapper>
  );
};

export default PageLayout;

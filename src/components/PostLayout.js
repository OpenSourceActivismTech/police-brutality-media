import React from "react";
import { Link } from "gatsby";
import GlobalWrapper from "./GlobalLayout";
import { rhythm, scale } from "../utils/typography";

const PostLayout = ({ children, title, description }) => {
  return (
    <GlobalWrapper title={title} description={description}>
      <div style={{
        padding: `${rhythm(0.5)} ${rhythm(0.75)}`,
      }}>
        <h1 style={{
          ...scale(1.5),
          marginTop: 0,
          display: "inline",
        }}>
          <Link to={"/"}
            style={{
              boxShadow: "none",
              textShadow: "2px 2px red",
            }}
          >
            Police Brutality
          </Link>
        </h1>
        <h2 style={{
          ...scale(1),
        }}>
          { title }
        </h2>
          {children} 
      </div>
    </GlobalWrapper>
  );
};

export default PostLayout;

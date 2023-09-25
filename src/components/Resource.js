import React from "react";
import { NavLink } from "react-router-dom";
const Resource = () => {
  return (
    <div className="resource">
      <section className="allDegree">
        <NavLink to="/resource" end>
          所有資源
        </NavLink>
        <NavLink to="/resource/jr">新手推薦</NavLink>
        <NavLink to="/resource/mid">中級程度</NavLink>
        <NavLink to="/resource/sr">高手專區</NavLink>
        <hr />
      </section>
      <section className="resourceArticle"></section>
    </div>
  );
};

export default Resource;

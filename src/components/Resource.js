import React from "react";
import { Link, NavLink } from "react-router-dom";
const Resource = () => {
  return (
    <div className="resource">
      <section className="allLevel">
        <NavLink to="/resource" end>
          所有資源
        </NavLink>
        <NavLink to="/resource/jr">新手推薦</NavLink>
        <NavLink to="/resource/mid">中級程度</NavLink>
        <NavLink to="/resource/sr">高手專區</NavLink>
        <hr />
      </section>
      <section className="resourceList">
        <Link to="/resource">初級泰語</Link>
        <hr />
        <Link to="/resource">初級泰語會話</Link>
        <hr />
        <Link to="/resource">中級泰語</Link>
        <hr />
        <Link to="/resource">中級泰語會話</Link>
        <hr />
        <Link to="/resource">泰語口語教程</Link>
        <hr />
        <Link to="/resource">高級泰語</Link>
        <hr />
        <Link to="/resource">推薦影片</Link>
        <hr />
      </section>
    </div>
  );
};

export default Resource;

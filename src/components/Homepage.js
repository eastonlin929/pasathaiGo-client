import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
const Homepage = () => {
  return (
    <div style={{ display: "flex" }}>
      <Card style={{ width: "60vw", margin: "1rem" }}>
        <Card.Img
          style={{ border: "0.5rem solid white", borderRadius: "0.8rem" }}
          variant="top"
          src="/images/25436815_l.jpg"
        />
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>
            想自學泰語嗎？
          </Card.Title>
          <Card.Text style={{ fontWeight: "normal" }}>
            是不是覺得泰語每個都長得像毛毛蟲，分不清楚呢？
            不管你是因為追星、興趣，或者喜歡泰國文化，如果想學習但還不知道如何下手就趕緊點擊看看吧！
          </Card.Text>

          <Button variant="primary" as={Link} to="/alphabet">
            開始學習
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Homepage;

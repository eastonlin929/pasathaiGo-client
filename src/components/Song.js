import React, { useEffect, useRef, useState } from "react";

const Song = () => {
  const [open, setOpen] = useState(false);
  const divRef = useRef(null);
  useEffect(() => {
    console.log(divRef);
  }, [open]);
  let utterance = new window.SpeechSynthesisUtterance("ก ไก่");
  utterance.lang = "th-TH";

  return (
    <div className="container">
      <button onClick={() => window.speechSynthesis.speak(utterance)}>
        ก ไก่
      </button>
    </div>
  );
};

export default Song;

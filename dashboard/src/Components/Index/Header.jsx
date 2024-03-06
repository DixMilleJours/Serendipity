import React from "react";
import "animate.css";
import TrackVisibility from "react-on-screen";

function Header() {
    const [loopNum, setLoopNum] = React.useState(0);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const toRotate = ["Students", "Family Travel", "Business Purpose  "]
    const [text, setText] = React.useState('')
    const [delta, setDelta] = React.useState(300 - Math.random() * 100);
    const [isEmpty, setIsEmpty] = React.useState(false);
    const period = 2000;
    
    const tick = () =>{
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText= isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

        setText(updatedText);

        if(isDeleting){
            setDelta(prevDelta => prevDelta / 2)
        }

        if(!isDeleting && updatedText === fullText){
            setIsDeleting(true);
            setDelta(period);
        }else if(isDeleting && updatedText === ''){
            setIsDeleting(false);
            setIsEmpty(true);
            setLoopNum(loopNum + 1);
            setDelta(500);
        }
    }

    React.useEffect(() => {
        let ticker = setInterval(() =>{
            tick()
        }, delta);

        return() =>{ clearInterval(ticker)};
    }, [text])

  return (
    <>
      <TrackVisibility>
      {({isVisible}) => 
        <div
          className={isVisible ? "animated__animated animate__fadeIn content-wrapper" : "content-wrapper"}
          data-scroll-reveal="enter bottom over 1s"
        >
          <h2
            className="gradient-text web-desc1"
            style={{
              fontSize: "30pt",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            Serendipity provides unique travel experience for:{" "}
          </h2>
          <h2
            className="gradient-text-inv web-desc2"
            style={{ fontSize: "60pt", marginTop: "20px" }}
          >
           {text}
          </h2>
        </div>}
      </TrackVisibility>
    </>
  );
}

export default Header;
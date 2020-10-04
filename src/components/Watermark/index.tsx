import * as React from "react";
import Moveable from "react-moveable";
import { Frame } from "scenejs";

const styleTarget: any = {
    width: "100px",
    minHeight: "100px",
    left: "0px",
    top: "0px",
    opacity: "0.8",
    position: "absolute",
    transform: {
        rotate: "0deg",
        scaleX: 1,
        scaleY: 1,
        matrix3d: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }
}
const frame = new Frame(styleTarget);
const moveableRef = React.createRef<Moveable>()
const rotateAndPaintImage  = ( context, image, angleInRad , positionX, positionY, imgWidth, imgHeight , opacity) => {
    context.translate( positionX, positionY );
    context.rotate( angleInRad );
    context.globalAlpha = Number(opacity)
    context.drawImage( image, 0, 0, imgWidth, imgHeight );
    context.globalAlpha = 1.0
    context.rotate( -angleInRad );
    //context.translate( -positionX, -positionY );
}
  
export default function Watermark({ image, logo, exportFunction, opacity }: { image: string, logo: string, exportFunction?: Function, opacity?: number }) {
    const [target, setTarget] = React.useState<any>();
    const [container, setContainer] = React.useState<any>();
    const [containerSize, setContainerSize] = React.useState<any>([200, 200])

    const setTransform = (target) => {
        if (!target) return;
        target.style.cssText = frame.toCSS();
    }
    const onDrag = ({ target, clientX, clientY, top, left, isPinch }) => {
        frame.set("left", `${left}px`);
        frame.set("top", `${top}px`);
        setTransform(target);
        /* if (!isPinch) {
          this.setLabel(clientX, clientY, `X: ${left}px<br/>Y: ${top}px`);
        } */
    };
    const onRotate = ({ target, clientX, clientY, beforeDelta, isPinch }) => {
        const deg = parseFloat(frame.get("transform", "rotate")) + beforeDelta;

        frame.set("transform", "rotate", `${deg}deg`);
        setTransform(target);
        /* if (!isPinch) {
            this.setLabel(clientX, clientY, `R: ${deg.toFixed(1)}`);
        } */
    };
    const onResize = ({ target, clientX, clientY, width, height, isPinch }) => {
        frame.set("width", `${width}px`);
        frame.set("height", `${height}px`);
        setTransform(target);
        /* if (!isPinch) {
            this.setLabel(clientX, clientY, `W: ${width}px<br/>H: ${height}px`);
        } */
    };

    const exportImage = async () => {
        const canvas: any = document.getElementById("myCanvas");
        const background = new Image()
        background.src = image
        await new Promise (r => background.onload = function () {
            canvas.width = this["width"]
            canvas.height = this["height"]
            r();
        })
        const ctx = canvas.getContext("2d");
        ctx.drawImage(background, 0, 0)

        //var imagePosition = getElementInfo()
        const img = new Image(frame.get("width"), frame.get("height"));
        img.setAttribute('crossorigin', 'anonymous');
        img.src = logo
        const scale = canvas.width / containerSize[0]
        await new Promise(r => {
            img.onload = function () {
                rotateAndPaintImage(
                    ctx,
                    img,
                    Number(frame.get("transform").rotate.replace(/deg/,"")) * Math.PI / 180,
                    Number(frame.get("left").replace(/px/, "")) * scale,
                    Number(frame.get("top").replace(/px/, "")) * scale,
                    Number(String(frame.get("width")).replace(/px/, "")) * scale,
                    Number(String(frame.get("height")).replace(/px/, "")) * scale,
                    frame.get("opacity"));
                r()
            }
        })
        let blob = await new Promise(r => canvas.toBlob(r))
        return URL.createObjectURL(blob);
    }

    React.useEffect(() => {
        setTarget(document.querySelector(".target")!);
        setContainer(document.querySelector(".container"))
    }, []);

    React.useEffect(() => {
        if (exportFunction) {
            exportFunction(exportImage)
        }
    })

    React.useEffect(() => {
        setTimeout(() => {
            frame.set("height", (document.querySelector(".target img") as any).offsetHeight)
            setTransform(target)
            moveableRef.current.updateRect()
        }, 100)
    }, [logo])

    React.useEffect(() => {
        setTimeout(() => {
            setContainerSize([container?.offsetWidth, container?.offsetHeight])
            
        }, 100)
        //setTransform(target)

    }, [image])
    React.useEffect(() => {
        frame.set("opacity", opacity / 100)
        setTransform(target)
    }, [opacity])

    return <div className="container" style={{
        minHeight: "200px",
        maxWidth: "800px",
        position: "relative",
        //background: `url(${image})`
    }}>
        <Moveable
            ref={moveableRef}
            target={target}
            resizable={true}
            rotatable={true}
            //container={container}
            keepRatio={true}
            snappable={true}
            bounds={{ "left": 0, "top": 0, "right": containerSize[0], "bottom": containerSize[1] }}
            draggable={true}
            throttleDrag={0}
            startDragRotate={0}
            throttleDragRotate={0}
            zoom={1}
            origin={true}
            padding={{ "left": 0, "top": 0, "right": 0, "bottom": 0 }}
            onDrag={onDrag}
            onResize={onResize}
            onRotate={onRotate}
        />
        <img src={image} style={{ width: "100%" }} />
        <div className="target" style={styleTarget}><img src={logo} style={{ width: "100%" }} /></div>
        <canvas id="myCanvas" style={{display: "none"}}/>
    </div>;
}
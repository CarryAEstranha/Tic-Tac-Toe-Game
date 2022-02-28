const selectMark = (mark) => {
    const decoration = document.getElementById("decoration");
    
    const labelCross = document.getElementById("label-cross");
    const labelCrossFade = document.getElementById("label-cross-fade");

    const labelCircle = document.getElementById("label-circle");
    const labelCircleFade = document.getElementById("label-circle-fade");

    if (mark === "x") {
        labelCross.className = "label-show";
        labelCrossFade.className = "label-hidden";

        labelCircle.className = "label-show";
        labelCircleFade.className = "label-hidden";

        decoration.style.width = "12.25rem";
    } else {
        labelCross.className = "label-hidden";
        labelCrossFade.className = "label-show";

        labelCircle.className = "label-hidden";
        labelCircleFade.className = "label-show";

        decoration.style.width = "24.5rem";
    }
}
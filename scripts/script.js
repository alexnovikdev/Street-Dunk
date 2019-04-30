let app = new PIXI.Application({
    width: 256, 
    height: 256,
    antialias: true,
    transparent: false,
    resolution: 1
});

document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x000000;

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", (event) => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    onSizeChange();
});

function onSizeChange() {
    
}
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
    updateSettings();
    onSizeChange();
});

let settings = {
    defaultWidth: 640,
    defaultHeight: 1136
};

let config = {
    ballSpeed: 0,
    ballScaleY : 0,
    isBallDown: true,
    ballStartY: 0,
    ballEndY: 0,
    ballFallDistance: 0
};

let ball = null;
let btn = null;
let logo = null;

PIXI.loader.add([
    "/images/ball.png",
    "/images/btn.png",
    "/images/logo.png"
]).on("progress", loadProgressHandler).load(setup);

function loadProgressHandler(loader, resource) {
    //console.log(resource.url);
    //console.log(loader.progress);
}

function setup() {
    ball = new PIXI.Sprite(
        PIXI.loader.resources["/images/ball.png"].texture
    );
    btn = new PIXI.Sprite(
        PIXI.loader.resources["/images/btn.png"].texture
    );
    logo = new PIXI.Sprite(
        PIXI.loader.resources["/images/logo.png"].texture
    );

    btn.interactive = true;

    btn.on("pointerdown", onDown);

    app.stage.addChild(ball);
    app.stage.addChild(btn);
    app.stage.addChild(logo);

    updateSettings();

    onSizeChange();

    app.ticker.add(delta => gameLoop(delta));
}

function onDown() {
    redirect();
}

function redirect() {
    
}

function updateSettings() {
    settings.gameWidth = app.renderer.view.width;
    settings.gameHeight = app.renderer.view.height;
    settings.isLandscape = settings.gameWidth > settings.gameHeight;

    let scaleX = 0;
    let scaleY = 0;

    if (settings.isLandscape) {
        scaleX = settings.gameWidth / settings.defaultHeight;
        scaleY = settings.gameHeight / settings.defaultWidth;
    } else {
        scaleX = settings.gameWidth / settings.defaultWidth;
        scaleY = settings.gameHeight / settings.defaultHeight;
    }

    settings.scale = Math.min(scaleX, scaleY);
}

function onSizeChange() {
    if (ball !== undefined && ball !== null) {
        ball.scale.set(.5 * settings.scale);
        config.ballScaleY = .5 * settings.scale;

        ball.anchor.set(.5, .5);

        if (settings.isLandscape) {
            ball.position.set(settings.gameWidth * .3, settings.gameHeight * .3);

            config.ballStartY = settings.gameHeight * .3;
            config.ballEndY = settings.gameHeight * .7; 
        } else {
            ball.position.set(settings.gameWidth * .5, settings.gameHeight * .4);

            config.ballStartY = settings.gameHeight * .4;
            config.ballEndY = settings.gameHeight * .65; 
        }

        config.ballFallDistance = config.ballEndY - config.ballStartY;
    }

    if (btn !== undefined && btn !== null) {
        btn.scale.set(.6 * settings.scale);
        btn.anchor.set(.5, .5);

        if (settings.isLandscape) {
            btn.position.set(app.renderer.view.width * .7, app.renderer.view.height * .7);
        } else {
            btn.position.set(app.renderer.view.width * .5, app.renderer.view.height * .8);  
        }
    }

    if (logo !== undefined && logo !== null) {
        logo.scale.set(.3 * settings.scale);
        logo.anchor.set(.5, .5);

        if (settings.isLandscape) {
            logo.position.set(app.renderer.view.width * .7, app.renderer.view.height * .4);
        } else {
            logo.position.set(app.renderer.view.width * .5, app.renderer.view.height * .2);
        }
    }
}

function gameLoop(delta) {
    if (ball !== undefined && ball !== null) {
        if (config.isBallDown) {
            ball.y += config.ballSpeed + delta;

            if (ball.y > config.ballEndY - config.ballFallDistance * .1) {
                ball.scale.y -= 0.03;
            }

            if (ball.y >= config.ballEndY) {
                config.isBallDown = false;
            }

            config.ballSpeed += config.ballFallDistance / 1000;
        }

        if (!config.isBallDown) {
            ball.y -= config.ballSpeed + delta;

            if (ball.scale.y < config.ballScaleY) {
                ball.scale.y += 0.03;
            }

            if (ball.y <= config.ballStartY) {
                config.ballSpeed = 0;
                config.isBallDown = true;               
            }

            config.ballSpeed -= config.ballFallDistance / 1000;
        }
    }
}
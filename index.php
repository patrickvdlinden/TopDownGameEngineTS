<!DOCTYPE html>

<html>
<head>
    <title>TopDownGameEngine</title>

    <style type="text/css">
        @font-face {
            font-family: 'Press Start 2P';
            src: url('Resources/Fonts/PressStart2P.ttf');
            font-weight: normal;
        }

h1 {
    color: white;
    position: absolute;
    font-family: "Press Start 2P";
}
        html, body {
            margin: 0;
            padding: 0;
            /*overflow: hidden;*/
            -webkit-user-select: none; /* webkit (safari, chrome) browsers */
            -moz-user-select: none; /* mozilla browsers */
            -khtml-user-select: none; /* webkit (konqueror) browsers */
            -ms-user-select: none; /* IE10+ */
        }
        
        body {
            font-family: "Segoe UI", sans-serif, serif;
            background-color: #000000;
        }

        #loader {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: black;
        }

        #IntroVideo {
            position: absolute;
            width: 0;
            height: 0;
        }

        #GameContainer {
            width: 800px;
            height: 600px;
            outline: thick solid #FFFFFF;
            position: absolute;
            top: calc(50% - 300px);
            left: calc(50% - 400px);
        }
    </style>

    <script type="text/javascript" src="map.js"></script>
    <script type="text/javascript">
        <?php if (isset($_GET["debug"]) && $_GET["debug"]) : ?>
            window.debug = true;
        <?php endif; ?>
    </script>
    <script type="text/javascript" src="script/gamecore.js?v=<?= filemtime("script/gamecore.js"); ?>"></script>
    <script type="text/javascript">
        window.onload = () => {
            var container = document.getElementById("GameContainer");
            var game = new Zaggoware.OnePiece.Game(container);
            game.start();
        };
    </script>
</head>
<body>
<h1>Test</h1>
<h2>ONE P<span>I</span>ECE</h1>
    <div id="GameContainer"></div>
</body>
</html>
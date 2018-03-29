window.onload = () => {
    const leftPane = document.getElementById("leftPane");
    const editorPane = document.getElementById("editorPane");
    const propertiesPane = document.getElementById("propertiesPane");

    const app = new SpritesheetBuilder.App(leftPane, editorPane, propertiesPane);
    app.initialize();
};
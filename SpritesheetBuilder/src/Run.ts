window.onload = () => {
    const leftPane = document.getElementById("leftPane");
    const editorPane = document.getElementById("editorPane");
    const propertiesPane = document.getElementById("propertiesPane");

    const app = new SpritesheetBuilder.App(document.getElementById("container"), leftPane, editorPane, propertiesPane);
    app.initialize();
};
export default function getTestDocument(markup) {
    var doc = document.implementation.createHTMLDocument("");

    doc.open();
    doc.write(
        markup || "<!doctype html><html><meta charset=utf-8><title>test doc</title>"
    );
    doc.close();
    return doc;
}

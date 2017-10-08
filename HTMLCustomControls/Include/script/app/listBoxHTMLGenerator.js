define(['hogan'], function (hogan) {
    var listBoxHTMLGenerator = function () {

        var compile = {
            buildFrame: hogan.compile(
                "<div class='_jpil' id='{{instanceId}}'>" +
                "{{#customAdd}} " +
                "<div class='_jpil_header'>{{headerText}}<span class='_customAddBtn'></span><span class='_clear' ></span><span class='_search' ></span><span class='_min' ></span> </div>" +
                "{{/customAdd}} " +
                "{{^customAdd}} " +
                "<div class='_jpil_header'>{{headerText}}<span class='_clear' ></span><span class='_search' ></span><span class='_min' ></span> </div>" +
                "{{/customAdd}} " +
                "<div class='_jpil_selectedList'><span class='filterHead' >Current Selection(s):</span></div>" +
                "<div class='_jpil_selList _jpmsShow'></div>" +
                "</div>"

            ),
            buildList: hogan.compile(
                "{{#items}}" +
                "<div class='_jpil_selItem' data-recId='{{idx}}' data-id='{{dataId}}' data-tval='{{dataValue}}' >{{displayValue}}</div>" +
                "{{/items}}"
            )
        } 
        var buildFrame = function (data) {
            //create html structure of listbox
            return compile.buildFrame.render(data);
        };
        var buildList = function (data) {
            return compile.buildList.render(data);            
        };
        var pubI = {
            buildFrame: buildFrame,
            buildList:buildList
        }
        return pubI;
    }();
    return listBoxHTMLGenerator;
});
define(["jquery", "underscore", "listBoxHTMLGenerator"], function ($, _, htmlGen) {
    // gen admin functions
    var init = function (c, _options) {
        this.container = $(c);
        var me = this;
        this.options = _.extend(this.options, _options);
        jpIndexListBox.cnter += 1;
        this.name = '#_jpil_' + jpIndexListBox.cnter;
        this.id = '_jpil_' + jpIndexListBox.cnter;
        this.buildFrame();
        if (!_options.dataUrl) {//data passed in as array
            this.data = this.sortData(_options.data);
            this.render();
        } else {//fetch data from end point
            this.fetchData();
        }
    };
    var fetchData = function () {
        var me = this;
        $.ajax({
            url: me.options.dataUrl,
            type: "GET",
            contentType: "application/json",
            headers: {
                'Cache-Control': ''
            },
            success: function (dt, status, request) {
                me.fetchDataHandler(dt);
            },
            error: function (xhr, a, b) {
                alert('error connecting to data source');
            }
        });
        
    };
    var sortData = function (dataset) {
        var me = this;
        var sFunction = function (a, b) {
            var atest = '';
            var btest = '';
            if (me.options.displayField == 'noObject') {
                atest = a.toLowerCase();
                btest = b.toLowerCase();
            } else {
                atest = a[me.options.displayField].toLowerCase();
                btest = b[me.options.displayField].toLowerCase();
            }
            switch (true) {
                case (atest > btest):
                    return 1;
                    break;
                case (atest < btest):
                    return -1;
                    break;
                default:
                    return 0;
                    break;
            }
        };
        return dataset.sort(sFunction);
    };
    var buildFrame = function () {
        //create html structure of listbox
        var data = { instanceId: this.id, headerText: this.options.headerText, customAdd: this.options.customAdd };
        var htmlToInsert = htmlGen.buildFrame(data);
        this.container.append(htmlToInsert);
        this.container.addClass('_jpIndexList');
        this.control = this.container.children(this.name);//div container for contents of control
        this.headerBox = this.container.find('._jpil_header');
        this.selList = this.container.find('._jpil_selList');
        this.selectedBox = this.container.find('._jpil_selectedList');
        if (this.options.showSelected) {
            this.container.addClass('_showSelected');
        }
    };
    var render = function () {
        var htmltoInsert = this.dataHTML;
        htmltoInsert[0] = '';
        htmltoInsert[1] = '';
        var listnum = 10;
        var me = this;
        this.fullLoad = false;
        if (listnum > this.data.length) {
            listnum = this.data.length;
            this.fullLoad = true;
        }
        var initLoadData = this.data.slice(0, listnum);
        var fullLoadData = this.data.slice(listnum, this.data.length);
        if (this.options.displayField == 'noObject') {
            initLoadData = initLoadData.map(function (i) {
                return { dataId: i, dataValue: i.toLowerCase(), displayValue: i };
            });
            fullLoadData = fullLoadData.map(function (i) {
                return { dataId: i, dataValue: i.toLowerCase(), displayValue: i };
            })
        } else {
            initLoadData = initLoadData.map(function (i) {
                return { dataId: i[me.options.idField], dataValue: i[me.options.displayField].toLowerCase(), displayValue: i[me.options.displayField] };
            });
            fullLoadData = fullLoadData.map(function (i) {
                return { dataId: i[me.options.idField], dataValue: i[me.options.displayField].toLowerCase(), displayValue: i[me.options.displayField] };
            })
        }
        var idx = 0;
        var dataToRender = {
            idx: function () {
                return idx++;
            }
        }
        dataToRender.items = initLoadData;
        htmltoInsert[0] = htmlGen.buildList(dataToRender);
        dataToRender.items = fullLoadData;
        htmltoInsert[1] = htmlGen.buildList(dataToRender);
        console.log("ILB render set list html : " + Date.now());
        this.selList.html(htmltoInsert[0]);
        if (this.container.hasClass("_min")) {
            this.headerBox.addClass("_max");
            //$(this.name + " ._jpil_header ._min").addClass("_max");
        }
        //add selected class to any selected items
        if (this.selectedItems.length > 0) {
            for (var i = 0; i < this.selected.length; i++) {
                $(this.name + " ._jpil_selItem[data-id='" + this.selectedItems[i][this.options.idField] + "']").addClass('selected');
            }
        }
        this.bind();
    };
    var bind = function () {
        this.headerBox.on("click", "._clear", this, this.clearBtnhandler);
        this.headerBox.on("click", "._search", this, this.search);
        this.selList.on("click", "._jpil_selItem", this, this.itemSelected);
        if (this.customAdd) {
            this.control.on("click", "._customAddBtn", this, this.customAddClick);
        }
        this.headerBox.on("click", "._min", this, this.minMax);
        if (!this.fullLoad) {
            this.control.on("click", this, this.checkStatus);
            this.selList.on("scroll", this, this.checkStatus);
        }
    };
    var unbind = function () {
        this.headerBox.off("click", "._clear", this.clearBtnhandler);
        this.headerBox.off("click", "._search", this.search);
        this.selList.off("click", "._jpil_selItem", this.itemSelected);

        if (this.customAdd) {
            this.control.off("click", "._customAddBtn", this.customAddClick);
        }
        this.headerBox.off("click", "._min", this.minMax);
        this.control.off("click", this.checkStatus);
        this.selList.off("scroll", this.checkStatus);
    };
    var checkStatus = function (e) {
        var me = this;
        if (e) {
            me = e.data;
        }
        if (!me.fullLoad) {
            me.selList.append(me.dataHTML[1]);
            me.fullLoad = true;
            me.unbind();
            me.bind();
        }
    };
    //external calls to change state  
    var setSelected = function (index, cxlfireEvent) {//clears any existing selections and sets new index
        if (!cxlfireEvent) {
            cxlfireEvent = false;
        }
        this.clearSelected();
        var dataDB = this.data;
        var setData = [];
        if (!$.isArray(index)) {
            setData.push(index);
        } else {
            setData = index;
        }
        var fname = this.idField;
        for (i = 0; i < setData.length; i++) {
            var fvalue = setData[i].IndexId;
            var selItem = _.filter(dataDB, function (rec) {
                return (rec[fname] == fvalue);
            })[0];
            this.selected.push(selItem[this.displayField]);
            this.selectedItems.push(selItem);
            //$(this.name + " ._jpil_selItem[data-id='" + selItem[this.idField] + "']").addClass('selected');
            this.selList.find("._jpil_selItem[data-id='" + selItem[this.idField] + "']").addClass('selected');
        }

        this.selectedBox.html('<span class="filterHead" >Current Selection(s):</span> ' + this.selected.join(', '));
        if (this.selectedItems.length > 0 || (this.displayField == "noObject" && this.selected.length > 0)) {
            this.container.addClass('_hasSelected');
        } else {
            this.container.removeClass('_hasSelected');
        }
        if (!cxlfireEvent) {
            this.options.onApply(this);
        }
    };
    var updateData = function (_options) {
        this.data = this.sortData(_options.data);
        this.unbind();
        this.selList[0].innerHTML = '';
        this.render();
    };
    //actions
    var minMaxAction = function (me) {
        if (me.headerBox.hasClass("_max")) {
            me.headerBox.removeClass("_max");
            me.container.removeClass("_min");
        } else {
            me.headerBox.addClass("_max");
            me.container.addClass("_min");
        }
    };
    var closeSearch = function (e) {
        var me = e.data;
        me.control.find("._jpil_search ._closeX").unbind("click", me.closeSearch);
        me.control.find("._jpil_search").remove();
    };
    var closeCustom = function (e) {
        var me = e.data;
        me.control.find("._jpil_customAdd ._closeX").unbind("click", me.closeSearch);
        me.control.find("._jpil_customAdd").remove();

    };
    var searchGo = function (e) {
        var me = e.data;
        var sElement = me.control.find('._jpil_selItem[data-tval^="' + $(e.currentTarget).val().toLowerCase() + '"]')
        if (sElement.length > 0) {
            me.control.find('._jpil_selList').animate({
                scrollTop: (sElement[0].offsetTop)
            }, 500);

        }
    };
    var customAddAction = function (e) {
        var keyPressed = (e == null) ? event.keyCode : e.keyCode;
        if ((keyPressed == 13) && (term != '')) {
            var me = e.data;
            var term = $(me.name + " ._customAdd").val().trim();
            //if (term != '') {
            //manage text selected array
            if ($.inArray(term, me.selected) == -1) {
                me.selected.push(term);
                me.selectedItems.push({ IndexId: -1, IndexText: term });
            }
            me.selectedBox.html('<span class="filterHead" >Current Selection(s):</span> ' + me.selected.join(', '));
            if (me.selectedItems.length > 0 || (me.options.displayField == "noObject" && me.selected.length > 0)) {
                me.container.addClass('_hasSelected');
            } else {
                me.container.removeClass('_hasSelected');
            }
            me.options.onApply(me);
            $(me.name + " ._customAdd").val('');
            me.control.find("._jpil_customAdd ._closeX").unbind("click", me.closeCustom);
            me.control.find("._jpil_customAdd ._customAdd").unbind("keydown", me.customAddAction);
            me.control.find("._jpil_customAdd").remove();
        }
    };
    var clearSelected = function () {
        this.selected = [];
        this.selectedItems = [];
        $(this.name + " ._jpil_selItem").removeClass('selected');
        this.container.removeClass('_hasSelected');
    };
    //event handlers
    var clearBtnhandler = function (e) {
        //Clear selected items
        var me = e.data;
        me.clearSelected();
        if (!!me.options.onApply) {
            me.options.onApply(me);
        }
    };
    var minMax = function (e) {
        var me = e.data;
        me.minMaxAction(me);
        if (me.options.onResize != null) {
            setTimeout(function () {
                me.options.onResize(me);
            }, 100);
        }
    };
    var itemSelected = function (e) {
        var me = e.data;
        if (me.options.allowMultiple) {
            if ($(e.target).hasClass('selected')) {
                $(e.target).removeClass('selected');
                //manage text selected array
                if ($.inArray($(e.target).text(), me.selected) > -1) {
                    me.selected = $.grep(me.selected, function (a) {
                        return a !== $(e.target).text();
                    });
                }
                if (!(me.options.displayField == "noObject")) {
                    //manage item selected array
                    me.selectedItems = $.grep(me.selectedItems, function (a) {
                        return a[me.options.displayField] !== $(e.target).text();
                    });
                }
            } else {
                $(e.target).addClass('selected');
                //manage text selected array
                if ($.inArray($(e.target).text(), me.selected) == -1) {
                    me.selected.push($(e.target).text());
                }
                if (!(me.options.displayField == "noObject")) {
                    //manage item selected array
                    me.selectedItems.push(me.data[$(e.target).data('recid')]);
                }
            }
        } else {
            me.selected = [];
            me.selectedItems = [];
            if ($(e.target).hasClass('selected')) {
                $(e.target).removeClass('selected');
            } else {
                $(me.selList).children().removeClass('selected');
                $(e.target).addClass('selected');
                me.selected.push($(e.target).text());
                me.selectedItems.push(me.data[$(e.target).data('recid')]);
            }
        }
        me.selectedBox.html('<span class="filterHead" >Current Selection(s):</span> ' + me.selected.join(', '));
        if (me.selectedItems.length > 0 || (me.options.displayField == "noObject" && me.selected.length > 0)) {
            me.container.addClass('_hasSelected');
        } else {
            me.container.removeClass('_hasSelected');
        }
        me.closeSearch(e);
        if (!!me.options.onApply) {
            me.options.onApply(me);
        }
    };
    var search = function (e) {
        var me = e.data;
        me.checkStatus();
        if (me.control.parent().hasClass('_min')) {
            me.minMax(e);
        }
        if ($(me.name + " ._jpil_search").length > 0) {
            var term = $(me.name + " ._jpil_search ._searchTerm").val().trim();
            me.control.find("._jpil_search ._closeX").unbind("click", me.closeSearch);
            me.control.find("._jpil_search").remove();
        } else {
            me.control.find("._jpil_selList").before("<div class='_jpil_search'><input placeholder='Enter Search Term' class='_searchTerm' /><div class='_closeX'></div></div>");
            me.control.find("._jpil_search ._closeX").bind("click", me, me.closeSearch);
            me.control.find("._jpil_search ._searchTerm").bind("keyup", me, me.searchGo);

        }

    };
    var customAddClick = function (e) {
        var me = e.data;
        var customClose = me.control.find("._jpil_customAdd ._closeX");
        if (customClose.length == 0) {
            me.control.find("._jpil_selList").before("<div class='_jpil_customAdd'><input placeholder='Enter Custom Index Term' class='_customAdd' /><div class='_closeX'></div> </div>");
            me.control.find("._jpil_customAdd ._closeX").bind("click", me, me.closeCustom);
            me.control.find("._jpil_customAdd ._customAdd").bind("keydown", me, me.customAddAction);
        }
    };
    var fetchDataHandler = function (response) {
        this.data = this.sortData(response);
        this.render();
    };
    //list Box Control
    var jpIndexListBox = {
        cnter: 0,
        type: 'jpIndexListBox',
        control: function () {
            this.options = {
                headerText: 'List Header: set using headerText option',
                displayField:'noObject',//if data is object array displayField is propertyname to display
                idField:'',//if data is object array idField notes id field 
                onApply:null,
                onResize:null,
                allowMultiple:true,
                customAdd:false,
                showSelected: false,
                dataUrl:'none'
            }
            this.container = '',
            this.control,
            this.selList = '',
            this.headerBox = '',
            this.selectedBox = '',
            this.data = [],
            this.dataHTML = [],
            this.selected = [],
            this.selectedItems = [],
            this.iObjId = 0;            
            this.fullLoad = false,            
            this.init = init,
            this.sortData = sortData,
            this.buildFrame = buildFrame,
            this.render = render,
            this.fetchData = fetchData,
            this.fetchDataHandler = fetchDataHandler,
            this.updateData = updateData,
            this.bind = bind,
            this.unbind = unbind,
            this.checkStatus = checkStatus,
            this.closeSearch = closeSearch,
            this.closeCustom = closeCustom,
            this.searchGo = searchGo,
            this.search = search,
            this.customAddAction,
            this.customAddClick = customAddClick,
            this.clearSelected = clearSelected,
            this.setSelected = setSelected,
            this.itemSelected = itemSelected,
            this.clearBtnhandler = clearBtnhandler,
            this.minMaxAction = minMaxAction,
            this.minMax = minMax,
            this.refresh = function () {
                this.fetchData();
            }
        }
    };
    return jpIndexListBox;
});
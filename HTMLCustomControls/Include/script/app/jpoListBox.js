define(["jquery","underscore"],function ($,_) {
    var jpIndexListBox = {
        cnter: 0,
        type: 'jpIndexListBox',
        control: function () {
            this.control,
            this.selList = '',
            this.headerBox = '',
            this.headerText = 'List Header: set using headerText option',
            this.selectedBox = '',
            this.data = [],
            this.displayField = '',//if data is object array displayField is propertyname to display
            this.idField = '',//if data is object array idField notes id field 
            this.selected = [],
            this.selectedItems = [],
            this.iObjId = 0;
            this.container = '',
            this.onApply = null,
            this.onResize = null,
            this.fullLoad = false,
            this.dataHTML = [],
            this.allowMultiple = true,
            this.customAdd = false,
            this.small = false,
            this.init = function (c, options) {
                this.container = $(c);
                var me = this;
                this.fieldName = options.fieldName;
                if (!!options.onResize) {
                    this.onResize = options.onResize;
                }
                if (!options.displayField) {//accepts a string array or an object array as datasource
                    this.displayField = 'noObject';
                } else {
                    this.displayField = options.displayField;
                }
                if (!options.idField) {
                    this.idField = 'noId';
                } else {
                    this.idField = options.idField;
                }
                if (!!options.onApply) {
                    this.onApply = options.onApply;
                }
                if (!!options.allowMultiple) {
                    this.allowMultiple = options.allowMultiple;
                }
                if (!!options.customAdd) {
                    this.customAdd = options.customAdd;
                }
                if (!options.small) {
                    options.small = false;
                }
                if (!!options.headerText) {
                    this.headerText = options.headerText;
                }
                this.small = options.small;
                jpIndexListBox.cnter += 1;
                this.name = '#_jpil_' + jpIndexListBox.cnter;
                this.buildFrame(options);
                this.headerBox = this.container.find('._jpil_header');
                this.selList = this.container.find('._jpil_selList');
                this.selectedBox = this.container.find('._jpil_selectedList');
                if (this.small) {
                    this.selList.addClass('small');
                }
                this.data = this.sortData(options.data);
                this.render();
            },
            this.sortData = function (dataset) {
                var me = this;
                var sFunction = function (a, b) {
                    var atest = '';
                    var btest = '';
                    if (me.displayField == 'noObject') {
                        atest = a.toLowerCase();
                        btest = b.toLowerCase();
                    } else {
                        atest = a[me.displayField].toLowerCase();
                        btest = b[me.displayField].toLowerCase();
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
            },
            this.buildFrame = function (options) {
                //create html structure of listbox
                this.container.append("<div class='_jpil' id='_jpil_" + jpIndexListBox.cnter + "'> </div>");
                this.container.addClass('_jpIndexList');
                this.control = this.container.children(this.name);//div container for contents of control
                //add header
                if (this.customAdd) {
                    this.control.append("<div class='_jpil_header'>" + this.headerText + "<span class='_customAddBtn'></span><span class='_clear' ></span><span class='_search' ></span><span class='_min' ></span> </div>");
                } else {
                    this.control.append("<div class='_jpil_header'>" + this.headerText + "<span class='_clear' ></span><span class='_search' ></span><span class='_min' ></span> </div>");
                }
                //add selected list and select list containers
                this.control.append("<div class='_jpil_selectedList'><span class='filterHead' >Active Filter(s):</span></div>");
                this.control.append("<div class='_jpil_selList _jpmsShow'></div>");
            },
            this.render = function () {
                var htmltoInsert = this.dataHTML;
                htmltoInsert[0] = '';
                htmltoInsert[1] = '';
                var listnum = 10;
                this.fullLoad = false;
                if (listnum > this.data.length) {
                    listnum = this.data.length;
                    this.fullLoad = true;
                }
                if (this.displayField == 'noObject') {
                    for (i = 0; i < this.data.length; i++) {
                        //this.selList.append("<div class='_jpil_selItem' data-recId=" + i + " data-id=" + this.data[i] + " data-tval='" + this.data[i].toLowerCase() + "' >" + this.data[i] + "</div>")
                        if (i < listnum) {
                            htmltoInsert[0] += "<div class='_jpil_selItem' data-recId=" + i + " data-id=" + this.data[i] + " data-tval='" + this.data[i].toLowerCase() + "' >" + this.data[i] + "</div>";
                        } else {
                            htmltoInsert[1] += "<div class='_jpil_selItem' data-recId=" + i + " data-id=" + this.data[i] + " data-tval='" + this.data[i].toLowerCase() + "' >" + this.data[i] + "</div>";
                        }

                    }
                } else {
                    for (i = 0; i < this.data.length; i++) {
                        //this.selList.append("<div class='_jpil_selItem' data-recId=" + i + " data-id=" + this.data[i][this.idField] + " data-tval='" + this.data[i][this.displayField].toLowerCase() + "' >" + this.data[i][this.displayField] + "</div>")
                        if (i < listnum) {
                            htmltoInsert[0] += "<div class='_jpil_selItem' data-recId=" + i + " data-id=" + this.data[i][this.idField] + " data-tval='" + this.data[i][this.displayField].toLowerCase() + "' >" + this.data[i][this.displayField] + "</div>";
                        } else {
                            htmltoInsert[1] += "<div class='_jpil_selItem' data-recId=" + i + " data-id=" + this.data[i][this.idField] + " data-tval='" + this.data[i][this.displayField].toLowerCase() + "' >" + this.data[i][this.displayField] + "</div>";
                        }
                    }
                }
                console.log("ILB render set list html : " + Date.now());
                this.selList.html(htmltoInsert[0]);

                if (this.container.hasClass("_min")) {
                    $(this.name + " ._jpil_header ._min").addClass("_max");
                }
                if (this.selectedItems.length > 0) {
                    for (var i = 0; i < this.selected.length; i++) {
                        $(this.name + " ._jpil_selItem[data-id='" + this.selectedItems[i][this.idField] + "']").addClass('selected');
                    }
                }
                this.bind();
            },
            this.updateData = function (options) {
                var me = this;
                console.log("ILB updateData sort data: " + Date.now());
                this.data = this.sortData(options.data);
                console.log("ILB updateData unbind: " + Date.now());
                this.unbind();
                console.log("ILB updateData clear list: " + Date.now());
                this.selList[0].innerHTML = '';
                this.render();
            },
            this.bind = function () {
                var me = this;
                $(this.name + " ._jpil_header ._clear").bind("click", this, this.iconAction);
                $(this.name + " ._jpil_header ._search").bind("click", this, this.search);

                $(this.name + " ._jpil_selItem").bind("click", me, this.itemSelected);
              
                if (this.customAdd) {
                    $(this.name + " ._customAddBtn").bind("click", me, this.customAddClick);
                }
                $(this.name + " ._jpil_header ._min").bind("click", this, this.minMax);
                if (!this.fullLoad) {
                    $(this.name).bind("click", this, this.checkStatus);
                    $(this.name + " ._jpil_selList").bind("scroll", this, this.checkStatus);
                }


            },
            this.unbind = function () {
                $(this.name + " ._jpil_header ._clear").unbind("click", this.iconAction);
                $(this.name + " ._jpil_header ._search").unbind("click", this.search);
                $(this.name + " ._jpil_selItem").unbind("click", this.itemSelected);
                if (this.customAdd) {
                    $(this.name + " ._customAddBtn").unbind("click", this.customAddClick);
                }
                $(this.name + " ._jpil_header ._min").unbind("click", this.minMax);
                $(this.name).unbind("click", this.checkStatus);
                $(this.name + " ._jpil_selList").unbind("scroll", this.checkStatus);

            },
            this.checkStatus = function (e) {
                var me = this;
                if (e) {
                    me = e.data;
                }
                if (!me.fullLoad) {
                    me.selList.append(me.dataHTML[1]);
                    me.fullLoad = true;
                    me.unbind();
                    me.bind();
                    //$(me.name).unbind("click", me.checkStatus);
                    //$(me.name + " ._jpil_selList").unbind("scroll", me.checkStatus);
                }
            },
            this.closeSearch = function (e) {
                var me = e.data;
                me.control.find("._jpil_search ._closeX").unbind("click", me.closeSearch);
                me.control.find("._jpil_search").remove();
            },
            this.closeCustom = function (e) {
                var me = e.data;
                me.control.find("._jpil_customAdd ._closeX").unbind("click", me.closeSearch);
                me.control.find("._jpil_customAdd").remove();

            },
            this.searchGo = function (e) {
                var me = e.data;
                var sElement = me.control.find('._jpil_selItem[data-tval^="' + $(e.currentTarget).val().toLowerCase() + '"]')
                if (sElement.length > 0) {
                    me.control.find('._jpil_selList').animate({
                        scrollTop: (sElement[0].offsetTop)
                    }, 500);

                }
            },
            this.search = function (e) {
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

            },
            this.customAddAction = function (e) {
                var keyPressed = (e == null) ? event.keyCode : e.keyCode;
                if ((keyPressed == 13) && (term != '')) {
                    var me = e.data;
                    var term = $(me.name + " ._customAdd").val().trim();
                    //if (term != '') {
                    //manage text selected array
                    if ($.inArray(term, e.data.selected) == -1) {
                        e.data.selected.push(term);
                        e.data.selectedItems.push({ IndexId: -1, IndexText: term });
                    }
                    $(e.data.name + " ._jpil_selectedList img").unbind("click", e.data.iconAction);
                    e.data.selectedBox.html('<span class="filterHead" >Active Filter(s):</span> ' + e.data.selected.join(', '));
                    $(e.data.name + " ._jpil_selectedList img").bind("click", e.data, e.data.iconAction);
                    if (e.data.selectedItems.length > 0 || (e.data.displayField == "noObject" && e.data.selected.length > 0)) {
                        e.data.container.addClass('_hasSelected');
                    } else {
                        e.data.container.removeClass('_hasSelected');
                    }
                    e.data.onApply(e.data);
                    $(me.name + " ._customAdd").val('');
                    me.control.find("._jpil_customAdd ._closeX").unbind("click", me.closeCustom);
                    me.control.find("._jpil_customAdd ._customAdd").unbind("keydown", me.customAddAction);
                    me.control.find("._jpil_customAdd").remove();
                    //} else {
                    //    alert('Please add a custom search term.');
                    //}
                }
            },
            this.customAddClick = function (e) {
                var me = e.data;
                var customClose = me.control.find("._jpil_customAdd ._closeX");
                if (customClose.length == 0) {
                    me.control.find("._jpil_selList").before("<div class='_jpil_customAdd'><input placeholder='Enter Custom Index Term' class='_customAdd' /><div class='_closeX'></div> </div>");
                    me.control.find("._jpil_customAdd ._closeX").bind("click", me, me.closeCustom);
                    me.control.find("._jpil_customAdd ._customAdd").bind("keydown", me, me.customAddAction);
                }
            },
            this.clearSelected = function () {
                this.selected = [];
                this.selectedItems = [];
                $(this.name + " ._jpil_selItem").removeClass('selected');

                this.container.removeClass('_hasSelected');
            },
            this.setSelected = function (index, cxlfireEvent) {//clears any existing selections and sets new index
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
                    $(this.name + " ._jpil_selItem[data-id='" + selItem[this.idField] + "']").addClass('selected');
                }

                $(this.name + " ._jpil_selectedList img").unbind("click", this.iconAction);
                this.selectedBox.html('<span class="filterHead" >Active Filter(s):</span> ' + this.selected.join(', ') );
                $(this.name + " ._jpil_selectedList img").bind("click", this, this.iconAction);
                if (this.selectedItems.length > 0 || (this.displayField == "noObject" && this.selected.length > 0)) {
                    this.container.addClass('_hasSelected');
                } else {
                    this.container.removeClass('_hasSelected');
                }
                if (!cxlfireEvent) {
                    this.onApply(this);
                }
            },
            this.itemSelected = function (e) {
                if (e.data.allowMultiple) {
                    if ($(e.target).hasClass('selected')) {
                        $(e.target).removeClass('selected');
                        //manage text selected array
                        if ($.inArray($(e.target).text(), e.data.selected) > -1) {
                            e.data.selected = $.grep(e.data.selected, function (a) {
                                return a !== $(e.target).text();
                            });
                        }
                        if (!(e.data.displayField == "noObject")) {
                            //manage item selected array
                            e.data.selectedItems = $.grep(e.data.selectedItems, function (a) {
                                return a[e.data.displayField] !== $(e.target).text();
                            });
                        }
                    } else {
                        $(e.target).addClass('selected');
                        //manage text selected array
                        if ($.inArray($(e.target).text(), e.data.selected) == -1) {
                            e.data.selected.push($(e.target).text());
                        }
                        if (!(e.data.displayField == "noObject")) {
                            //manage item selected array
                            e.data.selectedItems.push(e.data.data[$(e.target).data('recid')]);
                        }
                    }
                } else {
                    e.data.selected = [];
                    e.data.selectedItems = [];
                    if ($(e.target).hasClass('selected')) {
                        $(e.target).removeClass('selected');
                    } else {
                        $(e.data.selList).children().removeClass('selected');
                        $(e.target).addClass('selected');
                        e.data.selected.push($(e.target).text());
                        e.data.selectedItems.push(e.data.data[$(e.target).data('recid')]);
                    }
                }
                $(e.data.name + " ._jpil_selectedList img").unbind("click", e.data.iconAction);
                e.data.selectedBox.html('<span class="filterHead" >Active Filter(s):</span> ' + e.data.selected.join(', '));
                $(e.data.name + " ._jpil_selectedList img").bind("click", e.data, e.data.iconAction);
                if (e.data.selectedItems.length > 0 || (e.data.displayField == "noObject" && e.data.selected.length > 0)) {
                    e.data.container.addClass('_hasSelected');
                } else {
                    e.data.container.removeClass('_hasSelected');
                }
                e.data.closeSearch(e);
                if (!!e.data.onApply) {
                    e.data.onApply(e.data);
                }
            },
            this.iconAction = function (e) {
                //Clear selected items
                var me = e.data;
                me.clearSelected();
                if (!!me.onApply) {
                    me.onApply(me);
                }
            },
            this.minMaxAction = function (me) {
                if ($(me.name + " ._jpil_header ._min").hasClass("_max")) {
                    $(me.name + " ._jpil_header ._min").removeClass("_max");
                    me.container.removeClass("_min");
                } else {
                    $(me.name + " ._jpil_header ._min").addClass("_max");
                    me.container.addClass("_min");
                }
            },
            this.minMax = function (e) {
                var me = e.data;
                me.minMaxAction(me);
                //if ($(me.name + " ._jpil_header ._min").hasClass("_max")) {
                //    $(me.name + " ._jpil_header ._min").removeClass("_max");
                //    me.container.removeClass("_min");
                //} else {
                //    $(me.name + " ._jpil_header ._min").addClass("_max");
                //    me.container.addClass("_min");
                //}
                if (me.onResize != null) {
                    setTimeout(function () {
                        me.onResize(me);
                    }, 100);

                }
            },
            this.iconClick = function (e) {
                if ($(e.data.selList).hasClass('shown')) {
                    $(e.data.selList).removeClass('shown');
                    $(e.target).attr('src', 'Include/images/down.png');
                    e.data.iconAction();

                } else {
                    $(e.data.selList).addClass('shown');
                    $(e.target).attr('src', 'Include/images/apply.png');
                }
            }
        }
    };
    return jpIndexListBox;
});
define(["listBox"], function (listBox) {
    
        var appControl = function () {
            var newList = new listBox.control();
            var newList2 = new listBox.control();
            var newList3 = new listBox.control();
            var initialize = function () {
                var teamSelectedHandler = function (ctl) {
                    $('.list1Selections').html("<span class='filterHead'> Selected Team(s): </span>" + ctl.selected.toString());
                }
                $(document).ready(function (jpIndexListBox) {
                    var data = ["Denver Broncos", "San Diego Chargers", "Las Vegas Raiders", "Los Angeles Rams","Baltimore Ravens","Cinicinnati Bengals","Cleveland Browns", "Pittsburgh Steelers","Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Tennessee Titans"]
                    //load simple array list w/ external fucntion call on select
                    newList.init('#NFLTeamList', { data: data, headerText: 'AFC Football Teams', onApply:teamSelectedHandler });
                    //load simple array showing selection summary
                    newList2.init('#NFLTeamList2', { data: data, headerText: 'AFC Football Teams', showSelected: true });
                    //load json object array showing selection summary
                    var jsonData = [{ name: "Denver Broncos", city: "Denver", teamId: 1 }, { name: "Los Angeles Chargers", city: "Los Angeles", teamId: 2 }, { name: "Las Vegas Raiders", city: "Las Vegas", teamId: 3 }, { name: "Los Angeles Rams", city: "Los Angeles", teamId: 4 }, { name: "Baltimore Ravens", city: "Baltimore", teamId: 5 },
                    { name: "Cinicinnati Bengals", city: "Cinicinnati", teamId: 6 }, { name: "Cleveland Browns", city: "Cleveland", teamId: 7 }, { name: "Pittsburgh Steelers", city: "Pittsburgh", teamId: 8 }, { name: "Houston Texans", city: "Houston", teamId: 9 }, { name: "Indianapolis Colts", city: "Indianapolis", teamId: 10 },
                    { name: "Jacksonville Jaguars", city: "Jacksonville", teamId: 11 }, { name: "Tennessee Titans", city: "Nashville", teamId: 12 }];
                    //newList3.init('#NFLTeamList3', { data: jsonData, headerText: 'AFC Football Teams', showSelected: true, displayField: 'name', idField: 'teamId' });
                    newList3.init('#NFLTeamList3', { dataUrl: 'api/Teams', headerText: 'AFC Football Teams', showSelected: true, displayField: 'name', idField: 'teamId' });                    
                    $('.btnRefresh').on('click', function (e) {
                       newList3.refresh();
                    });
                });
            };
            var appControlInterface = {
                init: initialize
            };
            return appControlInterface;
        }();
        return appControl;
});
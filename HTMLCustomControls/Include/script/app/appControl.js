define(["listBox"], function (listBox) {
    
        var appControl = function () {
            var newList = new listBox.control();
            var initialize = function () {
                $(document).ready(function (jpIndexListBox) {
                    //load simple arraty list
                    var data = ["Denver Broncos", "San Diego Chargers", "Las Vegas Raiders", "Los Angeles Rams","Baltimore Ravens","Cinicinnati Bengals","Cleveland Browns", "Pittsburgh Steelers","Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Tennessee Titans"]
                    newList.init('#NFLTeamList', { data: data, headerText:'AFC Football Teams' });
                });
            };
            var appControlInterface = {
                init: initialize
            };
            return appControlInterface;
        }();
        return appControl;
});
using HTMLCustomControls.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HTMLCustomControls.Models
{
    public class Teams : ITeamProvider
    {
        private ITeamDataProvider _dataprovider;
        public Teams(ITeamDataProvider dataProvider)
        {
            _dataprovider = dataProvider;
        }
        public List<Team> GetTeams()
        {
            return _dataprovider.GetTeams();
        }
    }
}
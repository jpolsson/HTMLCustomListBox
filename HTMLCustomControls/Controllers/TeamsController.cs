using HTMLCustomControls.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace HTMLCustomControls.Controllers
{
    public class TeamsController : ApiController
    {
        [HttpGet]
        public IEnumerable<Team> GetTeams()
        {
            TestDataProvider testDataProvider = new TestDataProvider();
            Teams teams = new Teams(testDataProvider);
            return teams.GetTeams();
        }
    }
}

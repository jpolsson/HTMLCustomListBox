using HTMLCustomControls.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HTMLCustomControls.Models
{
    public class TestDataProvider : ITeamDataProvider
    {
        public List<Team> GetTeams()
        {
            List<Team> returnVal = new List<Team>();
            returnVal.Add(new Team("Denver Broncos",1,"Denver"));
            returnVal.Add(new Team("Los Angeles Chargers", 2, "Los Angeles"));
            returnVal.Add(new Team("Las Vegas Raiders", 3, "Las Vegas"));
            returnVal.Add(new Team("Los Angeles Rams", 4, "Los Angeles"));
            returnVal.Add(new Team("Baltimore Ravens", 5, "Baltimore"));
            returnVal.Add(new Team("Cinicinnati Bengals", 6, "Cinicinnati"));
            returnVal.Add(new Team("Cleveland Browns", 7, "Cleveland"));
            returnVal.Add(new Team("Pittsburgh Steelers", 8, "Pittsburgh"));
            returnVal.Add(new Team("Houston Texans", 9, "Houston"));
            returnVal.Add(new Team("Indianapolis Colts", 10, "Indianapolis"));
            returnVal.Add(new Team("Jacksonville Jaguars", 11, "Jacksonville"));
            returnVal.Add(new Team("Tennessee Titans", 12, "Nashville"));
            return returnVal;
        }
    }
}
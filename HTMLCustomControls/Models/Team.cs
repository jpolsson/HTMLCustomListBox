using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HTMLCustomControls.Models
{
    public class Team
    {
        public string name { get; set; }
        public int teamId { get; set; }
        public string city { get; set; }
        public Team(){}
        public Team(string name, int teamId, string city)
        {
            this.name = name;
            this.teamId = teamId;
            this.city = city;
        }
    }
}
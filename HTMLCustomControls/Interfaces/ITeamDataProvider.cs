﻿using HTMLCustomControls.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HTMLCustomControls.Interfaces
{
    public interface ITeamDataProvider
    {
        List<Team> GetTeams();
        
    }
}

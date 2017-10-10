using HTMLCustomControls.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Filters;


namespace HTMLCustomControls.Controllers
{
    public class TeamsController : ApiController
    {
        [HttpGet]
        [CacheClient(Duration = 30)]
        public HttpResponseMessage GetTeams()
        {
            TestDataProvider testDataProvider = new TestDataProvider();
            Teams teams = new Teams(testDataProvider);
            var result = teams.GetTeams();
            string hash = "\"" + result.GetHashCode().ToString() + "\"";
            if ( hash != Request.Headers.IfNoneMatch.ToString())
            {
                var response = Request.CreateResponse(HttpStatusCode.OK, result);
                response.Headers.ETag = new System.Net.Http.Headers.EntityTagHeaderValue(hash);
                return response;
            }
            else
            {
                var response = Request.CreateResponse(HttpStatusCode.NotModified, "");
                response.Headers.ETag = new System.Net.Http.Headers.EntityTagHeaderValue(hash);
                return response;
            }
        }
    }
}

using Microsoft.AspNet.SignalR;
using PracticeEnglish.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PracticeEnglish.Hubs
{
    public class ChatHub : Hub<ChatHubFrontend>, ChatHubBackend
    {
        protected static List<User> Users = new List<User>() {
            new User() {
                Age = 25,
                Country = "US",
                Skype = "echo123",
                Topics = "Test call"
            }
        };

        public void Join(User user)
        {
            user.ConnectionId = Context.ConnectionId;
            Users.Add(user);
            Clients.AllExcept(Context.ConnectionId).UserJoined(user);
        }

        public void Leave(User user)
        {
            Users.RemoveAll(u => u.ConnectionId == Context.ConnectionId);
            Clients.AllExcept(Context.ConnectionId).UserLeaved(user);
        }

        public IList<User> List()
        {
            return Users;
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var user = Users.FirstOrDefault(u => u.ConnectionId == Context.ConnectionId);

            if (user == null) return base.OnDisconnected(stopCalled);

            Clients.All.UserLeaved(user);
            Users.Remove(user);

            return base.OnDisconnected(stopCalled);
        }
    }

    public interface ChatHubBackend
    {
        void Join(User user);
        void Leave(User user);
        IList<User> List();
    }

    public interface ChatHubFrontend
    {
        void UserJoined(User user);
        void UserLeaved(User user);
    }
}
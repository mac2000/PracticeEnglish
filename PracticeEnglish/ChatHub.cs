using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using PracticeEnglish.Models;

namespace PracticeEnglish
{
	public class ChatHub : Hub
	{
		protected static List<User> Users = new List<User>() { new User() { Age = 25, Country = "US", Skype = "echo123", Topics = "Test call" } };

		public void Join(User user)
		{
			user.ConnectionId = Context.ConnectionId;
			Users.Add(user);
			Clients.AllExcept(Context.ConnectionId).userJoined(user);
		}

		public void Leave(User user)
		{
			Users.RemoveAll(u => u.ConnectionId == Context.ConnectionId);
			Clients.AllExcept(Context.ConnectionId).userLeaved(user);
		}

		public IEnumerable<User> List()
		{
			return Users;
		}

		public int JoinedCount()
		{
			return Users.Count;
		}

		public override Task OnDisconnected(bool stopCalled)
		{
			var user = Users.FirstOrDefault(u => u.ConnectionId == Context.ConnectionId);

			if (user == null) return base.OnDisconnected(stopCalled);

			Clients.All.userLeaved(user);
			Users.Remove(user);

			return base.OnDisconnected(stopCalled);
		}
	}
}
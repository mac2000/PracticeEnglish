using Newtonsoft.Json;

namespace PracticeEnglish.Models
{
    public class User
    {
        [JsonIgnore]
        public string ConnectionId { get; set; }
        public string Skype { get; set; }
        public int Age { get; set; }
        public string Country { get; set; }
        public string Topics { get; set; }
    }
}
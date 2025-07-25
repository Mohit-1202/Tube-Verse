

export default function Upload_Tweet_Page() {
  const likedTweets = Array(12).fill({
    text: `This is just a random tweet\nTalking about random thing\nTalking about random thing`,
    author: 'Mohit Mishra',
    date: '12-05-2002',
  });
  return (
    <div className="min-h-screen text-white start:p-2 mini:p-6">
      {/* Create Tweet Popup */}
      <div className="tweet-area flex flex-col items-center start:p-2">
      <div className="bg-[#3a3a3a] p-6 rounded-lg w-full max-w-md relative mb-10 shadow-lg">
        <h2 className="text-[30px] font-semibold mb-6 text-center">Create Tweet</h2>
        <textarea
          placeholder="Write your thoughts!!"
          className="w-full h-32 p-3 rounded-md text-white placeholder-gray-300 bg-[#212121]"
        ></textarea>
        <div className="flex justify-center mt-4">
          <button className="bg-[#FF9200] hover:bg-[#FF9200] hover:border-[1px] cursor-pointer text-black px-6 py-2 rounded-md font-semibold hover:brightness-110">
            Upload
          </button>
        </div>
      </div>
      </div>

      {/* Tweets Section */}
      <div className="min-h-screen text-white p-2">
      <h2 className="text-[30px] font-semibold mb-6">Your Tweets</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {likedTweets.map((tweet, index) => (
          <div
            key={index}
            className="bg-[#2c2c2c] p-4 rounded flex flex-col justify-between h-full"
          >
            <p className="mb-4 whitespace-pre-line leading-snug text-gray-100">
              {tweet.text}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-300 mt-4">
              <div className="flex items-center gap-2">
                <img
                  src="https://newkgfindia.com/assets/users2.avif"
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="text-lg">{tweet.author}</span>
              </div>
              <span>{tweet.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

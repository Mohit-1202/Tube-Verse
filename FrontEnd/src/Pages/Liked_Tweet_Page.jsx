const likedTweets = Array(12).fill({
  text: `This is just a random tweet\nTalking about random thing\nTalking about random thing`,
  author: 'Mohit Mishra',
  date: '12-05-2002',
});

export default function Liked_Tweet_Page() {
  return (
    <div className="min-h-screen text-white p-4">
      <h2 className="text-[30px] font-semibold mb-6">Liked Tweets</h2>

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
  );
}
